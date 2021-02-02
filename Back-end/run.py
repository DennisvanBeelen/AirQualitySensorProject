# coding: utf-8
import os
import time
import sensordata
import firebasedata
import sys

config = {}
sensors = []
CALIBRATE = False
WARMUP = True
PRINT_READINGS = False


def parse_config():
    if not os.path.isfile('./config.yml'):
        raise Exception('No config file found')

    config_file_lines = open('config.yml', 'r').readlines()

    try:
        for config_file_line in config_file_lines:
            config_file_line = config_file_line.replace('\n', '')
            config_attribute, config_value = config_file_line.split(': ')

            config_attribute = config_attribute.replace(' ', '_')

            config[config_attribute] = config_value

    except:
        raise Exception("Config file was formatted improperly!")


def check_config():
    if 'id' not in config:
        raise Exception('No id fount in config file!')
    elif 'name' not in config:
        raise Exception('No name fount in config file!')
    elif 'location' not in config:
        raise Exception('No location fount in config file!')
    elif 'collection' not in config:
        raise Exception('No collection name fount in config file!')

    elif 'password' not in config:
        raise Exception('No password found in config!')
    elif 'email' not in config:
        raise Exception('No email found in config!')
    elif 'firebase_rest_url' not in config:
        raise Exception('No firebase rest url found in config!')
    elif 'firebase_api_key' not in config:
        raise Exception('No firebase api key found in config!')




def set_up_sensors():
    sensors.append(sensordata.COSensor())
    sensors.append(sensordata.CO2Sensor())
    sensors.append(sensordata.PressureSensor())
    sensors.append(sensordata.HumiditySensor())
    
    if WARMUP:
        sensors[0].warm_up()

    
    for sensor in sensors:
        sensor.set_up()
        if CALIBRATE:
            sensor.calibrate()
    return sensors


def set_up_firebase():
    return firebasedata.FirebaseClient(config, sensors, PRINT_READINGS)


def set_up():
    try:
        parse_config()
        check_config()
        
        set_up_sensors()

        return set_up_firebase()

    except:
        raise
    
def set_calibration(calibration = False):
    global CALIBRATE
    CALIBRATE = calibration
    
def set_warmup(calibration=True):
    global WARMUP
    WARMUP = calibration
    
        
def set_print_readings(calibration=True):
    global PRINT_READINGS
    PRINT_READINGS = calibration

def help():
    print("Usage:")
    print("-c --calibrate: recalibrate the gas sensors")
    print("-h --help: show usage hints")
    print("-v --verbose: print sensor readings to the terminal")
    print("-s --skip-warmup: skip warming up the sensors (only recommended if sensors are guaranteed to be warmed up)")
    

def main():
    for x in sys.argv:
        if x.lower() == 'help' or x.lower() == '-h' or x.lower() == '--help':
            help()
            return
        if x.lower() == '-c' or x.lower() == '--calibrate':
            set_calibration(True)
        if x.lower() == '-s' or x.lower() == '--skip-warmup':
            set_warmup(False)
        if x.lower() == '-v' or x.lower() == '--verbose':
            set_print_readings(True)
            
    firebase_client = set_up()

    while True:
        firebase_client.update_sensors_values()
        firebase_client.send_data_to_firebase()

        time.sleep(2)


if __name__ == "__main__":
    main()
    