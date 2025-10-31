import { useState } from 'react';
import { ClientRole } from '@/types/chat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { BookOpen, Edit3 } from 'lucide-react';

interface RoleSelectorProps {
  onRoleSelect: (role: ClientRole, username: string) => void;
}

export const RoleSelector = ({ onRoleSelect }: RoleSelectorProps) => {
  const [username, setUsername] = useState('');
  const [selectedRole, setSelectedRole] = useState<ClientRole | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && selectedRole) {
      onRoleSelect(selectedRole, username.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-2xl p-8 bg-card border-border shadow-glow">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-primary bg-clip-text text-transparent">
            Readers-Writers Synchronization
          </h1>
          <p className="text-muted-foreground text-lg">
            Operating Systems Concurrent Access Control Demo
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-foreground">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-input border-border text-foreground"
              required
            />
          </div>

          <div className="space-y-3">
            <Label className="text-foreground">Select Your Role</Label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setSelectedRole('reader')}
                className={`p-6 rounded-lg border-2 transition-all ${
                  selectedRole === 'reader'
                    ? 'border-reader bg-reader/10 shadow-glow'
                    : 'border-border bg-secondary hover:border-reader/50'
                }`}
              >
                <BookOpen className="w-8 h-8 mx-auto mb-3 text-reader" />
                <h3 className="font-semibold text-foreground mb-2">Reader</h3>
                <p className="text-sm text-muted-foreground">
                  View messages only. Multiple readers can access simultaneously.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('writer')}
                className={`p-6 rounded-lg border-2 transition-all ${
                  selectedRole === 'writer'
                    ? 'border-writer bg-writer/10 shadow-glow'
                    : 'border-border bg-secondary hover:border-writer/50'
                }`}
              >
                <Edit3 className="w-8 h-8 mx-auto mb-3 text-writer" />
                <h3 className="font-semibold text-foreground mb-2">Writer</h3>
                <p className="text-sm text-muted-foreground">
                  Send messages. Exclusive access when writing.
                </p>
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={!username.trim() || !selectedRole}
            className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold py-6 text-lg"
          >
            Join Chat
          </Button>
        </form>

        <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
          <h4 className="font-semibold text-foreground mb-2">Synchronization Details:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Multiple readers can access data concurrently</li>
            <li>• Writers have exclusive access during write operations</li>
            <li>• Implements mutual exclusion to prevent race conditions</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};
