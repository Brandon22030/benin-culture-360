import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/services/supabase-client";

const StatsTab = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalContributions: 0,
    pendingContributions: 0,
    approvalRate: 0,
    totalArticles: 0,
    totalCultures: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Récupérer toutes les statistiques en parallèle
      const [
        usersCount,
        galleryStats,
        musicStats,
        articlesCount,
        culturesCount,
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact" }),
        supabase.from("gallery_pending").select("status"),
        supabase.from("music_pending").select("status"),
        supabase.from("articles").select("*", { count: "exact" }),
        supabase.from("cultures").select("*", { count: "exact" }),
      ]);

      const galleryData = galleryStats.data || [];
      const musicData = musicStats.data || [];

      const totalContributions = galleryData.length + musicData.length;
      const pendingContributions = [...galleryData, ...musicData].filter(
        (item) => item.status === "pending",
      ).length;

      const approvedContributions = [...galleryData, ...musicData].filter(
        (item) => item.status === "approved",
      ).length;

      setStats({
        totalUsers: usersCount.count || 0,
        totalContributions,
        pendingContributions,
        approvalRate: totalContributions
          ? Math.round((approvedContributions / totalContributions) * 100)
          : 0,
        totalArticles: articlesCount.count || 0,
        totalCultures: culturesCount.count || 0,
      });
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Chargement...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6"> */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Utilisateurs inscrits</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-benin-green">
            {stats.totalUsers}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Total des contributions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-benin-green">
            {stats.totalContributions}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contributions en attente</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-yellow-600">
            {stats.pendingContributions}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Taux d'approbation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-blue-600">
            {stats.approvalRate}%
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Total des articles</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-purple-600">
            {stats.totalArticles}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Total des cultures</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-orange-600">
            {stats.totalCultures}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsTab;
