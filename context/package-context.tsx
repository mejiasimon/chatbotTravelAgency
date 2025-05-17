"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface TourPackage {
  id: number
  name: string
  duration: number
  price: number
  maxPeople: number
  includes: string[]
  image: string
  description: string
  locations: string[]
  privateInfo?: string // Only visible to admins
}

// Initial packages data
const INITIAL_PACKAGES: TourPackage[] = [
  {
    id: 1,
    name: "Aventura Caribeña",
    duration: 7,
    price: 2500000,
    maxPeople: 12,
    includes: ["Alojamiento", "Transporte", "Guía"],
    image: "/images/aventura-caribena.jpeg",
    description:
      "Recorre las playas más hermosas del Caribe colombiano, visitando Cartagena, Santa Marta y el Parque Tayrona.",
    locations: ["Cartagena", "Santa Marta", "Parque Tayrona"],
    privateInfo: "Margen de ganancia: 35%. Proveedores: Hotel Caribe Azul, Transportes del Norte.",
  },
  {
    id: 2,
    name: "Ruta Cafetera",
    duration: 5,
    price: 1800000,
    maxPeople: 8,
    includes: ["Alojamiento", "Desayunos", "Tours"],
    image: "/images/ruta-cafetera.webp",
    description: "Explora la región cafetera de Colombia, visitando fincas tradicionales y el Valle del Cocora.",
    locations: ["Salento", "Valle del Cocora", "Armenia"],
    privateInfo: "Margen de ganancia: 40%. Proveedores: Hacienda El Café, Transportes del Eje.",
  },
  {
    id: 3,
    name: "Amazonas Salvaje",
    duration: 6,
    price: 3200000,
    maxPeople: 10,
    includes: ["Vuelos internos", "Alojamiento", "Comidas"],
    image: "/images/amazonas-salvaje.jpeg",
    description: "Adéntrate en la selva amazónica colombiana y descubre su increíble biodiversidad.",
    locations: ["Leticia", "Puerto Nariño", "Reserva Natural Tanimboca"],
    privateInfo: "Margen de ganancia: 30%. Proveedores: Amazonas Expeditions, Aerolínea Regional.",
  },
  {
    id: 4,
    name: "Bogotá Cultural",
    duration: 4,
    price: 1200000,
    maxPeople: 15,
    includes: ["Hotel 4 estrellas", "Desayunos", "City tour"],
    image: "/images/bogota.jpeg",
    description: "Conoce la capital colombiana, sus museos, gastronomía y atractivos culturales.",
    locations: ["La Candelaria", "Monserrate", "Museo del Oro"],
    privateInfo: "Margen de ganancia: 45%. Proveedores: Hotel Capital, Turismo Bogotá.",
  },
]

interface PackageContextType {
  packages: TourPackage[]
  addPackage: (newPackage: Omit<TourPackage, "id">) => void
  updatePackage: (id: number, updatedPackage: Partial<TourPackage>) => void
  deletePackage: (id: number) => void
  getPackageById: (id: number) => TourPackage | undefined
}

const PackageContext = createContext<PackageContextType | undefined>(undefined)

export function PackageProvider({ children }: { children: ReactNode }) {
  const [packages, setPackages] = useState<TourPackage[]>(INITIAL_PACKAGES)

  // Load packages from localStorage on mount
  useEffect(() => {
    const savedPackages = localStorage.getItem("exploraPackages")
    if (savedPackages) {
      setPackages(JSON.parse(savedPackages))
    }
  }, [])

  // Save packages to localStorage when they change
  useEffect(() => {
    localStorage.setItem("exploraPackages", JSON.stringify(packages))
  }, [packages])

  const addPackage = (newPackage: Omit<TourPackage, "id">) => {
    const id = Math.max(0, ...packages.map((p) => p.id)) + 1
    setPackages([...packages, { ...newPackage, id }])
  }

  const updatePackage = (id: number, updatedPackage: Partial<TourPackage>) => {
    setPackages(packages.map((pkg) => (pkg.id === id ? { ...pkg, ...updatedPackage } : pkg)))
  }

  const deletePackage = (id: number) => {
    setPackages(packages.filter((pkg) => pkg.id !== id))
  }

  const getPackageById = (id: number) => {
    return packages.find((pkg) => pkg.id === id)
  }

  return (
    <PackageContext.Provider value={{ packages, addPackage, updatePackage, deletePackage, getPackageById }}>
      {children}
    </PackageContext.Provider>
  )
}

export function usePackages() {
  const context = useContext(PackageContext)
  if (context === undefined) {
    throw new Error("usePackages must be used within a PackageProvider")
  }
  return context
}
