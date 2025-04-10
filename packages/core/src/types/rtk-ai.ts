export type AIMessage = {
  id?: string;
  action: string;
  participantName?: string;
  prompt?: string;
  createdAt?: Date;
  response?: string;
  loading?: boolean;
};
