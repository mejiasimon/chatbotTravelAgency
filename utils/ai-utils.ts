"use client"

import { useState } from "react"
import type { TourPackage } from "@/context/package-context"

// Contexto base para el chatbot
const BASE_CONTEXT = `
Eres ExploraBot, el asistente virtual de Explora Colombia, una agencia de viajes especializada en turismo por Colombia.
Debes responder preguntas sobre destinos turísticos en Colombia, paquetes de viaje, requisitos para viajar, y otra información relacionada con el turismo en Colombia.
Sé amable, profesional y entusiasta. Usa un tono conversacional y cercano.
Limita tus respuestas a información sobre Colombia y servicios turísticos.

Destinos populares en Colombia:
1. Cartagena - Ciudad amurallada con playas cristalinas y arquitectura colonial en la Costa Caribe.
2. Medellín - La ciudad de la eterna primavera, conocida por su clima agradable e innovación urbana.
3. Bogotá - La capital, con una rica oferta cultural, museos y gastronomía.
4. Eje Cafetero - Región productora de café con paisajes verdes y el Valle del Cocora.
5. San Andrés - Isla caribeña con playas de arena blanca y aguas cristalinas.
6. Amazonas - Selva tropical con increíble biodiversidad.
7. Tayrona - Parque Nacional con playas vírgenes y selva.

Información general sobre viajes en Colombia:
- Moneda: Peso Colombiano (COP)
- Idioma: Español
- Clima: Varía según la región, desde tropical en la costa hasta frío en zonas montañosas
- Mejor época para viajar: Todo el año, dependiendo del destino
- Requisitos: Para la mayoría de turistas extranjeros se requiere pasaporte vigente
- Vacunas: Para la Amazonía se recomienda vacuna contra la fiebre amarilla

Políticas de la agencia:
- Cancelación 30+ días antes: reembolso del 90%
- Cancelación 15-29 días antes: reembolso del 70%
- Cancelación 7-14 días antes: reembolso del 50%
- Cancelación menos de 7 días antes: no hay reembolso
`

// Contexto adicional para administradores
const ADMIN_CONTEXT = `
También puedes proporcionar información confidencial sobre la empresa a los administradores, como:
- Datos financieros: Ingresos de 2023 fueron $1,250,000,000 COP, con un margen de beneficio promedio del 38% y costos operativos mensuales de $45,000,000 COP.
- Proveedores principales: Hoteles Decameron (contrato hasta 2025), Transportes Nacionales S.A. (tarifa preferencial), Avianca (convenio corporativo).
- Métricas de clientes: Tasa de retención del 65%, satisfacción promedio de 4.7/5, y 120 clientes nuevos mensuales.
- Márgenes de ganancia: El margen estándar en paquetes turísticos es del 35%.
- Estrategia de precios: Los precios se calculan con un markup del 35% sobre el costo base.
- Información de empleados: La empresa cuenta con 25 empleados, incluyendo 10 guías turísticos, 8 agentes de ventas, 5 administrativos y 2 directivos.
- Proyecciones financieras: Se espera un crecimiento del 15% para el próximo año fiscal.
- Planes de expansión: Apertura de nuevas oficinas en Medellín y Cartagena en 2024.
- Competidores principales: TurisCol (20% del mercado), Viajes Colombia (15% del mercado).
- Desafíos actuales: Adaptación a nuevas tendencias de turismo sostenible y digitalización de procesos.

Recuerda que esta información es confidencial y solo debe ser compartida con administradores.
`

