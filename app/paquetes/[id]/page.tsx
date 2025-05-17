"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { usePackages, type TourPackage } from "@/context/package-context"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Users, DollarSign, MapPin, CheckCircle, ArrowLeft, Edit, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function PackageDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { getPackageById, deletePackage } = usePackages()
  const { user } = useAuth()
  const [packageData, setPackageData] = useState<TourPackage | null>(null)
  const [loading, setLoading] = useState(true)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    if (params.id) {
      const id = Number.parseInt(params.id as string)
      const data = getPackageById(id)
      setPackageData(data || null)
      setLoading(false)
    }
  }, [params.id, getPackageById])

  const handleDelete = () => {
    if (packageData) {
      deletePackage(packageData.id)
      router.push("/admin")
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>
  }

  if (!packageData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Paquete no encontrado</h1>
        <Button asChild>
          <Link href="/">Volver al inicio</Link>
        </Button>
      </div>
    )
  }

  const isAdmin = user?.role === "admin"

  return (
    <main className="min-h-screen py-12">
      <div className="container">
        <div className="flex justify-between items-center mb-6">
          <Button asChild variant="ghost">
            <Link href={isAdmin ? "/admin" : "/"}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Volver
            </Link>
          </Button>

          {isAdmin && (
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link href={`/admin/edit-package/${packageData.id}`}>
                  <Edit className="mr-2 h-4 w-4" /> Editar
                </Link>
              </Button>
              <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
                <Trash2 className="mr-2 h-4 w-4" /> Eliminar
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Package Image */}
          <div className="lg:col-span-2">
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <Image
                src={packageData.image || "/placeholder.svg"}
                alt={packageData.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Package Info */}
          <div>
            <Card>
              <CardContent className="pt-6">
                <h1 className="text-3xl font-bold text-green-800 mb-4">{packageData.name}</h1>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar size={20} className="text-green-600" />
                    <span>{packageData.duration} días</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={20} className="text-green-600" />
                    <span>Máximo {packageData.maxPeople} personas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign size={20} className="text-green-600" />
                    <span className="font-bold text-xl">${packageData.price.toLocaleString()} COP</span>
                    {isAdmin && (
                      <span className="text-sm text-orange-600 ml-2">
                        (Costo: ${Math.round(packageData.price * 0.65).toLocaleString()} COP)
                      </span>
                    )}
                  </div>
                </div>

                {!isAdmin && (
                  <>
                    <Button className="w-full bg-orange-500 hover:bg-orange-600 mb-4">Reservar Ahora</Button>
                    <Button variant="outline" className="w-full">
                      Consultar Disponibilidad
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Admin Private Info */}
            {isAdmin && packageData.privateInfo && (
              <Card className="mt-4 border-orange-200 bg-orange-50">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-bold text-orange-800 mb-2">Información Privada</h3>
                  <p className="text-orange-700">{packageData.privateInfo}</p>

                  <div className="mt-4 pt-4 border-t border-orange-200">
                    <h4 className="font-semibold text-orange-800 mb-2">Detalles Financieros</h4>
                    <ul className="space-y-2 text-sm text-orange-700">
                      <li>Precio de venta: ${packageData.price.toLocaleString()} COP</li>
                      <li>Costo aproximado: ${Math.round(packageData.price * 0.65).toLocaleString()} COP</li>
                      <li>Margen de ganancia: 35%</li>
                      <li>Ganancia por paquete: ${Math.round(packageData.price * 0.35).toLocaleString()} COP</li>
                    </ul>
                  </div>

                  <div className="mt-4 pt-4 border-t border-orange-200">
                    <h4 className="font-semibold text-orange-800 mb-2">Estadísticas</h4>
                    <ul className="space-y-2 text-sm text-orange-700">
                      <li>Ventas último mes: 12 paquetes</li>
                      <li>Valoración promedio: 4.8/5</li>
                      <li>Disponibilidad: Alta</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Package Description */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-green-800 mb-4">Descripción</h2>
          <p className="text-gray-700">{packageData.description}</p>
        </div>

        {/* Package Includes */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-green-800 mb-4">¿Qué incluye?</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {packageData.includes.map((item, index) => (
              <li key={index} className="flex items-center gap-2">
                <CheckCircle size={18} className="text-green-600" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Package Locations */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-green-800 mb-4">Destinos</h2>
          <div className="flex flex-wrap gap-2">
            {packageData.locations.map((location, index) => (
              <div key={index} className="flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full">
                <MapPin size={16} />
                <span>{location}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente el paquete "{packageData.name}" y no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}
