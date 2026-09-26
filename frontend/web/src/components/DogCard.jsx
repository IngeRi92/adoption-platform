import Link from "next/link";
import DogImage from "@/components/DogImage";
import { photoList } from "@/lib/format";

// Ported from the card template in frontend/2-tailwind/2-search-results.html
export default function DogCard({ dog }) {
  const isFemale = dog.sex === "female";

  return (
    <article className="border-soft-dark-purple overflow-hidden rounded-[0.625rem] border-[0.2rem] shadow-[0_0.125rem_0.5rem_rgba(0,0,0,0.06)] transition-transform duration-200 ease-in-out hover:scale-[1.03] hover:shadow-[0_0.25rem_0.75rem_rgba(0,0,0,0.12)]">
      <Link href={`/dogs/${dog.id}`} className="text-inherit no-underline">
        <DogImage
          src={photoList(dog)[0]}
          alt={dog.name}
          className="h-[10rem] w-full object-cover"
        />
        <div className="bg-soft-peach p-[0.5rem]">
          <h2 className="text-dark-brown mb-[0.1rem] text-[1.1rem] font-semibold">
            <span
              aria-label={dog.sex}
              className={`${isFemale ? "text-rosy-brown" : "text-royal-blue"} mr-[0.2rem] inline-block [font-family:'Segoe_UI_Symbol','Arial',sans-serif] text-[1.3rem] font-black`}
            >
              {isFemale ? "♀" : "♂"}
            </span>
            {dog.name}
          </h2>
          <p className="text-soft-dark-purple text-[1rem] font-medium">
            {dog.shelter?.country}
          </p>
        </div>
      </Link>
    </article>
  );
}
