import { motion } from "framer-motion";
import { useRef } from "react";
import { Star, Users, Shield, Clock } from "lucide-react";
import { CountUp } from "../animations";
import { useIntersectionObserver } from "../../hooks";

const stats = [
  {
    icon: Users,
    value: 12500,
    suffix: "+",
    label: "iPhones réparés",
    description: "Depuis notre ouverture"
  },
  {
    icon: Star,
    value: 4.9,
    suffix: "/5",
    label: "Note moyenne",
    description: "Sur plus de 2 800 avis"
  },
  {
    icon: Shield,
    value: 98,
    suffix: "%",
    label: "Clients satisfaits",
    description: "Recommandent nos services"
  },
  {
    icon: Clock,
    value: 25,
    suffix: "min",
    label: "Temps moyen",
    description: "De réparation express"
  }
];

function CounterAnimation({ value, suffix = "", duration = 2000 }: { value: number; suffix?: string; duration?: number }) {
  return (
    <CountUp 
      value={value} 
      duration={duration / 1000} 
      suffix={suffix}
      className="tabular-nums"
    />
  );
}

export default function StatsSection() {
  const ref = useRef(null);
  const { isIntersecting: isInView } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "-100px",
    freezeOnceVisible: true
  });

  return (
    <section className="py-20 bg-surface/50">
      <div className="container mx-auto px-4">
        <motion.div
          ref={(el) => ref.current = el}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-section text-foreground mb-4">
            La confiance de milliers de clients
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Des chiffres qui parlent d'eux-mêmes et témoignent de notre expertise 
            dans la réparation iPhone
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center p-8 bg-card rounded-3xl shadow-card hover:shadow-lg transition-all duration-300 card-hover"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6">
                <stat.icon className="h-8 w-8 text-primary" />
              </div>
              
              <div className="space-y-2">
                <div className="text-4xl font-bold text-foreground">
                  <CounterAnimation value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-lg font-semibold text-foreground">
                  {stat.label}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.description}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Social Proof Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center space-x-2 bg-primary/5 text-primary px-6 py-3 rounded-full">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-8 h-8 bg-gradient-primary rounded-full border-2 border-background flex items-center justify-center">
                  <span className="text-xs font-medium text-primary-foreground">
                    {String.fromCharCode(64 + i)}
                  </span>
                </div>
              ))}
            </div>
            <span className="text-sm font-medium ml-4">
              Rejoint par plus de 12 500 clients satisfaits
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}