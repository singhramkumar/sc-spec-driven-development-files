import { randomUUID } from 'crypto';
import { Ailment, AilmentSeverity, AilmentStatus } from './ailment.types';
import { IAilmentRepository } from './ailment.repository';
import { IAgentRepository } from '../agents/agent.repository';
import { ValidationError, NotFoundError } from '../errors';

const VALID_SEVERITIES = Object.values(AilmentSeverity) as string[];
const VALID_STATUSES = Object.values(AilmentStatus) as string[];

export class AilmentService {
  constructor(private repo: IAilmentRepository, private agentRepo: IAgentRepository) {}

  listAllAilments(): Ailment[] {
    return this.repo.findAll();
  }

  listAilmentsForAgent(agentId: string): Ailment[] {
    const agent = this.agentRepo.findById(agentId);
    if (!agent) throw new NotFoundError('Agent not found');
    return this.repo.findAllByAgentId(agentId);
  }

  createAilment(agentId: string, data: { name?: string; description?: string; severity?: string }): Ailment {
    const agent = this.agentRepo.findById(agentId);
    if (!agent) throw new NotFoundError('Agent not found');

    if (!data.name?.trim()) throw new ValidationError('name is required');
    if (!data.description?.trim()) throw new ValidationError('description is required');
    if (!data.severity) throw new ValidationError('severity is required');
    if (!VALID_SEVERITIES.includes(data.severity)) throw new ValidationError('Invalid severity value');

    const now = new Date().toISOString();
    const ailment: Ailment = {
      id: randomUUID(),
      agentId,
      name: data.name.trim(),
      description: data.description.trim(),
      severity: data.severity as AilmentSeverity,
      status: AilmentStatus.Active,
      createdAt: now,
      updatedAt: now,
    };
    return this.repo.create(ailment);
  }

  updateAilment(agentId: string, ailmentId: string, data: { name?: string; description?: string; severity?: string; status?: string }): Ailment {
    const agent = this.agentRepo.findById(agentId);
    if (!agent) throw new NotFoundError('Agent not found');

    const ailment = this.repo.findById(ailmentId);
    if (!ailment) throw new NotFoundError('Ailment not found');
    if (ailment.agentId !== agentId) throw new NotFoundError('Ailment not found');

    if (data.name !== undefined && !data.name.trim()) throw new ValidationError('name is required');
    if (data.description !== undefined && !data.description.trim()) throw new ValidationError('description is required');
    if (data.severity !== undefined && !VALID_SEVERITIES.includes(data.severity)) {
      throw new ValidationError('Invalid severity value');
    }
    if (data.status !== undefined && !VALID_STATUSES.includes(data.status)) {
      throw new ValidationError('Invalid status value');
    }

    const fields: Partial<Ailment> = { updatedAt: new Date().toISOString() };
    if (data.name !== undefined) fields.name = data.name.trim();
    if (data.description !== undefined) fields.description = data.description.trim();
    if (data.severity !== undefined) fields.severity = data.severity as AilmentSeverity;
    if (data.status !== undefined) fields.status = data.status as AilmentStatus;

    return this.repo.update(ailmentId, fields) as Ailment;
  }

  deleteAilment(agentId: string, ailmentId: string): boolean {
    const agent = this.agentRepo.findById(agentId);
    if (!agent) throw new NotFoundError('Agent not found');

    const ailment = this.repo.findById(ailmentId);
    if (!ailment) throw new NotFoundError('Ailment not found');
    if (ailment.agentId !== agentId) throw new NotFoundError('Ailment not found');

    return this.repo.delete(ailmentId);
  }
}
