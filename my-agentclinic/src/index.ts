import express, { Request, Response } from 'express';
import path from 'path';
import { createAgentRouter } from './agents/agent.router';
import { createAilmentRouter } from './ailments/ailment.router';
import { SqliteAgentRepository } from './agents/agent.repository';
import { SqliteAilmentRepository } from './ailments/ailment.repository';
import { AilmentService } from './ailments/ailment.service';

const app = express();
app.use(express.json());

const agentRepo = new SqliteAgentRepository();
const ailmentRepo = new SqliteAilmentRepository();
const ailmentService = new AilmentService(ailmentRepo, agentRepo);

app.get('/ailments', (_req: Request, res: Response) => {
  res.json(ailmentService.listAllAilments());
});

app.use('/agents', createAgentRouter(agentRepo));
app.use('/agents/:agentId/ailments', createAilmentRouter(ailmentRepo, agentRepo));

app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

const PORT = process.env['PORT'] ?? 3000;
app.listen(PORT, () => {
  console.log(`AgentClinic running on port ${PORT}`);
});
