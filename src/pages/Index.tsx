import { useState } from 'react';
import { RoleSelector } from '@/components/RoleSelector';
import { ChatInterface } from '@/components/ChatInterface';
import { ClientRole } from '@/types/chat';

const Index = () => {
  const [userRole, setUserRole] = useState<ClientRole | null>(null);
  const [username, setUsername] = useState<string>('');

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

  return <ChatInterface role={userRole} username={username} onLeave={handleLeave} />;
};

export default Index;
