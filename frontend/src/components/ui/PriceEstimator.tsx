import { motion } from 'framer-motion'
import { Calculator, Clock, Shield, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Badge } from './badge'
import { Button } from './button'
import type { RepairQuote } from '../../types'
import { formatPriceDH } from '../../lib/utils'

interface PriceEstimatorProps {
  quote: RepairQuote | null
  isLoading?: boolean
  onCalculate?: () => void
  className?: string
}

export function PriceEstimator({ 
  quote, 
  isLoading = false,
  onCalculate,
  className = '' 
}: PriceEstimatorProps) {
  if (!quote && !isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <Calculator className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-lg font-semibold mb-2">Estimation des coûts</h3>
          <p className="text-muted-foreground mb-4">
            Sélectionnez un modèle et des services pour obtenir une estimation
          </p>
          {onCalculate && (
            <Button onClick={onCalculate} disabled={isLoading}>
              {isLoading ? 'Calcul...' : 'Calculer le devis'}
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Calculator className="w-12 h-12 text-primary mx-auto mb-3" />
          </motion.div>
          <h3 className="text-lg font-semibold mb-2">Calcul en cours...</h3>
          <p className="text-muted-foreground">
            Nous analysons votre demande pour vous proposer le meilleur prix
          </p>
        </CardContent>
      </Card>
    )
  }

  if (!quote) return null

  const totalHours = quote.estimatedTime
  const formattedTime = totalHours < 1 
    ? `${Math.round(totalHours * 60)}min` 
    : `${totalHours}h`

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="w-5 h-5 text-primary" />
            <span>Devis estimatif</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Model Info */}
          <div className="flex items-center justify-between p-3 bg-background rounded-lg">
            <div>
              <div className="font-medium">Modèle</div>
              <div className="text-sm text-muted-foreground">{quote.phoneModel}</div>
            </div>
            <Badge variant="outline">iPhone</Badge>
          </div>

          {/* Services Summary */}
          <div>
            <h4 className="font-medium mb-3">Services sélectionnés</h4>
            <div className="space-y-2">
              {quote.services.map((service) => (
                <div key={service.id} className="flex items-center justify-between p-2 bg-background rounded">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm">{service.name}</span>
                  </div>
                  <span className="text-sm font-medium">{formatPriceDH(service.price)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="space-y-3 p-4 bg-background rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Sous-total</span>
              <span className="font-medium">{formatPriceDH(quote.totalPrice)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Diagnostic</span>
              <span className="text-green-600 font-medium">Gratuit</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Total estimé</span>
                <span className="text-2xl font-bold text-primary">
                  {formatPriceDH(quote.totalPrice)}
                </span>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-background rounded-lg">
              <Clock className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <div className="text-sm font-medium">Délai estimé</div>
              <div className="text-xs text-muted-foreground">{formattedTime}</div>
            </div>
            <div className="text-center p-3 bg-background rounded-lg">
              <Shield className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <div className="text-sm font-medium">Garantie</div>
              <div className="text-xs text-muted-foreground">{quote.warranty} mois</div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="text-xs text-muted-foreground text-center p-3 bg-background rounded-lg">
            <p>
              ⚠️ Ce prix est une estimation. Le prix final sera confirmé après diagnostic gratuit.
            </p>
          </div>

          {/* CTA */}
          <Button className="w-full" size="lg">
            <TrendingUp className="w-4 h-4 mr-2" />
            Commencer la réparation
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
} 