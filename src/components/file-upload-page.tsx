"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Home, Clipboard, Users, Settings, Upload, File, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface UploadedFile {
  name: string;
  size: number;
  type: string;
}

export function FileUploadPageComponent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Equipment', href: '/equipment', icon: Clipboard },
    { name: 'Tasks', href: '/tasks', icon: Clipboard },
    { name: 'Team', href: '/team', icon: Users },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newFiles = Array.from(files).map(file => ({
        name: file.name,
        size: file.size,
        type: file.type
      }))
      setUploadedFiles([...uploadedFiles, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    const newFiles = [...uploadedFiles]
    newFiles.splice(index, 1)
    setUploadedFiles(newFiles)
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black flex flex-col">
      {/* Navbar */}
      <nav className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0">
                <span className="text-xl font-bold">MineMain</span>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition duration-150 ease-in-out"
                  >
                    <item.icon className="inline-block w-5 h-5 mr-2" />
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700 transition duration-150 ease-in-out"
                >
                  <item.icon className="inline-block w-5 h-5 mr-2" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Main content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-6">File Upload</h1>
          
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-center w-full">
              <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-10 h-10 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-gray-400">PDF, DOC, XLS, CSV (MAX. 10MB)</p>
                </div>
                <Input id="dropzone-file" type="file" className="hidden" onChange={handleFileUpload} multiple />
              </label>
            </div>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-white mb-4">Uploaded Files</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File Name</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {uploadedFiles.map((file, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{file.name}</TableCell>
                      <TableCell>{(file.size / 1024).toFixed(2)} KB</TableCell>
                      <TableCell>{file.type}</TableCell>
                      <TableCell>
                        <Button variant="destructive" size="sm" onClick={() => removeFile(index)}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="mt-6">
                <File className="w-4 h-4 mr-2" />
                View File Details
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>File Details</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <p>Total files: {uploadedFiles.length}</p>
                <p>Total size: {uploadedFiles.reduce((acc, file) => acc + file.size, 0) / 1024} KB</p>
                <ul className="list-disc pl-5">
                  {uploadedFiles.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p>&copy; 2023 MineMain. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition duration-150 ease-in-out">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition duration-150 ease-in-out">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition duration-150 ease-in-out">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}