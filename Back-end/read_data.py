import busio
import digitalio
import board
import adafruit_mcp3xxx.mcp3008 as MCP
import adafruit_dht
import atexit
import adafruit_bmp280
import json
import time
from datetime import datetime
from signal import signal, SIGINT, SIGTERM
from adafruit_mcp3xxx.analog_in import AnalogIn


dht_device = adafruit_dht.DHT11(board.D4)


def exit_handler(signal, frame):
    dht_device.exit()
    exit(0)

def get_adc_channels(adc):
    return AnalogIn(adc, MCP.P0), AnalogIn(adc, MCP.P1)

def get_adc_value(channel):
    return channel.value

def get_adc_voltage(channel):
    return channel.voltage

def get_dht_value():
    try:
        # Print the values to the serial port
        temperature = dht_device.temperature
        humidity = dht_device.humidity
        return temperature, humidity
 
    except RuntimeError as error:
        print(error.args[0])
        return None
    
def get_barometer_value(barometer):
    #TODO calibrate
    return barometer.temperature, barometer.pressure, barometer.altitude
        
def get_co_value(adc_chan):
    #TODO: Convert to ppm
    return(get_adc_voltage(chan0))
    
def get_aq_value(adc_chan):
    #TODO: Convert to ppm
    return(get_adc_voltage(chan1))
    
    
def main():
    signal(SIGINT,exit_handler)
    signal(SIGTERM,exit_handler)
    spi = busio.SPI(clock=board.SCK, MISO=board.MISO, MOSI=board.MOSI)
    cs = digitalio.DigitalInOut(board.D5)
    adc = MCP.MCP3008(spi, cs)
    chan0, chan1 = get_adc_channels(adc)
    i2c = busio.I2C(board.SCL, board.SDA)
    barometer = adafruit_bmp280.Adafruit_BMP280_I2C(i2c)

    while True:
        try:
            co = get_adc_voltage(chan0)
            aq = get_adc_voltage(chan1)
            dht_temp, dht_humidity = get_dht_value()
            barometer_temp, barometer_pressure, barometer_altitude = get_barometer_value(barometer)
            reading_dict = {
                "id":"ff5gh7889",
                "Naam":"Woonkamer",
                "Timestamp":str(datetime.now().replace(microsecond=0)),
                "CO":co,
                "Air quality": aq,
                "DHT11 Temperature":dht_temp,
                "DHT11 Humidity":dht_humidity,
                "Barometer temperature":barometer_temp,
                "Pressure":barometer_pressure,
                "Altitude":barometer_altitude
            }
            json_str = json.dumps(reading_dict)
            print(json_str)
        except:
            pass
        time.sleep(2)
        
        
if __name__ == "__main__":
    main()
b