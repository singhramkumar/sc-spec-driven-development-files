import request from 'supertest';
import express from 'express';
import { createAgentRouter } from '../../agents/agent.router';
import { IAgentRepository } from '../../agents/agent.repository';
import { Agent, AgentStatus } from '../../agents/agent.types';

const mockAgent: Agent = {
  id: 'uuid-1',
  name: 'Atlas',
  email: 'atlas@agentclinic.dev',
  specialty: 'coding assistant',
  status: AgentStatus.Active,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

function makeMockRepo(overrides: Partial<IAgentRepository> = {}): IAgentRepository {
  return {
    findAll: jest.fn().mockReturnValue([mockAgent]),
    findById: jest.fn().mockReturnValue(mockAgent),
    findByEmail: jest.fn().mockReturnValue(undefined),
    create: jest.fn((a: Agent) => a),
    update: jest.fn().mockReturnValue(mockAgent),
    ...overrides,
  };
}

function makeApp(repo: IAgentRepository) {
  const app = express();
  app.use(express.json());
  app.use('/agents', createAgentRouter(repo));
  return app;
}

describe('GET /agents', () => {
  it('returns 200 with list of agents', async () => {
    const res = await request(makeApp(makeMockRepo())).get('/agents');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([mockAgent]);
  });
});

describe('GET /agents/:id', () => {
  it('returns 200 with agent when found', async () => {
    const res = await request(makeApp(makeMockRepo())).get('/agents/uuid-1');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockAgent);
  });

  it('returns 404 when agent not found', async () => {
    const repo = makeMockRepo({ findById: jest.fn().mockReturnValue(undefined) });
    const res = await request(makeApp(repo)).get('/agents/nope');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Agent not found' });
  });
});

describe('POST /agents', () => {
  const validBody = { name: 'Atlas', email: 'atlas@agentclinic.dev', specialty: 'coding assistant', status: 'active' };

  it('returns 201 with created agent', async () => {
    const res = await request(makeApp(makeMockRepo())).post('/agents').send(validBody);
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Atlas');
    expect(res.body.email).toBe('atlas@agentclinic.dev');
  });

  it('returns 400 when name is missing', async () => {
    const { name: _n, ...rest } = validBody;
    const res = await request(makeApp(makeMockRepo())).post('/agents').send(rest);
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/name/);
  });

  it('returns 400 on invalid email format', async () => {
    const res = await request(makeApp(makeMockRepo())).post('/agents').send({ ...validBody, email: 'bad' });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Invalid email format' });
  });

  it('returns 400 on invalid status value', async () => {
    const res = await request(makeApp(makeMockRepo())).post('/agents').send({ ...validBody, status: 'flying' });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Invalid status value' });
  });

  it('returns 409 on duplicate email', async () => {
    const repo = makeMockRepo({ findByEmail: jest.fn().mockReturnValue(mockAgent) });
    const res = await request(makeApp(repo)).post('/agents').send(validBody);
    expect(res.status).toBe(409);
    expect(res.body).toEqual({ error: 'Email already in use' });
  });
});

describe('PUT /agents/:id', () => {
  it('returns 200 with updated agent', async () => {
    const res = await request(makeApp(makeMockRepo())).put('/agents/uuid-1').send({ name: 'Atlas v2' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockAgent);
  });

  it('returns 404 when agent not found', async () => {
    const repo = makeMockRepo({ findById: jest.fn().mockReturnValue(undefined) });
    const res = await request(makeApp(repo)).put('/agents/nope').send({ name: 'X' });
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Agent not found' });
  });

  it('returns 400 on invalid status', async () => {
    const res = await request(makeApp(makeMockRepo())).put('/agents/uuid-1').send({ status: 'invalid' });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Invalid status value' });
  });
});
