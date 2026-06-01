import express from 'express';
import path from 'path';
import { createAgentRouter } from './agents/agent.router';
import { SqliteAgentRepository } from './agents/agent.repository';
import { AilmentService } from './ailments/ailment.service';
import { SqliteAilmentRepository } from './ailments/ailment.repository';
import { ValidationError, NotFoundError } from './errors';

const app = express();
app.use(express.json());

const agentRepo = new SqliteAgentRepository();
const ailmentRepo = new SqliteAilmentRepository();

// Direct ailment route handlers (must come BEFORE the agents router to take priority)
const ailmentService = new AilmentService(ailmentRepo, agentRepo);

// Test route to verify routing is working
app.get('/test-ailments', (req, res) => {
  res.json({ test: 'working' });
});

// GET /ailments - list all ailments
app.get('/ailments', (req, res) => {
  try {
    res.json(ailmentService.listAllAilments());
  } catch (err) {
    handleError(err, res);
  }
});

// GET /agents/:agentId/ailments - list agent's ailments
app.get('/agents/:agentId/ailments', (req, res) => {
  try {
    const { agentId } = req.params;
    res.json(ailmentService.listAilmentsForAgent(agentId));
  } catch (err) {
    handleError(err, res);
  }
});

// POST /agents/:agentId/ailments - create ailment
app.post('/agents/:agentId/ailments', (req, res) => {
  try {
    const { agentId } = req.params;
    const ailment = ailmentService.createAilment(agentId, req.body as Record<string, string>);
    res.status(201).json(ailment);
  } catch (err) {
    handleError(err, res);
  }
});

// PUT /agents/:agentId/ailments/:ailmentId - update ailment
app.put('/agents/:agentId/ailments/:ailmentId', (req, res) => {
  try {
    const { agentId, ailmentId } = req.params;
    const updated = ailmentService.updateAilment(agentId, ailmentId, req.body as Record<string, string>);
    res.json(updated);
  } catch (err) {
    handleError(err, res);
  }
});

// DELETE /agents/:agentId/ailments/:ailmentId - delete ailment
app.delete('/agents/:agentId/ailments/:ailmentId', (req, res) => {
  try {
    const { agentId, ailmentId } = req.params;
    ailmentService.deleteAilment(agentId, ailmentId);
    res.status(204).send();
  } catch (err) {
    handleError(err, res);
  }
});

// Mount agents router (must come AFTER ailment routes so specific routes match first)
app.use('/agents', createAgentRouter(agentRepo));

// Static files and fallback
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

function handleError(err: unknown, res: express.Response): void {
  if (err instanceof ValidationError) {
    res.status(400).json({ error: err.message });
  } else if (err instanceof NotFoundError) {
    res.status(404).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal server error' });
  }
}

const PORT = process.env['PORT'] ?? 3000;
app.listen(PORT, () => {
  console.log(`AgentClinic running on port ${PORT}`);
});
