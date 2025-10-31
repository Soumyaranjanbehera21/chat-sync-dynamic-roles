import { useState, useEffect, useRef } from 'react';
import { ClientRole } from '@/types/chat';
import { useChatSync } from '@/hooks/useChatSync';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpen, Edit3, Lock, Unlock, Send, Users } from 'lucide-react';

interface ChatInterfaceProps {
  role: ClientRole;
  username: string;
  onLeave: () => void;
}

export const ChatInterface = ({ role, username, onLeave }: ChatInterfaceProps) => {
  const { chatState, acquireReadLock, releaseReadLock, sendMessage } = useChatSync();
  const [messageInput, setMessageInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (role === 'reader') {
      acquireReadLock();
      return () => releaseReadLock();
    }
  }, [role, acquireReadLock, releaseReadLock]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatState.messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim() && role === 'writer') {
      sendMessage(messageInput.trim(), username, role);
      setMessageInput('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                OS Sync Chat
              </h1>
              <Badge 
                variant={role === 'reader' ? 'secondary' : 'default'}
                className={`${
                  role === 'reader' 
                    ? 'bg-reader/20 text-reader border-reader' 
                    : 'bg-writer/20 text-writer border-writer'
                } gap-2`}
              >
                {role === 'reader' ? <BookOpen className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                {role.toUpperCase()}
              </Badge>
              <span className="text-muted-foreground">@{username}</span>
            </div>
            <Button onClick={onLeave} variant="outline">
              Leave Chat
            </Button>
          </div>
        </div>
      </header>

      {/* Status Bar */}
      <div className="border-b border-border bg-secondary/50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-reader" />
              <span className="text-muted-foreground">Active Readers:</span>
              <span className="font-semibold text-reader">{chatState.activeReaders}</span>
            </div>
            <div className="flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-writer" />
              <span className="text-muted-foreground">Active Writers:</span>
              <span className="font-semibold text-writer">{chatState.activeWriters}</span>
            </div>
            <div className="flex items-center gap-2">
              {chatState.writeLock ? (
                <>
                  <Lock className="w-4 h-4 text-destructive" />
                  <span className="text-destructive font-semibold">WRITE LOCK ACTIVE</span>
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4 text-primary" />
                  <span className="text-primary font-semibold">UNLOCKED</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 container mx-auto px-4 py-6">
        <Card className="h-[calc(100vh-280px)] bg-card border-border">
          <ScrollArea className="h-full p-6">
            <div className="space-y-4">
              {chatState.messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-4 rounded-lg animate-in slide-in-from-bottom-2 ${
                    message.author === 'System'
                      ? 'bg-primary/10 border border-primary/30'
                      : 'bg-secondary border border-border'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Badge 
                      variant="outline" 
                      className={`${
                        message.role === 'reader'
                          ? 'bg-reader/10 text-reader border-reader'
                          : 'bg-writer/10 text-writer border-writer'
                      }`}
                    >
                      {message.author}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-foreground">{message.content}</p>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>
        </Card>
      </div>

      {/* Input Area */}
      {role === 'writer' ? (
        <div className="border-t border-border bg-card">
          <div className="container mx-auto px-4 py-4">
            <form onSubmit={handleSendMessage} className="flex gap-3">
              <Input
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-input border-border text-foreground"
              />
              <Button 
                type="submit" 
                disabled={!messageInput.trim()}
                className="bg-gradient-accent hover:opacity-90 text-accent-foreground"
              >
                <Send className="w-4 h-4 mr-2" />
                Send
              </Button>
            </form>
          </div>
        </div>
      ) : (
        <div className="border-t border-border bg-secondary/50">
          <div className="container mx-auto px-4 py-4">
            <p className="text-center text-muted-foreground">
              <BookOpen className="w-4 h-4 inline mr-2" />
              You are in READ-ONLY mode. Only writers can send messages.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
