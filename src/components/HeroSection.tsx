import React from 'react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

// Image de la statue des Amazones
import AmazonStatue from '@/assets/images/amazone-statue.jpg';

const HeroSection = () => {
  return (
    <div 
      className="relative bg-cover bg-center bg-no-repeat min-h-[600px] flex items-center justify-center text-white"
      style={{ 
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${AmazonStatue})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
          Découvrez le Bénin
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-200">
          Un voyage au cœur de la culture, de l'histoire et des traditions d'un pays riche et fascinant
        </p>
        <div className="flex justify-center space-x-4">
          <Link to="/quiz">
            <Button 
              variant="default" 
              className="bg-benin-green hover:bg-benin-green/90 text-white px-8 py-3 text-lg"
            >
              Commencer le Quiz
            </Button>
          </Link>
          <Link to="/map">
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white/10 px-8 py-3 text-lg"
            >
              Explorer la Carte
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
