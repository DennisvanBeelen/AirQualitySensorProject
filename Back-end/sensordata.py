import random
import busio
import digitalio
import board
import adafruit_dht
import adafruit_mcp3xxx.mcp3008 as MCP
import adafruit_bmp280
import math
from adafruit_mcp3xxx.analog_in import AnalogIn

from signal import signal, SIGINT, SIGTERM


class SensorOutput:
    def __init__(self, sensor_type, sensor_unit, sensor_min, sensor_max):
        self.sensor_type = sensor_type
        self.sensor_unit = sensor_unit
        self.sensor_min = sensor_min
        self.sensor_max = sensor_max
        self.value = sensor_min


class Sensor:
    def __init__(self, name):
        print("init sensor")
        self.value = 0
        self.name = name
        self.output = {}

    def add_output(self, output):
        self.output[output.sensor_type] = output

    def simulate_values(self):
        for sensor_type in list(self.output):
            sensor = self.output[sensor_type]
            self.output[sensor_type].value = random.randint(sensor.sensor_min, sensor.sensor_max)

    def set_up(self):
        pass

    def calc_value(self):
        return self.value

    def get_data(self):
        sensor_data = []

        for sensor_type in list(self.output):
            sensor = self.output[sensor_type]
            data = {
                "sensorName": self.name,
                "sensorDataUnit": sensor.sensor_unit,
                "sensorType": sensor.sensor_type,
                "sensorValue": str(sensor.value)
            }
            sensor_data.append(data)

        return sensor_data
    
    def warm_up(self):
        print("Warming up gas sensors, please wait.")
        for x in range(180):
            percentage_complete = x / 180 * 100
            if percentage_complete % 10 == 0:
                print(percentage_complete)
               
            sleep(1)


class HumiditySensor(Sensor):

    def __init__(self):
        super().__init__("Humidity Sensor")

        temperature_output = SensorOutput("Temperature", "°C", 10, 25)
        humidity_output = SensorOutput("Humidity", "%", 20, 75)
        self.add_output(temperature_output)
        self.add_output(humidity_output)

        self.dht_device = any

    def set_up(self):
        dht_device = adafruit_dht.DHT11(board.D4)

        signal(SIGINT, lambda signal, frame: [dht_device.exit(), exit(0)])
        signal(SIGTERM, lambda signal, frame: [dht_device.exit(), exit(0)])
        self.dht_device = dht_device

    def calc_value(self):
        try:
            self.output["Temperature"].value = self.dht_device.temperature
            self.output["Humidity"].value = self.dht_device.humidity

        except RuntimeError as error:
            print(error.args[0])
            return None


class PressureSensor(Sensor):

    def __init__(self):
        super().__init__("Pressure Sensor")

        temperature_output = SensorOutput("Temperature", "°C", 10, 25)
        pressure_output = SensorOutput("Pressure", "hbar", 980, 1020)
        altitude_output = SensorOutput("Altitude", "m", 1, 100)

        self.add_output(temperature_output)
        self.add_output(pressure_output)
        self.add_output(altitude_output)

        self.barometer = any

    def set_up(self):
        i2c = busio.I2C(board.SCL, board.SDA)
        self.barometer = adafruit_bmp280.Adafruit_BMP280_I2C(i2c)

    def calc_value(self):
        self.output["Temperature"].value = self.barometer.temperature
        self.output["Pressure"].value = self.barometer.pressure
        self.output["Altitude"].value = self.barometer.altitude


class AnalogSensor(Sensor):
    def __init__(self, name, mcp):
        super().__init__(name)
        self.mcp = mcp
        self.channel = any
        self.r0 = None
        self.vrl = 3.3 #Spanningsbereik - (0V - 3V3)
        self.slope = None
        self.b = None

    def set_up(self):
        spi = busio.SPI(clock=board.SCK, MISO=board.MISO, MOSI=board.MOSI)
        cs = digitalio.DigitalInOut(board.D5)
        adc = MCP.MCP3008(spi, cs)
        self.channel = AnalogIn(adc, self.mcp)

    def calc_value(self):
        output_key = list(self.output)[0]
        
        voltage = self.channel.voltage
        rs = ((self.vrl * 10) / voltage) - 10
        rsr0 = rs / self.r0
        log_rsr0 = math.log10(rsr0)
        log_ppm = (log_rsr0 - self.b) / self.slope
        ppm = pow(10, log_ppm)
        
        self.output[output_key].value = ppm


class COSensor(AnalogSensor):

    def __init__(self):
        super().__init__("CO Sensor", MCP.P0)
        self.r0 = 1.095939929029228
        self.slope = -0.7536
        self.b = 1.4189
        co_output = SensorOutput("CO", "ppm", 15, 75)
        self.add_output(co_output)


class CO2Sensor(AnalogSensor):

    def __init__(self):
        super().__init__("CO2 Sensor", MCP.P1)
        self.r0 = 13.003959679866863
        self.slope = -0.3597
        self.b = 0.7439
        co2_output = SensorOutput("CO2", "ppm", 15, 75)
        self.add_output(co2_output)
