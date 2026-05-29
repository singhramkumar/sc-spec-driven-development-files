"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SqliteAgentRepository = void 0;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
class SqliteAgentRepository {
    constructor(dbPath = 'agentclinic.db') {
        this.db = new better_sqlite3_1.default(dbPath);
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
    findAll() {
        return this.db.prepare('SELECT * FROM agents').all();
    }
    findById(id) {
        return this.db.prepare('SELECT * FROM agents WHERE id = ?').get(id);
    }
    findByEmail(email) {
        return this.db.prepare('SELECT * FROM agents WHERE email = ?').get(email);
    }
    create(agent) {
        this.db
            .prepare('INSERT INTO agents (id, name, email, status, specialty, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)')
            .run(agent.id, agent.name, agent.email, agent.status, agent.specialty, agent.createdAt, agent.updatedAt);
        return agent;
    }
    update(id, fields) {
        const existing = this.findById(id);
        if (!existing)
            return undefined;
        const updated = Object.assign(Object.assign({}, existing), fields);
        this.db
            .prepare('UPDATE agents SET name = ?, email = ?, status = ?, specialty = ?, createdAt = ?, updatedAt = ? WHERE id = ?')
            .run(updated.name, updated.email, updated.status, updated.specialty, updated.createdAt, updated.updatedAt, id);
        return updated;
    }
}
exports.SqliteAgentRepository = SqliteAgentRepository;
