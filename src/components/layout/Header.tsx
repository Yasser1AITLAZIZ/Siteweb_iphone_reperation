import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingCart, User, Menu, X, Smartphone, Wrench, HelpCircle, Info, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion, AnimatePresence } from "framer-motion";

const navigation = [
  {
    name: "Réparations",
    href: "/reparations",
    icon: Wrench,
    description: "Réparez votre iPhone rapidement"
  },
  {
    name: "Boutique",
    href: "/boutique",
    icon: Smartphone,
    description: "Pièces détachées et accessoires",
    megaMenu: [
      {
        category: "iPhone",
        items: [
          { name: "iPhone 15 Series", href: "/boutique/iphone-15" },
          { name: "iPhone 14 Series", href: "/boutique/iphone-14" },
          { name: "iPhone 13 Series", href: "/boutique/iphone-13" },
          { name: "iPhone 12 Series", href: "/boutique/iphone-12" },
          { name: "Modèles antérieurs", href: "/boutique/iphone-ancien" }
        ]
      },
      {
        category: "Pièces détachées",
        items: [
          { name: "Écrans", href: "/boutique/ecrans" },
          { name: "Batteries", href: "/boutique/batteries" },
          { name: "Connecteurs", href: "/boutique/connecteurs" },
          { name: "Caméras", href: "/boutique/cameras" },
          { name: "Autres pièces", href: "/boutique/autres" }
        ]
      }
    ]
  },
  {
    name: "FAQ",
    href: "/faq",
    icon: HelpCircle,
    description: "Questions fréquentes"
  },
  {
    name: "À propos",
    href: "/a-propos",
    icon: Info,
    description: "Notre histoire et expertise"
  },
  {
    name: "Contact",
    href: "/contact",
    icon: Phone,
    description: "Nous contacter"
  }
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-gradient-primary p-2 rounded-xl">
              <Smartphone className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">iRepair Pro</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => item.megaMenu && setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  to={item.href}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl text-text hover:bg-surface transition-colors duration-200"
                >
                  <item.icon className="h-4 w-4" />
                  <span className="font-medium">{item.name}</span>
                </Link>

                {/* Mega Menu */}
                <AnimatePresence>
                  {item.megaMenu && activeDropdown === item.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-96 bg-card border border-border rounded-2xl shadow-lg p-6"
                    >
                      <div className="grid grid-cols-2 gap-6">
                        {item.megaMenu.map((section) => (
                          <div key={section.category}>
                            <h3 className="font-semibold text-foreground mb-3">
                              {section.category}
                            </h3>
                            <ul className="space-y-2">
                              {section.items.map((subItem) => (
                                <li key={subItem.name}>
                                  <Link
                                    to={subItem.href}
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                  >
                                    {subItem.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-2">
            {/* Search */}
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="h-5 w-5" />
            </Button>

            {/* Cart */}
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Button>

            {/* Account */}
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <User className="h-5 w-5" />
            </Button>

            {/* CTA Button */}
            <Button className="hidden md:flex btn-hero ml-4">
              Demander une réparation
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-surface transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <item.icon className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.description}
                        </div>
                      </div>
                    </Link>
                  ))}
                  <Button className="btn-hero mt-6">
                    Demander une réparation
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}