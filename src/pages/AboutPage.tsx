import Layout from "@/components/Layout";

export default function AboutPage() {
  return (
    <Layout>
      <div className="container mx-auto py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold font-title mb-8">
            À Propos de BéninCulture360
          </h1>

          <div className="prose max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Notre Mission</h2>
              <p className="text-gray-600">
                BéninCulture360 est une plateforme dédiée à la préservation et à
                la promotion de la riche diversité culturelle du Bénin. Notre
                mission est de rendre accessible à tous le patrimoine culturel
                béninois, de faciliter sa découverte et sa compréhension à
                travers des outils interactifs et innovants.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Notre Vision</h2>
              <p className="text-gray-600">
                Nous aspirons à devenir la référence numérique pour la
                découverte et l'apprentissage de la culture béninoise, en créant
                un pont entre tradition et modernité, entre passé et présent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Nos Valeurs</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-2 text-benin-green">
                    Authenticité
                  </h3>
                  <p className="text-gray-600">
                    Nous nous engageons à présenter la culture béninoise dans
                    son authenticité, respectant ses traditions et ses origines.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-2 text-benin-green">
                    Accessibilité
                  </h3>
                  <p className="text-gray-600">
                    Notre plateforme est conçue pour être accessible à tous,
                    facilitant la découverte et l'apprentissage de la culture
                    béninoise.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-2 text-benin-green">
                    Innovation
                  </h3>
                  <p className="text-gray-600">
                    Nous utilisons les technologies modernes pour présenter le
                    patrimoine culturel de manière interactive et engageante.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-2 text-benin-green">
                    Communauté
                  </h3>
                  <p className="text-gray-600">
                    Nous encourageons la participation et la contribution de la
                    communauté pour enrichir et préserver notre patrimoine
                    culturel.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Notre Équipe</h2>
              <p className="text-gray-600 mb-6">
                BéninCulture360 est porté par une équipe passionnée de
                professionnels dévoués à la promotion et à la préservation de la
                culture béninoise.
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}
