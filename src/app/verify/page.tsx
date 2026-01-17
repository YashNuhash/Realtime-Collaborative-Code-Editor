'use client'

import { useRef, useState, useEffect } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { useRouter } from 'next/navigation'

export default function VerifyPage() {
  const router = useRouter()
  const recaptchaRef = useRef<ReCAPTCHA>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleVerify = async (token: string | null) => {
    if (!token) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      })

      if (response.ok) {
        router.push('/Collaborate')
      } else {
        const data = await response.json()
        setError(data.error || 'Verification failed')
      }
    } catch (error) {
      console.error('Verification failed:', error)
      setError('Network error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isMounted) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="p-8 bg-white rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Verify You're Human</h1>
        <div className="flex justify-center mb-4">
          {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ? (
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
              onChange={handleVerify}
            />
          ) : (
            <p className="text-red-500">ReCAPTCHA site key not configured</p>
          )}
        </div>
        {isLoading && (
          <p className="text-center text-gray-600">Verifying...</p>
        )}
        {error && (
          <p className="text-center text-red-500">{error}</p>
        )}
      </div>
    </div>
  )
}