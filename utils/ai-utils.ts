import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
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

// Función para generar respuestas con IA para usuarios regulares
export async function generateRegularResponse(prompt: string, packages: TourPackage[]): Promise<string> {
  // Crear contexto con información de paquetes
  const packagesInfo = packages
    .map(
      (pkg) =>
        `Paquete: ${pkg.name}, Duración: ${pkg.duration} días, Precio: $${pkg.price.toLocaleString()} COP, Incluye: ${pkg.includes.join(
          ", ",
        )}, Descripción: ${pkg.description}`,
    )
    .join("\n")

  const context = `${BASE_CONTEXT}
  
Información sobre nuestros paquetes turísticos:
${packagesInfo}

Responde a la siguiente consulta del usuario de manera conversacional y amigable. Si el usuario pregunta por información confidencial o interna de la empresa, indícale amablemente que esa información solo está disponible para administradores.

Consulta del usuario: ${prompt}`

  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: context,
      maxTokens: 500,
    })

    return text
  } catch (error) {
    console.error("Error al generar respuesta:", error)
    return "Lo siento, estoy teniendo problemas para procesar tu consulta en este momento. ¿Puedo ayudarte con algo más?"
  }
}

// Función para generar respuestas con IA para administradores
export async function generateAdminResponse(prompt: string, packages: TourPackage[]): Promise<string> {
  // Crear contexto con información de paquetes incluyendo información privada
  const packagesInfo = packages
    .map(
      (pkg) =>
        `Paquete: ${pkg.name}, Duración: ${pkg.duration} días, Precio: $${pkg.price.toLocaleString()} COP, Costo: $${Math.round(
          pkg.price * 0.65,
        ).toLocaleString()} COP, Margen: 35%, Incluye: ${pkg.includes.join(
          ", ",
        )}, Descripción: ${pkg.description}, Información privada: ${pkg.privateInfo || "No disponible"}`,
    )
    .join("\n")

  const context = `${BASE_CONTEXT}
${ADMIN_CONTEXT}
  
Información detallada sobre nuestros paquetes turísticos:
${packagesInfo}

Responde a la siguiente consulta del administrador de manera conversacional y detallada. Puedes incluir información confidencial ya que es un administrador.

Consulta del administrador: ${prompt}`

  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: context,
      maxTokens: 800,
    })

    return text
  } catch (error) {
    console.error("Error al generar respuesta:", error)
    return "Lo siento, estoy teniendo problemas para procesar tu consulta en este momento. ¿Puedo ayudarte con algo más?"
  }
}
