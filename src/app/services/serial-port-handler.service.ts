import { Injectable } from '@angular/core';
import {
  CHARACHORDER_3D_INPUT_DEVICE_PORTS,
  SerialPortHandler,
} from 'tangent-cc-lib';

@Injectable({ providedIn: 'root' })
export class SerialPortHandlerService extends SerialPortHandler {
  constructor() {
    super(false, CHARACHORDER_3D_INPUT_DEVICE_PORTS);
  }
}
