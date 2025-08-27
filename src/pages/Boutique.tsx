import { useState, useMemo } from "react";
import { Filter, Grid, List, Search, SlidersHorizontal, Star, ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import products from "@/data/products.json";

interface FilterState {
  categories: string[];
  models: string[];
  quality: string[];
  priceRange: [number, number];
  inStock: boolean;
  search: string;
}

export default function Boutique() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    models: [],
    quality: [],
    priceRange: [0, 500],
    inStock: false,
    search: ''
  });

  // Extraire les données pour les filtres
  const categories = [...new Set(products.map(p => p.category))];
  const models = [...new Set(products.flatMap(p => p.compatibility || []))];
  const qualities = [...new Set(products.map(p => p.attributes?.quality).filter(Boolean))];

  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filtrer par recherche
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm) ||
        p.compatibility?.some(c => c.toLowerCase().includes(searchTerm))
      );
    }

    // Filtrer par catégories
    if (filters.categories.length > 0) {
      filtered = filtered.filter(p => filters.categories.includes(p.category));
    }

    // Filtrer par modèles compatibles
    if (filters.models.length > 0) {
      filtered = filtered.filter(p => 
        p.compatibility?.some(c => filters.models.includes(c))
      );
    }

    // Filtrer par qualité
    if (filters.quality.length > 0) {
      filtered = filtered.filter(p => 
        p.attributes?.quality && filters.quality.includes(p.attributes.quality)
      );
    }

    // Filtrer par prix
    filtered = filtered.filter(p => 
      p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    // Filtrer par stock
    if (filters.inStock) {
      filtered = filtered.filter(p => p.stock > 0);
    }

    // Trier
    switch (sortBy) {
      case 'price-asc':
        return filtered.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return filtered.sort((a, b) => b.price - a.price);
      case 'rating':
        return filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'name':
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return filtered;
    }
  }, [products, filters, sortBy]);

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayFilter = (key: 'categories' | 'models' | 'quality', value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(v => v !== value)
        : [...prev[key], value]
    }));
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      models: [],
      quality: [],
      priceRange: [0, 500],
      inStock: false,
      search: ''
    });
  };

  const activeFiltersCount = filters.categories.length + filters.models.length + 
                           filters.quality.length + (filters.inStock ? 1 : 0);

  const ProductCard = ({ product }: { product: typeof products[0] }) => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className={`card-premium card-hover ${viewMode === 'list' ? 'flex' : ''}`}
    >
      <div className={viewMode === 'list' ? 'flex-shrink-0 w-32' : 'aspect-square'}>
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover rounded-t-2xl"
        />
      </div>
      
      <CardContent className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Compatibilité: {product.compatibility?.join(', ')}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {product.rating && (
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{product.rating}</span>
                <span className="text-xs text-muted-foreground">
                  ({product.reviewCount})
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-1">
            {product.tags?.includes('bestseller') && (
              <Badge variant="secondary" className="text-xs">Bestseller</Badge>
            )}
            {product.attributes?.quality && (
              <Badge variant="outline" className="text-xs">{product.attributes.quality}</Badge>
            )}
            {product.stock > 0 ? (
              <Badge className="text-xs bg-green-100 text-green-800">En stock</Badge>
            ) : (
              <Badge variant="destructive" className="text-xs">Rupture</Badge>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="font-bold text-xl">{product.price}€</div>
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="text-sm text-muted-foreground line-through">
                  {product.originalPrice}€
                </div>
              )}
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" size="icon">
                <Eye className="h-4 w-4" />
              </Button>
              <Button size="icon" disabled={product.stock === 0}>
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </motion.div>
  );

  const FilterSidebar = ({ mobile = false }) => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3">Recherche</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un produit..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold mb-3">Catégories</h3>
        <div className="space-y-2">
          {categories.map(category => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={category}
                checked={filters.categories.includes(category)}
                onCheckedChange={() => toggleArrayFilter('categories', category)}
              />
              <label htmlFor={category} className="text-sm cursor-pointer capitalize">
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold mb-3">Modèles compatibles</h3>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {models.map(model => (
            <div key={model} className="flex items-center space-x-2">
              <Checkbox
                id={model}
                checked={filters.models.includes(model)}
                onCheckedChange={() => toggleArrayFilter('models', model)}
              />
              <label htmlFor={model} className="text-sm cursor-pointer">
                {model}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold mb-3">Qualité</h3>
        <div className="space-y-2">
          {qualities.map(quality => (
            <div key={quality} className="flex items-center space-x-2">
              <Checkbox
                id={quality}
                checked={filters.quality.includes(quality)}
                onCheckedChange={() => toggleArrayFilter('quality', quality)}
              />
              <label htmlFor={quality} className="text-sm cursor-pointer">
                {quality}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="inStock"
            checked={filters.inStock}
            onCheckedChange={(checked) => updateFilter('inStock', checked)}
          />
          <label htmlFor="inStock" className="text-sm cursor-pointer">
            En stock uniquement
          </label>
        </div>
      </div>

      {activeFiltersCount > 0 && (
        <>
          <Separator />
          <Button variant="outline" onClick={clearFilters} className="w-full">
            Effacer les filtres ({activeFiltersCount})
          </Button>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-surface py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-hero mb-4">Boutique</h1>
          <p className="text-lg text-muted-foreground">
            Pièces détachées et accessoires pour iPhone
          </p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Desktop */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <Card className="card-premium">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold">Filtres</h2>
                  <Filter className="h-4 w-4" />
                </div>
                <FilterSidebar />
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div className="flex items-center space-x-4">
                {/* Mobile Filter Button */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden">
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Filtres
                      {activeFiltersCount > 0 && (
                        <Badge variant="destructive" className="ml-2 text-xs">
                          {activeFiltersCount}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <SheetHeader>
                      <SheetTitle>Filtres</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterSidebar mobile />
                    </div>
                  </SheetContent>
                </Sheet>

                <span className="text-sm text-muted-foreground">
                  {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''}
                </span>
              </div>

              <div className="flex items-center space-x-4">
                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Pertinence</SelectItem>
                    <SelectItem value="price-asc">Prix croissant</SelectItem>
                    <SelectItem value="price-desc">Prix décroissant</SelectItem>
                    <SelectItem value="rating">Mieux notés</SelectItem>
                    <SelectItem value="name">Nom A-Z</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Mode */}
                <div className="flex border border-border rounded-lg p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                    className="h-8 w-8"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                    className="h-8 w-8"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <motion.div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'space-y-4'
              }
              layout
            >
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">Aucun produit trouvé</h3>
                <p className="text-muted-foreground mb-4">
                  Essayez de modifier vos filtres ou votre recherche
                </p>
                <Button onClick={clearFilters}>
                  Effacer tous les filtres
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}