
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Database } from 'lucide-react';

const DatabaseNotice: React.FC = () => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    // Check if we've shown this notice before
    const hasShownNotice = localStorage.getItem('db_notice_shown');
    
    if (!hasShownNotice) {
      // Wait a few seconds before showing
      const timer = setTimeout(() => {
        setVisible(true);
        localStorage.setItem('db_notice_shown', 'true');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  const handleDismiss = () => {
    setVisible(false);
  };
  
  if (!visible) return null;
  
  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-in">
      <Card className="p-4 border-primary/20 glass">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Database Connected</h3>
          </div>
          <Button variant="ghost" size="icon" onClick={handleDismiss} className="h-6 w-6">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm mb-3 text-muted-foreground">
          This application is now connected to Supabase. User accounts, quiz data, and all other 
          information will be stored securely in the database.
        </p>
        <div className="flex justify-end">
          <Button 
            variant="link" 
            className="text-xs p-0 h-auto" 
            onClick={() => {
              window.open('https://supabase.com/dashboard/project/ljoieocugpdzhvdxkrcc', '_blank');
              handleDismiss();
            }}
          >
            View Dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default DatabaseNotice;
