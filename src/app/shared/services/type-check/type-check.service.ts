import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class TypeCheckService {
  constructor() {}

  isString(input: any): boolean {
    return typeof input === "string";
  }
}
