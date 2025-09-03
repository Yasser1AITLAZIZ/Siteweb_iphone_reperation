import { useState } from 'react'
import { ServiceCard, PhoneSelector, PriceEstimator, StatusBadge } from '@/components/ui'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { PhoneModel, RepairService, RepairQuote } from '@/types'

// Mock data for playground
const mockPhoneModels: PhoneModel[] = [
  {
    id: '1',
    brand: 'Apple',
    model: 'iPhone 13 Pro',
    year: 2021,
    isSupported: true,
    imageUrl: '/placeholder.svg',
    basePrice: 1200
  },
  {
    id: '2',
    brand: 'Apple',
    model: 'iPhone 14',
    year: 2022,
    isSupported: true,
    imageUrl: '/placeholder.svg',
    basePrice: 1000
  }
]

const mockServices: RepairService[] = [
  {
    id: '1',
    name: 'Remplacement écran',
    description: 'Écran OLED complet avec vitre',
    price: 1490,
    estimatedTime: 2,
    category: 'screen',
    isAvailable: true
  },
  {
    id: '2',
    name: 'Remplacement batterie',
    description: 'Batterie originale Apple',
    price: 89,
    estimatedTime: 1,
    category: 'battery',
    isAvailable: true
  },
  {
    id: '3',
    name: 'Remplacement caméra',
    description: 'Module caméra arrière',
    price: 299,
    estimatedTime: 3,
    category: 'camera',
    isAvailable: true
  }
]

const mockQuote: RepairQuote = {
  phoneModel: 'iPhone 13 Pro',
  services: [mockServices[0], mockServices[1]],
  totalPrice: 1579,
  estimatedTime: 3,
  warranty: 6
}

export default function UIPlayground() {
  const [selectedModel, setSelectedModel] = useState<PhoneModel | null>(null)
  const [selectedServices, setSelectedServices] = useState<RepairService[]>([])
  const [quote, setQuote] = useState<RepairQuote | null>(null)

  const handleServiceToggle = (service: RepairService) => {
    setSelectedServices(prev => {
      const isSelected = prev.some(s => s.id === service.id)
      if (isSelected) {
        return prev.filter(s => s.id !== service.id)
      } else {
        return [...prev, service]
      }
    })
  }

  const handleCalculateQuote = () => {
    if (selectedModel && selectedServices.length > 0) {
      const newQuote: RepairQuote = {
        phoneModel: selectedModel.model,
        services: selectedServices,
        totalPrice: selectedServices.reduce((sum, s) => sum + s.price, 0),
        estimatedTime: selectedServices.reduce((sum, s) => sum + s.estimatedTime, 0),
        warranty: Math.min(3 + Math.floor(selectedServices.length * 0.5), 12)
      }
      setQuote(newQuote)
    }
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">UI Components Playground</h1>
          <p className="text-xl text-muted-foreground">
            Démonstration des composants UI métier
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Phone Selector */}
            <Card>
              <CardHeader>
                <CardTitle>Phone Selector</CardTitle>
              </CardHeader>
              <CardContent>
                <PhoneSelector
                  models={mockPhoneModels}
                  selectedModel={selectedModel}
                  onSelect={setSelectedModel}
                />
              </CardContent>
            </Card>

            {/* Service Cards */}
            <Card>
              <CardHeader>
                <CardTitle>Service Cards</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockServices.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      isSelected={selectedServices.some(s => s.id === service.id)}
                      onToggle={handleServiceToggle}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Status Badges */}
            <Card>
              <CardHeader>
                <CardTitle>Status Badges</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge status="recu" />
                  <StatusBadge status="diagnostic" />
                  <StatusBadge status="en_attente" />
                  <StatusBadge status="en_reparation" />
                  <StatusBadge status="pret" />
                  <StatusBadge status="livre" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Price Estimator */}
            <Card>
              <CardHeader>
                <CardTitle>Price Estimator</CardTitle>
              </CardHeader>
              <CardContent>
                <PriceEstimator
                  quote={quote}
                  onCalculate={handleCalculateQuote}
                />
              </CardContent>
            </Card>

            {/* Interactive Demo */}
            <Card>
              <CardHeader>
                <CardTitle>Interactive Demo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Modèle sélectionné:</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedModel ? selectedModel.model : 'Aucun modèle sélectionné'}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Services sélectionnés:</h4>
                  <div className="space-y-1">
                    {selectedServices.length > 0 ? (
                      selectedServices.map(service => (
                        <div key={service.id} className="text-sm text-muted-foreground">
                          • {service.name} - {service.price} DH
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">Aucun service sélectionné</p>
                    )}
                  </div>
                </div>

                <Button 
                  onClick={handleCalculateQuote}
                  disabled={!selectedModel || selectedServices.length === 0}
                  className="w-full"
                >
                  Calculer le devis
                </Button>
              </CardContent>
            </Card>

            {/* Mock Quote Display */}
            {quote && (
              <Card>
                <CardHeader>
                  <CardTitle>Devis généré</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div><strong>Modèle:</strong> {quote.phoneModel}</div>
                    <div><strong>Services:</strong> {quote.services.length}</div>
                    <div><strong>Prix total:</strong> {quote.totalPrice} DH</div>
                    <div><strong>Temps estimé:</strong> {quote.estimatedTime}h</div>
                    <div><strong>Garantie:</strong> {quote.warranty} mois</div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 