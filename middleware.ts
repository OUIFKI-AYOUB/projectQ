import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";



export default async function middleware(request: Request) {



  const session = await auth();
  const isAdminRoute = request.url.includes('/admin');

  if (isAdminRoute && !session) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}


export const config = {
  matcher: ['/admin/:path*']
}