export enum AilmentSeverity {
  Mild = 'mild',
  Moderate = 'moderate',
  Severe = 'severe',
}

export enum AilmentStatus {
  Active = 'active',
  Resolved = 'resolved',
}

export interface Ailment {
  id: string;
  agentId: string;
  name: string;
  description: string;
  severity: AilmentSeverity;
  status: AilmentStatus;
  createdAt: string;
  updatedAt: string;
}
