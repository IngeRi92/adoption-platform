// Turns the search URL (?sex=female&size=small&size=medium&...) into a filters object
// and applies those filters to a list of dogs.

// Non-overlapping age groups in whole years, as proposed in backend/API_CONTRACT.md.
// Update this if #5 decides differently.
export const AGE_RANGES = {
  "0-1": [0, 1],
  "2-5": [2, 5],
  "6+": [6, Infinity],
};

const SIZES = ["small", "medium", "large"];

const first = (value) => (Array.isArray(value) ? value[0] : value);
const asArray = (value) =>
  value === undefined ? [] : Array.isArray(value) ? value : [value];

export function parseFilters(searchParams = {}) {
  const sex = first(searchParams.sex);
  const age = first(searchParams.age);

  return {
    sex: sex === "female" || sex === "male" ? sex : "", // "all" or missing = no filter
    age: AGE_RANGES[age] ? age : "",
    sizes: asArray(searchParams.size).filter((size) => SIZES.includes(size)),
    country: (first(searchParams.country) ?? "").trim(), // "" = all countries
    breed: (first(searchParams.breed) ?? "").trim(),
  };
}

const includesText = (value, search) =>
  (value ?? "").toLowerCase().includes(search.toLowerCase());

export function filterDogs(dogs, filters) {
  return dogs.filter((dog) => {
    // Only show dogs that can still be adopted
    if (dog.adoption_status && dog.adoption_status !== "available") return false;
    if (filters.sex && dog.sex !== filters.sex) return false;
    if (filters.sizes.length > 0 && !filters.sizes.includes(dog.size)) return false;
    if (filters.country && !includesText(dog.shelter?.country, filters.country)) return false;
    if (filters.breed && !includesText(dog.breed, filters.breed)) return false;
    if (filters.age) {
      const [min, max] = AGE_RANGES[filters.age];
      if (dog.age == null || dog.age < min || dog.age > max) return false;
    }
    return true;
  });
}
