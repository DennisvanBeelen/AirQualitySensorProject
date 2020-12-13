import random
import busio
import digitalio
import board
import adafruit_dht
import adafruit_mcp3xxx.mcp3008 as MCP
import adafruit_bmp280
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
            self.output[sensor_type].value = random.randint(sensor.simulate_min, sensor.simulate_max)

    def set_up(self):
        pass

    def calc_value(self):
        return self.value

    def get_data(self):
        sensor_data = []

        for sensor in self.output:
            sensor.get_value()
            data = {
                "sensorName": self.name,
                "sensorDataUnit": sensor.unit,
                "sensorType": sensor.name,
                "sensorValue": str(sensor.value)
            }
            sensor_data.append(data)

        return sensor_data


class DhtSensor(Sensor):

    def __init__(self):
        super().__init__("adafruit_dht")

        temperature_output = SensorOutput("temperature", "°", 20, 50)
        humidity_output = SensorOutput("humidity", "%", 20, 75)
        self.add_output(temperature_output)
        self.add_output(humidity_output)

        self.dht_device = any

    def set_up(self):
        dht_device = adafruit_dht.DHT11(board.D4)

        signal(SIGINT, lambda: [dht_device.exit(), exit(0)])
        signal(SIGTERM, lambda: [dht_device.exit(), exit(0)])
        self.dht_device = dht_device

    def calc_value(self):
        try:
            self.output["temperature"].value = self.dht_device.temperature
            self.output["humidity"].value = self.dht_device.humidity

        except RuntimeError as error:
            print(error.args[0])
            return None


class BmpSensor(Sensor):

    def __init__(self):
        super().__init__("adafruit_bmp280")

        temperature_output = SensorOutput("temperature", "°", 20, 50)
        pressure_output = SensorOutput("pressure", "bar", 20, 50)
        altitude_output = SensorOutput("altitude", "m", 1, 100)

        self.add_output(temperature_output)
        self.add_output(pressure_output)
        self.add_output(altitude_output)

        self.barometer = any

    def set_up(self):
        i2c = busio.I2C(board.SCL, board.SDA)
        self.barometer = adafruit_bmp280.Adafruit_BMP280_I2C(i2c)

    def calc_value(self):
        print('bmp calc value')
        self.output["temperature"].value = self.barometer.temperature
        self.output["pressure"].value = self.barometer.pressure
        self.output["altitude"].value = self.barometer.altitude


class AnalogSensor(Sensor):
    def __init__(self, name, mcp):
        super().__init__(name)
        self.mcp = mcp
        self.channel = any

    def set_up(self):
        spi = busio.SPI(clock=board.SCK, MISO=board.MISO, MOSI=board.MOSI)
        cs = digitalio.DigitalInOut(board.D5)
        adc = MCP.MCP3008(spi, cs)
        self.channel = AnalogIn(adc, self.mcp)

    def calc_value(self):
        output_key = list(self.output)[0]

        # TODO from voltage to value
        self.output[output_key].value = self.channel.voltage


class Co2Sensor(AnalogSensor):

    def __init__(self):
        super().__init__("Co2 sensor", MCP.P0)

        co2_output = SensorOutput("co2", "ppm", 15, 75)
        self.add_output(co2_output)


class AirQualitySensor(AnalogSensor):

    def __init__(self):
        super().__init__("Air quality sensor", MCP.P1)
        air_quality_output = SensorOutput("Air quality", "ppm", 15, 75)
        self.add_output(air_quality_output)
