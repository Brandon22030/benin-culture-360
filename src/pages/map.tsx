import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useToast } from "@/hooks/use-toast";

// Définir la clé d'API Mapbox
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || "";

// Coordonnées du Bénin
const BENIN_BOUNDS = {
  north: 12.4183,
  south: 6.225,
  east: 3.8517,
  west: 0.7743,
};

const BENIN_CENTER = {
  lng: 2.3158,
  lat: 9.3217,
};

export default function MapPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [zoom] = useState(7);
  const { toast } = useToast();

  useEffect(() => {
    if (!mapboxgl.accessToken) {
      toast({
        title: "Erreur de configuration",
        description: "La clé d'API Mapbox n'est pas configurée",
        variant: "destructive",
        className: "bg-red-50 text-red-900 border-red-200",
      });
      return;
    }

    if (map.current || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [BENIN_CENTER.lng, BENIN_CENTER.lat],
      zoom: zoom,
      maxBounds: [
        [BENIN_BOUNDS.west, BENIN_BOUNDS.south],
        [BENIN_BOUNDS.east, BENIN_BOUNDS.north],
      ],
    });

    // Ajouter les contrôles de navigation
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
    map.current.addControl(new mapboxgl.FullscreenControl());
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showUserHeading: true,
      }),
    );

    // Ajouter une échelle
    map.current.addControl(
      new mapboxgl.ScaleControl({
        maxWidth: 100,
        unit: "metric",
      }),
    );

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [toast]);

  return (
    <div className="relative w-full h-[calc(100vh-4rem)]">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}
