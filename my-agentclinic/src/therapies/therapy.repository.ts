import Database from 'better-sqlite3';
import { Therapy } from './therapy.types';

export interface ITherapyRepository {
  findAll(): Therapy[];
  findById(id: string): Therapy | undefined;
  insertMany(therapies: Therapy[]): void;
  count(): number;
}

export class SqliteTherapyRepository implements ITherapyRepository {
  private db: Database.Database;

  constructor(dbPath = 'agentclinic.db') {
    this.db = new Database(dbPath);
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS therapies (
        id          TEXT PRIMARY KEY,
        name        TEXT NOT NULL,
        description TEXT NOT NULL,
        duration    INTEGER NOT NULL,
        therapist   TEXT NOT NULL,
        category    TEXT NOT NULL,
        createdAt   TEXT NOT NULL
      )
    `);
  }

  findAll(): Therapy[] {
    return this.db.prepare('SELECT * FROM therapies').all() as Therapy[];
  }

  findById(id: string): Therapy | undefined {
    return this.db.prepare('SELECT * FROM therapies WHERE id = ?').get(id) as Therapy | undefined;
  }

  insertMany(therapies: Therapy[]): void {
    const insert = this.db.prepare(
      'INSERT INTO therapies (id, name, description, duration, therapist, category, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
    );
    const insertAll = this.db.transaction((rows: Therapy[]) => {
      for (const row of rows) {
        insert.run(row.id, row.name, row.description, row.duration, row.therapist, row.category, row.createdAt);
      }
    });
    insertAll(therapies);
  }

  count(): number {
    const result = this.db.prepare('SELECT COUNT(*) as count FROM therapies').get() as { count: number };
    return result.count;
  }
}
