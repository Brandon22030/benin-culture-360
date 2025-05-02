import Layout from "@/components/Layout";
import { ArrowLeft, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function ContactPage() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container mx-auto py-12">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à l'accueil
        </Button>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold font-title mb-8">Contactez-nous</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Formulaire de contact */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold mb-6">
                Envoyez-nous un message
              </h2>

              <form className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nom complet
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-benin-green"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-benin-green"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Sujet
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-benin-green"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-benin-green"
                    required
                  ></textarea>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-benin-green hover:bg-benin-green/90"
                >
                  Envoyer le message
                </Button>
              </form>
            </div>

            {/* Informations de contact */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold mb-6">Nos coordonnées</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <MapPin className="text-benin-green mt-1" />
                    <div>
                      <h3 className="font-semibold">Adresse</h3>
                      <p className="text-gray-600">
                        123 Rue du Patrimoine
                        <br />
                        Cotonou, Bénin
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Mail className="text-benin-green mt-1" />
                    <div>
                      <h3 className="font-semibold">Email</h3>
                      <p className="text-gray-600">
                        {" "}
                        beninculture360@gmail.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Phone className="text-benin-green mt-1" />
                    <div>
                      <h3 className="font-semibold">Téléphone</h3>
                      <p className="text-gray-600">+229 01 53 72 90 10</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* <div>
                <h2 className="text-2xl font-semibold mb-4">Horaires d'ouverture</h2>
                <p className="text-gray-600">
                  Lundi - Vendredi : 9h00 - 18h00<br />
                  Samedi : 9h00 - 13h00<br />
                  Dimanche : Fermé
                </p>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
