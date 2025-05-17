import OfficialPartners from "@/components/official-partners"
import Image from "next/image"

export default function AboutPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/valle-cocora.jpeg"
            alt="Paisaje colombiano - Valle del Cocora"
            fill
            className="object-cover brightness-[0.7]"
          />
        </div>
        <div className="container relative z-10 text-white">
          <h1 className="text-4xl md:text-5xl font-bold">Sobre Nosotros</h1>
          <p className="text-xl mt-4 max-w-2xl">
            Descubre quiénes somos y por qué somos tu mejor opción para explorar Colombia
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-green-800">Nuestra Historia</h2>
              <p className="mb-4">
                Explora Colombia nació en 2015 con una misión clara: mostrar la verdadera esencia de Colombia al mundo.
                Fundada por un grupo de apasionados viajeros colombianos, nuestra empresa se ha convertido en un
                referente del turismo sostenible y auténtico en el país.
              </p>
              <p className="mb-4">
                Nos especializamos en crear experiencias memorables que van más allá del turismo convencional,
                conectando a nuestros viajeros con la cultura, la naturaleza y la gente de Colombia.
              </p>
              <p>
                Con más de 8 años de experiencia y miles de viajeros satisfechos, seguimos comprometidos con la
                excelencia en cada detalle de nuestros servicios.
              </p>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/images/ruta-cafetera.webp"
                alt="Jeep Willys en la Ruta Cafetera de Colombia"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-green-50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12 text-green-800">Nuestros Valores</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4 text-orange-600">Sostenibilidad</h3>
              <p>
                Promovemos un turismo responsable que respeta y preserva los entornos naturales y culturales de
                Colombia.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4 text-orange-600">Autenticidad</h3>
              <p>Creamos experiencias genuinas que reflejan la verdadera esencia de cada destino y sus comunidades.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4 text-orange-600">Excelencia</h3>
              <p>
                Nos comprometemos con la calidad en cada detalle, desde la planificación hasta la ejecución de cada
                viaje.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Official Partners */}
      <OfficialPartners />
    </main>
  )
}
