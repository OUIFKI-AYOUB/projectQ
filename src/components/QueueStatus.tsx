"use client"

import React, { useEffect, useState } from 'react';
import { Hash } from 'lucide-react';
import { Toaster, toast } from 'sonner'; // Import toast from sonner
import { Card } from '@/components/ui/card';
import { translate } from '../../utils/translations';
import { useLanguage } from '../../context/LanguageContext';

interface QueueStatusProps {
  queueNumber: number;
  username: string | null | undefined;
  currentQueueNumber: number;
}

const QueueStatus = ({
  queueNumber,
  username,
  currentQueueNumber: initialCurrentQueueNumber,
}: QueueStatusProps) => {
  const [currentQueueNumber, setCurrentQueueNumber] = useState(initialCurrentQueueNumber);
  const { locale } = useLanguage();

  useEffect(() => {
    const eventSource = new EventSource('/api/sse');

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setCurrentQueueNumber(data.currentQueueNumber);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  useEffect(() => {
    if (currentQueueNumber === 1 && queueNumber === 1) {
      return; 
    }

    // Show the toast if currentQueueNumber equals queueNumber
    if (queueNumber === currentQueueNumber) {
      toast.success(translate(locale, 'yourTurnMessage'), {
        position: 'top-center',
        duration: 10000,
      });
    }
  }, [currentQueueNumber, queueNumber, locale]);

  return (
    <>
      <Toaster />
      <div className="max-w-2xl mx-auto p-4 space-y-10">
        {/* TV-Style Display */}
        <div className="relative">
          <div className="bg-gray-900 p-8 rounded-3xl shadow-2xl border-8 border-gray-800">
            <div className="bg-black p-8 rounded-2xl">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-green-500 mb-4">
                  {translate(locale, 'nowServing')}
                </h2>
                <div className="text-8xl font-bold text-green-500 tracking-widest animate-pulse">
                  {currentQueueNumber}
                </div>
              </div>
            </div>
          </div>
          {/* TV Stand */}
          <div className="h-6 w-20 bg-gray-800 mx-auto rounded-b-lg" />
        </div>

        {/* Ticket Design */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
          <div className="p-6 pt-8">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <Hash className="h-4 w-4 text-gray-600" />
                <h3 className="text-xl font-semibold text-gray-800">
                  {translate(locale, 'yourQueueTicket')}
                </h3>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">
                  {translate(locale, 'welcome')}
                </p>
                <div className="text-6xl font-black text-gray-800 tracking-tight">
                  {queueNumber}
                </div>
              </div>

              <div className="border-t border-dashed border-gray-300 pt-4">
                <p className="text-sm text-gray-500">
                  {translate(locale, 'keepTicket')}
                </p>
              </div>
            </div>
          </div>
          {/* Ticket Bottom Design */}
          <div className="h-4 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
        </Card>
      </div>
    </>
  );
};

export default QueueStatus;