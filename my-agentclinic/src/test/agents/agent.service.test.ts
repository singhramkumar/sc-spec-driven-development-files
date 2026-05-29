import { AgentService, ValidationError, NotFoundError, ConflictError } from '../../agents/agent.service';
import { IAgentRepository } from '../../agents/agent.repository';
import { Agent, AgentStatus } from '../../agents/agent.types';

function makeMockRepo(overrides: Partial<IAgentRepository> = {}): IAgentRepository {
  return {
    findAll: jest.fn().mockReturnValue([]),
    findById: jest.fn().mockReturnValue(undefined),
    findByEmail: jest.fn().mockReturnValue(undefined),
    create: jest.fn((a: Agent) => a),
    update: jest.fn().mockReturnValue(undefined),
    ...overrides,
  };
}

const validPayload = { name: 'Atlas', email: 'atlas@agentclinic.dev', specialty: 'coding assistant', status: 'active' };

const seedAgent: Agent = {
  id: 'uuid-1',
  name: 'Atlas',
  email: 'atlas@agentclinic.dev',
  specialty: 'coding assistant',
  status: AgentStatus.Active,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

describe('AgentService.createAgent', () => {
  it('throws ValidationError when name is missing', () => {
    const { name: _n, ...rest } = validPayload;
    expect(() => new AgentService(makeMockRepo()).createAgent(rest)).toThrow(ValidationError);
  });

  it('throws ValidationError when email is missing', () => {
    const { email: _e, ...rest } = validPayload;
    expect(() => new AgentService(makeMockRepo()).createAgent(rest)).toThrow(ValidationError);
  });

  it('throws ValidationError when specialty is missing', () => {
    const { specialty: _s, ...rest } = validPayload;
    expect(() => new AgentService(makeMockRepo()).createAgent(rest)).toThrow(ValidationError);
  });

  it('throws ValidationError when status is missing', () => {
    const { status: _st, ...rest } = validPayload;
    expect(() => new AgentService(makeMockRepo()).createAgent(rest)).toThrow(ValidationError);
  });

  it('throws ValidationError on invalid email format', () => {
    expect(() =>
      new AgentService(makeMockRepo()).createAgent({ ...validPayload, email: 'not-an-email' }),
    ).toThrow(ValidationError);
  });

  it('throws ValidationError on invalid status value', () => {
    expect(() =>
      new AgentService(makeMockRepo()).createAgent({ ...validPayload, status: 'flying' }),
    ).toThrow(ValidationError);
  });

  it('throws ConflictError on duplicate email', () => {
    const repo = makeMockRepo({ findByEmail: jest.fn().mockReturnValue(seedAgent) });
    expect(() => new AgentService(repo).createAgent(validPayload)).toThrow(ConflictError);
  });

  it('creates and returns agent on valid input', () => {
    const agent = new AgentService(makeMockRepo()).createAgent(validPayload);
    expect(agent.name).toBe('Atlas');
    expect(agent.email).toBe('atlas@agentclinic.dev');
    expect(agent.id).toBeTruthy();
    expect(agent.createdAt).toBeTruthy();
  });
});

describe('AgentService.getAgent', () => {
  it('throws NotFoundError when agent does not exist', () => {
    expect(() => new AgentService(makeMockRepo()).getAgent('missing')).toThrow(NotFoundError);
  });

  it('returns the agent when found', () => {
    const repo = makeMockRepo({ findById: jest.fn().mockReturnValue(seedAgent) });
    expect(new AgentService(repo).getAgent('uuid-1')).toEqual(seedAgent);
  });
});

describe('AgentService.updateAgent', () => {
  it('throws NotFoundError when agent does not exist', () => {
    expect(() => new AgentService(makeMockRepo()).updateAgent('missing', { name: 'X' })).toThrow(NotFoundError);
  });

  it('throws ValidationError on invalid status', () => {
    const repo = makeMockRepo({ findById: jest.fn().mockReturnValue(seedAgent) });
    expect(() => new AgentService(repo).updateAgent('uuid-1', { status: 'broken' })).toThrow(ValidationError);
  });

  it('throws ValidationError on invalid email format', () => {
    const repo = makeMockRepo({ findById: jest.fn().mockReturnValue(seedAgent) });
    expect(() => new AgentService(repo).updateAgent('uuid-1', { email: 'bad' })).toThrow(ValidationError);
  });

  it('throws ConflictError when email is taken by another agent', () => {
    const other: Agent = { ...seedAgent, id: 'uuid-2', email: 'other@agentclinic.dev' };
    const repo = makeMockRepo({
      findById: jest.fn().mockReturnValue(seedAgent),
      findByEmail: jest.fn().mockReturnValue(other),
      update: jest.fn().mockReturnValue(seedAgent),
    });
    expect(() => new AgentService(repo).updateAgent('uuid-1', { email: 'other@agentclinic.dev' })).toThrow(ConflictError);
  });

  it('updates successfully with valid fields', () => {
    const updated = { ...seedAgent, name: 'Atlas v2' };
    const repo = makeMockRepo({
      findById: jest.fn().mockReturnValue(seedAgent),
      update: jest.fn().mockReturnValue(updated),
    });
    const result = new AgentService(repo).updateAgent('uuid-1', { name: 'Atlas v2' });
    expect(result.name).toBe('Atlas v2');
  });
});
