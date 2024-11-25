export interface MessageT {
  id: number;
  userInput: string;
  botReply: string;
  createdAt: string;
}

export interface ChatDataT {
  messages: MessageT[];
}
