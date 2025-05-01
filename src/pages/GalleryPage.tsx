import { useEffect, useState } from "react";
import { supabase } from "@/services/supabase-client";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter, Search, X } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";


const GalleryPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [galleryItems, setGalleryItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  
  // Add this state for featured items
  const [featuredItems, setFeaturedItems] = useState([]);

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      const { data, error } = await supabase
        .from("galleries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setGalleryItems(data);
      // Set the first 3 items as featured items
      setFeaturedItems(data.slice(0, 3));
    } catch (error) {
      console.error("Erreur lors du chargement de la galerie:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredItems = galleryItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory
      ? item.category === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  const currentItem = galleryItems.find((item) => item.id === selectedItem);

  const getImageUrls = (imageUrlArray: any) => {
    try {
      // Si c'est déjà un tableau
      if (Array.isArray(imageUrlArray)) {
        return imageUrlArray.map(url => url.replace(/[\[\]"`\\]/g, '').trim());
      }
      
      // Si c'est une chaîne simple
      if (typeof imageUrlArray === 'string') {
        // Essayer de parser comme JSON si la chaîne commence par [ ou "
        if (imageUrlArray.startsWith('[') || imageUrlArray.startsWith('"')) {
          try {
            const parsed = JSON.parse(imageUrlArray);
            if (Array.isArray(parsed)) {
              return parsed.map(url => url.replace(/[\[\]"`\\]/g, '').trim());
            }
            return [parsed.toString().replace(/[\[\]"`\\]/g, '').trim()];
          } catch {
            // Si le parsing échoue, traiter comme une chaîne simple
            return [imageUrlArray.replace(/[\[\]"`\\]/g, '').trim()];
          }
        }
        return [imageUrlArray.replace(/[\[\]"`\\]/g, '').trim()];
      }
      
      // Cas par défaut
      return ['/images/gallery/placeholder.jpg'];
    } catch (error) {
      console.error('Erreur lors du parsing des URLs:', error);
      return ['/images/gallery/placeholder.jpg'];
    }
  };

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold font-title mb-4">
              Galerie Culturelle du Bénin
            </h1>
            <p className="text-lg text-gray-600">
              Découvrez la richesse du patrimoine béninois à travers notre
              collection d'images mettant en valeur l'art, l'architecture, les
              festivals et les traditions du pays.
            </p>
          </div>

          {/* Featured Carousel */}
          <div className="mb-10 max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4 text-center">
              En vedette
            </h2>
            <Carousel className="w-full">
              <CarouselContent>
                {featuredItems.map((item) => (
                  <CarouselItem key={item.id}>
                    <div className="p-1">
                      <div
                        className="relative aspect-[16/9] overflow-hidden rounded-xl cursor-pointer"
                        onClick={() => setSelectedItem(item.id)}
                      >
                        <img
                          src={getImageUrls(item.image_url)[0]} // Changed from getImageUrl to getImageUrls[0]
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                          <h3 className="text-white text-xl font-semibold">
                            {item.title}
                          </h3>
                          <p className="text-white/80 line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2 bg-white/80" />
              <CarouselNext className="right-2 bg-white/80" />
            </Carousel>
          </div>

          {/* Search and filter */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
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
                  className={`flex items-center gap-2 ${
                    showFilters
                      ? "bg-benin-green/10 border-benin-green text-benin-green"
                      : ""
                  }`}
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
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={
                        selectedCategory === category ? "default" : "outline"
                      }
                      className={
                        selectedCategory === category
                          ? "bg-benin-green hover:bg-benin-green/90"
                          : ""
                      }
                      onClick={() =>
                        setSelectedCategory((prev) =>
                          prev === category ? null : category
                        )
                      }
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
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="benin-card overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedItem(item.id)}
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={getImageUrls(item.image_url)[0]} // Modifié ici : getImageUrl -> getImageUrls[0]
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
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Aucun résultat trouvé
              </h3>
              <p className="text-gray-500">
                Essayez de modifier vos critères de recherche ou de
                réinitialiser les filtres.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchTerm("");
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
      <Dialog
        open={selectedItem !== null}
        onOpenChange={(open) => !open && setSelectedItem(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          {currentItem && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  {currentItem.title}
                </DialogTitle>
                <DialogDescription className="flex items-center gap-2">
                  <span className="bg-benin-green/10 text-benin-green text-xs px-2 py-1 rounded-full">
                    {currentItem.category}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(currentItem.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="image">
                <TabsList className="mb-4">
                  <TabsTrigger value="image">Images</TabsTrigger>
                  <TabsTrigger value="details">Détails</TabsTrigger>
                </TabsList>

                <TabsContent
                  value="image"
                  className="flex flex-col items-center"
                >
                  <div className="w-full">
                    {getImageUrls(currentItem.image_url).map((url, index) => (
                      <div key={index} className="relative aspect-[4/3]">
                        <img
                          src={url}
                          alt={`${currentItem.title} - Image ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                          onClick={() => window.open(url, '_blank')}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center mt-2 text-sm text-gray-500">
                    Cliquez sur l'image pour l'agrandir
                  </div>
                </TabsContent>

                <TabsContent value="details">
                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                      <h4 className="text-xl font-semibold mb-4 text-benin-green">Description</h4>
                      <p className="text-gray-700 leading-relaxed">{currentItem.description}</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                      <h4 className="text-xl font-semibold mb-4 text-benin-green">Informations détaillées</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-benin-green">Catégorie</span>
                          </div>
                          <p className="font-medium">{currentItem.category}</p>
                        </div>
                        
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-benin-green">Date de publication</span>
                          </div>
                          <p className="font-medium">
                            {new Date(currentItem.created_at).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-benin-green">Région</span>
                          </div>
                          <p className="font-medium">{currentItem.region}</p>
                        </div>
                        
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-benin-green">Source</span>
                          </div>
                          <p className="font-medium">{currentItem.source || 'Non spécifiée'}</p>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-benin-green">Crédit</span>
                          </div>
                          <p className="font-medium">{currentItem.credit || 'Non spécifié'}</p>
                        </div>
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
