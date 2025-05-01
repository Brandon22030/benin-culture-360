import { supabase } from "./supabase";

export const uploadImage = async (
  file: File,
  bucket: string = "cultures",
  customPath?: string,
  isAvatar: boolean = false,
) => {
  const fileExt = file.name.split(".").pop();
  const fileName = customPath
    ? `${customPath}.${fileExt}`
    : `${Math.random().toString(36).substring(2)}.${fileExt}`;

  // Si c'est un avatar, utiliser un chemin spécifique
  const filePath = isAvatar ? `${customPath}/avatar.${fileExt}` : fileName;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(isAvatar ? "avatars" : bucket)
    .upload(filePath, file, {
      upsert: true,
      contentType: file.type,
    });

  if (uploadError) throw uploadError;

  const {
    data: { publicUrl },
  } = supabase.storage
    .from(isAvatar ? "avatars" : bucket)
    .getPublicUrl(filePath);

  return publicUrl;
};
