import type React from "react"
import Link from "next/link"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="bg-green-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-12 h-12 bg-white rounded-full">
                <Image src="/images/logo.png" alt="Explora Colombia Logo" fill className="object-contain" />
              </div>
              <h3 className="text-xl font-bold">Explora Colombia</h3>
            </div>
            <p className="mb-4">
              Tu agencia de viajes especializada en turismo por Colombia. Descubre con nosotros los tesoros escondidos
              de este hermoso país.
            </p>
            <div className="flex space-x-4">
              <SocialLink href="https://facebook.com" icon={<Facebook size={20} />} label="Facebook" />
              <SocialLink href="https://instagram.com" icon={<Instagram size={20} />} label="Instagram" />
              <SocialLink href="https://twitter.com" icon={<Twitter size={20} />} label="Twitter" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <FooterLink href="/destinos">Destinos</FooterLink>
              <FooterLink href="/paquetes">Paquetes Turísticos</FooterLink>
              <FooterLink href="/blog">Blog de Viajes</FooterLink>
              <FooterLink href="/faq">Preguntas Frecuentes</FooterLink>
              <FooterLink href="/terminos">Términos y Condiciones</FooterLink>
            </ul>
          </div>

          {/* Popular Destinations */}
          <div>
            <h3 className="text-xl font-bold mb-4">Destinos Populares</h3>
            <ul className="space-y-2">
              <FooterLink href="/destinos/cartagena">Cartagena</FooterLink>
              <FooterLink href="/destinos/medellin">Medellín</FooterLink>
              <FooterLink href="/destinos/bogota">Bogotá</FooterLink>
              <FooterLink href="/destinos/eje-cafetero">Eje Cafetero</FooterLink>
              <FooterLink href="/destinos/san-andres">San Andrés</FooterLink>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="mt-1 flex-shrink-0" size={18} />
                <span>Calle 123 #45-67, Bogotá, Colombia</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} />
                <span>+57 (601) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} />
                <span>info@exploracolombia.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-green-700 mt-8 pt-8">
          <div className="flex flex-col items-center justify-center mb-6">
            <h3 className="text-xl font-bold mb-4 text-center">Aliados Oficiales</h3>
            <div className="flex flex-wrap justify-center gap-6">
              <div className="bg-white p-3 rounded-lg">
                <Image
                  src="/images/ministerio-turismo.png"
                  alt="Ministerio de Comercio, Industria y Turismo de Colombia"
                  width={240}
                  height={80}
                  className="object-contain"
                />
              </div>
            </div>
          </div>
          <p className="text-center">
            &copy; {new Date().getFullYear()} Explora Colombia. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="bg-green-700 hover:bg-orange-500 transition-colors p-2 rounded-full"
      aria-label={label}
    >
      {icon}
    </Link>
  )
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="hover:text-orange-300 transition-colors">
        {children}
      </Link>
    </li>
  )
}
