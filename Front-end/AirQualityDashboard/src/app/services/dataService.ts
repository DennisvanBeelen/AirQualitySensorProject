import {Injectable} from "@angular/core";
import {SensorType} from "../interfaces";

@Injectable()
export class dataService {
  extraAllowance = 0.1;

  getMostRecentSensorReading(element) {
    let array = this.createArrayFromObject(element);
    let locationOfMostRecentTimestamp = null;
    for (let i = 0; i < array.length; i++) {
      if (locationOfMostRecentTimestamp === null) {
        locationOfMostRecentTimestamp = i;
      } else {
        if (array[i].timestamp > array[locationOfMostRecentTimestamp].timestamp) {
          locationOfMostRecentTimestamp = i;
        }
      }
    }
    return array[locationOfMostRecentTimestamp];
  }

  createArrayFromObject(object) {
    return Object.keys(object).map(function (objectIndex) {
      return object[objectIndex];
    });
  }

  createReadableTimestamp(timestamp) {
    return new Date(timestamp.seconds * 1000).toLocaleString();
  }

  getSafetyColorCode(safetyRating: string) {
    switch (safetyRating) {
      case "mood":
        return "#03EA18"

      case "sentiment_dissatisfied":
        return "#fbbe00"

      case "mood_bad":
        return "#ff0000"
    }
  }

  getSafetyRating(sensorName, sensorValue) {
    let sensor = this.getCorrectSensorType(sensorName);

    if (sensorValue < sensor.maximumValue && sensorValue > sensor.minimalValue) {
      return "mood"; // mood is happy smiley
    } else if (sensorValue < (sensor.maximumValue + (sensor.maximumValue * this.extraAllowance)) && sensorValue > (sensor.minimalValue - (sensor.minimalValue * this.extraAllowance))) {
      return "sentiment_dissatisfied"; // sentiment_dissatisfied is not super happy smiley
    } else {
      return "mood_bad"; // sad smiley
    }
  }

  getCorrectSensorType(sensorName) {
    switch (sensorName.toLowerCase()) {
      case SensorType.PRESSURE.type.toLowerCase():
        return SensorType.PRESSURE;

      case SensorType.ALTITUDE.type.toLowerCase():
        return SensorType.ALTITUDE;

      case SensorType.TEMPERATURE.type.toLowerCase():
        return SensorType.TEMPERATURE;

      case SensorType.HUMIDITY.type.toLowerCase():
        return SensorType.HUMIDITY;

      case SensorType.AIRQUALITY.type.toLowerCase():
        return SensorType.AIRQUALITY;

      case SensorType.CO2.type.toLowerCase():
        return SensorType.CO2;
    }
  }


  roundSensorData(sensorValue) {
    return Math.round((Number(sensorValue) + Number.EPSILON) * 100) / 100
  }
}

