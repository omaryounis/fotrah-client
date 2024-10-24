import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

constructor() { }
 onvertToFormData(data: any): FormData {
  const formData = new FormData();

  function iterateObject(obj: any) {
    for (const key of Object.keys(obj)) {
      const value = obj[key];

      if (typeof value === 'object' && !Array.isArray(value)) {
        iterateObject(value);
      } else {
        formData.append(key, value);
      }
    }
  }

  iterateObject(data);
  return formData;
}

 isValidObject(obj :any) {
  const isValidValue = (value :any) => {
      if (value === null || value === undefined) {
          return false;
      }
      if (typeof value === 'string') {
          return value.trim().length > 0;
      }
      if (typeof value === 'number') {
          return value !== 0 && !isNaN(value); // Excluding 0 and NaN
      }
      if (typeof value === 'boolean') {
          return true;
      }
      if (Array.isArray(value)) {
          return value.length > 0;
      }
      if (value instanceof Date) {
          return !isNaN(value.getTime()); // Valid Date
      }
      if (typeof value === 'object') {
          return this.isValidObject(value);
      }
      return false;
  };

  for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
          if (!isValidValue(obj[key])) {
              return false;
          }
      }
  }
  return true;
}
}
