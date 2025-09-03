import { motion } from 'framer-motion'
import { Search, Smartphone } from 'lucide-react'
import { Input } from './input'
import { Button } from './button'
import { Card, CardContent } from './card'
import type { PhoneModel } from '../../types'
import { useState, useMemo } from 'react'

interface PhoneSelectorProps {
  models: PhoneModel[]
  selectedModel?: PhoneModel | null
  onSelect: (model: PhoneModel) => void
  className?: string
}

export function PhoneSelector({ 
  models, 
  selectedModel, 
  onSelect,
  className = '' 
}: PhoneSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showAll, setShowAll] = useState(false)

  const filteredModels = useMemo(() => {
    if (!searchQuery) {
      return showAll ? models : models.slice(0, 6)
    }
    
    return models.filter(model => 
      model.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.brand.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [models, searchQuery, showAll])

  const popularModels = models.filter(model => model.isSupported).slice(0, 6)

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Rechercher un modèle d'iPhone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Popular Models */}
      {!searchQuery && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            Modèles populaires
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {popularModels.map((model) => (
              <motion.div
                key={model.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedModel?.id === model.id
                      ? 'ring-2 ring-primary bg-primary/5 border-primary'
                      : 'hover:border-primary/50 hover:shadow-md'
                  }`}
                  onClick={() => onSelect(model)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-16 mx-auto mb-2">
                      <img
                        src={model.imageUrl}
                        alt={model.model}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="text-sm font-medium">{model.model}</div>
                    <div className="text-xs text-muted-foreground">
                      {model.year}
                    </div>
                    {model.isSupported && (
                      <div className="text-xs text-green-600 mt-1">
                        ✓ Supporté
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      {searchQuery && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            Résultats de recherche ({filteredModels.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredModels.map((model) => (
              <motion.div
                key={model.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Card 
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedModel?.id === model.id
                      ? 'ring-2 ring-primary bg-primary/5 border-primary'
                      : 'hover:border-primary/50 hover:shadow-md'
                  }`}
                  onClick={() => onSelect(model)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-12 flex-shrink-0">
                        <img
                          src={model.imageUrl}
                          alt={model.model}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{model.model}</div>
                        <div className="text-sm text-muted-foreground">
                          {model.brand} • {model.year}
                        </div>
                        {model.isSupported ? (
                          <div className="text-xs text-green-600">
                            ✓ Supporté
                          </div>
                        ) : (
                          <div className="text-xs text-red-600">
                            ✗ Non supporté
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Show More/Less */}
      {!searchQuery && (
        <div className="text-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Voir moins' : `Voir tous les modèles (${models.length})`}
          </Button>
        </div>
      )}

      {/* No Results */}
      {searchQuery && filteredModels.length === 0 && (
        <div className="text-center py-8">
          <Smartphone className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">
            Aucun modèle trouvé pour "{searchQuery}"
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSearchQuery('')}
            className="mt-3"
          >
            Effacer la recherche
          </Button>
        </div>
      )}
    </div>
  )
} 