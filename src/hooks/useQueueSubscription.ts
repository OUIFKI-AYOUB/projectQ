import { useEffect } from 'react'
import { toast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'

export function useQueueSubscription(onQueueUpdate: () => void) {
  useEffect(() => {
    const subscription = supabase
      .channel('queue_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'Queue'
        },
        (payload) => {
          onQueueUpdate()
          
          if (payload.eventType === 'INSERT') {
            toast({
              title: 'New Queue Added',
              description: `Queue #${payload.new.number} has joined`
            })
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [onQueueUpdate])
}
