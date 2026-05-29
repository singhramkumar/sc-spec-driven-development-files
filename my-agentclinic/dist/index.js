"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const agent_router_1 = require("./agents/agent.router");
const agent_repository_1 = require("./agents/agent.repository");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const repo = new agent_repository_1.SqliteAgentRepository();
app.use('/agents', (0, agent_router_1.createAgentRouter)(repo));
const PORT = (_a = process.env['PORT']) !== null && _a !== void 0 ? _a : 3000;
app.listen(PORT, () => {
    console.log(`AgentClinic running on port ${PORT}`);
});
