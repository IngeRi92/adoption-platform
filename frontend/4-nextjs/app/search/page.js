import Link from "next/link";
import DogCard from "@/components/DogCard";
import { getDogs } from "@/lib/dogs";
import { parseFilters } from "@/lib/filters";

export const metadata = {
  title: "Search results",
};

// Ported from frontend/2-tailwind/2-search-results.html
export default async function SearchPage({ searchParams }) {
  const filters = parseFilters(await searchParams);
  const dogs = await getDogs(filters);

  return (
    <main id="main-content" className="mx-auto max-w-[60rem] px-[0.3rem]">
      <h1
        id="dog-results-heading"
        className="text-soft-dark-purple mt-[0.7rem] mb-0 text-center text-[1.6rem] leading-[1.2] font-semibold tracking-[0.03rem]"
      >
        🐶 Search Results
        <span className="relative -top-[0.15rem] mx-[0.1rem] inline-block rotate-[-20deg] align-middle text-[2rem]">
          🐾
        </span>
      </h1>

      <h2 className="text-warm-white mt-0 mb-[0.1rem] text-center text-[1.4rem] leading-[1.3] font-semibold transition-[transform,text-shadow] duration-300 ease-in-out [text-shadow:0_0.1rem_0.1rem_rgba(183,110,121,0.5),0_0.2rem_0.3rem_rgba(60,45,30,0.35)]">
        <span className="text-medium-salmon mx-[0.5rem] align-middle text-[2.4rem] transition-[transform,text-shadow] duration-300 ease-in-out [text-shadow:0_0.08rem_0.05rem_rgba(255,255,255,0.3),0_0.12rem_0.12rem_rgba(183,110,121,0.6),0_0.25rem_0.35rem_rgba(60,45,30,0.5)]" aria-hidden="true">
          ♥
        </span>
        Dogs who are waiting for a loving home
        <span className="text-medium-salmon mx-[0.5rem] align-middle text-[2.4rem] transition-[transform,text-shadow] duration-300 ease-in-out [text-shadow:0_0.08rem_0.05rem_rgba(255,255,255,0.3),0_0.12rem_0.12rem_rgba(183,110,121,0.6),0_0.25rem_0.35rem_rgba(60,45,30,0.5)]" aria-hidden="true">
          ♥
        </span>
      </h2>

      {dogs.length === 0 ? (
        <p className="text-dark-brown py-[2rem] text-center text-[1.1rem]">
          No dogs match your search.{" "}
          <Link href="/" className="text-soft-dark-purple font-semibold underline">
            Try different filters
          </Link>
        </p>
      ) : (
        <section
          aria-labelledby="dog-results-heading"
          className="mx-auto grid [grid-template-columns:repeat(auto-fit,minmax(10rem,1fr))] gap-[0.8rem] px-[0.3rem] py-[1rem]"
        >
          {dogs.map((dog) => (
            <DogCard key={dog.id} dog={dog} />
          ))}
        </section>
      )}
    </main>
  );
}
