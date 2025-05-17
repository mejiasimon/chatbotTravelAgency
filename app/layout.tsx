import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/context/auth-context"
import { PackageProvider } from "@/context/package-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Explora Colombia - Viajes y Turismo",
  description: "Descubre los mejores destinos turísticos de Colombia con Explora Colombia",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <PackageProvider>
              <Header />
              {children}
              <Footer />
            </PackageProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
