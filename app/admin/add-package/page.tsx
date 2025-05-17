"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { usePackages } from "@/context/package-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, ArrowLeft } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import ProtectedRoute from "@/components/protected-route"

export default function AddPackagePage() {
  const { addPackage } = usePackages()
  const router = useRouter()
  const [error, setError] = useState("")
  const [formLoading, setFormLoading] = useState(false)

  // Form state
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [duration, setDuration] = useState(1)
  const [price, setPrice] = useState(0)
  const [maxPeople, setMaxPeople] = useState(1)
  const [includes, setIncludes] = useState("")
  const [locations, setLocations] = useState("")
  const [image, setImage] = useState("/images/aventura-caribena.jpeg") // Default image
  const [privateInfo, setPrivateInfo] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setFormLoading(true)

    try {
      // Validate form
      if (!name || !description || duration < 1 || price < 1 || maxPeople < 1 || !includes || !locations) {
        setError("Por favor completa todos los campos requeridos.")
        setFormLoading(false)
        return
      }

      // Add package
      addPackage({
        name,
        description,
        duration,
        price,
        maxPeople,
        includes: includes.split(",").map((item) => item.trim()),
        locations: locations.split(",").map((location) => location.trim()),
        image,
        privateInfo: privateInfo || undefined,
      })

      // Redirect to admin dashboard
      router.push("/admin")
    } catch (err) {
      setError("Ocurrió un error al agregar el paquete. Por favor intenta de nuevo.")
    } finally {
      setFormLoading(false)
    }
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container max-w-3xl">
          <div className="mb-6">
            <Button asChild variant="ghost" className="mb-4">
              <Link href="/admin">
                <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Panel
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-green-800">Agregar Nuevo Paquete</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Información del Paquete</CardTitle>
              <CardDescription>
                Completa el formulario para agregar un nuevo paquete turístico a la plataforma.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre del Paquete *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Aventura en la Costa Caribe"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción *</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe el paquete turístico..."
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duración (días) *</Label>
                    <Input
                      id="duration"
                      type="number"
                      min={1}
                      value={duration}
                      onChange={(e) => setDuration(Number.parseInt(e.target.value))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Precio (COP) *</Label>
                    <Input
                      id="price"
                      type="number"
                      min={0}
                      value={price}
                      onChange={(e) => setPrice(Number.parseInt(e.target.value))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxPeople">Máximo de Personas *</Label>
                    <Input
                      id="maxPeople"
                      type="number"
                      min={1}
                      value={maxPeople}
                      onChange={(e) => setMaxPeople(Number.parseInt(e.target.value))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="includes">Incluye (separado por comas) *</Label>
                  <Input
                    id="includes"
                    value={includes}
                    onChange={(e) => setIncludes(e.target.value)}
                    placeholder="Ej. Alojamiento, Transporte, Guía"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="locations">Ubicaciones (separado por comas) *</Label>
                  <Input
                    id="locations"
                    value={locations}
                    onChange={(e) => setLocations(e.target.value)}
                    placeholder="Ej. Cartagena, Santa Marta, Parque Tayrona"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">URL de la Imagen *</Label>
                  <Input
                    id="image"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="/images/nombre-imagen.jpg"
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Para este demo, usa una de las imágenes existentes: /images/aventura-caribena.jpeg,
                    /images/ruta-cafetera.webp, /images/amazonas-salvaje.jpeg, /images/bogota.jpeg
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="privateInfo">Información Privada (solo para administradores)</Label>
                  <Textarea
                    id="privateInfo"
                    value={privateInfo}
                    onChange={(e) => setPrivateInfo(e.target.value)}
                    placeholder="Ej. Margen de ganancia: 35%. Proveedores: Hotel X, Transporte Y."
                    rows={3}
                  />
                </div>

                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={formLoading}>
                  {formLoading ? "Agregando paquete..." : "Agregar Paquete"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </ProtectedRoute>
  )
}
