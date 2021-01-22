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

            config_attribute = config_attribute.replace(' ', '_')

            config[config_attribute] = config_value

    except:
        raise Exception("Config file was bad formatted!")


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
    print('init setup sensors')

    sensors.append(sensordata.AirQualitySensor)
    sensors.append(sensordata.Co2Sensor)
    sensors.append(sensordata.BmpSensor)
    sensors.append(sensordata.DhtSensor)

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
        firebase_client.update_sensors_values()
        firebase_client.send_data_to_firebase()

        time.sleep(2)


main()
