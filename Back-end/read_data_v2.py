import os
import time
import sensordata
import firebasedata

config = {}
sensors = []

def parse_config():
    if not os.path.isfile('./config.yml'):
        raise Exception('No config file found')

    config_file_lines = open('config.yml', 'r').readlines()

    try:
        for config_file_line in config_file_lines:
            config_file_line = config_file_line.replace('\n', '')
            config_attribute, config_value = config_file_line.split(': ')

            config[config_attribute] = config_value

    except:
        raise Exception("Config file was formatted wrong!")


def check_config():
    if 'id' not in config:
        raise Exception('No id found in config file!')
    elif 'name' not in config:
        raise Exception('No name found in config file!')
    elif 'location' not in config:
        raise Exception('No location found in config file!')
    elif 'collection' not in config:
        raise Exception('No collection name found in config file!')

    elif 'cert' not in config:
        raise Exception('No path to cert found in config!')
    elif not os.path.isfile(config['cert']):
        raise Exception('No cert file was found at location found in config file!')


def set_up_sensors():
    print('init setup sensors')

    sensors.append(sensordata.AirQualitySensor())
    sensors.append(sensordata.Co2Sensor())
    sensors.append(sensordata.BmpSensor())
    sensors.append(sensordata.DhtSensor())

    for sensor in sensors:
        sensor.set_up()

    return sensors


def set_up_firebase():
    return firebasedata.FirebaseClient(config, sensors)


def set_up():
    try:
        parse_config()
        check_config()

        set_up_sensors()

        return set_up_firebase()

    except:
        raise


def main():
    firebase_client = set_up()

    while True:
        firebase_client.simulate_sensor_values()
        firebase_client.send_data_to_firebase()

        time.sleep(2)



main()
