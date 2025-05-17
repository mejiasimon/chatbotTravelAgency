"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, DollarSign, Users } from "lucide-react"
import ExploraBot from "@/components/explora-bot"
import { usePackages } from "@/context/package-context"

export default function Home() {
  const { packages } = usePackages()

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/cartagena-banner.jpeg"
            alt="Coloridas calles coloniales de Cartagena, Colombia"
            fill
            className="object-cover brightness-[0.7]"
            priority
          />
        </div>
        <div className="container relative z-10 text-white">
          <div className="max-w-2xl space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-white text-green-800 px-3 py-1 text-xs">Turismo Oficial</Badge>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold">Tu próxima aventura comienza aquí</h1>
            <p className="text-xl md:text-2xl">Descubre los tesoros escondidos de Colombia con Explora Colombia</p>
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
              Chatea con tu guía virtual
            </Button>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12 text-green-800">Destinos Populares en Colombia</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((destination) => (
              <Card key={destination.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-64">
                  <Image
                    src={destination.image || "/placeholder.svg"}
                    alt={destination.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl">{destination.name}</CardTitle>
                    <Badge className="bg-orange-500">{destination.region}</Badge>
                  </div>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin size={16} /> {destination.location}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{destination.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tour Packages */}
      <section className="py-16 bg-green-50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12 text-green-800">Paquetes Turísticos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.slice(0, 4).map((pkg) => (
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
                  <Button className="w-full bg-green-600 hover:bg-green-700">Ver detalles</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Chatbot */}
      <ExploraBot />
    </main>
  )
}

const destinations = [
  {
    id: 1,
    name: "Cartagena",
    region: "Costa Caribe",
    location: "Bolívar",
    image: "/images/cartagena.webp",
    description: "Ciudad amurallada con arquitectura colonial, playas cristalinas y una vibrante vida nocturna.",
  },
  {
    id: 2,
    name: "Medellín",
    region: "Antioquia",
    location: "Valle de Aburrá",
    image: "/images/medellin.webp",
    description:
      "La ciudad de la eterna primavera, conocida por su clima agradable, innovación urbana y amabilidad de su gente.",
  },
  {
    id: 3,
    name: "Valle del Cocora",
    region: "Eje Cafetero",
    location: "Quindío",
    image: "/images/valle-cocora.jpeg",
    description: "Hogar de las majestuosas palmas de cera, el árbol nacional de Colombia, en un paisaje de ensueño.",
  },
]
