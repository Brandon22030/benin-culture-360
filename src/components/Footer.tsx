
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center">
              <div className="flex space-x-1 items-center">
                <div className="w-2 h-8 bg-benin-green"></div>
                <div className="w-2 h-8 bg-benin-yellow"></div>
                <div className="w-2 h-8 bg-benin-red"></div>
              </div>
              <span className="ml-3 text-xl font-bold font-title tracking-tight">BéninCulture<span className="text-benin-green">360</span></span>
            </Link>
            <p className="mt-4 text-sm text-gray-400">
              Explorez la richesse culturelle du Bénin à travers notre plateforme interactive dédiée au patrimoine béninois.
            </p>
            <div className="flex mt-6 space-x-4">
              <a href="#" className="text-gray-400 hover:text-benin-yellow transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-benin-yellow transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-benin-yellow transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-benin-yellow transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Explorer</h3>
            <ul className="space-y-2">
              <li><Link to="/map" className="text-gray-400 hover:text-benin-yellow transition-colors">Carte culturelle</Link></li>
              <li><Link to="/gallery" className="text-gray-400 hover:text-benin-yellow transition-colors">Galerie multimédia</Link></li>
              <li><Link to="/audio" className="text-gray-400 hover:text-benin-yellow transition-colors">Bibliothèque audio</Link></li>
              <li><Link to="/quiz" className="text-gray-400 hover:text-benin-yellow transition-colors">Quiz culturel</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">À propos</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-400 hover:text-benin-yellow transition-colors">Notre mission</Link></li>
              <li><Link to="/team" className="text-gray-400 hover:text-benin-yellow transition-colors">Notre équipe</Link></li>
              <li><Link to="/contribute" className="text-gray-400 hover:text-benin-yellow transition-colors">Contribuer</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-benin-yellow transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-sm text-gray-400 mb-4">
              Abonnez-vous pour recevoir les dernières actualités sur la culture béninoise.
            </p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Votre email" 
                className="bg-gray-800 text-white px-4 py-2 rounded-l-md w-full focus:outline-none focus:ring-1 focus:ring-benin-green"
              />
              <button className="bg-benin-green hover:bg-benin-green/90 px-4 py-2 rounded-r-md">
                <Mail size={20} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            © {currentYear} BéninCulture360. Tous droits réservés.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-sm text-gray-400 hover:text-benin-yellow transition-colors">Politique de confidentialité</Link>
            <Link to="/terms" className="text-sm text-gray-400 hover:text-benin-yellow transition-colors">Conditions d'utilisation</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
