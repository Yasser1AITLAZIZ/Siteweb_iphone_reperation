import { motion } from 'framer-motion'
import { Badge } from './badge'
import type { RepairStatus } from '../../types'

interface StatusBadgeProps {
  status: RepairStatus
  className?: string
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const getStatusConfig = (status: RepairStatus) => {
    switch (status) {
      case 'recu':
        return {
          label: 'Reçu',
          variant: 'secondary' as const,
          className: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: '📦'
        }
      case 'diagnostic':
        return {
          label: 'En diagnostic',
          variant: 'secondary' as const,
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: '🔍'
        }
      case 'en_attente':
        return {
          label: 'En attente',
          variant: 'secondary' as const,
          className: 'bg-orange-100 text-orange-800 border-orange-200',
          icon: '⏳'
        }
      case 'en_reparation':
        return {
          label: 'En réparation',
          variant: 'secondary' as const,
          className: 'bg-purple-100 text-purple-800 border-purple-200',
          icon: '🔧'
        }
      case 'pret':
        return {
          label: 'Prêt',
          variant: 'secondary' as const,
          className: 'bg-green-100 text-green-800 border-green-200',
          icon: '✅'
        }
      case 'livre':
        return {
          label: 'Livré',
          variant: 'secondary' as const,
          className: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: '🚚'
        }
      default:
        return {
          label: 'Inconnu',
          variant: 'secondary' as const,
          className: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: '❓'
        }
    }
  }

  const config = getStatusConfig(status)

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Badge 
        variant={config.variant} 
        className={`${config.className} ${className}`}
      >
        <span className="mr-1">{config.icon}</span>
        {config.label}
      </Badge>
    </motion.div>
  )
} 