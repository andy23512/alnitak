import { Injectable } from '@angular/core';
import { UAParser } from 'ua-parser-js';
import { OperatingSystemName } from '../models/operating-system.models';

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
