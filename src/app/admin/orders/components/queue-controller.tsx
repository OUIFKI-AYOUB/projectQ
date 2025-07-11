"use client"

import { useState, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Clock, Users } from "lucide-react"
import axios from "axios"
import { toast } from "react-hot-toast"
import { QueueColumn } from "./columns" 
import { useLanguage } from '../../../../../context/LanguageContext'
import { translate } from '../../../../../utils/translations'

export const QueueController = ({ queues }: { queues: QueueColumn[] }) => {
  const { locale } = useLanguage();

    // Initialize with the lowest numbered waiting queue
    const [currentQueue, setCurrentQueue] = useState<QueueColumn | undefined>(
      queues
        .filter(q => q.status === 'waiting')
        .sort((a, b) => a.number - b.number)[0]
    )
  
    const [waitingQueues, setWaitingQueues] = useState(
      queues
        .filter(q => q.status === 'waiting')
        .sort((a, b) => a.number - b.number)
    )
  
    const totalWaiting = waitingQueues.length
    const currentNumber = currentQueue?.number || 0
  
    const handleCallNext = async () => {
      if (currentQueue) {
        try {
          const response = await axios.patch('/api/queues/actions', {
            queueId: currentQueue.id,
            action: 'served'
          });
          
          const nextPatient = response.data;
          
          // Get the next lowest numbered waiting patient
          const nextInLine = waitingQueues
            .filter(q => q.number > currentQueue.number)
            .sort((a, b) => a.number - b.number)[0];
          
          setCurrentQueue(nextInLine);
          setWaitingQueues(prev => prev.filter(q => q.id !== currentQueue.id));
          
          if (nextInLine) {
            toast.success(`${translate(locale, "nowServing")} ${nextInLine.username}`);
          } else {
            toast.success(translate(locale, "allPersonsServed"));
            setCurrentQueue(undefined);
          }
          
          window.location.reload();
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
                {currentQueue?.username ||  translate(locale, "noOne")}
              </span>
            </div>
            <div className={`flex items-center ${locale === "ar" ? "space-x-reverse" : ""} space-x-2 mt-1`}>
            <Clock className="h-5 w-5 text-green-500" />
              <span className="text-lg">     {translate(locale, "queueNumber")} #{currentNumber}
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
            <p className="text-2xl font-bold text-purple-600">
                {queues.filter(q => q.status === 'served').length}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
