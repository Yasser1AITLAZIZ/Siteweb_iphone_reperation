import React from 'react'

export default function IndexSimple() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            iRepair Pro
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Réparation iPhone Express au Maroc
          </p>
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Services</h2>
            <ul className="text-left space-y-2">
              <li>✅ Écran iPhone</li>
              <li>✅ Batterie iPhone</li>
              <li>✅ Caméra iPhone</li>
              <li>✅ Autres réparations</li>
            </ul>
            <div className="mt-6 text-center">
              <p className="text-3xl font-bold text-blue-600">À partir de 299 DH</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
