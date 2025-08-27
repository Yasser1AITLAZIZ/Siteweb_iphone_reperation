import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { motion } from "framer-motion";
import heroImage from "@/assets/iphone-hero.jpg";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium"
            >
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse-gentle" />
              <span>Réparation express en moins de 30 minutes</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-display text-foreground leading-tight"
            >
              Réparez votre iPhone
              <span className="text-primary block">comme un pro</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-xl text-muted-foreground max-w-lg leading-relaxed"
            >
              Expertise technique, pièces de qualité OEM et garantie jusqu'à 12 mois. 
              Votre iPhone entre de bonnes mains.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button className="btn-hero group">
              Réparer mon iPhone
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button variant="outline" className="btn-secondary group">
              <Play className="mr-2 h-5 w-5" />
              Voir nos réalisations
            </Button>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="flex items-center space-x-8 pt-8"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">15min</div>
              <div className="text-sm text-muted-foreground">Diagnostic</div>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">12 mois</div>
              <div className="text-sm text-muted-foreground">Garantie</div>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">98%</div>
              <div className="text-sm text-muted-foreground">Succès</div>
            </div>
          </motion.div>
        </motion.div>

        {/* iPhone Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="relative flex justify-center lg:justify-end"
        >
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-110 animate-pulse-gentle" />
            
            {/* iPhone */}
            <motion.img
              src={heroImage}
              alt="iPhone réparation premium"
              className="relative z-10 w-full max-w-md lg:max-w-lg h-auto object-contain animate-float"
              animate={{ 
                y: [0, -10, 0],
                rotateY: [0, 5, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Floating elements */}
            <motion.div
              className="absolute top-1/4 -left-4 bg-card border border-border rounded-2xl p-4 shadow-lg"
              animate={{ 
                y: [0, -15, 0],
                rotate: [0, 5, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            >
              <div className="text-sm font-medium text-foreground">Écran remplacé</div>
              <div className="text-xs text-muted-foreground">en 20 minutes</div>
            </motion.div>
            
            <motion.div
              className="absolute bottom-1/4 -right-4 bg-card border border-border rounded-2xl p-4 shadow-lg"
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, -3, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            >
              <div className="text-sm font-medium text-foreground">Batterie 100%</div>
              <div className="text-xs text-muted-foreground">garantie 12 mois</div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-border rounded-full flex justify-center"
        >
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-bounce-gentle" />
        </motion.div>
      </motion.div>
    </section>
  );
}