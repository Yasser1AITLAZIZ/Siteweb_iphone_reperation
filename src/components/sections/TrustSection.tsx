import { motion } from "framer-motion";
import { Shield, Clock, Award, RefreshCw, CreditCard, Truck } from "lucide-react";

const trustBadges = [
  {
    icon: Shield,
    title: "Garantie 12 mois",
    description: "Sur toutes nos réparations",
    color: "text-green-600"
  },
  {
    icon: Award,
    title: "Pièces OEM", 
    description: "Qualité constructeur",
    color: "text-blue-600"
  },
  {
    icon: Clock,
    title: "Réparation express",
    description: "En moins de 30 min",
    color: "text-orange-600"
  },
  {
    icon: RefreshCw,
    title: "Retour gratuit",
    description: "Sous 14 jours",
    color: "text-purple-600"
  },
  {
    icon: CreditCard,
    title: "Paiement sécurisé",
    description: "CB, PayPal, Virement",
    color: "text-emerald-600"
  },
  {
    icon: Truck,
    title: "Livraison offerte",
    description: "Dès 50€ d'achat",
    color: "text-indigo-600"
  }
];

const partnerLogos = [
  { name: "Orange", logo: "🔶" },
  { name: "SFR", logo: "🔴" }, 
  { name: "Bouygues", logo: "🔵" },
  { name: "Free", logo: "⚪" },
  { name: "Apple Authorized", logo: "🍎" },
  { name: "Samsung", logo: "📱" }
];

export default function TrustSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-section text-foreground mb-4">
            Votre confiance, notre priorité
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            Des garanties solides et un service de qualité pour votre tranquillité d'esprit
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trustBadges.map((badge, index) => (
              <motion.div
                key={badge.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-card rounded-2xl p-6 shadow-card hover:shadow-lg transition-all duration-300 card-hover"
              >
                <div className="text-center space-y-4">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-surface ${badge.color} bg-opacity-10`}>
                    <badge.icon className={`h-7 w-7 ${badge.color}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {badge.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {badge.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Partners & Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="border-t border-border pt-16"
        >
          <div className="text-center mb-12">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Partenaires de confiance
            </h3>
            <p className="text-muted-foreground">
              Nous travaillons avec les plus grandes enseignes
            </p>
          </div>

          {/* Logo Wall */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center justify-items-center">
            {partnerLogos.map((partner, index) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center space-y-2 group cursor-pointer"
              >
                <div className="w-16 h-16 bg-surface rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300 shadow-sm">
                  {partner.logo}
                </div>
                <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                  {partner.name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center space-x-8 bg-surface/50 px-8 py-4 rounded-2xl">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="h-4 w-4 text-green-600" />
              </div>
              <span className="text-sm font-medium text-foreground">Certifié ISO 9001</span>
            </div>
            
            <div className="w-px h-6 bg-border" />
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Award className="h-4 w-4 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-foreground">Agréé assurances</span>
            </div>
            
            <div className="w-px h-6 bg-border" />
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <CreditCard className="h-4 w-4 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-foreground">Paiement 3D Secure</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}