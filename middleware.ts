import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

interface ClerkError extends Error {
  message: string;
}

export default clerkMiddleware(async (auth, request) => {
  try {
    console.log(`[Middleware] Processing request for: ${request.url}`);

    // Check if this is a redirect from Clerk
    if (request.nextUrl.searchParams.has('__clerk_handshake')) {
      console.log('[Middleware] Handling Clerk handshake');
      return NextResponse.next();
    }

    const response = NextResponse.next();
    console.log('[Middleware] Request processed successfully');
    return response;
  } catch (error) {
    console.error('[Middleware] Error:', error);
    // If it's a redirect error, let it proceed
    if ((error as ClerkError)?.message === 'NEXT_REDIRECT') {
      console.log('[Middleware] Handling redirect');
      return NextResponse.next();
    }
    throw error;
  }
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