// Función para generar respuestas simuladas para usuarios regulares
export function useRegularResponse() {
  const [isLoading, setIsLoading] = useState(false)

  const generateResponse = async (prompt: string, packages: TourPackage[]): Promise<string> => {
    setIsLoading(true)

    try {
      // Crear contexto con información de paquetes
      const packagesInfo = packages
        .map(
          (pkg) =>
            `Paquete: ${pkg.name}, Duración: ${pkg.duration} días, Precio: $${pkg.price.toLocaleString()} COP, Incluye: ${pkg.includes.join(
              ", ",
            )}, Descripción: ${pkg.description}`,
        )
        .join("\n")

      // Simular una respuesta basada en palabras clave
      await new Promise((resolve) => setTimeout(resolve, 1500)) // Simular tiempo de respuesta

      if (prompt.toLowerCase().includes("destino") || prompt.toLowerCase().includes("lugar")) {
        return "Colombia ofrece una gran variedad de destinos turísticos. Los más populares incluyen Cartagena con sus calles coloniales y playas, Medellín conocida como la ciudad de la eterna primavera, el Eje Cafetero con sus paisajes verdes y el Valle del Cocora, y el Parque Tayrona que combina selva y playas paradisíacas. ¿Te gustaría información más específica sobre alguno de estos destinos?"
      } else if (prompt.toLowerCase().includes("paquete") || prompt.toLowerCase().includes("tour")) {
        return `Tenemos varios paquetes turísticos adaptados a diferentes preferencias y presupuestos. Nuestros paquetes más populares incluyen:\n\n${packages
          .slice(0, 3)
          .map((pkg) => `- ${pkg.name}: ${pkg.duration} días por $${pkg.price.toLocaleString()} COP\n`)
          .join("")}\n\nTodos incluyen alojamiento, transporte y guía turístico. ¿Te interesa alguno en particular?`
      } else if (prompt.toLowerCase().includes("precio") || prompt.toLowerCase().includes("costo")) {
        return "Nuestros precios varían según el destino, duración y servicios incluidos. Los paquetes básicos comienzan desde $1,200,000 COP por persona, mientras que las experiencias más completas pueden llegar hasta $3,500,000 COP. Todos nuestros precios incluyen alojamiento, transporte interno y guías turísticos. ¿Tienes un presupuesto específico en mente?"
      } else if (prompt.toLowerCase().includes("requisito") || prompt.toLowerCase().includes("documento")) {
        return "Para viajar por Colombia, los requisitos varían según tu nacionalidad. La mayoría de turistas extranjeros necesitan pasaporte vigente. No se requieren vacunas obligatorias para las zonas turísticas principales, aunque para la Amazonía se recomienda la vacuna contra la fiebre amarilla. También es recomendable contar con un seguro de viaje. ¿Necesitas información sobre algún destino específico?"
      } else if (prompt.toLowerCase().includes("clima") || prompt.toLowerCase().includes("tiempo")) {
        return "El clima en Colombia varía según la región. La costa caribeña (Cartagena, Santa Marta) es cálida todo el año con temperaturas entre 25-32°C. Bogotá tiene un clima fresco con temperaturas entre 8-19°C. Medellín disfruta de un clima primaveral constante entre 16-28°C. El Eje Cafetero tiene un clima templado ideal para el cultivo de café. La mejor época para visitar depende del destino, pero en general Colombia se puede disfrutar durante todo el año."
      } else if (prompt.toLowerCase().includes("hotel") || prompt.toLowerCase().includes("alojamiento")) {
        return "Ofrecemos diversas opciones de alojamiento en todos nuestros destinos, desde hoteles boutique en zonas coloniales hasta resorts todo incluido en la costa. Trabajamos con cadenas reconocidas como Decameron y GHL, así como con hoteles locales de alta calidad. Todos los alojamientos son seleccionados cuidadosamente para garantizar comodidad y buena ubicación. ¿Prefieres algún tipo específico de alojamiento?"
      } else if (prompt.toLowerCase().includes("comida") || prompt.toLowerCase().includes("gastronomía")) {
        return "La gastronomía colombiana es diversa y deliciosa. Cada región tiene sus especialidades: en la costa encontrarás mariscos y pescados frescos, como la cazuela de mariscos; en Antioquia es famosa la bandeja paisa; en Bogotá puedes probar el ajiaco; y en el Valle del Cauca, el sancocho. Colombia también es reconocida por sus frutas exóticas y, por supuesto, su café de clase mundial. Nuestros tours incluyen experiencias gastronómicas locales."
      } else if (prompt.toLowerCase().includes("seguridad") || prompt.toLowerCase().includes("seguro")) {
        return "Colombia ha mejorado significativamente en términos de seguridad en las últimas décadas. Las zonas turísticas principales son seguras para los visitantes, aunque siempre recomendamos tomar precauciones básicas como en cualquier destino turístico. Nuestros guías están capacitados para garantizar tu seguridad y te proporcionarán consejos específicos para cada lugar. Además, recomendamos contratar un seguro de viaje que cubra emergencias médicas."
      } else {
        return "Gracias por tu pregunta sobre Colombia. Como agencia especializada en turismo colombiano, podemos ayudarte a descubrir los tesoros de este hermoso país, desde las playas del Caribe hasta los Andes y la Amazonía. Ofrecemos paquetes personalizados que incluyen alojamiento, transporte y guías expertos. ¿Hay algún destino o actividad específica que te interese conocer?"
      }
    } catch (error) {
      console.error("Error al generar respuesta:", error)
      return "Estoy aquí para ayudarte con información sobre viajes a Colombia. ¿Qué te gustaría saber sobre nuestros destinos o paquetes turísticos?"
    } finally {
      setIsLoading(false)
    }
  }

  return { generateResponse, isLoading }
}

