import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Upload, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import models from "@/data/models.json";

interface WizardData {
  model: string;
  issue: string;
  symptoms: string[];
  description: string;
  photos: File[];
  contactMode: string;
  contact: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
}

const issues = [
  { id: "screen", name: "Écran cassé/fissuré", icon: "📱", priceRange: "89€ - 189€", delay: "30min - 2h" },
  { id: "battery", name: "Problème de batterie", icon: "🔋", priceRange: "45€ - 79€", delay: "30min - 1h" },
  { id: "charging", name: "Problème de charge", icon: "⚡", priceRange: "29€ - 59€", delay: "30min - 1h" },
  { id: "camera", name: "Caméra défectueuse", icon: "📷", priceRange: "69€ - 149€", delay: "1h - 3h" },
  { id: "audio", name: "Problème audio/micro", icon: "🔊", priceRange: "39€ - 89€", delay: "30min - 2h" },
  { id: "button", name: "Boutons défaillants", icon: "🔘", priceRange: "35€ - 75€", delay: "45min - 1h30" },
  { id: "water", name: "Dégât des eaux", icon: "💧", priceRange: "49€ - 199€", delay: "2h - 24h" },
  { id: "other", name: "Autre problème", icon: "🔧", priceRange: "Sur devis", delay: "Variable" }
];

const symptoms = {
  screen: ["Écran noir", "Tactile ne répond pas", "Lignes sur l'écran", "Taches colorées", "Vitre cassée"],
  battery: ["Se décharge rapidement", "Ne charge plus", "S'éteint brutalement", "Gonflement visible"],
  charging: ["Ne charge pas du tout", "Charge très lentement", "Connecteur endommagé", "Cable non reconnu"],
  camera: ["Photos floues", "Ne s'ouvre pas", "Erreur caméra", "Flash ne fonctionne pas"],
  audio: ["Pas de son", "Son grésille", "Micro ne fonctionne pas", "Haut-parleur muet"],
  button: ["Bouton home cassé", "Volume ne fonctionne pas", "Bouton power défaillant"],
  water: ["Tombé dans l'eau", "Traces d'humidité", "Fonctionne par intermittence"],
  other: ["Autre symptôme"]
};

const contactModes = [
  { id: "appointment", name: "Rendez-vous en atelier", icon: "🏪", description: "Venez directement dans notre atelier" },
  { id: "shipping", name: "Envoi par colis", icon: "📦", description: "Nous envoyons un kit de retour gratuit" },
  { id: "pickup", name: "Enlèvement à domicile", icon: "🚗", description: "Un coursier récupère votre iPhone" }
];

