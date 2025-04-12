import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { LogOut, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from '@/services/supabase-client';
import type { Database } from '@/types/database.types';

const UserMenu = () => {
  const { user, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<{ id: string; full_name: string | null; avatar_url: string | null } | null>(null);

  useEffect(() => {

    if (user?.id) {
      setProfile({
        id: user.id,
        full_name: user.user_metadata.full_name || '',
        avatar_url: user.user_metadata.avatar_url || '',
      });
    }
  }, [user]);
  
  const handleSignOut = async () => {
    setIsLoading(true);
    await signOut();
    setProfile(null);
    setIsLoading(false);
  };
  
  // Get initials from user's full name or email
  const getInitials = () => {
    const fullName = user?.user_metadata?.full_name;
    if (fullName) {
      return fullName
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    return user?.email?.substring(0, 2).toUpperCase() || 'BC';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-11 w-11 rounded-full">
          <Avatar className="h-10 w-10 border border-benin-green/30">
            {profile?.avatar_url ? (
              <AvatarImage 
                src={profile.avatar_url} 
                alt="Avatar" 
                className="object-cover"
              />
            ) : (
              <AvatarFallback className="bg-benin-green/10 text-benin-green">
                {getInitials()}
              </AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {profile?.full_name || 'Utilisateur'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile" className="cursor-pointer w-full">
            <User className="mr-2 h-4 w-4" />
            <span>Mon Profil</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={handleSignOut} disabled={isLoading}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isLoading ? 'Déconnexion...' : 'Se déconnecter'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
