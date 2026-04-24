export enum SerialLogItemType {
  Send = 'Send',
  Receive = 'Receive',
}

export interface SerialLogItem {
  type: SerialLogItemType;
  time: Date;
  data: string;
}

export interface SerialLogState {
  items: SerialLogItem[];
}
