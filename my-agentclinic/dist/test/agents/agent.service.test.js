"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const agent_service_1 = require("../../agents/agent.service");
const agent_types_1 = require("../../agents/agent.types");
function makeMockRepo(overrides = {}) {
    return Object.assign({ findAll: jest.fn().mockReturnValue([]), findById: jest.fn().mockReturnValue(undefined), findByEmail: jest.fn().mockReturnValue(undefined), create: jest.fn((a) => a), update: jest.fn().mockReturnValue(undefined) }, overrides);
}
const validPayload = { name: 'Atlas', email: 'atlas@agentclinic.dev', specialty: 'coding assistant', status: 'active' };
const seedAgent = {
    id: 'uuid-1',
    name: 'Atlas',
    email: 'atlas@agentclinic.dev',
    specialty: 'coding assistant',
    status: agent_types_1.AgentStatus.Active,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
};
describe('AgentService.createAgent', () => {
    it('throws ValidationError when name is missing', () => {
        const { name: _n } = validPayload, rest = __rest(validPayload, ["name"]);
        expect(() => new agent_service_1.AgentService(makeMockRepo()).createAgent(rest)).toThrow(agent_service_1.ValidationError);
    });
    it('throws ValidationError when email is missing', () => {
        const { email: _e } = validPayload, rest = __rest(validPayload, ["email"]);
        expect(() => new agent_service_1.AgentService(makeMockRepo()).createAgent(rest)).toThrow(agent_service_1.ValidationError);
    });
    it('throws ValidationError when specialty is missing', () => {
        const { specialty: _s } = validPayload, rest = __rest(validPayload, ["specialty"]);
        expect(() => new agent_service_1.AgentService(makeMockRepo()).createAgent(rest)).toThrow(agent_service_1.ValidationError);
    });
    it('throws ValidationError when status is missing', () => {
        const { status: _st } = validPayload, rest = __rest(validPayload, ["status"]);
        expect(() => new agent_service_1.AgentService(makeMockRepo()).createAgent(rest)).toThrow(agent_service_1.ValidationError);
    });
    it('throws ValidationError on invalid email format', () => {
        expect(() => new agent_service_1.AgentService(makeMockRepo()).createAgent(Object.assign(Object.assign({}, validPayload), { email: 'not-an-email' }))).toThrow(agent_service_1.ValidationError);
    });
    it('throws ValidationError on invalid status value', () => {
        expect(() => new agent_service_1.AgentService(makeMockRepo()).createAgent(Object.assign(Object.assign({}, validPayload), { status: 'flying' }))).toThrow(agent_service_1.ValidationError);
    });
    it('throws ConflictError on duplicate email', () => {
        const repo = makeMockRepo({ findByEmail: jest.fn().mockReturnValue(seedAgent) });
        expect(() => new agent_service_1.AgentService(repo).createAgent(validPayload)).toThrow(agent_service_1.ConflictError);
    });
    it('creates and returns agent on valid input', () => {
        const agent = new agent_service_1.AgentService(makeMockRepo()).createAgent(validPayload);
        expect(agent.name).toBe('Atlas');
        expect(agent.email).toBe('atlas@agentclinic.dev');
        expect(agent.id).toBeTruthy();
        expect(agent.createdAt).toBeTruthy();
    });
});
describe('AgentService.getAgent', () => {
    it('throws NotFoundError when agent does not exist', () => {
        expect(() => new agent_service_1.AgentService(makeMockRepo()).getAgent('missing')).toThrow(agent_service_1.NotFoundError);
    });
    it('returns the agent when found', () => {
        const repo = makeMockRepo({ findById: jest.fn().mockReturnValue(seedAgent) });
        expect(new agent_service_1.AgentService(repo).getAgent('uuid-1')).toEqual(seedAgent);
    });
});
describe('AgentService.updateAgent', () => {
    it('throws NotFoundError when agent does not exist', () => {
        expect(() => new agent_service_1.AgentService(makeMockRepo()).updateAgent('missing', { name: 'X' })).toThrow(agent_service_1.NotFoundError);
    });
    it('throws ValidationError on invalid status', () => {
        const repo = makeMockRepo({ findById: jest.fn().mockReturnValue(seedAgent) });
        expect(() => new agent_service_1.AgentService(repo).updateAgent('uuid-1', { status: 'broken' })).toThrow(agent_service_1.ValidationError);
    });
    it('throws ValidationError on invalid email format', () => {
        const repo = makeMockRepo({ findById: jest.fn().mockReturnValue(seedAgent) });
        expect(() => new agent_service_1.AgentService(repo).updateAgent('uuid-1', { email: 'bad' })).toThrow(agent_service_1.ValidationError);
    });
    it('throws ConflictError when email is taken by another agent', () => {
        const other = Object.assign(Object.assign({}, seedAgent), { id: 'uuid-2', email: 'other@agentclinic.dev' });
        const repo = makeMockRepo({
            findById: jest.fn().mockReturnValue(seedAgent),
            findByEmail: jest.fn().mockReturnValue(other),
            update: jest.fn().mockReturnValue(seedAgent),
        });
        expect(() => new agent_service_1.AgentService(repo).updateAgent('uuid-1', { email: 'other@agentclinic.dev' })).toThrow(agent_service_1.ConflictError);
    });
    it('updates successfully with valid fields', () => {
        const updated = Object.assign(Object.assign({}, seedAgent), { name: 'Atlas v2' });
        const repo = makeMockRepo({
            findById: jest.fn().mockReturnValue(seedAgent),
            update: jest.fn().mockReturnValue(updated),
        });
        const result = new agent_service_1.AgentService(repo).updateAgent('uuid-1', { name: 'Atlas v2' });
        expect(result.name).toBe('Atlas v2');
    });
});
