"use client";
import React, { createContext, useContext, useState, useCallback } from 'react';

export interface QueueItem {
  id: number;
  number: number;
  userId: string;
  status: string;
  username: string | null;
  createdAt: string;
}

interface QueueContextType {
  queues: QueueItem[];
  setQueues: React.Dispatch<React.SetStateAction<QueueItem[]>>;
  updateQueue: (id: number, updates: Partial<QueueItem>) => void;
  addQueue: (queue: QueueItem) => void;
  removeQueue: (id: number) => void;
  clearAllQueues: () => void;
  refreshQueues: () => Promise<void>;
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

export const QueueProvider: React.FC<{ children: React.ReactNode; initialQueues: QueueItem[] }> = ({ 
  children, 
  initialQueues 
}) => {
  const [queues, setQueues] = useState<QueueItem[]>(initialQueues);

  const updateQueue = useCallback((id: number, updates: Partial<QueueItem>) => {
    setQueues(prev => prev.map(queue => 
      queue.id === id ? { ...queue, ...updates } : queue
    ));
  }, []);

  const addQueue = useCallback((queue: QueueItem) => {
    setQueues(prev => [queue, ...prev]);
  }, []);

  const removeQueue = useCallback((id: number) => {
    setQueues(prev => prev.filter(queue => queue.id !== id));
  }, []);

  const clearAllQueues = useCallback(() => {
    setQueues([]);
  }, []);

  const refreshQueues = useCallback(async () => {
    try {
      const response = await fetch('/api/queues');
      const data = await response.json();
      setQueues(data);
    } catch (error) {
      console.error('Failed to refresh queues:', error);
    }
  }, []);

  return (
    <QueueContext.Provider value={{
      queues,
      setQueues,
      updateQueue,
      addQueue,
      removeQueue,
      clearAllQueues,
      refreshQueues
    }}>
      {children}
    </QueueContext.Provider>
  );
};

export const useQueue = () => {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error('useQueue must be used within a QueueProvider');
  }
  return context;
};
