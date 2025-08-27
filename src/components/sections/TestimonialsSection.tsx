import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    id: "1",
    name: "Sophie M.",
    model: "iPhone 14 Pro",
    repair: "Remplacement écran",
    rating: 5,
    comment: "Service exceptionnel ! Mon écran a été remplacé en 20 minutes avec une qualité parfaite. L'équipe est très professionnelle.",
    avatar: "SM",
    date: "Il y a 2 jours"
  },
  {
    id: "2", 
    name: "Thomas L.",
    model: "iPhone 13",
    repair: "Changement batterie",
    rating: 5,
    comment: "Ma batterie tient enfin toute la journée ! Prix très correct et travail soigné. Je recommande vivement.",
    avatar: "TL",
    date: "Il y a 1 semaine"
  },
  {
    id: "3",
    name: "Marie D.",
    model: "iPhone 12 Pro Max",
    repair: "Réparation connecteur",
    rating: 5,
    comment: "Mon iPhone ne se rechargeait plus. Réparé en 30 minutes, impeccable ! Excellent accueil et conseils avisés.",
    avatar: "MD",
    date: "Il y a 3 jours"
  },
  {
    id: "4",
    name: "Alexandre R.",
    model: "iPhone 15 Pro",
    repair: "Module caméra",
    rating: 5,
    comment: "Caméra arrière réparée rapidement. Photos parfaites maintenant. Service client au top, merci !",
    avatar: "AR",
    date: "Il y a 5 jours"
  },
  {
    id: "5",
    name: "Julie B.",
    model: "iPhone 11",
    repair: "Écran + batterie",
    rating: 5,
    comment: "Double réparation effectuée avec soin. Prix transparent, délai respecté. Mon iPhone est comme neuf !",
    avatar: "JB", 
    date: "Il y a 1 semaine"
  },
  {
    id: "6",
    name: "David P.",
    model: "iPhone 13 Pro",
    repair: "Diagnostic complet",
    rating: 5,
    comment: "Diagnostic précis et honnête. Pas de réparation inutile, juste les conseils nécessaires. Très professionnel.",
    avatar: "DP",
    date: "Il y a 4 jours"
  }
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [direction, setDirection] = useState(0);

  // Auto-rotation every 6 seconds
  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const nextTestimonial = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  return (
    <section className="py-20 bg-gradient-surface">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-section text-foreground mb-4">
            Ce que disent nos clients
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Découvrez l'expérience de nos clients et leur satisfaction 
            après nos réparations iPhone
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Main Testimonial Card */}
          <div 
            className="relative h-96 overflow-hidden"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="bg-card rounded-3xl shadow-xl p-8 md:p-12 max-w-3xl mx-4 card-hover">
                  <div className="flex items-start space-x-6">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center">
                        <span className="text-lg font-bold text-primary-foreground">
                          {testimonials[currentIndex].avatar}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-4">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-foreground">
                            {testimonials[currentIndex].name}
                          </h3>
                          <p className="text-muted-foreground">
                            {testimonials[currentIndex].model} • {testimonials[currentIndex].repair}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1">
                          {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                            <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>

                      {/* Comment */}
                      <blockquote className="text-lg text-foreground leading-relaxed">
                        "{testimonials[currentIndex].comment}"
                      </blockquote>

                      {/* Date */}
                      <p className="text-sm text-muted-foreground">
                        {testimonials[currentIndex].date}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonial}
              className="rounded-full"
              disabled={testimonials.length <= 1}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            {/* Dots Indicator */}
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? "bg-primary scale-125" 
                      : "bg-border hover:bg-border/80"
                  }`}
                  aria-label={`Aller au témoignage ${index + 1}`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              className="rounded-full"
              disabled={testimonials.length <= 1}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Auto-play Indicator */}
          <div className="text-center mt-6">
            <div className="inline-flex items-center space-x-2 text-sm text-muted-foreground">
              <div className={`w-2 h-2 rounded-full ${isAutoPlaying ? "bg-primary animate-pulse-gentle" : "bg-border"}`} />
              <span>{isAutoPlaying ? "Rotation automatique" : "En pause"}</span>
            </div>
          </div>
        </div>

        {/* Rating Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center space-x-4 bg-card px-8 py-4 rounded-2xl shadow-card">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <div className="text-left">
              <div className="text-xl font-bold text-foreground">4.9/5</div>
              <div className="text-sm text-muted-foreground">2 847 avis clients</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}