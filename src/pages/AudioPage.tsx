
import { useEffect, useState } from 'react';
import { supabase } from '@/services/supabase-client';
import Layout from '@/components/Layout';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, 
  Download, Info, Music, Clock, Disc3, X
} from 'lucide-react';

// Fonction utilitaire pour traiter les URLs d'images
const getImageUrl = (url: string | null) => {
  return url || "/images/audio/placeholder.jpg";
};

const AudioPage = () => {
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [trackDetails, setTrackDetails] = useState<string | null>(null);
  const [audioTracks, setAudioTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Déplacer ces déclarations avant le useEffect
  const categories = Array.from(new Set(audioTracks.map(track => track.category)));
  const filteredTracks = selectedCategory 
    ? audioTracks.filter(track => track.category === selectedCategory) 
    : audioTracks;
  const currentTrackData = audioTracks.find(track => track.id === currentTrack);
  const detailsTrackData = audioTracks.find(track => track.id === trackDetails);

  useEffect(() => {
    fetchAudioTracks();
  }, []);

  useEffect(() => {
    if (currentTrack && currentTrackData) {
      // Si un audio existe déjà, on le nettoie
      if (audioRef) {
        audioRef.pause();
        audioRef.remove();
      }
  
      const audio = new Audio(currentTrackData.audio_url);
      audio.volume = volume / 100;
      audio.muted = isMuted;
      
      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime);
      });
      
      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration);
      });
      
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        setCurrentTime(0);
      });
      
      setAudioRef(audio);
      
      if (isPlaying) {
        audio.play().catch(error => {
          console.error('Erreur lors de la lecture:', error);
          setIsPlaying(false);
        });
      }
      
      return () => {
        audio.pause();
        audio.remove();
      };
    }
  }, [currentTrack, currentTrackData]);

  // Effet séparé pour la gestion du volume et de la lecture
  useEffect(() => {
    if (audioRef) {
      audioRef.volume = volume / 100;
      audioRef.muted = isMuted;
      
      if (isPlaying) {
        audioRef.play().catch(error => {
          console.error('Erreur lors de la lecture:', error);
          setIsPlaying(false);
        });
      } else {
        audioRef.pause();
      }
    }
  }, [volume, isMuted, isPlaying]);

  const handleTimeChange = (value: number[]) => {
    if (audioRef) {
      audioRef.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const fetchAudioTracks = async () => {
    try {
      const { data, error } = await supabase
        .from('music')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAudioTracks(data);
    } catch (error) {
      console.error('Erreur lors du chargement des pistes audio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayPause = (trackId: string) => {
    if (currentTrack === trackId) {
      // Si on clique sur la même piste, on met en pause/reprend la lecture
      setIsPlaying(!isPlaying);
    } else {
      // Si on change de piste
      if (audioRef) {
        // On arrête complètement la lecture en cours
        audioRef.pause();
        audioRef.currentTime = 0;
        audioRef.remove(); // On supprime l'élément audio précédent
        setAudioRef(null); // On réinitialise la référence
      }
      // On change de piste et on démarre la lecture
      setCurrentTrack(trackId);
      setIsPlaying(true);
      setCurrentTime(0); // On réinitialise le temps de lecture
    }
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold font-title mb-6">Bibliothèque Audio Béninoise</h1>
            <p className="text-lg text-gray-600">
              Immergez-vous dans les sons et musiques traditionnelles du Bénin, des percussions aux chants rituels.
            </p>
          </div>
          
          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              className={selectedCategory === null ? "bg-benin-red hover:bg-benin-red/90" : ""}
              onClick={() => setSelectedCategory(null)}
            >
              Tous
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className={selectedCategory === category ? "bg-benin-red hover:bg-benin-red/90" : ""}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
          
          {/* Audio tracks list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {filteredTracks.map(track => (
              <div key={track.id} className="benin-card flex overflow-hidden group">
                <div className="w-1/3 relative overflow-hidden">
                  {/* Dans la liste des pistes audio */}
                  <img 
                    src={getImageUrl(track.image_url)}
                    alt={track.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                    onError={(e) => {
                      e.currentTarget.src = "/images/audio/placeholder.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <button 
                      onClick={() => handlePlayPause(track.id)}
                      className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center transition-transform hover:scale-110"
                    >
                      {isPlaying && currentTrack === track.id ? (
                        <Pause className="text-benin-red" size={24} />
                      ) : (
                        <Play className="text-benin-red ml-1" size={24} />
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="w-2/3 p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="font-semibold">{track.title}</h3>
                        <p className="text-gray-500 text-sm">{track.artist}</p>
                      </div>
                      <span className="bg-benin-red/10 text-benin-red text-xs px-2 py-1 rounded-full">
                        {track.category}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2 mt-2">
                      {track.description.substring(0, 100)}...
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-sm text-gray-500">{track.duration}</span>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 w-8 p-0"
                        onClick={() => setTrackDetails(track.id)}
                      >
                        <Info size={16} />
                      </Button>
                      {/* <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 w-8 p-0"
                      >
                        <Download size={16} />
                      </Button> */}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Fixed audio player */}
          {currentTrack && (
            <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 py-3 px-4 z-30">
              <div className="container mx-auto">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 overflow-hidden rounded bg-gray-100 flex-shrink-0">
                    <img 
                      src={getImageUrl(currentTrackData?.image_url)} 
                      alt={currentTrackData?.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <div>
                        <h4 className="font-medium leading-tight">{currentTrackData?.title}</h4>
                        <p className="text-xs text-gray-500">{currentTrackData?.artist}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button onClick={toggleMute} className="text-gray-500 hover:text-gray-700">
                          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                        </button>
                        <div className="w-20">
                          <Slider
                            value={[isMuted ? 0 : volume]}
                            min={0}
                            max={100}
                            step={1}
                            onValueChange={(value) => {
                              setVolume(value[0]);
                              setIsMuted(value[0] === 0);
                            }}
                            className="h-1"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Slider
                        value={[currentTime]}
                        min={0}
                        max={duration}
                        step={1}
                        onValueChange={handleTimeChange}
                        className="h-1"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" className="w-8 h-8 p-0 rounded-full">
                      <SkipBack size={18} />
                    </Button>
                    <Button 
                      size="sm" 
                      className="w-10 h-10 p-0 rounded-full bg-benin-red hover:bg-benin-red/90"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
                    </Button>
                    <Button size="sm" variant="ghost" className="w-8 h-8 p-0 rounded-full">
                      <SkipForward size={18} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Track details dialog */}
          {trackDetails && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-auto">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-semibold">{detailsTrackData?.title}</h3>
                      <p className="text-benin-red">{detailsTrackData?.artist}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => setTrackDetails(null)}
                    >
                      <X size={20} />
                    </Button>
                  </div>
                  
                  <Tabs defaultValue="info">
                    <TabsList>
                      <TabsTrigger value="info">Information</TabsTrigger>
                      {/* <TabsTrigger value="lyrics">Contexte</TabsTrigger> */}
                    </TabsList>
                    
                    <TabsContent value="info" className="mt-4">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-1/3 aspect-square overflow-hidden rounded-lg">
                          <img 
                            src={getImageUrl(detailsTrackData?.image_url)} 
                            alt={detailsTrackData?.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="w-2/3 space-y-3">
                          <div className="flex items-center gap-2">
                            <Music size={16} className="text-benin-red" />
                            <span className="text-sm text-gray-600">
                              {detailsTrackData?.category || "Catégorie non spécifiée"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock size={16} className="text-benin-red" />
                            <span className="text-sm text-gray-600">
                              {detailsTrackData?.duration || "Durée non spécifiée"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Disc3 size={16} className="text-benin-red" />
                            <span className="text-sm text-gray-600">
                              {detailsTrackData?.region ? `Région: ${detailsTrackData.region}` : "Région non spécifiée"}
                            </span>
                          </div>
                          {/* <Button 
                            size="sm" 
                            className="bg-benin-red hover:bg-benin-red/90 flex items-center gap-2 mt-2"
                            onClick={() => window.open(detailsTrackData.audio_url, '_blank')}
                          >
                            <Download size={16} />
                            Télécharger
                          </Button> */}
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-gray-100">
                        <h4 className="font-medium mb-2">Description</h4>
                        <p className="text-gray-600">
                          {detailsTrackData?.description || "Aucune description disponible"}
                        </p>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="lyrics" className="mt-4">
                      {detailsTrackData?.context ? (
                        <>
                          <p className="text-gray-600 italic">
                            {detailsTrackData.context.introduction || "Informations contextuelles sur cette pièce musicale traditionnelle."}
                          </p>
                          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-medium mb-2">Contexte culturel</h4>
                            <p className="text-gray-600 mb-3">
                              {detailsTrackData.context.cultural_context || 
                               `Cette pièce musicale traditionnelle est souvent jouée lors de cérémonies importantes dans la région ${detailsTrackData?.region || 'du Bénin'}.`}
                            </p>
                            <p className="text-gray-600">
                              {detailsTrackData.context.significance || 
                               "Elle représente un élément important du patrimoine immatériel du Bénin, transmis de génération en génération pour préserver les connaissances culturelles et spirituelles de la communauté."}
                            </p>
                          </div>
                        </>
                      ) : (
                        <p className="text-gray-600 italic">
                          Informations contextuelles non disponibles pour cette pièce musicale.
                        </p>
                      )}
                    </TabsContent>
                  </Tabs>
                  
                  <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
                    <Button 
                      onClick={() => setTrackDetails(null)} 
                      variant="outline"
                    >
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

export default AudioPage;