import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (pathname === '/Collaborate') {
    const verificationToken = request.cookies.get('recaptcha-verified')
    
    if (!verificationToken) {
      return NextResponse.redirect(new URL('/verify', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/Collaborate'
}