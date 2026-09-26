// Issue #2 version: reads sample data only (no API calls yet).
// Issue #1 replaces this file with a version that calls the Django API.
import { cache } from "react";
import { sampleDogs } from "@/data/sampleDogs";
import { filterDogs } from "@/lib/filters";

export async function getDogs(filters) {
  return filterDogs(sampleDogs, filters);
}

// cache() lets the page and its metadata share one lookup per request
export const getDog = cache(async (id) => {
  return sampleDogs.find((dog) => String(dog.id) === String(id)) ?? null;
});
