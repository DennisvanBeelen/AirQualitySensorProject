// export interface SensorUnits {
//   id: number;
//   location: string;
//   timestamp: Date;
//   sensorData: SensorData[];
// }
//
// export interface SensorData {
//   sensorName: string;
//   sensorValue: number;
//   sensorDataUnit: string;
// }

export interface SensorUnits {
  id: number;
  location: string;
  timestamp: Date;
  sensorData: SensorData[];
}

export interface SensorData {
  timestamp: Date,
  dataBundle: DataBundle[]
}

export interface DataBundle {
  sensorName: string;
  sensorValue: number;
  sensorDataUnit: string;
}

export interface airQualityInformationObject{
  name: string,
  information: informationFormat[],
  infoLink: string
}
export interface informationFormat{
  header: string,
  info: string
}

export const SensorType = {
  PRESSURE: {
    name: 'Barometer',
    type: 'pressure',
    unitType: ' hpa',
    minimalValue: 1000,
    maximumValue: 1075,
    infoLink: "https://www.wikipedia.org",
    sensorInfo: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  },
  TEMPERATURE: {
    name: 'Temperature',
    type: 'temperature',
    unitType: '°',
    minimalValue: 15,
    maximumValue: 25,
    infoLink: "https://www.wikipedia.org",
    sensorInfo: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  },
  ALTITUDE: {
    name: 'Altitude',
    type: 'altitude',
    unitType: ' meter',
    minimalValue: -5,
    maximumValue: 30,
    infoLink: "https://www.wikipedia.org",
    sensorInfo: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  },
  AIRQUALITY: {
    name: 'Air quality',
    type: 'Air quality',
    unitType: '%',
    minimalValue: 0.45,
    maximumValue: 1,
    infoLink: "https://www.wikipedia.org",
    sensorInfo: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  },
  HUMIDITY: {
    name: 'Humidity',
    type: 'humidity',
    unitType: '%',
    minimalValue: 45,
    maximumValue: 50,
    infoLink: "https://www.wikipedia.org",
    sensorInfo: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  },
  CO2: {
    name: 'Co2',
    type: 'co2',
    unitType: 'ppm',
    minimalValue: 1,
    maximumValue: 1.35,
    infoLink: "https://www.wikipedia.org",
    sensorInfo: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  },
}




