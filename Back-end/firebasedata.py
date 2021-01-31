from datetime import datetime
from firebase_admin import firestore
from google.oauth2.credentials import Credentials
from google.cloud.firestore import Client
import requests
import json


class FirebaseClient:
    def __init__(self, config, sensors):
        print("init firebase data")

        self.sensors = sensors
        self.id = config['id']
        self.name = config['name']
        self.location = config['location']
        self.collection = config['collection']

        self.firestore_client = self.set_up_firebase_connection(config)

        self.timestamp = str(datetime.now().replace(microsecond=0))

    def set_up_firebase_connection(self, config):
        oauth_response = self.get_firebase_oauth_token(config)

        cred = Credentials(oauth_response['idToken'], oauth_response['refreshToken'])

        return Client("sensortechminor", cred)

    def get_firebase_oauth_token(self, config):
        request_url = config['firebase_rest_url'] + ":signInWithPassword?key=" + config['firebase_api_key']
        headers = {"content-type": "application/json; charset=UTF-8"}
        data = json.dumps({
            "email": config['email'],
            "password": config['password'],
            "returnSecureToken": True
        })

        oauth_response = requests.post(request_url, headers=headers, data=data)

        oauth_response.raise_for_status()

        return oauth_response.json()

    def update_sensors_values(self):
        for sensor in self.sensors:
            sensor.calc_value()

    def simulate_sensor_values(self):
        for sensor in self.sensors:
            sensor.simulate_values()

    def get_collection(self):
        return self.collection

    def get_document(self):
        document = self.name + self.id
        return document

    def get_sensor_data_array(self):
        sensor_array = []

        for sensor in self.sensors:
            for data in sensor.get_data():
                sensor_array.append(data)

        return sensor_array

    def get_data_as_dict(self):
        self.timestamp = str(datetime.now().replace(microsecond=0))
        firebase_data = {
            "id": self.id,
            "location": self.location,
            "sensorData": {
                self.timestamp: {
                    "data": self.get_sensor_data_array(),
                    "timestamp": firestore.SERVER_TIMESTAMP
                }
            }
        }
        print(firebase_data)

        return firebase_data

    def send_data_to_firebase(self):
        data_ref = self.firestore_client.collection(self.get_collection()).document(self.get_document())
        data_ref.set(self.get_data_as_dict(), merge=True)
