"use client"

import { usePackages } from "@/context/package-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Users, DollarSign } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function PackagesPage() {
  const { packages } = usePackages()

  return (
    <main className="min-h-screen py-12">
      <div className="container">
        <h1 className="text-3xl font-bold text-center mb-12 text-green-800">Nuestros Paquetes Turísticos</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <Card key={pkg.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <Image src={pkg.image || "/placeholder.svg"} alt={pkg.name} fill className="object-cover" />
                <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full font-bold">
                  ${pkg.price.toLocaleString()} COP
                </div>
              </div>
              <CardHeader>
                <CardTitle>{pkg.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-green-600" />
                  <span>{pkg.duration} días</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-green-600" />
                  <span>Máximo {pkg.maxPeople} personas</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign size={18} className="text-green-600" />
                  <span>Incluye: {pkg.includes.join(", ")}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                  <Link href={`/paquetes/${pkg.id}`}>Ver detalles</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
