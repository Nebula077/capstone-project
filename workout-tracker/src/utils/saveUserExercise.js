import supabase from "../../supabase-client";

export async function saveUserExercise(user, exercise) {
  if (!user) {
    return { ok: false, error: "NOT_AUTHENTICATED" };
  }

  if (!exercise || !exercise.id) {
    return { ok: false, error: "INVALID_EXERCISE" };
  }

  const englishName =
    (exercise.translations &&
      exercise.translations.find((t) => t.language === 2)?.name) ||
    exercise.name;

  const imageUrls = exercise.images?.map((img) => img.image) ?? [];
  const muscleNames = exercise.muscles?.map((m) => m.name_en) ?? [];

  try {
    const { data: existing, error: existsError } = await supabase
      .from("user_exercises")
      .select("id")
      .eq("user_id", user.id)
      .eq("exercise_id", exercise.id)
      .maybeSingle();

    if (existsError) {
      return { ok: false, error: existsError.message };
    }

    if (existing) {
      return { ok: false, error: "ALREADY_EXISTS" };
    }

    const { error } = await supabase.from("user_exercises").insert({
      user_id: user.id,
      exercise_id: exercise.id,
      name: englishName,
      category: exercise.category?.name ?? null,
      description: exercise.description ?? null,
      images: imageUrls,
      muscles: muscleNames,
    });

    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message ?? "UNKNOWN_ERROR" };
  }
}
