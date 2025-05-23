import { useState, useEffect } from "react";
import { supabase } from "@/services/supabase";
import type { Database } from "@/types/database.types";

type Gallery = Database["public"]["Tables"]["galleries"]["Row"];
import { Link } from "react-router-dom";
import {
  MapPin,
  Image,
  Music,
  BookOpen,
  Users,
  ChevronRight,
  MapPinned,
} from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { regions, galleryItems, audioTracks } from "@/data/culturalData";

const Index = () => {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [isLoadingGalleries, setIsLoadingGalleries] = useState(true);
  const [musics, setMusics] = useState<any[]>([]);
  const [isLoadingMusics, setIsLoadingMusics] = useState(true);

  // Animation effect on load
  useEffect(() => {
    const elements = document.querySelectorAll(".animate-on-scroll");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  // Load galleries
  useEffect(() => {
    const loadGalleries = async () => {
      try {
        const { data, error } = await supabase
          .from("galleries")
          .select("*")
          .limit(3)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setGalleries(data || []);
      } catch (error) {
        console.error("Erreur lors du chargement des galeries:", error);
      } finally {
        setIsLoadingGalleries(false);
      }
    };

    loadGalleries();
  }, []);

  // Load musics
  useEffect(() => {
    const loadMusics = async () => {
      try {
        const { data, error } = await supabase
          .from("music")
          .select("*")
          .limit(2)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setMusics(data || []);
      } catch (error) {
        console.error("Erreur lors du chargement des musiques:", error);
      } finally {
        setIsLoadingMusics(false);
      }
    };

    loadMusics();
  }, []);

  // Featured items
  const featuredRegion = regions[0];
  const featuredGalleryItems = galleryItems.slice(0, 3);
  const featuredAudioTracks = audioTracks.slice(0, 2);

  return (
    <Layout>
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(/images/amazone.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="hero-pattern absolute inset-0 opacity-5"></div>
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-3xl">
            <div className="flex space-x-2 items-center mb-6">
              <div className="w-3 h-10 bg-benin-green"></div>
              <div className="w-3 h-10 bg-benin-yellow"></div>
              <div className="w-3 h-10 bg-benin-red"></div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-title mb-6 leading-tight">
              Découvrez la Richesse Culturelle du Bénin
            </h1>
            <p className="text-xl md:text-2xl mb-8 font-light max-w-2xl">
              Une immersion interactive au cœur des traditions, de l'art, de la
              musique et du patrimoine de la perle de l'Afrique de l'Ouest.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/quiz" className="w-full sm:w-auto">
                <Button
                  variant="default"
                  className="bg-benin-yellow hover:bg-benin-yellow/90 text-black font-semibold px-8 py-6 text-lg rounded-md w-full"
                >
                  Commencer le Quiz
                </Button>
              </Link>
              <Link to="/map" className="w-full sm:w-auto">
                <Button
                  variant="default"
                  className="text-white bg-benin-green hover:bg-benin-green/90 px-8 py-6 text-lg w-full"
                >
                  Explorer la Carte
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-title mb-4">
              Explorez le Bénin à Votre Façon
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Plongez dans la diversité culturelle du Bénin à travers nos
              fonctionnalités interactives
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Link
              to="/map"
              className="benin-card group p-6 flex flex-col items-center text-center hover:translate-y-[-5px]"
            >
              <div className="w-16 h-16 bg-benin-green/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-benin-green/20 transition-colors">
                <MapPin className="w-8 h-8 text-benin-green" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Carte Interactive</h3>
              <p className="text-gray-600">
                Explorez les régions du Bénin et découvrez leurs spécificités
                culturelles uniques
              </p>
            </Link>

            <Link
              to="/gallery"
              className="benin-card group p-6 flex flex-col items-center text-center hover:translate-y-[-5px]"
            >
              <div className="w-16 h-16 bg-benin-yellow/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-benin-yellow/20 transition-colors">
                <Image className="w-8 h-8 text-benin-yellow" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Galerie Multimédia</h3>
              <p className="text-gray-600">
                Parcourez notre collection de photos et vidéos des trésors
                culturels béninois
              </p>
            </Link>

            <Link
              to="/audio"
              className="benin-card group p-6 flex flex-col items-center text-center hover:translate-y-[-5px]"
            >
              <div className="w-16 h-16 bg-benin-red/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-benin-red/20 transition-colors">
                <Music className="w-8 h-8 text-benin-red" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Bibliothèque Audio</h3>
              <p className="text-gray-600">
                Écoutez les sons traditionnels, la musique et les récits oraux
                du Bénin
              </p>
            </Link>

            <Link
              to="/quiz"
              className="benin-card group p-6 flex flex-col items-center text-center hover:translate-y-[-5px]"
            >
              <div className="w-16 h-16 bg-benin-green/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-benin-green/20 transition-colors">
                <BookOpen className="w-8 h-8 text-benin-green" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quiz Culturel</h3>
              <p className="text-gray-600">
                Testez vos connaissances sur la culture béninoise avec nos quiz
                interactifs
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Region Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 animate-on-scroll">
              <div className="aspect-video overflow-hidden rounded-xl shadow-lg relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
                <img
                  src="/images/regions/placeholder.jpg"
                  alt={featuredRegion.name}
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                />
                <div className="absolute bottom-4 left-4 z-20 text-white">
                  <div className="flex space-x-1 items-center mb-2">
                    <div className="w-1 h-4 bg-benin-green"></div>
                    <div className="w-1 h-4 bg-benin-yellow"></div>
                    <div className="w-1 h-4 bg-benin-red"></div>
                  </div>
                  <h3 className="text-xl font-semibold">
                    {featuredRegion.name}
                  </h3>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 animate-on-scroll">
              <h2 className="text-3xl md:text-4xl font-bold font-title mb-4">
                Régions Culturelles du Bénin
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Le Bénin, bien que petit par sa taille, possède une diversité
                culturelle immense à travers ses différentes régions. Chaque
                région conserve ses traditions, son artisanat et ses expressions
                culturelles uniques.
              </p>
              <p className="text-gray-600 mb-8">
                Explorez la carte interactive pour découvrir les spécificités
                culturelles de chaque région, des cérémonies vodun de
                l'Atlantique aux Tata Somba de l'Atacora, en passant par les
                palais royaux de l'ancienne Dahomey.
              </p>
              <Link to="/map">
                <Button className="bg-benin-green hover:bg-benin-green/90 text-white flex items-center gap-2">
                  <MapPinned size={18} />
                  Explorer la carte
                  <ChevronRight size={16} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Preview Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold font-title mb-4">
              Notre Galerie Culturelle
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explorez notre collection d'images illustrant la richesse du
              patrimoine culturel béninois
            </p>
          </div>

          {isLoadingGalleries ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-benin-green"></div>
            </div>
          ) : galleries.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                Aucune galerie disponible pour le moment.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {galleries.map((gallery) => (
                <div
                  key={gallery.id}
                  className="benin-card group overflow-hidden animate-on-scroll"
                >
                  <div className="relative overflow-hidden aspect-[4/3]">
                    <img
                      src={
                        gallery.image_url || "/images/gallery/placeholder.jpg"
                      }
                      alt={gallery.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                    />
                    {gallery.category && (
                      <div className="absolute top-3 right-3 bg-white/80 text-benin-green text-xs font-semibold px-2 py-1 rounded">
                        {gallery.category}
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">
                      {gallery.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {gallery.description?.substring(0, 100)}...
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {new Date(gallery.created_at).toLocaleDateString(
                          "fr-FR",
                        )}
                      </span>
                      {/* <Link
                        to={`/gallery/${gallery.id}`}
                        className="text-benin-green hover:text-benin-green/80 text-sm font-medium flex items-center gap-1"
                      >
                        <span>Voir plus</span>
                        <ChevronRight size={16} />
                      </Link> */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center">
            <Link to="/gallery">
              <Button
                variant="outline"
                className="border-benin-green text-benin-green hover:text-benin-green hover:bg-benin-green/5"
              >
                Voir toute la galerie
                <ChevronRight size={16} className="ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Audio Preview Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-10">
            <h2 className="text-3xl md:text-4xl font-bold font-title mb-4">
              Écoutez le Bénin
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl">
              Découvrez les sons et musiques traditionnels qui font partie
              intégrante de la culture béninoise
            </p>
          </div>

          {isLoadingMusics ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-benin-green"></div>
            </div>
          ) : musics.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                Aucune musique disponible pour le moment.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              {musics.map((music) => (
                <div
                  key={music.id}
                  className="benin-card flex flex-col md:flex-row overflow-hidden animate-on-scroll"
                >
                  <div className="md:w-1/3 overflow-hidden">
                    <img
                      src={music.image_url || "/images/audio/placeholder.jpg"}
                      alt={music.title}
                      className="w-full h-full object-cover md:object-center"
                    />
                  </div>
                  <div className="md:w-2/3 p-6">
                    <div className="flex items-center mb-2">
                      <div className="w-10 h-10 rounded-full bg-benin-red/10 flex items-center justify-center mr-3">
                        <Music size={20} className="text-benin-red" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-benin-red">
                          {music.category}
                        </span>
                        <h3 className="font-semibold">{music.title}</h3>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      {music.description?.substring(0, 100)}...
                    </p>
                    <div className="flex justify-between items-center">
                      <audio controls className="w-full h-8">
                        <source src={music.audio_url} type="audio/mpeg" />
                        Votre navigateur ne supporte pas la lecture audio.
                      </audio>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center">
            <Link to="/audio">
              <Button
                variant="outline"
                className="border-benin-red text-benin-red hover:text-benin-red hover:bg-benin-red/5"
              >
                Explorer la bibliothèque audio
                <ChevronRight size={16} className="ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-benin-green text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-title mb-4">
            Participez à la Préservation Culturelle
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Aidez-nous à enrichir cette base de connaissances culturelles en
            partageant votre savoir, vos photos et vos histoires.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contribute">
              <Button className="bg-white hover:bg-white/90 text-benin-green font-semibold px-6 py-5 text-lg rounded-md w-full sm:w-auto">
                <Users size={18} className="mr-2" />
              </Button>
            </Link>
            <Link to="/about">
              <Button className="border-white hover:bg-white/10 text-black hover:text-white font-semibold px-6 py-5 text-lg rounded-md w-full sm:w-auto">
                En savoir plus
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
