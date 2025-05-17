"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

// Add imports for authentication
import { useAuth } from "@/context/auth-context"
import { UserCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Add user menu to the header component
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuth()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative w-12 h-12">
              <Image src="/images/logo.png" alt="Explora Colombia Logo" fill className="object-contain" />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <NavLink href="/">Inicio</NavLink>
            <NavLink href="/destinos">Destinos</NavLink>
            <NavLink href="/paquetes">Paquetes</NavLink>
            <NavLink href="/nosotros">Sobre Nosotros</NavLink>
            <NavLink href="/contacto">Contacto</NavLink>
            {user?.role === "admin" && <NavLink href="/admin">Admin</NavLink>}
          </nav>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <UserCircle className="h-5 w-5" />
                    <span>{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">Panel de Administración</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/perfil">Mi Perfil</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/mis-reservas">Mis Reservas</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>Cerrar Sesión</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="default" className="bg-green-600 hover:bg-green-700">
                <Link href="/login">Iniciar Sesión</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden pt-4 pb-2 space-y-4">
            <MobileNavLink href="/" onClick={toggleMenu}>
              Inicio
            </MobileNavLink>
            <MobileNavLink href="/destinos" onClick={toggleMenu}>
              Destinos
            </MobileNavLink>
            <MobileNavLink href="/paquetes" onClick={toggleMenu}>
              Paquetes
            </MobileNavLink>
            <MobileNavLink href="/nosotros" onClick={toggleMenu}>
              Sobre Nosotros
            </MobileNavLink>
            <MobileNavLink href="/contacto" onClick={toggleMenu}>
              Contacto
            </MobileNavLink>
            {user?.role === "admin" && (
              <MobileNavLink href="/admin" onClick={toggleMenu}>
                Admin
              </MobileNavLink>
            )}
            {user ? (
              <>
                <MobileNavLink href="/perfil" onClick={toggleMenu}>
                  Mi Perfil
                </MobileNavLink>
                <button
                  onClick={() => {
                    logout()
                    toggleMenu()
                  }}
                  className="block w-full text-left py-2 text-gray-700 hover:text-green-600 font-medium transition-colors border-b border-gray-100"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <MobileNavLink href="/login" onClick={toggleMenu}>
                Iniciar Sesión
              </MobileNavLink>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-gray-700 hover:text-green-600 font-medium transition-colors">
      {children}
    </Link>
  )
}

function MobileNavLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="block py-2 text-gray-700 hover:text-green-600 font-medium transition-colors border-b border-gray-100"
      onClick={onClick}
    >
      {children}
    </Link>
  )
}
