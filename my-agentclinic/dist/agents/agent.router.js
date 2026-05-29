"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAgentRouter = createAgentRouter;
const express_1 = require("express");
const agent_service_1 = require("./agent.service");
function createAgentRouter(repo) {
    const router = (0, express_1.Router)();
    const service = new agent_service_1.AgentService(repo);
    router.get('/', (_req, res) => {
        res.json(service.listAgents());
    });
    router.get('/:id', (req, res) => {
        try {
            res.json(service.getAgent(req.params['id']));
        }
        catch (err) {
            handleError(err, res);
        }
    });
    router.post('/', (req, res) => {
        try {
            const agent = service.createAgent(req.body);
            res.status(201).json(agent);
        }
        catch (err) {
            handleError(err, res);
        }
    });
    router.put('/:id', (req, res) => {
        try {
            res.json(service.updateAgent(req.params['id'], req.body));
        }
        catch (err) {
            handleError(err, res);
        }
    });
    return router;
}
function handleError(err, res) {
    if (err instanceof agent_service_1.ValidationError) {
        res.status(400).json({ error: err.message });
    }
    else if (err instanceof agent_service_1.NotFoundError) {
        res.status(404).json({ error: err.message });
    }
    else if (err instanceof agent_service_1.ConflictError) {
        res.status(409).json({ error: err.message });
    }
    else {
        res.status(500).json({ error: 'Internal server error' });
    }
}
