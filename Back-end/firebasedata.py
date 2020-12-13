from datetime import datetime
from firebase_admin import credentials
from firebase_admin import firestore
import firebase_admin


class FirebaseClient:
    def __init__(self, config, sensors):
        print("init firebase data")

        self.sensors = sensors
        self.id = config['id']
        self.name = config['name']
        self.location = config['location']
        self.collection = config['collection']

        self.firestore_client = self.set_up_firebase_connection(config['cert'])

        self.timestamp = str(datetime.now().replace(microsecond=0))

    def set_up_firebase_connection(self, certificate):
        cred = credentials.Certificate(certificate)
        firebase_admin.initialize_app(cred)
        return firestore.client()

    def update_sensors_values(self):
        for sensor in self.sensors:
            sensor.calc_value()

    def simulate_sensor_values(self):
        for sensor in self.sensors:
            sensor.simulate_values()

    def get_collection(self):
        return self.collection

    def get_document(self):
        document = self.name + self.id + 'test'
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
            "sensorData": {
                self.timestamp: {
                    "data": self.get_sensor_data_array(),
                    "timestamp": firestore.SERVER_TIMESTAMP
                }
            }
        }

        return firebase_data

    def send_data_to_firebase(self):
        data_ref = self.firestore_client.collection(self.get_collection()).document(self.get_document())
        data_ref.set(self.get_data_as_dict(), merge=True)
