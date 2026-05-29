import Database from 'better-sqlite3';
import { Agent } from './agent.types';

export interface IAgentRepository {
  findAll(): Agent[];
  findById(id: string): Agent | undefined;
  findByEmail(email: string): Agent | undefined;
  create(agent: Agent): Agent;
  update(id: string, fields: Partial<Agent>): Agent | undefined;
}

export class SqliteAgentRepository implements IAgentRepository {
  private db: Database.Database;

  constructor(dbPath = 'agentclinic.db') {
    this.db = new Database(dbPath);
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS agents (
        id       TEXT PRIMARY KEY,
        name     TEXT NOT NULL,
        email    TEXT NOT NULL UNIQUE,
        status   TEXT NOT NULL,
        specialty TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )
    `);
  }

  findAll(): Agent[] {
    return this.db.prepare('SELECT * FROM agents').all() as Agent[];
  }

  findById(id: string): Agent | undefined {
    return this.db.prepare('SELECT * FROM agents WHERE id = ?').get(id) as Agent | undefined;
  }

  findByEmail(email: string): Agent | undefined {
    return this.db.prepare('SELECT * FROM agents WHERE email = ?').get(email) as Agent | undefined;
  }

  create(agent: Agent): Agent {
    this.db
      .prepare(
        'INSERT INTO agents (id, name, email, status, specialty, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
      )
      .run(agent.id, agent.name, agent.email, agent.status, agent.specialty, agent.createdAt, agent.updatedAt);
    return agent;
  }

  update(id: string, fields: Partial<Agent>): Agent | undefined {
    const existing = this.findById(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...fields };
    this.db
      .prepare(
        'UPDATE agents SET name = ?, email = ?, status = ?, specialty = ?, createdAt = ?, updatedAt = ? WHERE id = ?',
      )
      .run(updated.name, updated.email, updated.status, updated.specialty, updated.createdAt, updated.updatedAt, id);
    return updated;
  }
}
