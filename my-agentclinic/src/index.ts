import express from 'express';
import path from 'path';
import { createAgentRouter } from './agents/agent.router';
import { SqliteAgentRepository } from './agents/agent.repository';

const app = express();
app.use(express.json());

const repo = new SqliteAgentRepository();
app.use('/agents', createAgentRouter(repo));

app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

const PORT = process.env['PORT'] ?? 3000;
app.listen(PORT, () => {
  console.log(`AgentClinic running on port ${PORT}`);
});
