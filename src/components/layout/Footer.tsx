import { Link } from "react-router-dom";
import { Smartphone, Mail, Phone, MapPin, Clock, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

const footerLinks = {
  services: [
    { name: "Réparation iPhone", href: "/reparations" },
    { name: "Pièces détachées", href: "/boutique" },
    { name: "Diagnostic gratuit", href: "/diagnostic" },
    { name: "Devis en ligne", href: "/devis" }
  ],
  boutique: [
    { name: "Écrans iPhone", href: "/boutique/ecrans" },
    { name: "Batteries", href: "/boutique/batteries" },
    { name: "Connecteurs", href: "/boutique/connecteurs" },
    { name: "Accessoires", href: "/boutique/accessoires" }
  ],
  aide: [
    { name: "FAQ", href: "/faq" },
    { name: "Guide d'entretien", href: "/guide" },
    { name: "Garanties", href: "/garanties" },
    { name: "Support client", href: "/support" }
  ],
  legal: [
    { name: "CGU", href: "/cgu" },
    { name: "CGV", href: "/cgv" },
    { name: "Confidentialité", href: "/confidentialite" },
    { name: "Cookies", href: "/cookies" },
    { name: "Retours & garanties", href: "/retours-garanties" }
  ]
};

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "#" },
  { name: "Instagram", icon: Instagram, href: "#" },
  { name: "Twitter", icon: Twitter, href: "#" },
  { name: "LinkedIn", icon: Linkedin, href: "#" }
];

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="flex items-center space-x-3">
              <div className="bg-gradient-primary p-2 rounded-xl">
                <Smartphone className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight">iRepair Pro</span>
            </Link>
            
            <p className="text-muted-foreground max-w-md">
              Spécialiste de la réparation iPhone depuis 2018. 
              Expertise technique, pièces de qualité et garantie étendue 
              pour redonner vie à votre smartphone.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">
                  123 Avenue de la République, 75011 Paris
                </span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">01 42 36 78 90</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">contact@irepairl-pro.fr</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">
                  Lun-Sam: 9h-19h | Dim: 10h-18h
                </span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 bg-background border border-border rounded-xl flex items-center justify-center hover:bg-surface transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="h-4 w-4 text-muted-foreground" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Services</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Boutique */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Boutique</h3>
            <ul className="space-y-3">
              {footerLinks.boutique.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Aide & Légal */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Aide</h3>
            <ul className="space-y-3 mb-6">
              {footerLinks.aide.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="font-semibold text-foreground mb-4">Légal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-border flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">
            © 2024 iRepair Pro. Tous droits réservés.
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse-gentle" />
              <span>Service client disponible</span>
            </div>
            
            <div className="flex items-center space-x-2 bg-card px-3 py-1 rounded-full">
              <span className="text-xs font-medium text-foreground">Accessibilité</span>
              <div className="w-2 h-2 bg-primary rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}