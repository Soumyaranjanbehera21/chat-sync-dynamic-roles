import { useState, useCallback, useRef } from 'react';
import { Message, ClientRole, ChatState } from '@/types/chat';
import { toast } from '@/hooks/use-toast';

export const useChatSync = () => {
  const [chatState, setChatState] = useState<ChatState>({
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

  const lockRef = useRef<boolean>(false);
  const readersRef = useRef<number>(0);

  const acquireReadLock = useCallback(() => {
    // First reader locks the resource for readers
    if (readersRef.current === 0) {
      while (lockRef.current) {
        // Wait for write lock to be released (simulated)
      }
      lockRef.current = true;
    }
    readersRef.current++;
    
    setChatState(prev => ({
      ...prev,
      activeReaders: readersRef.current,
      writeLock: lockRef.current,
    }));

    toast({
      title: "Reader Access Granted",
      description: `Active readers: ${readersRef.current}`,
    });
  }, []);

  const releaseReadLock = useCallback(() => {
    readersRef.current--;
    
    // Last reader releases the lock
    if (readersRef.current === 0) {
      lockRef.current = false;
    }
    
    setChatState(prev => ({
      ...prev,
      activeReaders: readersRef.current,
      writeLock: lockRef.current,
    }));
  }, []);

  const acquireWriteLock = useCallback(() => {
    while (lockRef.current) {
      // Wait for lock to be available (simulated)
    }
    lockRef.current = true;
    
    setChatState(prev => ({
      ...prev,
      activeWriters: 1,
      writeLock: true,
    }));

    toast({
      title: "Writer Access Granted",
      description: "Exclusive write access acquired",
    });
  }, []);

  const releaseWriteLock = useCallback(() => {
    lockRef.current = false;
    
    setChatState(prev => ({
      ...prev,
      activeWriters: 0,
      writeLock: false,
    }));
  }, []);

  const sendMessage = useCallback((content: string, author: string, role: ClientRole) => {
    acquireWriteLock();
    
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      author,
      timestamp: new Date(),
      role,
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage],
    }));

    // Simulate write operation delay
    setTimeout(() => {
      releaseWriteLock();
      toast({
        title: "Message Sent",
        description: "Write lock released",
      });
    }, 500);
  }, [acquireWriteLock, releaseWriteLock]);

  return {
    chatState,
    acquireReadLock,
    releaseReadLock,
    sendMessage,
  };
};
