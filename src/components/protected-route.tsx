'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LockIcon } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  password: string
}

export function ProtectedRouteComponent({ children, password }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [inputPassword, setInputPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputPassword === password) {
      setIsAuthenticated(true)
      setError('')
    } else {
      setError('Incorrect password. Please try again.')
    }
  }

  if (isAuthenticated) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black flex flex-col items-center justify-center">
      <Card className="w-full max-w-md bg-gray-800 text-white border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center">
            <LockIcon className="mr-2" /> Protected Route
          </CardTitle>
          <CardDescription className="text-gray-400 text-center">
            Please enter the password to access this page
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <Input
              type="password"
              placeholder="Enter password"
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            />
            {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              Unlock
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}