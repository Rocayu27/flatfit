import { supabase } from "./supabase";

export type RoommateProfileRecord = {
  id: string;
  display_name: string;
  age: number | null;
  class_year: number | null;
  gender: string | null;

  major: string | null;
  housing_preference: string | null;
  budget_range: string | null;

  main_photo_url: string | null;
  photo_urls: string[] | null;

  introduction: string | null;
  cleanliness_text: string | null;
  study_habits_text: string | null;
  conflict_resolution_text: string | null;
  hobbies_text: string | null;
  ideal_weekend_text: string | null;
  fun_facts: string[] | null;

  sleep_schedule: number | null;
  noise_tolerance: number | null;
  cleanliness_score: number | null;
  guest_frequency: number | null;
  overnight_guests: number | null;
  study_environment: number | null;
  social_energy: number | null;
};

// Fetch all visible roommate profiles
export async function getRoommateProfiles(): Promise<RoommateProfileRecord[]> {
  const { data, error } = await supabase
    .from("roommate_profiles")
    .select("*")
    .eq("is_visible", true);

  if (error) {
    console.error("Error fetching roommate profiles:", error);
    return [];
  }

  return data as RoommateProfileRecord[];
}