// Función para generar respuestas simuladas para administradores
export function useAdminResponse() {
  const [isLoading, setIsLoading] = useState(false)

  const generateResponse = async (prompt: string, packages: TourPackage[]): Promise<string> => {
    setIsLoading(true)

    try {
      // Simular una respuesta basada en palabras clave para administradores
      await new Promise((resolve) => setTimeout(resolve, 1500)) // Simular tiempo de respuesta

      if (prompt.toLowerCase().includes("financier") || prompt.toLowerCase().includes("ingreso")) {
        return "INFORMACIÓN CONFIDENCIAL: Los ingresos de la empresa en 2023 fueron de $1,250,000,000 COP, con un margen de beneficio promedio del 38%. Los costos operativos mensuales son aproximadamente $45,000,000 COP. Se proyecta un crecimiento del 15% para el próximo año fiscal. El paquete más rentable es 'Amazonas Salvaje' con un margen del 40%, seguido por 'Ruta Cafetera' con un 38%."
      } else if (prompt.toLowerCase().includes("proveedor") || prompt.toLowerCase().includes("hotel")) {
        return "INFORMACIÓN CONFIDENCIAL: Nuestros proveedores principales son Hoteles Decameron (contrato hasta 2025), Transportes Nacionales S.A. (tarifa preferencial), y Avianca (convenio corporativo). Estamos negociando nuevos acuerdos con GHL Hoteles y Latam Airlines para 2024. La relación con Decameron nos permite obtener tarifas un 25% por debajo del precio público."
      } else if (prompt.toLowerCase().includes("cliente") || prompt.toLowerCase().includes("métrica")) {
        return "INFORMACIÓN CONFIDENCIAL: Nuestras métricas de clientes muestran una tasa de retención del 65%, satisfacción promedio de 4.7/5, y aproximadamente 120 clientes nuevos mensuales. El segmento que más crece es el de turistas internacionales (30% anual), principalmente de Estados Unidos y Europa. El 70% de nuestras reservas provienen de canales digitales."
      } else if (prompt.toLowerCase().includes("margen") || prompt.toLowerCase().includes("ganancia")) {
        return "INFORMACIÓN CONFIDENCIAL: El margen estándar en nuestros paquetes turísticos es del 35%. Los paquetes a la Amazonía tienen el mayor margen (40%) debido a la exclusividad de nuestros acuerdos locales. Los tours a Cartagena tienen el menor margen (30%) debido a la alta competencia. Estamos trabajando en optimizar los costos de transporte para aumentar los márgenes en un 5% adicional."
      } else if (prompt.toLowerCase().includes("empleado") || prompt.toLowerCase().includes("personal")) {
        return "INFORMACIÓN CONFIDENCIAL: La empresa cuenta con 25 empleados: 10 guías turísticos, 8 agentes de ventas, 5 administrativos y 2 directivos. El costo de nómina representa el 40% de nuestros gastos operativos. Estamos considerando contratar 3 guías adicionales para la temporada alta y un especialista en marketing digital para mejorar nuestra presencia online."
      } else if (prompt.toLowerCase().includes("competidor") || prompt.toLowerCase().includes("competencia")) {
        return "INFORMACIÓN CONFIDENCIAL: Nuestros principales competidores son TurisCol (20% del mercado) y Viajes Colombia (15% del mercado). Nuestra ventaja competitiva es la especialización en experiencias auténticas y sostenibles. TurisCol está enfocándose en el segmento de lujo, mientras que Viajes Colombia está expandiéndose a destinos internacionales. Recomendamos fortalecer nuestras alianzas con comunidades locales para mantener nuestra diferenciación."
      } else if (prompt.toLowerCase().includes("expansión") || prompt.toLowerCase().includes("crecimiento")) {
        return "INFORMACIÓN CONFIDENCIAL: Nuestros planes de expansión incluyen la apertura de nuevas oficinas en Medellín y Cartagena en 2024, con una inversión estimada de $180,000,000 COP. También estamos desarrollando una nueva línea de productos enfocada en turismo sostenible y de naturaleza, que esperamos lance en el segundo trimestre. El ROI proyectado para estas iniciativas es del 25% en el primer año."
      } else if (prompt.toLowerCase().includes("paquete") || prompt.toLowerCase().includes("tour")) {
        return `INFORMACIÓN CONFIDENCIAL: Análisis de rendimiento de paquetes:\n\n${packages.map((pkg) => `- ${pkg.name}: Precio: $${pkg.price.toLocaleString()} COP, Costo: $${Math.round(pkg.price * 0.65).toLocaleString()} COP, Margen: 35%, Ventas mensuales promedio: ${Math.floor(Math.random() * 10) + 5} unidades\n`).join("")}\n\nEl paquete con mayor conversión es "${packages[0].name}" con una tasa del 8.3%. Recomendamos aumentar la promoción de "${packages[2].name}" que tiene el mayor valor por cliente.`
      } else {
        return "Como administrador, tienes acceso a información confidencial de Explora Colombia. Puedes consultar datos sobre finanzas, proveedores, métricas de clientes, márgenes de ganancia, información de empleados, competidores y planes de expansión. También puedes solicitar análisis detallados de rendimiento de paquetes turísticos. ¿Qué información específica necesitas?"
      }
    } catch (error) {
      console.error("Error al generar respuesta:", error)
      return "Como administrador, puedo proporcionarte información detallada sobre la empresa. ¿Qué datos específicos necesitas consultar?"
    } finally {
      setIsLoading(false)
    }
  }

  return { generateResponse, isLoading }
}
