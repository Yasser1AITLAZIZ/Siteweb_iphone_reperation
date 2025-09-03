import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Informations de l'entreprise */}
          <div>
            <h3 className="text-lg font-semibold mb-4">iRepair Pro</h3>
            <p className="text-gray-300 text-sm mb-4">
              Spécialiste de la réparation iPhone au Maroc. Service express, garantie 12 mois.
            </p>
            <div className="space-y-2 text-sm text-gray-300">
              <p>📍 Casablanca, Maroc</p>
              <p>📞 +212 5 22 34 56 78</p>
              <p>✉️ contact@irepair-pro.ma</p>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Nos Services</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>🔧 Réparation écran iPhone</li>
              <li>🔋 Remplacement batterie</li>
              <li>📱 Réparation caméra</li>
              <li>⚡ Service express 30min</li>
            </ul>
          </div>

          {/* Horaires et contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Horaires</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>Lun-Sam: 9h00 - 19h00</p>
              <p>Dimanche: 10h00 - 18h00</p>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-300">Garantie 12 mois sur toutes nos réparations</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-sm text-gray-400">
            © 2024 iRepair Pro. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
}