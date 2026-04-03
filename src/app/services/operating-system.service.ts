import { Injectable } from '@angular/core';
import { OperatingSystemName } from 'tangent-cc-lib';
import { UAParser } from 'ua-parser-js';

@Injectable({
  providedIn: 'root',
})
export class OperatingSystemService {
  private uaParser = new UAParser();

  constructor() {}

  public getOS(): OperatingSystemName | undefined {
    return this.uaParser.getOS().name as OperatingSystemName | undefined;
  }
}
