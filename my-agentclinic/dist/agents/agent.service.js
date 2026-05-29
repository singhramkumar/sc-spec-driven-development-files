"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConflictError = exports.NotFoundError = exports.ValidationError = exports.AgentService = void 0;
const crypto_1 = require("crypto");
const agent_types_1 = require("./agent.types");
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_STATUSES = Object.values(agent_types_1.AgentStatus);
class AgentService {
    constructor(repo) {
        this.repo = repo;
    }
    listAgents() {
        return this.repo.findAll();
    }
    getAgent(id) {
        const agent = this.repo.findById(id);
        if (!agent)
            throw new NotFoundError('Agent not found');
        return agent;
    }
    createAgent(data) {
        var _a, _b, _c;
        if (!((_a = data.name) === null || _a === void 0 ? void 0 : _a.trim()))
            throw new ValidationError('name is required');
        if (!((_b = data.email) === null || _b === void 0 ? void 0 : _b.trim()))
            throw new ValidationError('email is required');
        if (!((_c = data.specialty) === null || _c === void 0 ? void 0 : _c.trim()))
            throw new ValidationError('specialty is required');
        if (!data.status)
            throw new ValidationError('status is required');
        if (!EMAIL_REGEX.test(data.email))
            throw new ValidationError('Invalid email format');
        if (!VALID_STATUSES.includes(data.status))
            throw new ValidationError('Invalid status value');
        if (this.repo.findByEmail(data.email))
            throw new ConflictError('Email already in use');
        const now = new Date().toISOString();
        const agent = {
            id: (0, crypto_1.randomUUID)(),
            name: data.name.trim(),
            email: data.email.trim(),
            specialty: data.specialty.trim(),
            status: data.status,
            createdAt: now,
            updatedAt: now,
        };
        return this.repo.create(agent);
    }
    updateAgent(id, data) {
        const existing = this.repo.findById(id);
        if (!existing)
            throw new NotFoundError('Agent not found');
        if (data.name !== undefined && !data.name.trim())
            throw new ValidationError('name is required');
        if (data.specialty !== undefined && !data.specialty.trim())
            throw new ValidationError('specialty is required');
        if (data.email !== undefined) {
            if (!EMAIL_REGEX.test(data.email))
                throw new ValidationError('Invalid email format');
            const conflict = this.repo.findByEmail(data.email);
            if (conflict && conflict.id !== id)
                throw new ConflictError('Email already in use');
        }
        if (data.status !== undefined && !VALID_STATUSES.includes(data.status)) {
            throw new ValidationError('Invalid status value');
        }
        const fields = { updatedAt: new Date().toISOString() };
        if (data.name !== undefined)
            fields.name = data.name.trim();
        if (data.email !== undefined)
            fields.email = data.email.trim();
        if (data.specialty !== undefined)
            fields.specialty = data.specialty.trim();
        if (data.status !== undefined)
            fields.status = data.status;
        return this.repo.update(id, fields);
    }
}
exports.AgentService = AgentService;
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}
exports.ValidationError = ValidationError;
class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NotFoundError';
    }
}
exports.NotFoundError = NotFoundError;
class ConflictError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ConflictError';
    }
}
exports.ConflictError = ConflictError;
