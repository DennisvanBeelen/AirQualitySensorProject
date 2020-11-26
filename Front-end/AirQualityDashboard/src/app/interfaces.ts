export interface SensorUnits {
  id: number;
  location: string;
  timestamp: Date;
  sensorData: Sensor[];
}

export interface Sensor {
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
  BAROMETER: {
    name: 'Barometer',
    unitType: ' bar',
    minimalValue: 1,
    maximumValue: 2,
    infoLink: "https://www.wikipedia.org",
    sensorInfo: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  },
  TEMPERATURE: {
    name: 'Temperature',
    unitType: '°',
    minimalValue: 10,
    maximumValue: 30,
    infoLink: "https://www.wikipedia.org",
    sensorInfo: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  },
  ALTIMETER: {
    name: 'Altimeter',
    unitType: ' meter',
    minimalValue: -5,
    maximumValue: 30,
    infoLink: "https://www.wikipedia.org",
    sensorInfo: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  },
  AIRQUALITY: {
    name: 'Air quality',
    unitType: '%',
    minimalValue: 70,
    maximumValue: 100,
    infoLink: "https://www.wikipedia.org",
    sensorInfo: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  },
  HUMIDITY: {
    name: 'humidity',
    unitType: '%',
    minimalValue: 25,
    maximumValue: 75,
    infoLink: "https://www.wikipedia.org",
    sensorInfo: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  },
}