export default function Reparations() {
  const [step, setStep] = useState(1);
  const [wizardData, setWizardData] = useState<WizardData>({
    model: "",
    issue: "",
    symptoms: [],
    description: "",
    photos: [],
    contactMode: "",
    contact: {
      name: "",
      email: "",
      phone: "",
      address: ""
    }
  });

  const totalSteps = 5;

  const nextStep = () => setStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSymptomChange = (symptom: string, checked: boolean) => {
    setWizardData(prev => ({
      ...prev,
      symptoms: checked 
        ? [...prev.symptoms, symptom]
        : prev.symptoms.filter(s => s !== symptom)
    }));
  };

  const getEstimate = () => {
    const issue = issues.find(i => i.id === wizardData.issue);
    if (!issue) return null;
    return {
      priceRange: issue.priceRange,
      delay: issue.delay
    };
  };

  const canProceedStep = () => {
    switch (step) {
      case 1: return wizardData.model !== "";
      case 2: return wizardData.issue !== "";
      case 3: return wizardData.symptoms.length > 0;
      case 4: return wizardData.contactMode !== "";
      case 5: return wizardData.contact.name && wizardData.contact.email && wizardData.contact.phone;
      default: return false;
    }
  };

  const stepVariants = {
    enter: { opacity: 0, x: 50 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  return (
    <div className="min-h-screen bg-gradient-hero py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-hero">Assistant de Réparation</h1>
            <span className="text-sm text-muted-foreground">
              Étape {step} sur {totalSteps}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <motion.div
              className="bg-primary h-2 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${(step / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <Card className="card-premium">
          <CardContent className="p-8">
            <motion.div
              key={step}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              {/* Step 1: Sélection du modèle */}
              {step === 1 && (
                <div>
                  <h2 className="text-section mb-2">Quel est votre modèle d'iPhone ?</h2>
                  <p className="text-muted-foreground mb-6">Sélectionnez votre modèle pour un devis précis</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {models.map(model => (
                      <motion.button
                        key={model.id}
                        onClick={() => setWizardData(prev => ({ ...prev, model: model.id }))}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          wizardData.model === model.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <img
                          src={model.image}
                          alt={model.name}
                          className="w-16 h-24 mx-auto mb-3 object-contain"
                        />
                        <div className="font-semibold text-sm">{model.name}</div>
                        {model.popular && (
                          <div className="text-xs text-primary mt-1">Populaire</div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Type de problème */}
              {step === 2 && (
                <div>
                  <h2 className="text-section mb-2">Quel est le problème ?</h2>
                  <p className="text-muted-foreground mb-6">Sélectionnez le type de problème principal</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {issues.map(issue => (
                      <motion.button
                        key={issue.id}
                        onClick={() => setWizardData(prev => ({ ...prev, issue: issue.id }))}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          wizardData.issue === issue.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-2xl">{issue.icon}</span>
                          <div className="font-semibold">{issue.name}</div>
                        </div>
                        <div className="text-sm space-y-1 text-muted-foreground">
                          <div>Prix: {issue.priceRange}</div>
                          <div>Délai: {issue.delay}</div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Symptômes détaillés */}
              {step === 3 && wizardData.issue && (
                <div>
                  <h2 className="text-section mb-2">Décrivez les symptômes</h2>
                  <p className="text-muted-foreground mb-6">Cochez tous les symptômes observés</p>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {symptoms[wizardData.issue as keyof typeof symptoms]?.map(symptom => (
                        <div key={symptom} className="flex items-center space-x-2">
                          <Checkbox
                            id={symptom}
                            checked={wizardData.symptoms.includes(symptom)}
                            onCheckedChange={(checked) => 
                              handleSymptomChange(symptom, checked as boolean)
                            }
                          />
                          <label htmlFor={symptom} className="text-sm cursor-pointer">
                            {symptom}
                          </label>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Description détaillée (optionnel)
                      </label>
                      <Textarea
                        value={wizardData.description}
                        onChange={(e) => setWizardData(prev => ({ 
                          ...prev, 
                          description: e.target.value 
                        }))}
                        placeholder="Décrivez plus précisément le problème rencontré..."
                        className="min-h-[100px]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Photos du problème (optionnel)
                      </label>
                      <div className="border-2 border-dashed border-border rounded-xl p-6 text-center">
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Glissez vos photos ici ou cliquez pour parcourir
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Format acceptés: JPG, PNG (max 5MB)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Mode de prise en charge */}
              {step === 4 && (
                <div>
                  <h2 className="text-section mb-2">Comment souhaitez-vous procéder ?</h2>
                  <p className="text-muted-foreground mb-6">Choisissez le mode de prise en charge</p>

                  {getEstimate() && (
                    <Card className="bg-primary/5 border-primary/20 mb-6">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-primary">Estimation indicative</h3>
                            <p className="text-sm text-muted-foreground">
                              Devis précis après diagnostic gratuit
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-lg">{getEstimate()?.priceRange}</div>
                            <div className="text-sm text-muted-foreground">{getEstimate()?.delay}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  <div className="space-y-4">
                    {contactModes.map(mode => (
                      <motion.button
                        key={mode.id}
                        onClick={() => setWizardData(prev => ({ ...prev, contactMode: mode.id }))}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                          wizardData.contactMode === mode.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex items-center space-x-4">
                          <span className="text-3xl">{mode.icon}</span>
                          <div>
                            <div className="font-semibold">{mode.name}</div>
                            <div className="text-sm text-muted-foreground">{mode.description}</div>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 5: Informations de contact */}
              {step === 5 && (
                <div>
                  <h2 className="text-section mb-2">Vos coordonnées</h2>
                  <p className="text-muted-foreground mb-6">Nous vous recontacterons rapidement</p>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Nom complet *</label>
                        <Input
                          value={wizardData.contact.name}
                          onChange={(e) => setWizardData(prev => ({
                            ...prev,
                            contact: { ...prev.contact, name: e.target.value }
                          }))}
                          placeholder="Votre nom et prénom"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Téléphone *</label>
                        <Input
                          type="tel"
                          value={wizardData.contact.phone}
                          onChange={(e) => setWizardData(prev => ({
                            ...prev,
                            contact: { ...prev.contact, phone: e.target.value }
                          }))}
                          placeholder="06 12 34 56 78"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Email *</label>
                      <Input
                        type="email"
                        value={wizardData.contact.email}
                        onChange={(e) => setWizardData(prev => ({
                          ...prev,
                          contact: { ...prev.contact, email: e.target.value }
                        }))}
                        placeholder="votre@email.com"
                      />
                    </div>

                    {wizardData.contactMode === 'pickup' && (
                      <div>
                        <label className="block text-sm font-medium mb-2">Adresse *</label>
                        <Textarea
                          value={wizardData.contact.address}
                          onChange={(e) => setWizardData(prev => ({
                            ...prev,
                            contact: { ...prev.contact, address: e.target.value }
                          }))}
                          placeholder="Votre adresse complète pour l'enlèvement"
                        />
                      </div>
                    )}

                    <Card className="bg-surface">
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2 flex items-center">
                          <CheckCircle className="h-4 w-4 text-primary mr-2" />
                          Récapitulatif de votre demande
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div>Modèle: <span className="font-medium">
                            {models.find(m => m.id === wizardData.model)?.name}
                          </span></div>
                          <div>Problème: <span className="font-medium">
                            {issues.find(i => i.id === wizardData.issue)?.name}
                          </span></div>
                          <div>Prise en charge: <span className="font-medium">
                            {contactModes.find(c => c.id === wizardData.contactMode)?.name}
                          </span></div>
                          {wizardData.symptoms.length > 0 && (
                            <div>Symptômes: <span className="font-medium">
                              {wizardData.symptoms.join(', ')}
                            </span></div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-border">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={step === 1}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Précédent</span>
              </Button>

              {step < totalSteps ? (
                <Button
                  onClick={nextStep}
                  disabled={!canProceedStep()}
                  className="btn-hero flex items-center space-x-2"
                >
                  <span>Suivant</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    // Simuler la création du ticket
                    const ticketId = `TK${Date.now()}`;
                    window.location.href = `/reparations/confirmation/${ticketId}`;
                  }}
                  disabled={!canProceedStep()}
                  className="btn-hero"
                >
                  Confirmer la demande
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}