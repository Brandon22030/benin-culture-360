import Layout from '@/components/Layout';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function TermsPage() {
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
          <h1 className="text-4xl font-bold font-title mb-8">Conditions d'Utilisation</h1>
          
          <div className="prose max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Acceptation des Conditions</h2>
              <p className="text-gray-600">
                En accédant et en utilisant BéninCulture360, vous acceptez d'être lié par ces 
                conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas 
                utiliser notre plateforme.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Utilisation du Service</h2>
              <p className="text-gray-600">
                Vous vous engagez à utiliser BéninCulture360 de manière responsable et à :
              </p>
              <ul className="list-disc list-inside text-gray-600 mt-2">
                <li>Respecter les droits d'auteur et la propriété intellectuelle</li>
                <li>Ne pas publier de contenu offensant ou inapproprié</li>
                <li>Ne pas tenter de compromettre la sécurité du site</li>
                <li>Ne pas utiliser le service à des fins illégales</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Contenu Utilisateur</h2>
              <p className="text-gray-600">
                En publiant du contenu sur BéninCulture360, vous :
              </p>
              <ul className="list-disc list-inside text-gray-600 mt-2">
                <li>Conservez vos droits sur votre contenu</li>
                <li>Accordez une licence non exclusive à BéninCulture360</li>
                <li>Garantissez avoir les droits nécessaires sur le contenu</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Modifications des Conditions</h2>
              <p className="text-gray-600">
                Nous nous réservons le droit de modifier ces conditions à tout moment. Les 
                modifications entrent en vigueur dès leur publication sur le site.
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}