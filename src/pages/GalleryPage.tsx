
import { useState } from 'react';
import Layout from '@/components/Layout';
import { galleryItems } from '@/data/culturalData';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter, Search, X } from 'lucide-react';

// Filter categories
const categories = Array.from(new Set(galleryItems.map(item => item.category)));

const GalleryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filter items based on search and category
  const filteredItems = galleryItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const currentItem = galleryItems.find(item => item.id === selectedItem);

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold font-title mb-6">Galerie Culturelle du Bénin</h1>
            <p className="text-lg text-gray-600">
              Découvrez la richesse du patrimoine béninois à travers notre collection d'images mettant en valeur l'art, l'architecture, les festivals et les traditions du pays.
            </p>
          </div>

          {/* Search and filter */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="text"
                  placeholder="Rechercher dans la galerie..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className={`flex items-center gap-2 ${showFilters ? 'bg-benin-green/10 border-benin-green text-benin-green' : ''}`}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter size={18} />
                  Filtres
                </Button>
                {selectedCategory && (
                  <Button 
                    variant="outline" 
                    className="text-benin-green border-benin-green"
                    onClick={() => setSelectedCategory(null)}
                  >
                    {selectedCategory} <X size={16} className="ml-2" />
                  </Button>
                )}
              </div>
            </div>

            {/* Category filters */}
            {showFilters && (
              <div className="mt-4 p-4 bg-white rounded-lg shadow-sm">
                <h3 className="font-medium mb-3">Filtrer par catégorie</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      className={selectedCategory === category ? "bg-benin-green hover:bg-benin-green/90" : ""}
                      onClick={() => setSelectedCategory(prev => prev === category ? null : category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Gallery grid */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map(item => (
                <div 
                  key={item.id} 
                  className="benin-card overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedItem(item.id)}
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img 
                      src={item.imageUrl || "/images/gallery/placeholder.jpg"} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold truncate">{item.title}</h3>
                      <span className="bg-benin-green/10 text-benin-green text-xs px-2 py-1 rounded-full">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucun résultat trouvé</h3>
              <p className="text-gray-500">
                Essayez de modifier vos critères de recherche ou de réinitialiser les filtres.
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory(null);
                }}
              >
                Réinitialiser les filtres
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Item detail modal */}
      <Dialog open={selectedItem !== null} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          {currentItem && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{currentItem.title}</DialogTitle>
                <DialogDescription className="flex items-center gap-2">
                  <span className="bg-benin-green/10 text-benin-green text-xs px-2 py-1 rounded-full">
                    {currentItem.category}
                  </span>
                  <span className="text-sm text-gray-500">{currentItem.date}</span>
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="image">
                <TabsList className="mb-4">
                  <TabsTrigger value="image">Image</TabsTrigger>
                  <TabsTrigger value="details">Détails</TabsTrigger>
                </TabsList>
                
                <TabsContent value="image" className="flex justify-center">
                  <img 
                    src={currentItem.imageUrl || "/images/gallery/placeholder.jpg"} 
                    alt={currentItem.title}
                    className="max-h-[60vh] object-contain rounded-lg" 
                  />
                </TabsContent>
                
                <TabsContent value="details">
                  <div className="space-y-4">
                    <p className="text-gray-600">{currentItem.description}</p>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Informations</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-gray-500">Catégorie:</div>
                        <div>{currentItem.category}</div>
                        <div className="text-gray-500">Date:</div>
                        <div>{currentItem.date}</div>
                        <div className="text-gray-500">Région:</div>
                        <div>{currentItem.regionId}</div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default GalleryPage;
