import { NextResponse } from "next/server";
import db from "@/lib/db/db";
import { v4 as uuidv4 } from 'uuid';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    // Check if user already has an active queue session
    const cookieStore = await cookies();
    const existingSession = cookieStore.get('queue-session');

    if (existingSession) {
      const session = await db.queueSession.findUnique({
        where: { sessionToken: existingSession.value },
      });

      if (session && new Date(session.expires) > new Date()) {
        return NextResponse.json(
          { error: "You already have an active queue number" },
          { status: 400 }
        );
      }
    }

    const body = await req.json();
    const { username } = body;

    // Validate input
    if (!username || typeof username !== 'string') {
      return NextResponse.json(
        { error: "Username is required and must be a string" },
        { status: 400 }
      );
    }

    const sessionToken = uuidv4();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Get the last queue number and increment it
    const lastQueue = await db.queue.findFirst({
      orderBy: { number: 'desc' },
    });
    const nextNumber = (lastQueue?.number || 0) + 1;

    // Create the queue and session in a transaction
    const result = await db.$transaction(async (tx) => {
      const queue = await tx.queue.create({
        data: {
          number: nextNumber,
          username,
          userId: sessionToken,
          status: 'waiting',
          queueSession: {
            create: {
              sessionToken,
              username,
              expires,
            },
          },
        },
      });
      return queue;
    });

    // Set the queue-session cookie
    const response = NextResponse.json(result);
    response.cookies.set({
      name: 'queue-session',
      value: sessionToken,
      expires,
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    return response;
  } catch (error) {
    console.error("Error creating queue:", error);
    return NextResponse.json(
      { error: "Failed to create queue. Please try again later." },
      { status: 500 }
    );
  }
}