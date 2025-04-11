
import { useState } from 'react';
import Layout from '@/components/Layout';
import { regions, CulturalElement } from '@/data/culturalData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Info, X } from 'lucide-react';

const MapPage = () => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState<CulturalElement | null>(null);
  
  const handleRegionClick = (regionId: string) => {
    setSelectedRegion(regionId);
    setSelectedElement(null); // Reset selected element when region changes
  };
  
  const handleElementClick = (element: CulturalElement) => {
    setSelectedElement(element);
  };
  
  const closeElementDetails = () => {
    setSelectedElement(null);
  };
  
  const region = regions.find(r => r.id === selectedRegion);
  
  return (
    <Layout>
      <div className="bg-gray-50 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold font-title mb-6">Carte Culturelle Interactive du Bénin</h1>
            <p className="text-lg text-gray-600">
              Explorez les différentes régions du Bénin et découvrez leurs spécificités culturelles, traditions et monuments.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Map visualization - left panel */}
            <div className="lg:col-span-3 bg-white rounded-xl shadow-md overflow-hidden min-h-[500px]">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Régions du Bénin</h2>
                <p className="text-gray-600 text-sm mb-4">
                  Cliquez sur une région pour explorer ses éléments culturels
                </p>
                
                {/* This would be a real map in a full implementation */}
                <div className="relative border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50 min-h-[400px]">
                  {/* Simplified map representation */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-gray-400 italic">Carte interactive du Bénin</p>
                  </div>
                  
                  {/* Map regions (simplified) */}
                  <div className="relative z-10 p-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {regions.map(region => (
                        <button
                          key={region.id}
                          onClick={() => handleRegionClick(region.id)}
                          className={`p-3 rounded-lg text-left transition-colors ${
                            selectedRegion === region.id 
                              ? 'bg-benin-green text-white' 
                              : 'bg-white border border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-start">
                            <MapPin size={18} className={selectedRegion === region.id ? 'text-white' : 'text-benin-green'} />
                            <div className="ml-2">
                              <h3 className="font-medium text-sm">{region.name}</h3>
                              <p className={`text-xs ${selectedRegion === region.id ? 'text-white/80' : 'text-gray-500'}`}>
                                {region.culturalElements.length} éléments
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Region information - right panel */}
            <div className="lg:col-span-2">
              {selectedRegion ? (
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="relative h-40 overflow-hidden">
                    <img 
                      src={region?.image || "/images/regions/placeholder.jpg"} 
                      alt={region?.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h2 className="text-2xl font-semibold">{region?.name}</h2>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <p className="text-gray-600 mb-6">{region?.description}</p>
                    
                    <h3 className="text-lg font-semibold mb-4">Éléments Culturels</h3>
                    
                    <div className="space-y-3">
                      {region?.culturalElements.map(element => (
                        <div 
                          key={element.id}
                          onClick={() => handleElementClick(element)}
                          className="p-3 border border-gray-100 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">{element.name}</h4>
                              <p className="text-sm text-gray-500 capitalize">{element.type}</p>
                            </div>
                            <Info size={18} className="text-benin-green" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center min-h-[400px]">
                  <MapPin size={48} className="text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">Sélectionnez une région</h3>
                  <p className="text-gray-500 text-center">
                    Cliquez sur une région sur la carte pour afficher ses informations culturelles
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Cultural Element Details Modal */}
          {selectedElement && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
              <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-auto">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-semibold">{selectedElement.name}</h3>
                      <p className="text-benin-green capitalize">{selectedElement.type}</p>
                    </div>
                    <button 
                      onClick={closeElementDetails}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={24} />
                    </button>
                  </div>
                  
                  <Tabs defaultValue="description">
                    <TabsList className="mb-4">
                      <TabsTrigger value="description">Description</TabsTrigger>
                      <TabsTrigger value="images">Images</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="description">
                      <p className="text-gray-600">
                        {selectedElement.description}
                      </p>
                    </TabsContent>
                    
                    <TabsContent value="images">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {selectedElement.images.map((image, index) => (
                          <div key={index} className="aspect-[4/3] rounded-lg overflow-hidden">
                            <img 
                              src={image || "/images/placeholder.jpg"} 
                              alt={`${selectedElement.name} - ${index + 1}`} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                  
                  <div className="mt-6 pt-6 border-t border-gray-100 flex justify-end">
                    <Button onClick={closeElementDetails} variant="outline">
                      Fermer
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MapPage;
