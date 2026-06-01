import Database from 'better-sqlite3';
import { Ailment } from './ailment.types';

export interface IAilmentRepository {
  findAll(): Ailment[];
  findAllByAgentId(agentId: string): Ailment[];
  findById(id: string): Ailment | undefined;
  create(ailment: Ailment): Ailment;
  update(id: string, fields: Partial<Ailment>): Ailment | undefined;
  delete(id: string): boolean;
}

export class SqliteAilmentRepository implements IAilmentRepository {
  private db: Database.Database;

  constructor(dbPath = 'agentclinic.db') {
    this.db = new Database(dbPath);
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS ailments (
        id            TEXT PRIMARY KEY,
        agentId       TEXT NOT NULL,
        name          TEXT NOT NULL,
        description   TEXT NOT NULL,
        severity      TEXT NOT NULL,
        status        TEXT NOT NULL,
        createdAt     TEXT NOT NULL,
        updatedAt     TEXT NOT NULL,
        FOREIGN KEY (agentId) REFERENCES agents(id)
      )
    `);
  }

  findAll(): Ailment[] {
    return this.db.prepare('SELECT * FROM ailments').all() as Ailment[];
  }

  findAllByAgentId(agentId: string): Ailment[] {
    return this.db.prepare('SELECT * FROM ailments WHERE agentId = ?').all(agentId) as Ailment[];
  }

  findById(id: string): Ailment | undefined {
    return this.db.prepare('SELECT * FROM ailments WHERE id = ?').get(id) as Ailment | undefined;
  }

  create(ailment: Ailment): Ailment {
    this.db
      .prepare(
        'INSERT INTO ailments (id, agentId, name, description, severity, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      )
      .run(ailment.id, ailment.agentId, ailment.name, ailment.description, ailment.severity, ailment.status, ailment.createdAt, ailment.updatedAt);
    return ailment;
  }

  update(id: string, fields: Partial<Ailment>): Ailment | undefined {
    const existing = this.findById(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...fields };
    this.db
      .prepare(
        'UPDATE ailments SET agentId = ?, name = ?, description = ?, severity = ?, status = ?, createdAt = ?, updatedAt = ? WHERE id = ?',
      )
      .run(updated.agentId, updated.name, updated.description, updated.severity, updated.status, updated.createdAt, updated.updatedAt, id);
    return updated;
  }

  delete(id: string): boolean {
    const result = this.db.prepare('DELETE FROM ailments WHERE id = ?').run(id);
    return result.changes > 0;
  }
}
