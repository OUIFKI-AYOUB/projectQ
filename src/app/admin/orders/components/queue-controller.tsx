"use client"
import { useState, useEffect, useMemo } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Clock, Users } from "lucide-react"
import axios from "axios"
import { toast } from "react-hot-toast"
import { useLanguage } from '../../../../../context/LanguageContext'
import { translate } from '../../../../../utils/translations'
import { useQueue } from '@/app/QueueContext'

export const QueueController = () => {
  const { locale } = useLanguage();
  const { queues, updateQueue } = useQueue();

  // Memoized calculations to avoid unnecessary re-renders
  const waitingQueues = useMemo(() => 
    queues
      .filter(q => q.status === 'waiting')
      .sort((a, b) => a.number - b.number),
    [queues]
  );

  const currentQueue = useMemo(() => waitingQueues[0], [waitingQueues]);
  
  const totalWaiting = waitingQueues.length;
  const currentNumber = currentQueue?.number || 0;
  const totalServed = useMemo(() => 
    queues.filter(q => q.status === 'served').length,
    [queues]
  );

  const handleCallNext = async () => {
    if (currentQueue) {
      try {
        await axios.patch('/api/queues/actions', {
          queueId: currentQueue.id,
          action: 'served'
        });
        
        // Update local state instead of reloading
        updateQueue(currentQueue.id, { ...currentQueue, status: 'served' });
        
        // Get the next patient after updating
        const nextInLine = waitingQueues[1]; // Since current will be removed from waiting
        
        if (nextInLine) {
          toast.success(`${translate(locale, "nowServing")} ${nextInLine.username}`);
        } else {
          toast.success(translate(locale, "allPersonsServed"));
        }
      } catch (error) {
        toast.error(translate(locale, "failedToCallNext"));
      }
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{translate(locale, "nowServing")}</h2>
            <div className={`flex items-center ${locale === "ar" ? "space-x-reverse" : ""} space-x-2 mt-2`}>
              <User className="h-5 w-5 text-blue-500" />
              <span className="text-lg font-semibold">
                {currentQueue?.username || translate(locale, "noOne")}
              </span>
            </div>
            <div className={`flex items-center ${locale === "ar" ? "space-x-reverse" : ""} space-x-2 mt-1`}>
              <Clock className="h-5 w-5 text-green-500" />
              <span className="text-lg">
                {translate(locale, "queueNumber")} #{currentNumber}
              </span>
            </div>
          </div>
          <Button
            onClick={handleCallNext}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg text-sm sm:px-4 sm:py-2"
            disabled={!currentQueue}
          >
            {translate(locale, "callNextOne")}
          </Button>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 bg-green-50">
          <div className={`flex items-center ${locale === "ar" ? "space-x-reverse" : ""} space-x-2`}>
            <Users className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">{translate(locale, "waiting")}</p>
              <p className="text-2xl font-bold text-green-600">{totalWaiting}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-blue-50">
          <div className={`flex items-center ${locale === "ar" ? "space-x-reverse" : ""} space-x-2`}>
            <Clock className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">{translate(locale, "currentNumber")}</p>
              <p className="text-2xl font-bold text-blue-600">#{currentNumber}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-purple-50">
          <div className={`flex items-center ${locale === "ar" ? "space-x-reverse" : ""} space-x-2`}>
            <User className="h-8 w-8 text-purple-600 " />
            <div>
              <p className="text-sm text-gray-600">{translate(locale, "totalServed")}</p>
              <p className="text-2xl font-bold text-purple-600">{totalServed}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
