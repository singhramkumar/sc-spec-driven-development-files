import express from 'express';
import { createAgentRouter } from './agents/agent.router';
import { SqliteAgentRepository } from './agents/agent.repository';

const app = express();
app.use(express.json());

const repo = new SqliteAgentRepository();
app.use('/agents', createAgentRouter(repo));

const PORT = process.env['PORT'] ?? 3000;
app.listen(PORT, () => {
  console.log(`AgentClinic running on port ${PORT}`);
});
