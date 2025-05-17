"use client"

import { usePackages, type TourPackage } from "@/context/package-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  PlusCircle,
  Package,
  Users,
  DollarSign,
  Info,
  Edit,
  Trash2,
  Eye,
  BarChart3,
  TrendingUp,
  Calendar,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import ProtectedRoute from "@/components/protected-route"
import { useState } from "react"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function AdminDashboard() {
  const { packages, deletePackage } = usePackages()
  const [packageToDelete, setPackageToDelete] = useState<number | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDeleteClick = (id: number) => {
    setPackageToDelete(id)
    setShowDeleteDialog(true)
  }

  const confirmDelete = () => {
    if (packageToDelete !== null) {
      deletePackage(packageToDelete)
      setShowDeleteDialog(false)
    }
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-green-800">Panel de Administración</h1>
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link href="/admin/add-package">
                <PlusCircle className="mr-2 h-4 w-4" /> Agregar Paquete
              </Link>
            </Button>
          </div>

          <Tabs defaultValue="packages">
            <TabsList className="mb-8">
              <TabsTrigger value="packages">Paquetes Turísticos</TabsTrigger>
              <TabsTrigger value="table">Vista de Tabla</TabsTrigger>
              <TabsTrigger value="company">Información de la Empresa</TabsTrigger>
              <TabsTrigger value="stats">Estadísticas</TabsTrigger>
            </TabsList>

            <TabsContent value="packages">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.map((pkg) => (
                  <PackageCard key={pkg.id} pkg={pkg} onDeleteClick={() => handleDeleteClick(pkg.id)} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="table">
              <Card>
                <CardHeader>
                  <CardTitle>Lista de Paquetes</CardTitle>
                  <CardDescription>Administra todos los paquetes turísticos desde esta vista de tabla.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Duración</TableHead>
                        <TableHead>Precio</TableHead>
                        <TableHead>Costo</TableHead>
                        <TableHead>Margen</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {packages.map((pkg) => (
                        <TableRow key={pkg.id}>
                          <TableCell>{pkg.id}</TableCell>
                          <TableCell>{pkg.name}</TableCell>
                          <TableCell>{pkg.duration} días</TableCell>
                          <TableCell>${pkg.price.toLocaleString()}</TableCell>
                          <TableCell>${Math.round(pkg.price * 0.65).toLocaleString()}</TableCell>
                          <TableCell>35%</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button asChild size="sm" variant="outline">
                                <Link href={`/paquetes/${pkg.id}`}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button asChild size="sm" variant="outline">
                                <Link href={`/admin/edit-package/${pkg.id}`}>
                                  <Edit className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => handleDeleteClick(pkg.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="company">
              <Card>
                <CardHeader>
                  <CardTitle>Información Privada de la Empresa</CardTitle>
                  <CardDescription>
                    Esta información es confidencial y solo está disponible para administradores.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Datos Financieros</h3>
                    <ul className="space-y-2">
                      <li>Ingresos 2023: $1,250,000,000 COP</li>
                      <li>Margen de beneficio promedio: 38%</li>
                      <li>Costos operativos mensuales: $45,000,000 COP</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Proveedores Principales</h3>
                    <ul className="space-y-2">
                      <li>Hoteles Decameron - Contrato hasta 2025</li>
                      <li>Transportes Nacionales S.A. - Tarifa preferencial</li>
                      <li>Avianca - Convenio corporativo</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Métricas de Clientes</h3>
                    <ul className="space-y-2">
                      <li>Tasa de retención: 65%</li>
                      <li>Satisfacción promedio: 4.7/5</li>
                      <li>Clientes nuevos mensuales: 120</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stats">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="mr-2 h-5 w-5 text-green-600" />
                      Rendimiento de Paquetes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {packages.slice(0, 3).map((pkg) => (
                        <div key={pkg.id} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{pkg.name}</p>
                            <p className="text-sm text-gray-500">Ventas último mes: 12</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-green-600">${(pkg.price * 12 * 0.35).toLocaleString()}</p>
                            <p className="text-sm text-gray-500">Ganancia</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="mr-2 h-5 w-5 text-green-600" />
                      Tendencias de Ventas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <p className="font-medium">Este mes</p>
                        <p className="font-medium text-green-600">$42,500,000</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="font-medium">Mes anterior</p>
                        <p className="font-medium">$38,200,000</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="font-medium">Crecimiento</p>
                        <p className="font-medium text-green-600">+11.3%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="mr-2 h-5 w-5 text-green-600" />
                      Próximas Salidas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Aventura Caribeña</p>
                          <p className="text-sm text-gray-500">15 de junio, 2023</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">8/12</p>
                          <p className="text-sm text-gray-500">Reservas</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Ruta Cafetera</p>
                          <p className="text-sm text-gray-500">22 de junio, 2023</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">5/8</p>
                          <p className="text-sm text-gray-500">Reservas</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="mr-2 h-5 w-5 text-green-600" />
                      Usuarios Activos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <p className="font-medium">Total de usuarios</p>
                        <p className="font-medium">1,245</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="font-medium">Nuevos este mes</p>
                        <p className="font-medium text-green-600">+87</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="font-medium">Tasa de conversión</p>
                        <p className="font-medium">8.3%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción eliminará permanentemente el paquete y no se puede deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </ProtectedRoute>
  )
}

function PackageCard({ pkg, onDeleteClick }: { pkg: TourPackage; onDeleteClick: () => void }) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48">
        <Image src={pkg.image || "/placeholder.svg"} alt={pkg.name} fill className="object-cover" />
      </div>
      <CardHeader>
        <CardTitle>{pkg.name}</CardTitle>
        <CardDescription>{pkg.description.substring(0, 100)}...</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2">
          <Package size={16} className="text-green-600" />
          <span>{pkg.duration} días</span>
        </div>
        <div className="flex items-center gap-2">
          <Users size={16} className="text-green-600" />
          <span>Máximo {pkg.maxPeople} personas</span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign size={16} className="text-green-600" />
          <span>${pkg.price.toLocaleString()} COP</span>
          <span className="text-xs text-orange-600">(Costo: ${Math.round(pkg.price * 0.65).toLocaleString()})</span>
        </div>
        {pkg.privateInfo && (
          <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-md">
            <div className="flex items-start gap-2">
              <Info size={16} className="text-orange-600 mt-0.5" />
              <span className="text-sm text-orange-800">{pkg.privateInfo}</span>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button asChild variant="outline" className="flex-1">
          <Link href={`/paquetes/${pkg.id}`}>
            <Eye className="mr-2 h-4 w-4" /> Ver
          </Link>
        </Button>
        <Button asChild variant="outline" className="flex-1">
          <Link href={`/admin/edit-package/${pkg.id}`}>
            <Edit className="mr-2 h-4 w-4" /> Editar
          </Link>
        </Button>
        <Button variant="destructive" className="flex-1" onClick={onDeleteClick}>
          <Trash2 className="mr-2 h-4 w-4" /> Eliminar
        </Button>
      </CardFooter>
    </Card>
  )
}
