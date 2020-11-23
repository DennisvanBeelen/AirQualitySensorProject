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

export const SensorType = {
  BAROMETER: {name: 'Barometer', unitType: ' bar', minimalValue: 1, maximumValue: 2},
  TEMPERATURE: {name: 'Temperature', unitType: '°', minimalValue: 10, maximumValue: 30},
  ALTIMETER: {name: 'Altimeter', unitType: ' meter', minimalValue: -5, maximumValue: 30},
  AIRQUALITY: {name: 'Air quality', unitType: '%', minimalValue: 70, maximumValue: 100},
  HUMIDITY: {name: 'humidity', unitType: '%', minimalValue: 25, maximumValue: 75},
}

