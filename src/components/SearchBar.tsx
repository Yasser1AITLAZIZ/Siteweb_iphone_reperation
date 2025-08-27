import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import products from "@/data/products.json";
import faq from "@/data/faq.json";

interface SearchResult {
  id: string;
  type: 'product' | 'service' | 'faq';
  title: string;
  description: string;
  url: string;
  category?: string;
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  // Services de réparation mockés
  const services = [
    { id: "repair-screen", title: "Réparation écran iPhone", description: "Remplacement d'écran cassé", url: "/reparations?service=screen" },
    { id: "repair-battery", title: "Remplacement batterie", description: "Batterie qui ne tient plus", url: "/reparations?service=battery" },
    { id: "repair-charging", title: "Réparation connecteur", description: "Problème de charge", url: "/reparations?service=charging" }
  ];

  const fuzzySearch = (searchTerm: string) => {
    if (!searchTerm || searchTerm.length < 2) {
      setResults([]);
      return;
    }

    const term = searchTerm.toLowerCase();
    const searchResults: SearchResult[] = [];

    // Recherche dans les produits
    products.forEach(product => {
      const score = calculateScore(term, product.name.toLowerCase()) +
                   calculateScore(term, product.description.toLowerCase()) +
                   (product.compatibility?.some(c => c.toLowerCase().includes(term)) ? 0.5 : 0);
      
      if (score > 0.3) {
        searchResults.push({
          id: product.id,
          type: 'product',
          title: product.name,
          description: product.description,
          url: `/produit/${product.slug}`,
          category: product.category
        });
      }
    });

    // Recherche dans les services
    services.forEach(service => {
      const score = calculateScore(term, service.title.toLowerCase()) +
                   calculateScore(term, service.description.toLowerCase());
      
      if (score > 0.3) {
        searchResults.push({
          id: service.id,
          type: 'service',
          title: service.title,
          description: service.description,
          url: service.url
        });
      }
    });

    // Recherche dans la FAQ
    faq.forEach(item => {
      const score = calculateScore(term, item.question.toLowerCase()) +
                   calculateScore(term, item.answer.toLowerCase());
      
      if (score > 0.3) {
        searchResults.push({
          id: item.id,
          type: 'faq',
          title: item.question,
          description: item.answer.substring(0, 100) + "...",
          url: `/faq#${item.id}`,
          category: item.category
        });
      }
    });

    // Trier par pertinence et limiter les résultats
    const sortedResults = searchResults
      .sort((a, b) => {
        const scoreA = calculateScore(term, a.title.toLowerCase());
        const scoreB = calculateScore(term, b.title.toLowerCase());
        return scoreB - scoreA;
      })
      .slice(0, 8);

    setResults(sortedResults);
  };

  const calculateScore = (searchTerm: string, text: string): number => {
    if (text.includes(searchTerm)) return 1;
    
    const words = searchTerm.split(' ');
    let score = 0;
    words.forEach(word => {
      if (text.includes(word)) score += 0.5 / words.length;
    });
    
    return score;
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
    setFocusedIndex(-1);
    fuzzySearch(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex(prev => prev < results.length - 1 ? prev + 1 : prev);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter' && focusedIndex >= 0) {
      e.preventDefault();
      window.location.href = results[focusedIndex].url;
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'product': return '🛍️';
      case 'service': return '🔧';
      case 'faq': return '❓';
      default: return '📄';
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('[data-search-container]')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="relative" data-search-container>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Rechercher un produit, service ou question..."
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-10 py-2 rounded-xl border-border/50 focus:border-primary"
          aria-label="Barre de recherche"
          aria-expanded={isOpen && results.length > 0}
          aria-haspopup="listbox"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setQuery("");
              setResults([]);
              setFocusedIndex(-1);
            }}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
            aria-label="Effacer la recherche"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden"
            role="listbox"
          >
            {results.map((result, index) => (
              <motion.a
                key={result.id}
                href={result.url}
                className={`block px-4 py-3 hover:bg-surface transition-colors border-b border-border/50 last:border-b-0 ${
                  focusedIndex === index ? 'bg-surface' : ''
                }`}
                role="option"
                aria-selected={focusedIndex === index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.1, delay: index * 0.02 }}
              >
                <div className="flex items-start space-x-3">
                  <span className="text-lg flex-shrink-0 mt-0.5">
                    {getTypeIcon(result.type)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-foreground truncate">
                      {result.title}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {result.description}
                    </div>
                    {result.category && (
                      <div className="text-xs text-primary mt-1 capitalize">
                        {result.category}
                      </div>
                    )}
                  </div>
                </div>
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}