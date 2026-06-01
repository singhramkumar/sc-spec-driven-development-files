import { randomUUID } from 'crypto';
import { Agent, AgentStatus } from './agent.types';
import { IAgentRepository } from './agent.repository';
import { ValidationError, NotFoundError, ConflictError } from '../errors';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_STATUSES = Object.values(AgentStatus) as string[];

export class AgentService {
  constructor(private repo: IAgentRepository) {}

  listAgents(): Agent[] {
    return this.repo.findAll();
  }

  getAgent(id: string): Agent {
    const agent = this.repo.findById(id);
    if (!agent) throw new NotFoundError('Agent not found');
    return agent;
  }

  createAgent(data: { name?: string; email?: string; specialty?: string; status?: string }): Agent {
    if (!data.name?.trim()) throw new ValidationError('name is required');
    if (!data.email?.trim()) throw new ValidationError('email is required');
    if (!data.specialty?.trim()) throw new ValidationError('specialty is required');
    if (!data.status) throw new ValidationError('status is required');
    if (!EMAIL_REGEX.test(data.email)) throw new ValidationError('Invalid email format');
    if (!VALID_STATUSES.includes(data.status)) throw new ValidationError('Invalid status value');
    if (this.repo.findByEmail(data.email)) throw new ConflictError('Email already in use');

    const now = new Date().toISOString();
    const agent: Agent = {
      id: randomUUID(),
      name: data.name.trim(),
      email: data.email.trim(),
      specialty: data.specialty.trim(),
      status: data.status as AgentStatus,
      createdAt: now,
      updatedAt: now,
    };
    return this.repo.create(agent);
  }

  updateAgent(id: string, data: { name?: string; email?: string; specialty?: string; status?: string }): Agent {
    const existing = this.repo.findById(id);
    if (!existing) throw new NotFoundError('Agent not found');

    if (data.name !== undefined && !data.name.trim()) throw new ValidationError('name is required');
    if (data.specialty !== undefined && !data.specialty.trim()) throw new ValidationError('specialty is required');
    if (data.email !== undefined) {
      if (!EMAIL_REGEX.test(data.email)) throw new ValidationError('Invalid email format');
      const conflict = this.repo.findByEmail(data.email);
      if (conflict && conflict.id !== id) throw new ConflictError('Email already in use');
    }
    if (data.status !== undefined && !VALID_STATUSES.includes(data.status)) {
      throw new ValidationError('Invalid status value');
    }

    const fields: Partial<Agent> = { updatedAt: new Date().toISOString() };
    if (data.name !== undefined) fields.name = data.name.trim();
    if (data.email !== undefined) fields.email = data.email.trim();
    if (data.specialty !== undefined) fields.specialty = data.specialty.trim();
    if (data.status !== undefined) fields.status = data.status as AgentStatus;

    return this.repo.update(id, fields) as Agent;
  }
}
