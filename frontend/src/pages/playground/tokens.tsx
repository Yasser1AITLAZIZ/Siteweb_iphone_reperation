import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function TokensPlayground() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Design Tokens Playground</h1>
          <p className="text-xl text-muted-foreground">
            Visualisation de la palette de couleurs et des tokens Tailwind
          </p>
        </div>

        <div className="space-y-12">
          {/* Colors */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Palette de couleurs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Primary Colors */}
              <Card>
                <CardHeader>
                  <CardTitle>Primary Colors</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="h-12 bg-primary rounded-lg border"></div>
                    <div className="text-sm">
                      <div className="font-medium">Primary</div>
                      <div className="text-muted-foreground">bg-primary</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-12 bg-primary-foreground rounded-lg border"></div>
                    <div className="text-sm">
                      <div className="font-medium">Primary Foreground</div>
                      <div className="text-muted-foreground">bg-primary-foreground</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-12 bg-primary-hover rounded-lg border"></div>
                    <div className="text-sm">
                      <div className="font-medium">Primary Hover</div>
                      <div className="text-muted-foreground">bg-primary-hover</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Surface Colors */}
              <Card>
                <CardHeader>
                  <CardTitle>Surface Colors</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="h-12 bg-surface rounded-lg border"></div>
                    <div className="text-sm">
                      <div className="font-medium">Surface</div>
                      <div className="text-muted-foreground">bg-surface</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-12 bg-background rounded-lg border"></div>
                    <div className="text-sm">
                      <div className="font-medium">Background</div>
                      <div className="text-muted-foreground">bg-background</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-12 bg-card rounded-lg border"></div>
                    <div className="text-sm">
                      <div className="font-medium">Card</div>
                      <div className="text-muted-foreground">bg-card</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Text Colors */}
              <Card>
                <CardHeader>
                  <CardTitle>Text Colors</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="h-12 bg-foreground rounded-lg border"></div>
                    <div className="text-sm">
                      <div className="font-medium">Foreground</div>
                      <div className="text-muted-foreground">bg-foreground</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-12 bg-muted rounded-lg border"></div>
                    <div className="text-sm">
                      <div className="font-medium">Muted</div>
                      <div className="text-muted-foreground">bg-muted</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-12 bg-muted-foreground rounded-lg border"></div>
                    <div className="text-sm">
                      <div className="font-medium">Muted Foreground</div>
                      <div className="text-muted-foreground">bg-muted-foreground</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Typography */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Typographie</h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h1 className="text-hero">Hero Heading (text-hero)</h1>
                  <div className="text-sm text-muted-foreground">Taille: 3.5rem (56px)</div>
                </div>
                <div>
                  <h2 className="text-section">Section Heading (text-section)</h2>
                  <div className="text-sm text-muted-foreground">Taille: 2.25rem (36px)</div>
                </div>
                <div>
                  <h3 className="text-xl">Large Text (text-xl)</h3>
                  <div className="text-sm text-muted-foreground">Taille: 1.25rem (20px)</div>
                </div>
                <div>
                  <p className="text-base">Base Text (text-base)</p>
                  <div className="text-sm text-muted-foreground">Taille: 1rem (16px)</div>
                </div>
                <div>
                  <p className="text-sm">Small Text (text-sm)</p>
                  <div className="text-sm text-muted-foreground">Taille: 0.875rem (14px)</div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Shadows */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Ombres</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="shadow-sm">
                <CardContent className="p-6 text-center">
                  <div className="text-sm font-medium mb-2">Shadow SM</div>
                  <div className="text-xs text-muted-foreground">shadow-sm</div>
                </CardContent>
              </Card>
              <Card className="shadow-md">
                <CardContent className="p-6 text-center">
                  <div className="text-sm font-medium mb-2">Shadow MD</div>
                  <div className="text-xs text-muted-foreground">shadow-md</div>
                </CardContent>
              </Card>
              <Card className="shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="text-sm font-medium mb-2">Shadow LG</div>
                  <div className="text-xs text-muted-foreground">shadow-lg</div>
                </CardContent>
              </Card>
              <Card className="shadow-xl">
                <CardContent className="p-6 text-center">
                  <div className="text-sm font-medium mb-2">Shadow XL</div>
                  <div className="text-xs text-muted-foreground">shadow-xl</div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Gradients */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Dégradés</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="h-24 bg-gradient-primary rounded-lg mb-3"></div>
                  <div className="text-sm font-medium">Gradient Primary</div>
                  <div className="text-xs text-muted-foreground">bg-gradient-primary</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="h-24 bg-gradient-surface rounded-lg mb-3"></div>
                  <div className="text-sm font-medium">Gradient Surface</div>
                  <div className="text-xs text-muted-foreground">bg-gradient-surface</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="h-24 bg-gradient-hero rounded-lg mb-3"></div>
                  <div className="text-sm font-medium">Gradient Hero</div>
                  <div className="text-xs text-muted-foreground">bg-gradient-hero</div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Animations */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Animations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-primary rounded-lg mx-auto mb-3 animate-fade-in-up"></div>
                  <div className="text-sm font-medium">Fade In Up</div>
                  <div className="text-xs text-muted-foreground">animate-fade-in-up</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-primary rounded-lg mx-auto mb-3 animate-scale-in"></div>
                  <div className="text-sm font-medium">Scale In</div>
                  <div className="text-xs text-muted-foreground">animate-scale-in</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-primary rounded-lg mx-auto mb-3 animate-bounce-gentle"></div>
                  <div className="text-sm font-medium">Bounce Gentle</div>
                  <div className="text-xs text-muted-foreground">animate-bounce-gentle</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-primary rounded-lg mx-auto mb-3 animate-float"></div>
                  <div className="text-sm font-medium">Float</div>
                  <div className="text-xs text-muted-foreground">animate-float</div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Spacing */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Espacement personnalisé</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <div className="h-4 bg-primary rounded w-18"></div>
                    <div className="text-sm font-medium">w-18 (4.5rem)</div>
                    <div className="text-xs text-muted-foreground">72px</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <div className="h-4 bg-primary rounded w-88"></div>
                    <div className="text-sm font-medium">w-88 (22rem)</div>
                    <div className="text-xs text-muted-foreground">352px</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <div className="h-4 bg-primary rounded w-128"></div>
                    <div className="text-sm font-medium">w-128 (32rem)</div>
                    <div className="text-xs text-muted-foreground">512px</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Border Radius */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Rayons de bordure</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-primary rounded-sm mx-auto mb-3"></div>
                  <div className="text-sm font-medium">Rounded SM</div>
                  <div className="text-xs text-muted-foreground">rounded-sm</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-primary rounded mx-auto mb-3"></div>
                  <div className="text-sm font-medium">Rounded</div>
                  <div className="text-xs text-muted-foreground">rounded</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-primary rounded-2xl mx-auto mb-3"></div>
                  <div className="text-sm font-medium">Rounded 2XL</div>
                  <div className="text-xs text-muted-foreground">rounded-2xl</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-primary rounded-3xl mx-auto mb-3"></div>
                  <div className="text-sm font-medium">Rounded 3XL</div>
                  <div className="text-xs text-muted-foreground">rounded-3xl</div>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
} 