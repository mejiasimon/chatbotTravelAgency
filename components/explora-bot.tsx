"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { MessageSquare, Send, X, User, Mic, Sparkles } from "lucide-react"
import Image from "next/image"
import { useAuth } from "@/context/auth-context"
import { usePackages } from "@/context/package-context"
import { useRegularResponse, useAdminResponse } from "@/utils/ai-utils"

type Message = {
  id: number
  text: string
  sender: "bot" | "user"
  options?: string[]
  type?: "text" | "card" | "cards" | "ai"
  cards?: {
    title: string
    image: string
    description: string
    price?: string
    id?: number
  }[]
  isAI?: boolean
}

export default function ExploraBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [askingName, setAskingName] = useState(false)
  const [purchaseInProgress, setPurchaseInProgress] = useState(false)
  const [selectedPackageId, setSelectedPackageId] = useState<number | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuth()
  const { packages } = usePackages()

  // Usar los hooks personalizados para generar respuestas
  const { generateResponse: generateRegularResponse, isLoading: isRegularLoading } = useRegularResponse()
  const { generateResponse: generateAdminResponse, isLoading: isAdminLoading } = useAdminResponse()

  const isGeneratingAI = isRegularLoading || isAdminLoading

  // Initial greeting when chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting = user
        ? `¡Hola ${user.name}! Soy ExploraBot, tu guía virtual de viajes por Colombia. ¿En qué puedo ayudarte hoy?`
        : "¡Hola! Soy ExploraBot, tu guía virtual de viajes por Colombia. ¿Cómo te llamas?"

      setMessages([
        {
          id: 1,
          text: greeting,
          sender: "bot",
          options: user ? ["Destinos populares", "Paquetes turísticos", "Información de viaje"] : undefined,
          isAI: false, // Initial greeting is not AI-generated
        },
      ])

      setAskingName(!user)
    }
  }, [isOpen, messages.length, user])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  const handleSend = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: "user",
    }
    setMessages((prev) => [...prev, userMessage])

    // Process user input
    if (askingName) {
      setAskingName(false)

      setTimeout(() => {
        const welcomeMessage: Message = {
          id: messages.length + 2,
          text: `¡Un placer conocerte, ${input}! ¿En qué puedo ayudarte hoy? Puedes preguntarme sobre destinos en Colombia, paquetes turísticos, o información práctica para tu viaje.`,
          sender: "bot",
          options: ["Destinos populares", "Paquetes turísticos", "Información de viaje", "Hablar con un agente"],
          isAI: false, // Welcome message is not AI-generated
        }
        setMessages((prev) => [...prev, welcomeMessage])
      }, 500)
    } else if (purchaseInProgress) {
      handlePurchaseFlow(input)
    } else if (
      input.toLowerCase().includes("paquete") ||
      input.toLowerCase().includes("tour") ||
      input.toLowerCase().includes("destino") ||
      input.toLowerCase().includes("lugar")
    ) {
      // Show cards for packages or destinations
      showPackagesOrDestinations(input.toLowerCase())
    } else if (input.toLowerCase().includes("comprar") || input.toLowerCase().includes("reservar")) {
      // Handle purchase intent
      handlePurchaseIntent()
    } else {
      // Use AI for most other responses
      handleAIResponse(input)
    }

    // Clear input
    setInput("")
  }

  const handleAIResponse = async (query: string) => {
    // Add loading message
    const loadingMessageId = messages.length + 2
    setMessages((prev) => [
      ...prev,
      {
        id: loadingMessageId,
        text: "Estoy pensando en una respuesta...",
        sender: "bot",
        type: "ai",
        isAI: true,
      },
    ])

    try {
      // Generate AI response based on user role
      const aiResponse =
        user?.role === "admin"
          ? await generateAdminResponse(query, packages)
          : await generateRegularResponse(query, packages)

      // Replace loading message with AI response
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMessageId
            ? {
                ...msg,
                text: aiResponse,
                options: getRelevantOptions(query),
              }
            : msg,
        ),
      )
    } catch (error) {
      console.error("Error generating AI response:", error)

      // Replace loading message with error message
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMessageId
            ? {
                ...msg,
                text: "Lo siento, tuve un problema al generar una respuesta. ¿Puedo ayudarte con algo más?",
                options: ["Destinos populares", "Paquetes turísticos", "Información de viaje"],
              }
            : msg,
        ),
      )
    }
  }

  // Helper function to get relevant options based on the query
  const getRelevantOptions = (query: string) => {
    if (
      query.toLowerCase().includes("destino") ||
      query.toLowerCase().includes("lugar") ||
      query.toLowerCase().includes("visitar")
    ) {
      return ["Ver paquetes turísticos", "Información de viaje", "Hablar con un agente"]
    } else if (
      query.toLowerCase().includes("paquete") ||
      query.toLowerCase().includes("tour") ||
      query.toLowerCase().includes("viaje")
    ) {
      return ["Ver destinos populares", "Información de viaje", "Hablar con un agente"]
    } else if (
      query.toLowerCase().includes("requisito") ||
      query.toLowerCase().includes("documento") ||
      query.toLowerCase().includes("información")
    ) {
      return ["Destinos populares", "Paquetes turísticos", "Hablar con un agente"]
    } else {
      return ["Destinos populares", "Paquetes turísticos", "Información de viaje"]
    }
  }

  const showPackagesOrDestinations = (query: string) => {
    setTimeout(() => {
      let botResponse: Message

      if (query.includes("destino") || query.includes("lugar")) {
        botResponse = {
          id: messages.length + 2,
          text: "Colombia tiene destinos increíbles para todos los gustos. Aquí te muestro algunos de los más populares:",
          sender: "bot",
          type: "cards",
          cards: [
            {
              title: "Cartagena",
              image: "/images/cartagena.webp",
              description: "Ciudad amurallada con playas cristalinas y arquitectura colonial.",
            },
            {
              title: "Valle del Cocora",
              image: "/images/valle-cocora.jpeg",
              description: "Paisajes verdes y las icónicas palmas de cera, árbol nacional de Colombia.",
            },
            {
              title: "Medellín",
              image: "/images/medellin.webp",
              description: "La ciudad de la eterna primavera con su innovadora transformación urbana.",
            },
          ],
          isAI: false,
        }
      } else {
        botResponse = {
          id: messages.length + 2,
          text: "Tenemos varios paquetes turísticos diseñados para diferentes presupuestos y preferencias:",
          sender: "bot",
          type: "cards",
          cards: packages.map((pkg) => ({
            id: pkg.id,
            title: pkg.name,
            image: pkg.image,
            description: pkg.description.substring(0, 80) + "...",
            price: `$${pkg.price.toLocaleString()} COP`,
          })),
          isAI: false,
        }
      }

      setMessages((prev) => [...prev, botResponse])
    }, 1000)
  }

  const handlePurchaseIntent = () => {
    if (user && user.role === "regular") {
      setTimeout(() => {
        const botResponse: Message = {
          id: messages.length + 2,
          text: "¡Genial! Para ayudarte a reservar, primero necesito saber qué paquete te interesa. Aquí están nuestras opciones disponibles:",
          sender: "bot",
          type: "cards",
          cards: packages.map((pkg) => ({
            id: pkg.id,
            title: pkg.name,
            image: pkg.image,
            description: `${pkg.duration} días - Máx. ${pkg.maxPeople} personas`,
            price: `$${pkg.price.toLocaleString()} COP`,
          })),
          isAI: false,
        }
        setMessages((prev) => [...prev, botResponse])
      }, 1000)
    } else {
      setTimeout(() => {
        const botResponse: Message = {
          id: messages.length + 2,
          text: "Para reservar un paquete, necesitas iniciar sesión como usuario regular. ¿Te gustaría que te redirija a la página de inicio de sesión?",
          sender: "bot",
          options: ["Ir a iniciar sesión", "No, gracias"],
          isAI: false,
        }
        setMessages((prev) => [...prev, botResponse])
      }, 1000)
    }
  }

  const handlePurchaseFlow = (input: string) => {
    if (!selectedPackageId) return

    const selectedPackage = packages.find((p) => p.id === selectedPackageId)
    if (!selectedPackage) return

    setTimeout(() => {
      // Simulate purchase confirmation
      const confirmationMessage: Message = {
        id: messages.length + 2,
        text: `¡Excelente! He registrado tu reserva para el paquete "${selectedPackage.name}" para ${input} personas.\n\nEn breve recibirás un correo electrónico con los detalles de tu reserva y las instrucciones para realizar el pago.\n\n¿Puedo ayudarte con algo más?`,
        sender: "bot",
        options: ["Ver más paquetes", "Información de viaje", "No, gracias"],
        isAI: false,
      }
      setMessages((prev) => [...prev, confirmationMessage])
      setPurchaseInProgress(false)
      setSelectedPackageId(null)
    }, 1500)
  }

  const handleOptionClick = (option: string) => {
    // Add user message with the selected option
    const userMessage: Message = {
      id: messages.length + 1,
      text: option,
      sender: "user",
    }
    setMessages((prev) => [...prev, userMessage])

    // Handle special options
    if (option === "Ir a iniciar sesión") {
      window.location.href = "/login"
      return
    }

    // Process the selected option using AI
    handleAIResponse(option)
  }

  const handlePackageSelect = (packageId: number) => {
    const selectedPackage = packages.find((p) => p.id === packageId)
    if (!selectedPackage) return

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: `Me interesa el paquete "${selectedPackage.name}"`,
      sender: "user",
    }
    setMessages((prev) => [...prev, userMessage])

    // If user is logged in as regular user, proceed with purchase
    if (user && user.role === "regular") {
      setTimeout(() => {
        const purchaseMessage: Message = {
          id: messages.length + 2,
          text: `¡Excelente elección! El paquete "${selectedPackage.name}" incluye:\n\n• ${selectedPackage.duration} días de viaje\n• ${selectedPackage.includes.join("\n• ")}\n\nEl precio es de $${selectedPackage.price.toLocaleString()} COP por persona.\n\n¿Para cuántas personas te gustaría reservar este paquete?`,
          sender: "bot",
          isAI: false,
        }
        setMessages((prev) => [...prev, purchaseMessage])
        setPurchaseInProgress(true)
        setSelectedPackageId(packageId)
      }, 1000)
    } else {
      // If not logged in or not a regular user
      setTimeout(() => {
        const loginMessage: Message = {
          id: messages.length + 2,
          text: "Para reservar este paquete, necesitas iniciar sesión como usuario regular. ¿Te gustaría que te redirija a la página de inicio de sesión?",
          sender: "bot",
          options: ["Ir a iniciar sesión", "No, gracias"],
          isAI: false,
        }
        setMessages((prev) => [...prev, loginMessage])
      }, 1000)
    }
  }

  return (
    <>
      {/* Floating chat button */}
      <Button
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 rounded-full w-16 h-16 shadow-lg z-50 ${
          isOpen ? "bg-red-500 hover:bg-red-600" : "bg-green-600 hover:bg-green-700"
        }`}
        aria-label={isOpen ? "Cerrar chat" : "Abrir chat con ExploraBot"}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </Button>

      {/* Chat window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-[350px] md:w-[400px] h-[500px] z-50 flex flex-col shadow-xl border-2 border-green-200">
          {/* Chat header */}
          <div className="bg-green-600 text-white p-4 flex items-center justify-between rounded-t-lg">
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white p-1">
                <Image src="/images/logo.png" alt="ExploraBot Avatar" fill className="object-contain" />
              </div>
              <div>
                <h3 className="font-bold">Guía ExploraBot</h3>
                <p className="text-xs flex items-center">
                  <Sparkles size={12} className="mr-1" /> Asistente virtual con IA
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleChat}
              className="text-white hover:bg-green-700"
              aria-label="Cerrar chat"
            >
              <X size={20} />
            </Button>
          </div>

          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === "user"
                      ? "bg-green-600 text-white rounded-tr-none"
                      : "bg-white border border-gray-200 shadow-sm rounded-tl-none"
                  }`}
                >
                  {message.isAI && isGeneratingAI ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                      <span>Generando respuesta...</span>
                    </div>
                  ) : message.type === "cards" && message.cards ? (
                    <div className="space-y-3">
                      <p>{message.text}</p>
                      <div className="flex overflow-x-auto pb-2 space-x-3 -mx-2 px-2">
                        {message.cards.map((card, index) => (
                          <div
                            key={index}
                            className="flex-shrink-0 w-48 border rounded-lg overflow-hidden bg-white cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => card.id && handlePackageSelect(card.id)}
                          >
                            <div className="relative h-32 w-full">
                              <Image
                                src={card.image || "/placeholder.svg"}
                                alt={card.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="p-2">
                              <h4 className="font-bold text-sm">{card.title}</h4>
                              <p className="text-xs text-gray-600">{card.description}</p>
                              {card.price && <p className="text-xs font-bold text-orange-600 mt-1">{card.price}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div>
                      {message.isAI && (
                        <div className="flex items-center gap-1 mb-1 text-xs text-green-600">
                          <Sparkles size={12} />
                          <span>Respuesta IA</span>
                        </div>
                      )}
                      <p className="whitespace-pre-line">{message.text}</p>
                    </div>
                  )}

                  {message.options && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.options.map((option, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="text-xs bg-white hover:bg-green-50 border-green-200"
                          onClick={() => handleOptionClick(option)}
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
                {message.sender === "user" && (
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center ml-2">
                    <User size={16} className="text-green-600" />
                  </div>
                )}
                {message.sender === "bot" && (
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
                    <div className="relative w-6 h-6">
                      <Image src="/images/logo.png" alt="Bot" fill className="object-contain" />
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat input */}
          <div className="p-3 border-t bg-white rounded-b-lg">
            <div className="flex items-center space-x-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Escribe tu mensaje..."
                className="flex-1"
                disabled={isGeneratingAI}
              />
              <Button
                size="icon"
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={handleSend}
                aria-label="Enviar mensaje"
                disabled={isGeneratingAI}
              >
                <Send size={18} />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="border-green-200 text-green-600"
                aria-label="Usar micrófono"
                disabled={isGeneratingAI}
              >
                <Mic size={18} />
              </Button>
            </div>
            {user?.role === "admin" && (
              <div className="mt-2 text-xs text-orange-600 flex items-center">
                <Sparkles size={12} className="mr-1" />
                <span>Modo administrador: Puedes solicitar información confidencial</span>
              </div>
            )}
          </div>
        </Card>
      )}
    </>
  )
}
