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

  getSafetyColorCode(sensorName, sensorValue) {

    let sensor = this.getCorrectSensorType(sensorName);

    if (sensorValue < sensor.maximumValue && sensorValue > sensor.minimalValue) {
      return "#80ff97"
    } else if (sensorValue < (sensor.maximumValue + (sensor.maximumValue * this.extraAllowance)) && sensorValue > (sensor.minimalValue - (sensor.minimalValue * this.extraAllowance))) {
      return "#fbff80"
    } else {
      return "#ff6666"
    }
  }

  getSafetyRating(sensorName, sensorValue) {
    let sensor = this.getCorrectSensorType(sensorName);
    let betweenMinAndMax = sensor.maximumValue - sensor.minimalValue;
    let stepsBetween = betweenMinAndMax/5;
    let offset = 0;

    if (sensorValue < sensor.maximumValue && sensorValue > sensor.minimalValue) {
      return this.getSafetyRatingGreen(sensorValue, sensor, stepsBetween, offset);
    } else if (sensorValue < (sensor.maximumValue + (sensor.maximumValue * this.extraAllowance)) && sensorValue > (sensor.minimalValue - (sensor.minimalValue * this.extraAllowance))) {
      return this.getSafetyRatingYellow(sensorValue, sensor, stepsBetween, offset);
    } else {
      return this.getSafetyRatingRed(sensorValue, sensor, stepsBetween, offset)
    }
  }

  getSafetyRatingGreen(sensorValue, sensor, stepsBetween, offset){
    if (sensorValue > sensor.maximumValue - (stepsBetween)){ return (45-offset)+ "px"}
    else if (sensorValue > sensor.maximumValue - (stepsBetween*2)){ return (35-offset)+"px"}
    else if (sensorValue < sensor.minimalValue + (stepsBetween)){ return (5-offset)+"px"}
    else if (sensorValue < sensor.minimalValue + (stepsBetween)){ return (15-offset)+"px"}
    else {return (25-offset)+"px";} // dead center
  }

  getSafetyRatingYellow(sensorValue, sensor, stepsBetween, offset){
    if (sensorValue < sensor.minimalValue) {
      return (-5-offset)+"px"; // left yellow
    } else {
      return (54-offset)+"px"; // right yellow
    }
  }

  getSafetyRatingRed(sensorValue, sensor, stepsBetween, offset){
    if (sensorValue > (sensor.maximumValue + (sensor.maximumValue * this.extraAllowance))) {
      return (70-offset)+ "px";
    } else {
      return (-20-offset)+"px";
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

  cutArrayToWantedSize(array, wantedLength) {
    if (array.length > wantedLength) {
      let amountToLong = array.length - wantedLength;
      array.splice(0, amountToLong);
    }
    return array;
  }

  sortArrayOnTimestamp(array) {
    return array.sort(function (a, b) {
      return a.timestamp - b.timestamp
    });
  }
}

