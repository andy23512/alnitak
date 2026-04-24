import { inject, Injectable } from '@angular/core';
import { SerialHandler } from 'tangent-cc-lib';
import { SerialLogItemType } from '../models/serial-log.model';
import { SerialLogStore } from '../stores/serial-log.store';
import { SerialPortHandlerService } from './serial-port-handler.service';

@Injectable({ providedIn: 'root' })
export class SerialHandlerService extends SerialHandler {
  private readonly serialLogStore = inject(SerialLogStore);

  constructor(protected serialPortHandlerService: SerialPortHandlerService) {
    super(serialPortHandlerService);
    this.on('sendSerialData', (data: string) => {
      console.log('sendSerialData', data);
      this.serialLogStore.push(SerialLogItemType.Send, data);
    });
    this.on('receiveSerialData', (data: string) => {
      console.log('receiveSerialData', data);
      this.serialLogStore.push(SerialLogItemType.Receive, data);
    });
  }
}
