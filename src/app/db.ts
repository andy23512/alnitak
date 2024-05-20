import Dexie, { Table } from 'dexie';
import { KeyRecord } from './models/key-record.models';

export class AppDB extends Dexie {
  keyRecords!: Table<KeyRecord, number>;

  constructor() {
    super('appDB');
    this.version(1).stores({
      keyRecords: '++id, timestamp, topicId, lessonId, isCorrect',
    });
  }
}

export const db = new AppDB();
