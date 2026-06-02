export type TherapyCategory = 'cognitive' | 'physical' | 'relaxation' | 'social' | 'creative';

export interface Therapy {
  id: string;
  name: string;
  description: string;
  duration: number;
  therapist: string;
  category: TherapyCategory;
  createdAt: string;
}
