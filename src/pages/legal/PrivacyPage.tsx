import Layout from '@/components/Layout';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function PrivacyPage() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container mx-auto py-12">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à l'accueil
        </Button>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold font-title mb-8">Politique de Confidentialité</h1>
          
          <div className="prose max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
              <p className="text-gray-600">
                La présente politique de confidentialité décrit la manière dont BéninCulture360 
                collecte, utilise et protège vos informations personnelles.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Collecte des Données</h2>
              <p className="text-gray-600">
                Nous collectons les informations que vous nous fournissez directement lors de :
              </p>
              <ul className="list-disc list-inside text-gray-600 mt-2">
                <li>La création de votre compte</li>
                <li>La publication d'articles ou de commentaires</li>
                <li>L'inscription à notre newsletter</li>
                <li>La participation aux quiz culturels</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Utilisation des Données</h2>
              <p className="text-gray-600">
                Vos données sont utilisées pour :
              </p>
              <ul className="list-disc list-inside text-gray-600 mt-2">
                <li>Personnaliser votre expérience utilisateur</li>
                <li>Améliorer nos services</li>
                <li>Vous informer des mises à jour importantes</li>
                <li>Assurer la sécurité de votre compte</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Protection des Données</h2>
              <p className="text-gray-600">
                Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos 
                informations personnelles contre tout accès, modification, divulgation ou 
                destruction non autorisée.
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}