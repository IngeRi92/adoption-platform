export const PLACEHOLDER_PHOTO = "/images/mascot.png";

// The API currently returns `photos` as one URL (or null). This also accepts
// an array, in case #5 decides to support several photos.
export function photoList(dog) {
  if (Array.isArray(dog.photos)) return dog.photos.filter(Boolean);
  return dog.photos ? [dog.photos] : [];
}

export function formatAge(age) {
  if (age == null) return "Unknown";
  if (age === 0) return "Under 1 year";
  return age === 1 ? "1 year" : `${age} years`;
}

export function capitalize(text) {
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
}
