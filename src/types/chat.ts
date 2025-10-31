export type ClientRole = 'reader' | 'writer';

export interface Message {
  id: string;
  content: string;
  author: string;
  timestamp: Date;
  role: ClientRole;
}

export interface ChatState {
  messages: Message[];
  activeReaders: number;
  activeWriters: number;
  writeLock: boolean;
}
