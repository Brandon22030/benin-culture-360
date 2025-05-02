import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import {
  Upload,
  Camera,
  Music,
  BookOpen,
  Users,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/services/supabase";

export default function ContributePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("gallery"); // Déplacer ici
  const { toast } = useToast();
  const { user } = useAuth();
  const [uploadedFiles, setUploadedFiles] = useState<{
    images: string[];
    audios: string[];
  }>({
    images: [],
    audios: [],
  });

  const handleRemoveFile = (type: "image" | "audio", url: string) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [type === "image" ? "images" : "audios"]: prev[
        type === "image" ? "images" : "audios"
      ].filter((fileUrl) => fileUrl !== url),
    }));
    toast({
      title: "Succès",
      description: "Le fichier a été supprimé",
    });
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "audio",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier les limites de fichiers pour les deux sections
    if (type === "image" && uploadedFiles.images.length > 0) {
      toast({
        title: "Erreur",
        description: "Une seule image est autorisée",
        variant: "destructive",
      });
      return;
    }

    if (type === "audio" && uploadedFiles.audios.length > 0) {
      toast({
        title: "Erreur",
        description: "Un seul fichier audio est autorisé",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Erreur",
        description: "Le fichier ne doit pas dépasser 10MB",
        variant: "destructive",
      });
      return;
    }

    if (type === "image" && !file.type.startsWith("image/")) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une image",
        variant: "destructive",
      });
      return;
    }

    if (type === "audio" && !file.type.startsWith("audio/")) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier audio",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "benin_culture_360");
      formData.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
      formData.append("resource_type", type === "audio" ? "video" : "image");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/${type === "audio" ? "video" : "image"}/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Erreur lors de l'upload");
      }

      setUploadedFiles((prev) => ({
        ...prev,
        [type === "image" ? "images" : "audios"]: [
          ...prev[type === "image" ? "images" : "audios"],
          data.secure_url,
        ],
      }));

      toast({
        title: "Succès",
        description: `Le fichier a été téléchargé avec succès`,
      });
    } catch (error) {
      console.error("Erreur upload:", error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le fichier",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    // Supprimer ces console.log
    setIsSubmitting(true);

    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour soumettre une contribution",
        variant: "destructive",
      });
      return;
    }

    console.log("FormData:", Object.fromEntries(formData.entries()));
    console.log("ActiveTab:", activeTab);
    console.log("UploadedFiles:", uploadedFiles);

    setIsSubmitting(true);

    try {
      if (activeTab === "gallery") {
        const galleryData = {
          contributor_id: user.id,
          title: form.querySelector("#gallery-title")?.value,
          category: form.querySelector('[name="gallery-category"]')?.value,
          region: form.querySelector('[name="gallery-region"]')?.value,
          description: form.querySelector("#gallery-description")?.value,
          credit: form.querySelector("#gallery-credit")?.value,
          source: form.querySelector("#gallery-source")?.value,
          image_url: uploadedFiles.images[0], // Maintenant on envoie tout le tableau d'URLs
          status: "pending",
        };

        if (
          !galleryData.title ||
          !galleryData.category ||
          !galleryData.region ||
          !galleryData.description
        ) {
          toast({
            title: "Erreur",
            description: "Veuillez remplir tous les champs obligatoires",
            variant: "destructive",
          });
          return;
        }

        const { error } = await supabase
          .from("gallery_pending")
          .insert(galleryData);

        if (error) throw error;

        // Réinitialiser uniquement le formulaire de galerie
        form.reset();
        setUploadedFiles((prev) => ({ ...prev, images: [] }));
        setIsSuccess(true);
      } else if (activeTab === "audio") {
        const audioData = {
          contributor_id: user.id,
          title: formData.get("audio-title"),
          artist: formData.get("artist"),
          category: formData.get("audio-category"),
          credit: formData.get("credit"),
          source: formData.get("source"),
          album: formData.get("album"),
          year: formData.get("year"),
          region: formData.get("audio-region"),
          description: formData.get("audio-description"),
          audio_url: uploadedFiles.audios[0],
          image_url: uploadedFiles.images[0], // Ajout de l'image
          status: "pending", // Changé en 'pending' pour correspondre à la galerie
        };

        console.log("Audio Data:", audioData);

        const { error } = await supabase
          .from("music_pending")
          .insert(audioData);

        if (error) {
          console.error("Supabase Error:", error);
          throw error;
        }
      }

      setIsSuccess(true);
      toast({
        title: "Contribution soumise avec succès !",
        description:
          "Notre équipe va examiner votre contribution prochainement.",
      });

      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error: any) {
      console.error("Erreur soumission:", error);
      toast({
        title: "Erreur",
        description:
          error.message || "Une erreur est survenue lors de la soumission",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }; // Supprimer le point-virgule ici

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="gallery" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 mb-6 sm:mb-8">
                <TabsTrigger value="gallery">Galerie</TabsTrigger>
                <TabsTrigger value="audio">Audio</TabsTrigger>
              </TabsList>

              <TabsContent value="gallery">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl sm:text-2xl">Contribution à la Galerie</CardTitle>
                    <CardDescription>
                      Partagez des images du patrimoine culturel béninois
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit}>
                      <div className="space-y-4 sm:space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="gallery-title">
                            Titre de l'image
                          </Label>
                          <Input
                            id="gallery-title"
                            name="gallery-title"
                            placeholder="Titre de l'image"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="gallery-category">Catégorie</Label>
                            <Select name="gallery-category">
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez une catégorie" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="art">Art</SelectItem>
                                <SelectItem value="architecture">
                                  Architecture
                                </SelectItem>
                                <SelectItem value="dance">Danse</SelectItem>
                                <SelectItem value="festival">
                                  Festival
                                </SelectItem>
                                <SelectItem value="craft">Artisanat</SelectItem>
                                <SelectItem value="other">Autre</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="gallery-region">Région</Label>
                            <Select name="gallery-region">
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez une région" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="atlantique">
                                  Atlantique
                                </SelectItem>
                                <SelectItem value="zou">Zou</SelectItem>
                                <SelectItem value="collines">
                                  Collines
                                </SelectItem>
                                <SelectItem value="borgou">Borgou</SelectItem>
                                <SelectItem value="atacora">Atacora</SelectItem>
                                <SelectItem value="multiple">
                                  Plusieurs régions
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="gallery-description">
                            Description
                          </Label>
                          <Textarea
                            id="gallery-description"
                            placeholder="Décrivez l'image et son contexte culturel..."
                            rows={4}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="gallery-credit">Crédit photo</Label>
                          <Input
                            id="gallery-credit"
                            name="gallery-credit"
                            placeholder="Nom du photographe"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="gallery-source">Source</Label>
                          <Input
                            id="gallery-source"
                            name="gallery-source"
                            placeholder="Source de l'image (ex: collection personnelle, musée, etc.)"
                          />
                        </div>

                        <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                          <Camera className="mx-auto h-12 w-12 text-gray-400" />
                          <h3 className="mt-2 text-sm font-semibold">
                            Télécharger une image
                          </h3>
                          <p className="mt-1 text-xs text-gray-500">
                            Une seule image PNG ou JPG jusqu'à 10MB (haute
                            résolution recommandée)
                          </p>
                          <div className="mt-4">
                            <Input
                              id="gallery-upload"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleFileUpload(e, "image")}
                              disabled={isSubmitting}
                            />
                            <Label
                              htmlFor="gallery-upload"
                              className="cursor-pointer inline-flex items-center rounded-md bg-benin-green px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-benin-green/90"
                            >
                              {isSubmitting
                                ? "Téléchargement..."
                                : "Sélectionner une image"}
                            </Label>
                          </div>
                        </div>

                        {uploadedFiles.images.length > 0 && (
                          <div className="mt-4">
                            {uploadedFiles.images.map((url, index) => (
                              <div
                                key={index}
                                className="relative aspect-square"
                              >
                                <img
                                  src={url}
                                  alt={`Image ${index + 1}`}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveFile("image", url)}
                                  className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 focus:outline-none"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex justify-end mt-6">
                        <Button
                          type="submit"
                          className="bg-benin-green hover:bg-benin-green/90"
                          disabled={isSubmitting}
                        >
                          {isSubmitting
                            ? "Envoi en cours..."
                            : isSuccess
                              ? "Envoyé !"
                              : "Soumettre l'image"}
                          {isSuccess && (
                            <CheckCircle className="ml-2 h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="audio">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl sm:text-2xl">Contribution Audio</CardTitle>
                    <CardDescription>
                      Partagez des enregistrements de musiques traditionnelles ou récits
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit}>
                      <div className="space-y-4 sm:space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="audio-title">
                            Titre de l'enregistrement
                          </Label>
                          <Input
                            id="audio-title"
                            name="audio-title"
                            placeholder="Titre de l'enregistrement audio"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="artist">Artiste/Interprète</Label>
                            <Input
                              id="artist"
                              name="artist"
                              placeholder="Nom de l'artiste ou du groupe"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="audio-category">Catégorie</Label>
                            <Select name="audio-category">
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez une catégorie" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="percussion">
                                  Percussion
                                </SelectItem>
                                <SelectItem value="chant">
                                  Chant Traditionnel
                                </SelectItem>
                                <SelectItem value="instrumental">
                                  Instrumental
                                </SelectItem>
                                <SelectItem value="recit">
                                  Récit Oral
                                </SelectItem>
                                <SelectItem value="ceremonie">
                                  Cérémonie
                                </SelectItem>
                                <SelectItem value="other">Autre</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Credit & Source */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="credit">Credit</Label>
                            <Input
                              id="credit"
                              name="credit"
                              placeholder="Votre nom"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="source">Source</Label>
                            <Input
                              id="source"
                              name="source"
                              placeholder="Source de l'audio"
                            />
                          </div>
                        </div>

                        {/* album & year */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="album">Album</Label>
                            <Input
                              id="album"
                              name="album"
                              placeholder="Nom de l'album de l'artiste"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="year">Année</Label>
                            <Input
                              id="year"
                              name="year"
                              placeholder="Année de sortie de l'audio"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="audio-region">Région d'origine</Label>
                          <Select name="audio-region">
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez une région" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="atlantique">
                                Atlantique
                              </SelectItem>
                              <SelectItem value="zou">Zou</SelectItem>
                              <SelectItem value="collines">Collines</SelectItem>
                              <SelectItem value="borgou">Borgou</SelectItem>
                              <SelectItem value="atacora">Atacora</SelectItem>
                              <SelectItem value="multiple">
                                Plusieurs régions
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="audio-description">
                            Description et contexte
                          </Label>
                          <Textarea
                            id="audio-description"
                            name="audio-description"
                            placeholder="Décrivez l'enregistrement, son contexte culturel et historique..."
                            rows={4}
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                            <Music className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-semibold">
                              Fichier audio
                            </h3>
                            <p className="mt-1 text-xs text-gray-500">
                              Un seul fichier MP3 ou WAV jusqu'à 10MB
                            </p>
                            <div className="mt-4">
                              <Input
                                id="audio-upload"
                                type="file"
                                accept="audio/*"
                                className="hidden"
                                onChange={(e) => handleFileUpload(e, "audio")}
                                disabled={isSubmitting}
                              />
                              <Label
                                htmlFor="audio-upload"
                                className="cursor-pointer inline-flex items-center rounded-md bg-benin-green px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-benin-green/90"
                              >
                                {isSubmitting
                                  ? "Téléchargement..."
                                  : "Sélectionner un fichier audio"}
                              </Label>
                            </div>
                          </div>

                          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                            <Camera className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-semibold">
                              Image de couverture
                            </h3>
                            <p className="mt-1 text-xs text-gray-500">
                              Une seule image PNG ou JPG jusqu'à 10MB (haute
                              résolution recommandée)
                            </p>
                            <div className="mt-4">
                              <Input
                                id="audio-image-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFileUpload(e, "image")}
                                disabled={isSubmitting}
                              />
                              <Label
                                htmlFor="audio-image-upload"
                                className="cursor-pointer inline-flex items-center rounded-md bg-benin-green px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-benin-green/90"
                              >
                                {isSubmitting
                                  ? "Téléchargement..."
                                  : "Sélectionner une image"}
                              </Label>
                            </div>
                          </div>
                        </div>

                        {/* Affichage des fichiers */}
                        <div className="space-y-4">
                          {uploadedFiles.audios.length > 0 && (
                            <div className="mt-4">
                              {uploadedFiles.audios.map((url, index) => (
                                <div
                                  key={index}
                                  className="p-4 bg-gray-50 rounded-lg relative"
                                >
                                  <audio controls className="w-full">
                                    <source src={url} type="audio/mpeg" />
                                    Votre navigateur ne supporte pas la lecture
                                    audio.
                                  </audio>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleRemoveFile("audio", url)
                                    }
                                    className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 focus:outline-none"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-4 w-4"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}

                          {uploadedFiles.images.length > 0 &&
                            activeTab === "audio" && (
                              <div className="mt-4">
                                {uploadedFiles.images.map((url, index) => (
                                  <div
                                    key={index}
                                    className="relative aspect-square"
                                  >
                                    <img
                                      src={url}
                                      alt={`Image ${index + 1}`}
                                      className="w-full h-full object-cover rounded-lg"
                                    />
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleRemoveFile("image", url)
                                      }
                                      className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 focus:outline-none"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                        </div>
                      </div>

                      <div className="flex justify-end mt-6">
                        <Button
                          type="submit"
                          className="bg-benin-green hover:bg-benin-green/90"
                          disabled={isSubmitting}
                        >
                          {isSubmitting
                            ? "Envoi en cours..."
                            : isSuccess
                              ? "Envoyé !"
                              : "Soumettre l'audio"}
                          {isSuccess && (
                            <CheckCircle className="ml-2 h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* <TabsContent value="quiz">
                  <Card>
                    <CardHeader>
                      <CardTitle>Suggestion de Question pour le Quiz</CardTitle>
                      <CardDescription>
                        Proposez des questions pour enrichir notre quiz culturel
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="quiz-name">Nom complet</Label>
                              <Input id="quiz-name" placeholder="Votre nom" required />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="quiz-email">Email</Label>
                              <Input id="quiz-email" type="email" placeholder="votre.email@exemple.com" required />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="question">Question proposée</Label>
                            <Textarea 
                              id="question" 
                              placeholder="Écrivez votre question..." 
                              required
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="quiz-category">Catégorie</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionnez une catégorie" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="history">Histoire et Religion</SelectItem>
                                  <SelectItem value="art">Arts et Traditions</SelectItem>
                                  <SelectItem value="geography">Géographie</SelectItem>
                                  <SelectItem value="food">Cuisine</SelectItem>
                                  <SelectItem value="language">Langue et Littérature</SelectItem>
                                  <SelectItem value="other">Autre</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="difficulty">Difficulté</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Niveau de difficulté" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="easy">Facile</SelectItem>
                                  <SelectItem value="medium">Moyen</SelectItem>
                                  <SelectItem value="hard">Difficile</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <Label>Options de réponse</Label>
                            <div className="space-y-2">
                              <div className="flex gap-2">
                                <span className="bg-benin-green text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">A</span>
                                <Input placeholder="Option A" required />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex gap-2">
                                <span className="bg-benin-green text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">B</span>
                                <Input placeholder="Option B" required />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex gap-2">
                                <span className="bg-benin-green text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">C</span>
                                <Input placeholder="Option C" required />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex gap-2">
                                <span className="bg-benin-green text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">D</span>
                                <Input placeholder="Option D" required />
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="correct-answer">Réponse correcte</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez la bonne réponse" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="0">Option A</SelectItem>
                                <SelectItem value="1">Option B</SelectItem>
                                <SelectItem value="2">Option C</SelectItem>
                                <SelectItem value="3">Option D</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="explanation">Explication de la réponse</Label>
                            <Textarea 
                              id="explanation" 
                              placeholder="Expliquez pourquoi c'est la bonne réponse..." 
                              rows={3}
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="source">Source de l'information</Label>
                            <Input id="source" placeholder="D'où provient cette information ? (optionnel)" />
                          </div>
                        </div>
                        
                        <div className="flex justify-end mt-6">
                          <Button 
                            type="submit" 
                            className="bg-benin-green hover:bg-benin-green/90"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? 'Envoi en cours...' : isSuccess ? 'Envoyé !' : 'Soumettre la question'}
                            {isSuccess && <CheckCircle className="ml-2 h-4 w-4" />}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent> */}
            </Tabs>

            <div className="mt-16">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">
                    Comment votre contribution est-elle traitée ?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-benin-green/10 rounded-full flex items-center justify-center mb-4">
                        <Users className="h-8 w-8 text-benin-green" />
                      </div>
                      <h3 className="font-semibold mb-2">1. Soumission</h3>
                      <p className="text-sm text-gray-600">
                        Vous soumettez votre contribution qui est enregistrée
                        dans notre système
                      </p>
                    </div>

                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-benin-yellow/10 rounded-full flex items-center justify-center mb-4">
                        <BookOpen className="h-8 w-8 text-benin-yellow" />
                      </div>
                      <h3 className="font-semibold mb-2">2. Vérification</h3>
                      <p className="text-sm text-gray-600">
                        Notre équipe d'experts vérifie l'exactitude et la
                        pertinence de votre contribution
                      </p>
                    </div>

                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-benin-red/10 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle className="h-8 w-8 text-benin-red" />
                      </div>
                      <h3 className="font-semibold mb-2">3. Publication</h3>
                      <p className="text-sm text-gray-600">
                        Après validation, votre contribution est publiée sur la
                        plateforme avec crédit
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-gray-100 pt-6 flex justify-center">
                  <p className="text-sm text-gray-500 max-w-2xl text-center">
                    Nous vous contacterons par email pour vous informer de
                    l'état de votre contribution. Merci de participer à
                    l'enrichissement et à la préservation du patrimoine culturel
                    béninois !
                  </p>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
