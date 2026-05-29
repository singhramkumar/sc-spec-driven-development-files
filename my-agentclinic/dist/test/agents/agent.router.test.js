"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const agent_router_1 = require("../../agents/agent.router");
const agent_types_1 = require("../../agents/agent.types");
const mockAgent = {
    id: 'uuid-1',
    name: 'Atlas',
    email: 'atlas@agentclinic.dev',
    specialty: 'coding assistant',
    status: agent_types_1.AgentStatus.Active,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
};
function makeMockRepo(overrides = {}) {
    return Object.assign({ findAll: jest.fn().mockReturnValue([mockAgent]), findById: jest.fn().mockReturnValue(mockAgent), findByEmail: jest.fn().mockReturnValue(undefined), create: jest.fn((a) => a), update: jest.fn().mockReturnValue(mockAgent) }, overrides);
}
function makeApp(repo) {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use('/agents', (0, agent_router_1.createAgentRouter)(repo));
    return app;
}
describe('GET /agents', () => {
    it('returns 200 with list of agents', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(makeApp(makeMockRepo())).get('/agents');
        expect(res.status).toBe(200);
        expect(res.body).toEqual([mockAgent]);
    }));
});
describe('GET /agents/:id', () => {
    it('returns 200 with agent when found', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(makeApp(makeMockRepo())).get('/agents/uuid-1');
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockAgent);
    }));
    it('returns 404 when agent not found', () => __awaiter(void 0, void 0, void 0, function* () {
        const repo = makeMockRepo({ findById: jest.fn().mockReturnValue(undefined) });
        const res = yield (0, supertest_1.default)(makeApp(repo)).get('/agents/nope');
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ error: 'Agent not found' });
    }));
});
describe('POST /agents', () => {
    const validBody = { name: 'Atlas', email: 'atlas@agentclinic.dev', specialty: 'coding assistant', status: 'active' };
    it('returns 201 with created agent', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(makeApp(makeMockRepo())).post('/agents').send(validBody);
        expect(res.status).toBe(201);
        expect(res.body.name).toBe('Atlas');
        expect(res.body.email).toBe('atlas@agentclinic.dev');
    }));
    it('returns 400 when name is missing', () => __awaiter(void 0, void 0, void 0, function* () {
        const { name: _n } = validBody, rest = __rest(validBody, ["name"]);
        const res = yield (0, supertest_1.default)(makeApp(makeMockRepo())).post('/agents').send(rest);
        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/name/);
    }));
    it('returns 400 on invalid email format', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(makeApp(makeMockRepo())).post('/agents').send(Object.assign(Object.assign({}, validBody), { email: 'bad' }));
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: 'Invalid email format' });
    }));
    it('returns 400 on invalid status value', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(makeApp(makeMockRepo())).post('/agents').send(Object.assign(Object.assign({}, validBody), { status: 'flying' }));
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: 'Invalid status value' });
    }));
    it('returns 409 on duplicate email', () => __awaiter(void 0, void 0, void 0, function* () {
        const repo = makeMockRepo({ findByEmail: jest.fn().mockReturnValue(mockAgent) });
        const res = yield (0, supertest_1.default)(makeApp(repo)).post('/agents').send(validBody);
        expect(res.status).toBe(409);
        expect(res.body).toEqual({ error: 'Email already in use' });
    }));
});
describe('PUT /agents/:id', () => {
    it('returns 200 with updated agent', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(makeApp(makeMockRepo())).put('/agents/uuid-1').send({ name: 'Atlas v2' });
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockAgent);
    }));
    it('returns 404 when agent not found', () => __awaiter(void 0, void 0, void 0, function* () {
        const repo = makeMockRepo({ findById: jest.fn().mockReturnValue(undefined) });
        const res = yield (0, supertest_1.default)(makeApp(repo)).put('/agents/nope').send({ name: 'X' });
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ error: 'Agent not found' });
    }));
    it('returns 400 on invalid status', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(makeApp(makeMockRepo())).put('/agents/uuid-1').send({ status: 'invalid' });
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: 'Invalid status value' });
    }));
});
