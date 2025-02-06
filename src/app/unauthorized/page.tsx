'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { LockIcon } from 'lucide-react'

export default function page() {
  const router = useRouter()

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push('/api/auth/signin') // Redirigir a login después de unos segundos
    }, 5000)

    return () => clearTimeout(timeout) // Limpiar el timeout si el usuario navega antes
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black flex flex-col items-center justify-center">
      <Card className="w-full max-w-md bg-gray-800 text-white border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center">
            <LockIcon className="mr-2" /> Access Denied
          </CardTitle>
          <CardDescription className="text-gray-400 text-center">
            You do not have permission to access this page. Redirecting to login...
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
