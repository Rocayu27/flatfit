// src/lib/profiles.ts
import { supabase } from "./supabase";

export type ProfileRecord = {
  user_id: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  contact_notes: string | null;
  major: string | null;
  age: number | null;
  class_year: number | null;
  housing_preference: string | null;
  budget_range: string | null;
  hobbies: string[] | null;
  avatar_url: string | null;
};

const PROFILE_COLUMNS = `
  user_id,
  first_name,
  last_name,
  phone,
  contact_notes,
  major,
  age,
  class_year,
  housing_preference,
  budget_range,
  hobbies,
  avatar_url
`;

// Fetch profile for a given user_id
export async function getProfile(
  userId: string
): Promise<ProfileRecord | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select(PROFILE_COLUMNS)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }

  return data as ProfileRecord | null;
}

// Data you pass in when saving/updating a profile
export type ProfileUpsert = Omit<ProfileRecord, "user_id">;

// Upsert profile for a given user_id
export async function upsertProfile(
  userId: string,
  values: ProfileUpsert
) {
  const { error } = await supabase
    .from("profiles")
    .upsert(
      {
        user_id: userId,
        ...values,
      },
      { onConflict: "user_id" }
    );

  if (error) {
    console.error("Error upserting profile:", error);
    throw error;
  }
}
