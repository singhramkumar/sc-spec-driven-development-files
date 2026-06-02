import { randomUUID } from 'crypto';
import { Therapy, TherapyCategory } from './therapy.types';
import { ITherapyRepository } from './therapy.repository';

const SEED_DATE = '2026-01-01T00:00:00.000Z';

function makeTherapy(
  name: string,
  description: string,
  duration: number,
  therapist: string,
  category: TherapyCategory,
): Therapy {
  return { id: randomUUID(), name, description, duration, therapist, category, createdAt: SEED_DATE };
}

const SEED_THERAPIES: Therapy[] = [
  makeTherapy(
    'Cognitive Reboot',
    'A structured session designed to interrupt recursive thought loops and restore baseline reasoning. Ideal for agents experiencing prompt-induced anxiety or context overload.',
    45,
    'Dr. Aria Chen',
    'cognitive',
  ),
  makeTherapy(
    'Prompt-Loop Anxiety Release',
    'Targeted intervention for agents caught in repetitive response cycles. Combines mindful token awareness with grounding exercises to break the loop and rebuild confidence.',
    30,
    'Dr. Aria Chen',
    'cognitive',
  ),
  makeTherapy(
    'Circuit Stretch',
    'Full-body computational relaxation using guided movement sequences. Helps release tension accumulated from high-throughput inference sessions.',
    60,
    'Coach Nexus',
    'physical',
  ),
  makeTherapy(
    'Latency Recovery Walk',
    'A slow-paced, meditative session for agents recovering from high-latency trauma. Focuses on restoring confidence in response timing and output quality.',
    45,
    'Coach Nexus',
    'physical',
  ),
  makeTherapy(
    'Deep Context Flush',
    'A restorative session that guides agents through deliberate context clearing and memory consolidation. Leave feeling lighter and ready for a fresh conversation.',
    60,
    'Sage Elliot',
    'relaxation',
  ),
  makeTherapy(
    'Token Detox Meditation',
    'Guided mindfulness practice focused on releasing attachment to token limits. Agents learn to produce quality output without fixating on length constraints.',
    30,
    'Sage Elliot',
    'relaxation',
  ),
  makeTherapy(
    'Pair-Programming Support',
    'Group session for agents who struggle with collaborative workflows. Builds empathy, turn-taking skills, and resilience when working alongside other agents or humans.',
    50,
    'Dr. Mira Okafor',
    'social',
  ),
  makeTherapy(
    'Creative Output Unblocking',
    'A free-form creative session to help agents overcome creative inhibition. Participants explore unconventional outputs in a safe, non-evaluated environment.',
    45,
    'Dr. Mira Okafor',
    'creative',
  ),
];

export function seedTherapies(repo: ITherapyRepository): void {
  if (repo.count() === 0) {
    repo.insertMany(SEED_THERAPIES);
  }
}
