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

export interface airQualityInformationObject {
  name: string,
  information: informationFormat[],
  infoLink: string
}

export interface informationFormat {
  header: string,
  info: string
}

export const SensorType = {
  PRESSURE: {
    name: 'Barometer',
    type: 'pressure',
    unitType: ' hpa',
    minimalValue: 940,
    maximumValue: 1060,
    gaugeBoundaries: [],
    gaugeColors: [],
    infoLink: "https://en.wikipedia.org/wiki/Atmospheric_pressure",
    sensorInfo: "The atmospheric pressure varies wildly depending on the altitude you live in. Air pressure is measured in HPA (HectoPascal). \n\n" +
      "According to the The Royal Dutch Meteorological Institute on average the air pressure on earth is between 940 and 1060 hpa and should be considered the healthy norm."
  },
  TEMPERATURE: {
    name: 'Temperature',
    type: 'temperature',
    unitType: '°',
    minimalValue: 18,
    maximumValue: 25,
    gaugeBoundaries: [4,12,18,24,32, 40],
    gaugeColors: ['#F44336','#FFEB3B', '#4CAF50', '#FFEB3B', '#F44336'],
    infoLink: "https://en.wikipedia.org/wiki/Room_temperature",
    sensorInfo: "Room temperature is the range of air temperatures that most people prefer for indoor settings, which feel comfortable when wearing typical indoor clothing.\n\n " +
      "The comfort temperature range is between 20-22°C. \n" +
      "According to the WHO a room temperature should be between 18-25°C, being in a room with typical indoor clothing for a long period of time could be bad for health."
  },
  ALTITUDE: {
    name: 'Altitude',
    type: 'altitude',
    unitType: ' meter',
    minimalValue: -5,
    maximumValue: 300,
    gaugeBoundaries: [],
    gaugeColors: [],
    infoLink: "https://en.wikipedia.org/wiki/Effects_of_high_altitude_on_humans",
    sensorInfo: "Over 8000 feet you can start getting serious health issues if you stay at that altitude for a long time without training. " +
      "Other then that if you are not too far underground and get enough sunlight altitude is mostly fine. " +
      "There is no skyscraper in the netherlands high enough that would make the air TOO thin.\n"+
      "Going to low for too long is also unhealthy due to the lack of sun and a higher air pressure. "
  },
  AIRQUALITY: {
    name: 'Air quality',
    type: 'Air quality',
    unitType: 'ppm',
    minimalValue: 0.45,
    maximumValue: 1,
    gaugeBoundaries: [250,400,1000,1600,3000],
    gaugeColors: ['#4CAF50', '#FFEB3B', '#FF9800', '#F44336'],
    infoLink: "https://ec.europa.eu/environment/air/pdf/Brochure%20lower-cost%20sensors.pdf",
    sensorInfo: "The air quality sensor measures the amount of particles in the air en gives a estimate of air quality. More information about air quality sensors in the link."
  },
  HUMIDITY: {
    name: 'Humidity',
    type: 'humidity',
    unitType: '%',
    minimalValue: 30,
    maximumValue: 50,
    gaugeBoundaries: [],
    gaugeColors: [],
    infoLink: "https://www.lennox.com/lennox-life/comfort-matters/getting-comfortable/three-signs-your-home-has-poor-indoor-humidity#:~:text=The%20ideal%20relative%20humidity%20for,of%20moisture%20it%20can%20contain.",
    sensorInfo: "According to the Mayo Clinic a healthy and comfortable humidity indoors is between 30-50%.\n\n" +
      "Too much humidity could lead to:\n" +
      "- not sleeping well. \n" +
      "- Extra sweating. \n" +
      "- Difficult to breath. \n"
  },
  CO2: {
    name: 'Co2',
    type: 'co2',
    unitType: 'ppm',
    minimalValue: 0,
    maximumValue: 2,
    gaugeBoundaries: [250,400,1000,2000],
    gaugeColors: ['#4CAF50', '#FFEB3B', '#F44336'],
    infoLink: "https://www.dhs.wisconsin.gov/chemical/carbondioxide.htm#:~:text=The%20levels%20of%20CO2%20in,(normal)%20outdoor%20air%20level.&text=1%2C000%20%2D%202%2C000%20ppm%3A%20level%20associated,stagnant%2C%20stale%2C%20stuffy%20air.",
    sensorInfo: "CO2 is the fourth most abundant gas in the earth's atmosphere. At room temperature, carbon dioxide (CO2) is a colorless, odorless, non-flammable gas, at other temperatures and pressures, carbon dioxide can be a liquid or a solid. \n\n" +
      "0.250 is seen as normal outdoor values in a nature setting. \n" +
      "2-5 could lead to headaches, sleepiness, and stagnant, stale, stuffy air. Poor concentration, loss of attention, increased heart rate and slight nausea may also be present. "
  },
}




//colors = ['#F44336','#FF9800','#FFEB3B','#4CAF50', '#FFEB3B', '#FF9800', '#F44336'];
