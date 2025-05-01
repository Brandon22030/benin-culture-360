import { useState, useEffect, useRef } from "react";
import Layout from "@/components/Layout";
import { regions, CulturalElement } from "@/data/culturalData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Info, X } from "lucide-react";
import { Loader } from "@googlemaps/js-api-loader";
import { useToast } from "@/hooks/use-toast";

// Coordonnées du Bénin
const BENIN_BOUNDS = {
  north: 12.4183,
  south: 6.225,
  east: 3.8517,
  west: 0.7743,
};

const BENIN_CENTER = {
  lat: 9.3217,
  lng: 2.3158,
};

// Chargeur Google Maps
const loader = new Loader({
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  version: "weekly",
  libraries: ["places"],
});

const MapPage = () => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] =
    useState<CulturalElement | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const markers = useRef<{ [key: string]: google.maps.Marker }>({});
  const [zoom] = useState(7);
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleRegionClick = (regionId: string) => {
    // Réinitialiser la couleur de tous les marqueurs
    Object.values(markers.current).forEach((marker) => {
      marker.setIcon({
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: "#16A34A",
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 2,
        scale: 8,
      });
    });

    // Mettre à jour la couleur du marqueur sélectionné
    if (markers.current[regionId]) {
      markers.current[regionId].setIcon({
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: "#047857",
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 2,
        scale: 8,
      });

      // Centrer la carte sur le marqueur sélectionné
      if (map.current) {
        map.current.panTo(markers.current[regionId].getPosition()!);
        map.current.setZoom(9);
      }
    }

    setSelectedRegion(regionId);
    setSelectedElement(null); // Reset selected element when region changes
  };

  const handleElementClick = (element: CulturalElement) => {
    setSelectedElement(element);
  };

  const closeElementDetails = () => {
    setSelectedElement(null);
  };

  useEffect(() => {
    if (!import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
      toast({
        title: "Erreur de configuration",
        description: "La clé d'API Google Maps n'est pas configurée",
        variant: "destructive",
        className: "bg-red-50 text-red-900 border-red-200",
      });
      return;
    }

    if (map.current || !mapContainer.current) return;

    loader
      .load()
      .then(() => {
        map.current = new google.maps.Map(mapContainer.current!, {
          center: BENIN_CENTER,
          zoom: zoom,
          restriction: {
            latLngBounds: {
              north: BENIN_BOUNDS.north,
              south: BENIN_BOUNDS.south,
              east: BENIN_BOUNDS.east,
              west: BENIN_BOUNDS.west,
            },
            strictBounds: true,
          },
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
          zoomControl: true,
          scaleControl: true,
        });

        // Ajouter les marqueurs pour chaque région
        regions.forEach((region) => {
          if (region.coordinates) {
            const marker = new google.maps.Marker({
              position: {
                lat: region.coordinates.lat,
                lng: region.coordinates.lng,
              },
              map: map.current,
              title: region.name,
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: selectedRegion === region.id ? "#047857" : "#16A34A",
                fillOpacity: 1,
                strokeColor: "#ffffff",
                strokeWeight: 2,
                scale: 8,
              },
            });

            // Stocker le marqueur dans la référence
            markers.current[region.id] = marker;

            // Ajouter un écouteur de clic sur le marqueur
            marker.addListener("click", () => {
              handleRegionClick(region.id);
            });
          }
        });
      })
      .catch((error) => {
        console.error("Error loading Google Maps:", error);
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger Google Maps",
          variant: "destructive",
          className: "bg-red-50 text-red-900 border-red-200",
        });
      });

    return () => {
      // Google Maps ne nécessite pas de nettoyage explicite
      map.current = null;
    };
  }, [toast, zoom]);

  const region = regions.find((r) => r.id === selectedRegion);

  return (
    <Layout>
      <div className="bg-gray-50 py-12 md:py-16 relative">
        {/* Overlay de flou si non authentifié */}
        {/* {!isAuthenticated && ( */}
        <div className="absolute inset-0 backdrop-blur-md bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center">
            <h2 className="text-2xl font-bold mb-4">
              Fonctionnalité bientôt disponible
            </h2>
            <p className="text-gray-600 mb-6">
              Nous travaillons actuellement sur cette fonctionnalité pour vous
              offrir une expérience exceptionnelle.
            </p>
          </div>
        </div>
        {/* )} */}

        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold font-title mb-6">
              Carte Culturelle Interactive du Bénin
            </h1>
            <p className="text-lg text-gray-600">
              Explorez les différentes régions du Bénin et découvrez leurs
              spécificités culturelles, traditions et monuments.
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

                {/* Real Mapbox map implementation */}
                <div className="relative border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50 min-h-[400px]">
                  <div ref={mapContainer} className="absolute inset-0" />

                  {/* Map regions (simplified) */}
                  <div className="relative z-10 p-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {regions.map((region) => (
                        <button
                          key={region.id}
                          onClick={() => handleRegionClick(region.id)}
                          className={`p-3 rounded-lg text-left transition-colors ${
                            selectedRegion === region.id
                              ? "bg-benin-green text-white"
                              : "bg-white border border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-start">
                            <MapPin
                              size={18}
                              className={
                                selectedRegion === region.id
                                  ? "text-white"
                                  : "text-benin-green"
                              }
                            />
                            <div className="ml-2">
                              <h3 className="font-medium text-sm">
                                {region.name}
                              </h3>
                              <p
                                className={`text-xs ${
                                  selectedRegion === region.id
                                    ? "text-white/80"
                                    : "text-gray-500"
                                }`}
                              >
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

            {/* Right panel */}
            <div className="lg:col-span-2">
              {region ? (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-xl font-semibold mb-4">{region.name}</h3>
                  <p className="text-gray-600 mb-6">{region.description}</p>

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">
                      Eléments culturels
                    </h4>
                    <div className="space-y-3">
                      {region.culturalElements.map((element) => (
                        <div
                          key={element.id}
                          onClick={() => handleElementClick(element)}
                          className="p-3 border border-gray-100 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">{element.name}</h4>
                              <p className="text-sm text-gray-500 capitalize">
                                {element.type}
                              </p>
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
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    Sélectionnez une région
                  </h3>
                  <p className="text-gray-500 text-center">
                    Cliquez sur une région sur la carte pour afficher ses
                    informations culturelles
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
                      <h3 className="text-2xl font-semibold">
                        {selectedElement.name}
                      </h3>
                      <p className="text-benin-green capitalize">
                        {selectedElement.type}
                      </p>
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
                          <div
                            key={index}
                            className="aspect-[4/3] rounded-lg overflow-hidden"
                          >
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
