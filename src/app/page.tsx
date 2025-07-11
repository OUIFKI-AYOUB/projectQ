'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"

export default function Home() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

// src/app/page.tsx
useEffect(() => {
  const handleQueue = async () => {
    try {
      // Step 1: Check if the user has an active queue session
      const checkResponse = await fetch("/api/queue/check-session", {
        method: "GET",
        credentials: "include", // Include cookies in the request
      });

      const checkData = await checkResponse.json();

      if (checkResponse.ok && checkData.queueId) {
        // If the user has an active queue session, redirect them to their queue page
        router.push(`/queue/${checkData.queueId}`);
      } else {
        // Step 2: If no active session exists, create a new queue automatically
        const createResponse = await fetch("/api/queue", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: " " }), 
          credentials: "include", // Include cookies in the request
        });

        const createData = await createResponse.json();

        if (createResponse.ok) {
          // Redirect the user to their new queue page
          router.push(`/queue/${createData.id}`);
        } else {
          toast({
            title: "Error",
            description: "Failed to create queue",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check or create queue",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  handleQueue();
}, [router]);
  return (
    <div>

      <div className="container mx-auto py-10">
        <Card className="max-w-md mx-auto">
          <CardHeader>
          </CardHeader>
          <CardContent>
            {loading ? 'Setting up your queue...' : 'Redirecting...'}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}