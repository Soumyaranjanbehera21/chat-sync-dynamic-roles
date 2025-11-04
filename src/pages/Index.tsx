import { useState } from 'react';
import { RoleSelector } from '@/components/RoleSelector';
import { ChatInterface } from '@/components/ChatInterface';
import { ClientRole, ChatState, Message } from '@/types/chat';

const Index = () => {
  const [userRole, setUserRole] = useState<ClientRole | null>(null);
  const [username, setUsername] = useState<string>('');
  const [sharedChatState, setSharedChatState] = useState<ChatState>({
    messages: [
      {
        id: '1',
        content: 'Welcome to the Readers-Writers Chat System! Writers can send messages, Readers can view them.',
        author: 'System',
        timestamp: new Date(),
        role: 'reader',
      },
    ],
    activeReaders: 0,
    activeWriters: 0,
    writeLock: false,
  });

  const handleRoleSelect = (role: ClientRole, name: string) => {
    setUserRole(role);
    setUsername(name);
  };

  const handleLeave = () => {
    setUserRole(null);
    setUsername('');
  };

  if (!userRole) {
    return <RoleSelector onRoleSelect={handleRoleSelect} />;
  }

  return <ChatInterface role={userRole} username={username} onLeave={handleLeave} sharedChatState={sharedChatState} setSharedChatState={setSharedChatState} />;
};

export default Index;
