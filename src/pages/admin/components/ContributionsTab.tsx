import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/services/supabase-client";

const getStatusStyle = (status: string) => {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    default:
      return "bg-yellow-100 text-black";
  }
};

const ContributionsTab = () => {
  const [galleryPending, setGalleryPending] = useState([]);
  const [musicPending, setMusicPending] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const getImageUrls = (imageUrlArray: any) => {
    try {
      if (Array.isArray(imageUrlArray)) {
        return imageUrlArray.map((url) =>
          url.replace(/[\[\]"`\\]/g, "").trim(),
        );
      }

      const parsedArray = JSON.parse(imageUrlArray);
      if (Array.isArray(parsedArray)) {
        return parsedArray.map((url) => url.replace(/[\[\]"`\\]/g, "").trim());
      }
      if (typeof parsedArray === "string") {
        return [parsedArray.replace(/[\[\]"`\\]/g, "").trim()];
      }

      return ["/images/gallery/placeholder.jpg"];
    } catch (error) {
      if (typeof imageUrlArray === "string") {
        return [imageUrlArray.replace(/[\[\]"`\\]/g, "").trim()];
      }
      return ["/images/gallery/placeholder.jpg"];
    }
  };

  useEffect(() => {
    fetchPendingContributions();
  }, []);

  const fetchPendingContributions = async () => {
    try {
      const [galleryData, musicData] = await Promise.all([
        supabase.from("gallery_pending").select("*"),
        supabase.from("music_pending").select("*"),
      ]);

      setGalleryPending(galleryData.data || []);
      setMusicPending(musicData.data || []);
    } catch (error) {
      console.error("Erreur lors du chargement des contributions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculer le nombre de contributions en attente
  const pendingGalleryCount = galleryPending.filter(
    (item) => item.status === "pending",
  ).length;
  const pendingMusicCount = musicPending.filter(
    (item) => item.status === "pending",
  ).length;

  const handleStatusChange = async (
    id: string,
    status: string,
    type: "gallery" | "music",
  ) => {
    try {
      const table = type === "gallery" ? "gallery_pending" : "music_pending";

      // Si le statut est "approved", on récupère d'abord les données de la contribution
      if (status === "approved") {
        const { data: contribution, error: fetchError } = await supabase
          .from(table)
          .select("*")
          .eq("id", id)
          .single();

        if (fetchError) throw fetchError;

        // On crée l'entrée dans la table correspondante en tant qu'admin
        if (type === "gallery") {
          let imageUrl;
          try {
            const cleanUrl = (url: string) => {
              return url
                .replace(/[`\s]/g, "")
                .replace(/[\[\]"\\]/g, "")
                .trim();
            };

            if (Array.isArray(contribution.image_url)) {
              imageUrl = cleanUrl(contribution.image_url[0].toString());
            } else if (typeof contribution.image_url === "string") {
              try {
                let parsed = contribution.image_url;
                while (
                  typeof parsed === "string" &&
                  (parsed.startsWith("[") || parsed.startsWith('"'))
                ) {
                  parsed = JSON.parse(parsed);
                }

                imageUrl = Array.isArray(parsed)
                  ? cleanUrl(parsed[0].toString())
                  : cleanUrl(parsed.toString());
              } catch {
                imageUrl = cleanUrl(contribution.image_url);
              }
            } else {
              imageUrl = cleanUrl(contribution.image_url.toString());
            }

            // Vérifier que l'URL est valide
            if (!imageUrl || !imageUrl.startsWith("http")) {
              throw new Error("URL d'image invalide");
            }

            console.log("URL d'image avant envoi:", imageUrl);

            const { error: insertError } = await supabase.rpc(
              "create_approved_gallery",
              {
                p_title: contribution.title,
                p_description: contribution.description,
                p_image_url: imageUrl, // Une seule URL
                p_category: contribution.category,
                p_region: contribution.region,
                p_credit: contribution.credit,
                p_source: contribution.source,
                p_contributor_id: contribution.contributor_id,
                p_created_at:
                  contribution.created_at || new Date().toISOString(),
              },
            );

            if (insertError) {
              console.error("Erreur lors de l'insertion:", insertError);
              throw insertError;
            }
          } catch (error) {
            console.error("Erreur lors du traitement de l'URL:", error);
            throw new Error("Impossible de traiter l'URL d'image");
          }
        } else {
          const { error: insertError } = await supabase.rpc(
            "create_approved_music",
            {
              p_title: contribution.title,
              p_artist: contribution.artist,
              p_description: contribution.description,
              p_audio_url: contribution.audio_url,
              p_image_url: contribution.image_url,
              p_category: contribution.category,
              p_region: contribution.region,
              p_credit: contribution.credit,
              p_contributor_id: contribution.contributor_id,
              p_created_at: contribution.created_at || new Date().toISOString(),
              p_album: contribution.album,
              p_year: contribution.year,
            },
          );

          if (insertError) throw insertError;
        }
      }

      // Mise à jour du statut dans la table pending
      const { error } = await supabase
        .from(table)
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      fetchPendingContributions();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
    }
  };

  const handleDelete = async (id: string, type: "gallery" | "music") => {
    try {
      const table = type === "gallery" ? "gallery_pending" : "music_pending";

      const { error } = await supabase.from(table).delete().eq("id", id);

      if (error) throw error;

      // Rafraîchir la liste après la suppression
      fetchPendingContributions();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  if (isLoading) return <div>Chargement...</div>;

  return (
    <div className="space-y-6">
      <Tabs defaultValue="images">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="images">
            Images en attente ({pendingGalleryCount})
          </TabsTrigger>
          <TabsTrigger value="audio">
            Audio en attente ({pendingMusicCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="images">
          <Card>
            <CardHeader>
              <CardTitle>Images en attente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {galleryPending.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <img
                      src={getImageUrls(item.image_url)}
                      alt={item.title}
                      className="w-full h-48 object-cover rounded-md mb-4"
                      onError={(e) => {
                        e.currentTarget.src = "/images/gallery/placeholder.jpg";
                      }}
                    />
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="flex justify-between items-center mt-4">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() =>
                            navigate(`/admin/contributions/gallery/${item.id}`)
                          }
                        >
                          Détails
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDelete(item.id, "gallery")}
                        >
                          Supprimer
                        </Button>
                      </div>

                      <Select
                        defaultValue={item.status}
                        onValueChange={(value) =>
                          handleStatusChange(item.id, value, "gallery")
                        }
                      >
                        <SelectTrigger
                          className={`w-[180px] ${getStatusStyle(item.status)}`}
                        >
                          <SelectValue placeholder="Statut" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">En attente...</SelectItem>
                          <SelectItem value="approved">Approuvé</SelectItem>
                          <SelectItem value="rejected">Rejeté</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audio">
          <Card>
            <CardHeader>
              <CardTitle>Audio en attente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {musicPending.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="bg-muted p-4 rounded-lg mb-4">
                      <audio
                        controls
                        className="w-full"
                        controlsList="nodownload"
                      >
                        <source src={item.audio_url} />
                        Votre navigateur ne supporte pas la lecture audio.
                      </audio>
                    </div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="flex justify-between items-center mt-4">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() =>
                            navigate(`/admin/contributions/music/${item.id}`)
                          }
                        >
                          Détails
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDelete(item.id, "music")}
                        >
                          Supprimer
                        </Button>
                      </div>

                      <Select
                        defaultValue={item.status}
                        onValueChange={(value) =>
                          handleStatusChange(item.id, value, "music")
                        }
                      >
                        <SelectTrigger
                          className={`w-[180px] ${getStatusStyle(item.status)}`}
                        >
                          <SelectValue placeholder="Statut" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">En attente...</SelectItem>
                          <SelectItem value="approved">Approuvé</SelectItem>
                          <SelectItem value="rejected">Rejeté</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContributionsTab;
