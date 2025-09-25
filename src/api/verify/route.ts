import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const { token } = await request.json()

    const verificationURL = 'https://www.google.com/recaptcha/api/siteverify'
    const secretKey = process.env.RECAPTCHA_SECRET_KEY

    const verificationResponse = await fetch(verificationURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: secretKey || '',
        response: token,
      }).toString(),
    })

    const data = await verificationResponse.json()

    if (data.success) {
      const cookieStore = await cookies()
      cookieStore.set('recaptcha-verified', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 3600
      })

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: false }, { status: 400 })
  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}