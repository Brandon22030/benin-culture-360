import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/services/supabase-client";

const UsersTab = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select(
          `
          *,
          articles(count)
        `,
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBanUser = async (userId: string) => {
    if (
      !confirm(
        "Êtes-vous sûr de vouloir bannir cet utilisateur ? Cette action est irréversible.",
      )
    ) {
      return;
    }

    try {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);

      if (error) throw error;

      // Supprimer également l'utilisateur de la table auth.users via une fonction RPC
      const { error: rpcError } = await supabase.rpc("delete_user", {
        user_id: userId,
      });

      if (rpcError) throw rpcError;

      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Erreur lors du bannissement de l'utilisateur:", error);
    }
  };

  const getInitials = (fullName: string) => {
    if (!fullName) return "??";
    return fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) return <div>Chargement...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Liste des utilisateurs</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom complet</TableHead>
              <TableHead>Email de l'utilisateur</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Date d'inscription</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.full_name || "Non défini"}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      user.role === "admin"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {user.role || "utilisateur"}
                  </span>
                </TableCell>
                <TableCell>
                  {new Date(user.created_at).toLocaleDateString("fr-FR")}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          onClick={() => setSelectedUser(user)}
                        >
                          Détails
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Détails de l'utilisateur</DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col items-center gap-4 py-4">
                          <Avatar className="h-24 w-24">
                            <AvatarImage
                              src={user.avatar_url}
                              alt={user.full_name}
                              className="w-32 h-32 rounded-full object-cover"
                            />
                            <AvatarFallback>
                              {getInitials(user.full_name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="grid gap-2 text-center">
                            <h3 className="font-semibold text-lg">
                              {user.full_name || "Non défini"}
                            </h3>
                            <p className="text-sm text-gray-500">
                              @{user.username}
                            </p>
                            <p className="text-sm">{user.email}</p>
                            <p className="text-sm">
                              Membre depuis le{" "}
                              {new Date(user.created_at).toLocaleDateString(
                                "fr-FR",
                              )}
                            </p>
                            <p className="text-sm">
                              Articles publiés: {user.articles_count || 0}
                            </p>
                            <p className="text-sm">
                              Contributions: {user.contributions_count || 0}
                            </p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    {user.role !== "admin" && (
                      <Button
                        variant="destructive"
                        onClick={() => handleBanUser(user.id)}
                      >
                        Bannir
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default UsersTab;
