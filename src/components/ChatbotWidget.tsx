import { useState } from "react";
import { MessageCircle, X, Calculator, HelpCircle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedIssue, setSelectedIssue] = useState("");

  const models = [
    { id: "iphone-15-pro", name: "iPhone 15 Pro" },
    { id: "iphone-15", name: "iPhone 15" },
    { id: "iphone-14-pro", name: "iPhone 14 Pro" },
    { id: "iphone-14", name: "iPhone 14" },
    { id: "iphone-13", name: "iPhone 13" }
  ];

  const issues = [
    { id: "screen", name: "Écran cassé", price: "89€ - 189€", delay: "30min - 2h" },
    { id: "battery", name: "Problème de batterie", price: "45€ - 79€", delay: "30min - 1h" },
    { id: "charging", name: "Problème de charge", price: "29€ - 59€", delay: "30min - 1h" },
    { id: "camera", name: "Caméra défectueuse", price: "69€ - 149€", delay: "1h - 3h" },
    { id: "speaker", name: "Problème audio", price: "39€ - 89€", delay: "30min - 2h" }
  ];

  const getEstimate = () => {
    if (!selectedModel || !selectedIssue) return null;
    const issue = issues.find(i => i.id === selectedIssue);
    return issue ? { price: issue.price, delay: issue.delay } : null;
  };

  const faqItems = [
    { q: "Combien coûte une réparation d'écran ?", a: "Entre 89€ et 189€ selon le modèle d'iPhone" },
    { q: "Combien de temps pour une réparation ?", a: "30 minutes à 3 heures selon la complexité" },
    { q: "Proposez-vous une garantie ?", a: "Oui, 12 mois sur toutes nos réparations" },
    { q: "Puis-je suivre ma réparation ?", a: "Oui, via votre espace client en ligne" }
  ];

  return (
    <>
      {/* Bouton flottant */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, duration: 0.3 }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          size="icon"
          className="h-14 w-14 rounded-full bg-primary hover:bg-primary-hover shadow-lg hover:shadow-xl transition-all duration-300"
          aria-label="Ouvrir l'assistant de réparation"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </motion.div>

      {/* Panel chatbot */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            
            {/* Panel */}
            <motion.div
              className="fixed bottom-6 right-6 w-96 h-[32rem] bg-card border border-border rounded-2xl shadow-xl z-50 overflow-hidden"
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-primary">
                <h3 className="font-semibold text-primary-foreground">Assistant iRepair Pro</h3>
                <Button
                  variant="ghost" 
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-primary-foreground hover:bg-primary-foreground/20 h-8 w-8"
                  aria-label="Fermer"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <Tabs defaultValue="estimation" className="flex-1">
                <TabsList className="grid w-full grid-cols-3 p-1 m-2">
                  <TabsTrigger value="estimation" className="text-xs">
                    <Calculator className="h-3 w-3 mr-1" />
                    Estimation
                  </TabsTrigger>
                  <TabsTrigger value="faq" className="text-xs">
                    <HelpCircle className="h-3 w-3 mr-1" />
                    FAQ
                  </TabsTrigger>
                  <TabsTrigger value="warranty" className="text-xs">
                    <Shield className="h-3 w-3 mr-1" />
                    Garantie
                  </TabsTrigger>
                </TabsList>

                <div className="h-[22rem] overflow-y-auto p-4">
                  <TabsContent value="estimation" className="mt-0 space-y-4">
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Modèle iPhone</label>
                        <Select value={selectedModel} onValueChange={setSelectedModel}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choisir un modèle" />
                          </SelectTrigger>
                          <SelectContent>
                            {models.map(model => (
                              <SelectItem key={model.id} value={model.id}>
                                {model.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Type de problème</label>
                        <Select value={selectedIssue} onValueChange={setSelectedIssue}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choisir un problème" />
                          </SelectTrigger>
                          <SelectContent>
                            {issues.map(issue => (
                              <SelectItem key={issue.id} value={issue.id}>
                                {issue.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {getEstimate() && (
                        <Card className="bg-surface border-primary/20">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm text-primary">Estimation indicative</CardTitle>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Prix :</span>
                                <span className="font-semibold">{getEstimate()?.price}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Délai :</span>
                                <span className="font-semibold">{getEstimate()?.delay}</span>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-3">
                              *Prix indicatif, devis précis après diagnostic
                            </p>
                          </CardContent>
                        </Card>
                      )}

                      <Button 
                        className="w-full btn-hero" 
                        disabled={!selectedModel || !selectedIssue}
                      >
                        Demander un devis
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="faq" className="mt-0">
                    <div className="space-y-3">
                      {faqItems.map((item, index) => (
                        <Card key={index}>
                          <CardContent className="p-4">
                            <h4 className="font-medium text-sm mb-2">{item.q}</h4>
                            <p className="text-xs text-muted-foreground">{item.a}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="warranty" className="mt-0">
                    <div className="space-y-4">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm flex items-center">
                            <Shield className="h-4 w-4 mr-2 text-primary" />
                            Garantie 12 mois
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0 text-sm space-y-3">
                          <div className="space-y-2">
                            <p className="text-muted-foreground">• Pièces et main d'œuvre</p>
                            <p className="text-muted-foreground">• Défauts de fabrication couverts</p>
                            <p className="text-muted-foreground">• Service client dédié</p>
                            <p className="text-muted-foreground">• Réparation ou remplacement gratuit</p>
                          </div>
                          <div className="pt-2 border-t border-border">
                            <p className="text-xs text-muted-foreground">
                              Garantie valable sur présentation de la facture
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}