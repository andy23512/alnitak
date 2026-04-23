import { Injectable } from '@angular/core';
import { SerialHandler } from 'tangent-cc-lib';
import { SerialPortHandlerService } from './serial-port-handler.service';

@Injectable({ providedIn: 'root' })
export class SerialHandlerService extends SerialHandler {
  constructor(protected serialPortHandlerService: SerialPortHandlerService) {
    super(serialPortHandlerService);
  }
}
