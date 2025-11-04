import { useCallback, useRef } from 'react';
import { Message, ClientRole, ChatState } from '@/types/chat';
import { toast } from '@/hooks/use-toast';

export const useChatSync = (
  chatState: ChatState,
  setChatState: React.Dispatch<React.SetStateAction<ChatState>>
) => {

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
  }, [setChatState]);

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
  }, [setChatState]);

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
  }, [setChatState]);

  const releaseWriteLock = useCallback(() => {
    lockRef.current = false;
    
    setChatState(prev => ({
      ...prev,
      activeWriters: 0,
      writeLock: false,
    }));
  }, [setChatState]);

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
  }, [acquireWriteLock, releaseWriteLock, setChatState]);

  return {
    chatState,
    acquireReadLock,
    releaseReadLock,
    sendMessage,
  };
};
