export enum AgentStatus {
  Active = 'active',
  Inactive = 'inactive',
  InTherapy = 'in-therapy',
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  status: AgentStatus;
  specialty: string;
  createdAt: string;
  updatedAt: string;
}
