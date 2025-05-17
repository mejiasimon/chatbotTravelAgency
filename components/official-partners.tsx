import Image from "next/image"

export default function OfficialPartners() {
  return (
    <section className="py-12 bg-white">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-8 text-green-800">Respaldados Oficialmente</h2>
        <p className="text-center max-w-3xl mx-auto mb-10 text-gray-600">
          Explora Colombia trabaja en colaboración con entidades oficiales de turismo para garantizar experiencias
          auténticas y de calidad en todos nuestros destinos.
        </p>

        <div className="flex flex-col items-center justify-center">
          <div className="bg-white shadow-md rounded-lg p-6 max-w-md">
            <div className="flex justify-center mb-4">
              <Image
                src="/images/ministerio-turismo.png"
                alt="Ministerio de Comercio, Industria y Turismo de Colombia"
                width={300}
                height={100}
                className="object-contain"
              />
            </div>
            <p className="text-center text-gray-700">
              Operamos bajo los estándares y regulaciones del Ministerio de Comercio, Industria y Turismo de Colombia,
              garantizando servicios turísticos de alta calidad y responsabilidad.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
