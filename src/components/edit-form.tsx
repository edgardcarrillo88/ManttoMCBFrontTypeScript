'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function EditForm() {
  const [formData, setFormData] = useState({
    IdPpto: '',
    Gerencia: '',
    Planta: '',
    Area: '',
    SubArea: '',
    Categoria: '',
    CeCo: '',
    DescripcionCeCo: '',
    ClaseCosto: '',
    DescripcionClaseCosto: '',
    Responsable: '',
    Especialidad: '',
    TAG: '',
    Partida: '',
    DescripcionPartida: '',
    Mes: null,
    Monto: 0,
    Proveedor: '',
    TxtPedido: '',
    OC: '',
    Posicion: '',
    Fecha: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(formData)
    // Here you would typically send the data to your backend
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black flex flex-col items-center">
      <div className="w-full max-w-4xl p-8 bg-gray-800 rounded-lg shadow-xl mt-10 mb-10">
        <h1 className="text-3xl font-bold text-white mb-6">Edit Form</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(formData).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={key} className="text-white">
                  {key}
                </Label>
                {key === 'DescripcionCeCo' || key === 'DescripcionClaseCosto' || key === 'DescripcionPartida' ? (
                  <Textarea
                    id={key}
                    name={key}
                    value={value as string}
                    onChange={handleChange}
                    className="w-full bg-gray-700 text-white border-gray-600"
                  />
                ) : (
                  <Input
                    type={key === 'Mes' || key === 'Monto' ? 'number' : 'text'}
                    id={key}
                    name={key}
                    value={value as string}
                    onChange={handleChange}
                    className="w-full bg-gray-700 text-white border-gray-600"
                  />
                )}
              </div>
            ))}
          </div>
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            Submit
          </Button>
        </form>
      </div>
    </div>
  )
}