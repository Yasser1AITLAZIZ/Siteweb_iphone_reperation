import { motion } from 'framer-motion'
import { Check, Clock, Shield } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Badge } from './badge'
import { Button } from './button'
import type { RepairService } from '../../types'
import { formatPriceDH } from '../../lib/utils'

interface ServiceCardProps {
  service: RepairService
  isSelected?: boolean
  onToggle?: (service: RepairService) => void
  className?: string
}

export function ServiceCard({ 
  service, 
  isSelected = false, 
  onToggle,
  className = '' 
}: ServiceCardProps) {
  const handleToggle = () => {
    onToggle?.(service)
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'screen':
        return 'bg-blue-100 text-blue-800'
      case 'battery':
        return 'bg-green-100 text-green-800'
      case 'camera':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'screen':
        return '📱'
      case 'battery':
        return '🔋'
      case 'camera':
        return '📷'
      default:
        return '🔧'
    }
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={className}
    >
      <Card 
        className={`cursor-pointer transition-all duration-200 ${
          isSelected 
            ? 'ring-2 ring-primary bg-primary/5 border-primary' 
            : 'hover:border-primary/50 hover:shadow-md'
        }`}
        onClick={handleToggle}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{getCategoryIcon(service.category)}</span>
              <Badge variant="secondary" className={getCategoryColor(service.category)}>
                {service.category}
              </Badge>
            </div>
            {isSelected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-6 h-6 bg-primary rounded-full flex items-center justify-center"
              >
                <Check className="w-4 h-4 text-primary-foreground" />
              </motion.div>
            )}
          </div>
          <CardTitle className="text-lg">{service.name}</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {service.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-primary">
              {formatPriceDH(service.price)}
            </div>
            <div className="text-sm text-muted-foreground">
              {service.estimatedTime}h
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>~{service.estimatedTime}h</span>
            </div>
            <div className="flex items-center space-x-1">
              <Shield className="w-3 h-3" />
              <span>3 mois garantie</span>
            </div>
          </div>
          
          {onToggle && (
            <Button
              variant={isSelected ? "default" : "outline"}
              size="sm"
              className="w-full"
              onClick={(e) => {
                e.stopPropagation()
                handleToggle()
              }}
            >
              {isSelected ? 'Désélectionner' : 'Sélectionner'}
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
} 