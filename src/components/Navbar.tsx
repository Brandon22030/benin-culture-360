
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, MapPin, Image, Music, BookOpen, Users, LogIn, UserPlus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import LoginDialog from '@/components/auth/LoginDialog';
import RegisterDialog from '@/components/auth/RegisterDialog';
import UserMenu from '@/components/auth/UserMenu';
import { useAuth } from '@/context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);
  const { user, isLoading } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="flex space-x-1 items-center">
                <div className="w-2 h-8 bg-benin-green"></div>
                <div className="w-2 h-8 bg-benin-yellow"></div>
                <div className="w-2 h-8 bg-benin-red"></div>
              </div>
              <span className="ml-3 text-xl font-bold font-title tracking-tight">BéninCulture<span className="text-benin-green">360</span></span>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link to="/map" className="text-gray-700 hover:text-benin-green font-medium flex items-center gap-1">
              <MapPin size={18} />
              <span>Carte</span>
            </Link>
            <Link to="/gallery" className="text-gray-700 hover:text-benin-green font-medium flex items-center gap-1">
              <Image size={18} />
              <span>Galerie</span>
            </Link>
            <Link to="/audio" className="text-gray-700 hover:text-benin-green font-medium flex items-center gap-1">
              <Music size={18} />
              <span>Audio</span>
            </Link>
            <Link to="/quiz" className="text-gray-700 hover:text-benin-green font-medium flex items-center gap-1">
              <BookOpen size={18} />
              <span>Quiz</span>
            </Link>
            <Link to="/contribute" className="text-gray-700 hover:text-benin-green font-medium flex items-center gap-1">
              <Users size={18} />
              <span>Contribuer</span>
            </Link>
            
            {!isLoading && (
              user ? (
                <UserMenu />
              ) : (
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    className="text-benin-green border-benin-green hover:bg-benin-green/10"
                    onClick={() => setShowLoginDialog(true)}
                  >
                    <LogIn size={18} className="mr-2" />
                    Connexion
                  </Button>
                  <Button 
                    variant="default" 
                    className="bg-benin-green hover:bg-benin-green/90"
                    onClick={() => setShowRegisterDialog(true)}
                  >
                    <UserPlus size={18} className="mr-2" />
                    Inscription
                  </Button>
                </div>
              )
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            {!isLoading && user && (
              <div className="mr-2">
                <UserMenu />
              </div>
            )}
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-benin-green focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg rounded-b-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/map" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-benin-green">
              <div className="flex items-center gap-2">
                <MapPin size={18} />
                <span>Carte</span>
              </div>
            </Link>
            <Link to="/gallery" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-benin-green">
              <div className="flex items-center gap-2">
                <Image size={18} />
                <span>Galerie</span>
              </div>
            </Link>
            <Link to="/audio" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-benin-green">
              <div className="flex items-center gap-2">
                <Music size={18} />
                <span>Audio</span>
              </div>
            </Link>
            <Link to="/quiz" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-benin-green">
              <div className="flex items-center gap-2">
                <BookOpen size={18} />
                <span>Quiz</span>
              </div>
            </Link>
            <Link to="/contribute" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-benin-green">
              <div className="flex items-center gap-2">
                <Users size={18} />
                <span>Contribuer</span>
              </div>
            </Link>
            
            {!isLoading && !user && (
              <div className="pt-2 space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full text-benin-green border-benin-green hover:bg-benin-green/10"
                  onClick={() => setShowLoginDialog(true)}
                >
                  <LogIn size={18} className="mr-2" />
                  Connexion
                </Button>
                <Button 
                  variant="default" 
                  className="w-full bg-benin-green hover:bg-benin-green/90"
                  onClick={() => setShowRegisterDialog(true)}
                >
                  <UserPlus size={18} className="mr-2" />
                  Inscription
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Auth Dialogs */}
      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
      <RegisterDialog open={showRegisterDialog} onOpenChange={setShowRegisterDialog} />
    </nav>
  );
};

export default Navbar;
