import { AppDB } from './db';

describe('AppDB', () => {
  let db: AppDB;

  beforeEach(async () => {
    await new AppDB().delete();
    db = new AppDB();
  });

  afterEach(async () => {
    db.close();
    await new AppDB().delete();
  });

  it('is the database appDB with a keyRecords table keyed by an auto id', () => {
    expect(db.name).toBe('appDB');
    expect(db.keyRecords.schema.primKey.name).toBe('id');
    expect(db.keyRecords.schema.primKey.auto).toBeTrue();
  });

  it('indexes the timestamp, topic, lesson and correctness', () => {
    expect(db.keyRecords.schema.indexes.map((i) => i.name)).toEqual([
      'timestamp',
      'topicId',
      'lessonId',
      'isCorrect',
    ]);
  });

  it('is at version 1', () => {
    expect(db.verno).toBe(1);
  });

  it('stores records, gives them ids and finds them by index', async () => {
    const record = (topicId: string) =>
      ({ timestamp: 1, topicId, lessonId: 'l', isCorrect: true }) as never;
    const id1 = await db.keyRecords.add(record('t'));
    const id2 = await db.keyRecords.add(record('u'));
    expect(id2).toBeGreaterThan(id1);
    expect(
      (await db.keyRecords.where('topicId').equals('u').toArray()).length,
    ).toBe(1);
    expect(await db.keyRecords.count()).toBe(2);
  });
});
