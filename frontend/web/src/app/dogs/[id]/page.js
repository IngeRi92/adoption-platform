import { notFound } from "next/navigation";
import DogImage from "@/components/DogImage";
import { getDog } from "@/lib/dogs";
import { capitalize, formatAge, photoList } from "@/lib/format";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const dog = await getDog(id);
  if (!dog) return { title: "Dog not found" };
  return {
    title: dog.name,
    description: `${dog.name} is waiting for a loving home. Adopt a shelter dog with Dogeli.`,
  };
}

// Ported from frontend/2-tailwind/3-dog-mokka.html
export default async function DogPage({ params }) {
  const { id } = await params;
  const dog = await getDog(id);
  if (!dog) notFound();

  const photos = photoList(dog);
  const shelter = dog.shelter ?? {};

  const details = [
    ["Sex", capitalize(dog.sex)],
    ["Age", formatAge(dog.age)],
    ["Size", capitalize(dog.size)],
    ["Country", shelter.country],
    ["Location", shelter.location],
    ["Breed", dog.breed],
    ["ID Number", dog.external_id], // proposed in #5; row is hidden when missing
  ].filter(([, value]) => value);

  return (
    <main className="bg-warm-white border-powder-blue mx-auto my-[0.8rem] max-w-[45rem] rounded-[1rem] border-[0.1875rem] p-[0.5rem] shadow-[0_0_0_0.1875rem_#38584F,0_0.375rem_0.75rem_rgba(0,0,0,0.12),0_0.75rem_1.5rem_rgba(0,0,0,0.08),inset_0_0.0625rem_0.0625rem_rgba(255,255,255,0.7),inset_0_-0.125rem_0.25rem_rgba(0,0,0,0.08),inset_0.125rem_0_0.1875rem_rgba(0,0,0,0.03),inset_-0.125rem_0_0.1875rem_rgba(0,0,0,0.03)]">
      {/* Overview Section */}
      <section className="bg-warm-white grid grid-cols-1 md:grid-cols-[1fr_2fr] items-start gap-[1rem] rounded-[1rem] p-[0.5rem] md:items-stretch">
        {/* Dog Details */}
        <div className="border-muted-lavender text-dark-grape flex h-full w-full flex-col rounded-[0.5rem] border-[0.09375rem] pt-[0.5rem] pr-[1rem] pl-[1.5rem] shadow-[0_0_0_0.09375rem_#5D3A6A,0_0.25rem_0.375rem_rgba(0,0,0,0.08),0_0.375rem_0.75rem_rgba(0,0,0,0.06),inset_0_0.0625rem_0.0625rem_rgba(255,255,255,0.5),inset_0_-0.125rem_0.1875rem_rgba(0,0,0,0.05),inset_0.125rem_0_0.125rem_rgba(0,0,0,0.03),inset_-0.125rem_0_0.125rem_rgba(0,0,0,0.03)] transition-transform duration-300 ease-in-out">
          <h1 className="text-muted-lavender font-kalam mb-[0.6rem] text-[1.8em] font-[500] tracking-[0.3rem] uppercase [-webkit-text-stroke:0.075rem_#46265A]">
            {dog.name}
          </h1>

          <ul className="list-none space-y-[0.03rem] text-[1rem] leading-[2.3] [&>li:last-child]:mb-0">
            {details.map(([label, value]) => (
              <li key={label}>
                <strong>{label}:</strong>{" "}
                <span className="ml-[0.1rem] text-[1rem] font-[450] text-black">{value}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Photo Gallery */}
        <div className="flex flex-wrap items-start gap-[0.25rem]">
          {photos.length === 0 ? (
            <DogImage src={null} alt={dog.name} className="border-soft-dark-purple cursor-pointer rounded-[0.5rem] border-[0.1875rem] shadow-[0_0.25rem_0.375rem_rgba(0,0,0,0.1),0_0.375rem_0.75rem_rgba(0,0,0,0.06)] transition-transform duration-300 ease-in-out hover:scale-[1.05] hover:shadow-[0_0.5rem_1rem_rgba(0,0,0,0.2),0_0.75rem_1.5rem_rgba(0,0,0,0.12)] w-full" />
          ) : (
            photos.map((photo, index) => (
              <DogImage
                key={photo}
                src={photo}
                alt={`${dog.name} photo ${index + 1}`}
                className={`border-soft-dark-purple cursor-pointer rounded-[0.5rem] border-[0.1875rem] shadow-[0_0.25rem_0.375rem_rgba(0,0,0,0.1),0_0.375rem_0.75rem_rgba(0,0,0,0.06)] transition-transform duration-300 ease-in-out hover:scale-[1.05] hover:shadow-[0_0.5rem_1rem_rgba(0,0,0,0.2),0_0.75rem_1.5rem_rgba(0,0,0,0.12)] ${photos.length === 1 ? "w-full" : "w-[calc(50%-0.25rem)]"}`}
              />
            ))
          )}
        </div>
      </section>

      {/* Description */}
      <section className="pt-[0.5rem] leading-[1.2] text-black">
        <h2 className="text-dark-grape pb-[0.3rem] text-[1.1em] font-semibold">About Me 🐶</h2>
        <p className="pt-[0.2rem] leading-[1.4] font-normal whitespace-pre-line">
          {dog.description || "The shelter hasn’t added a description yet."}
        </p>
      </section>

            {/* Contact */}
      <section id="contact" className="text-dark-grape pb-[0.4rem] leading-[1.6]">
        <h2 className="text-dark-grape text-[1.1em] font-semibold">Contact ✨</h2>
        {shelter.name && (
          <p>
            <strong className="font-semibold">Shelter:</strong>{" "}
            <span className="text-[1rem] font-normal text-black">{shelter.name}</span>
          </p>
        )}
        {shelter.contact_email && (
          <p>
            <strong className="font-semibold">Email:</strong>{" "}
            <a href={`mailto:${shelter.contact_email}`} className="text-[1rem] font-normal text-black hover:underline">
              {shelter.contact_email}
            </a>
          </p>
        )}
        {shelter.contact_phone && (
          <p>
            <strong className="font-semibold">Phone:</strong>{" "}
            <a href={`tel:${shelter.contact_phone.replace(/\s/g, "")}`} className="text-[1rem] font-normal text-black hover:underline">
              {shelter.contact_phone}
            </a>
          </p>
        )}
      </section>

      {/* Buttons */}
      <div className="mt-[0.3rem] mb-[0.3rem] flex flex-wrap items-center gap-[1rem]">
        {/* Issue #1: change href to "#inquiry" when the inquiry form is added, and remove the preview note below */}
        <a href="#contact" className="text-medium-salmon bg-soft-peach border-medium-salmon relative inline-flex items-center justify-center gap-[0.3rem] overflow-hidden rounded-[7rem] border-[0.1875rem] px-[0.5rem] py-[0.3rem] text-[1.1rem] leading-[1.2] font-extrabold tracking-[0.08rem] uppercase no-underline shadow-[inset_0.1875rem_0.1875rem_0.375rem_rgba(255,255,255,0.85),inset_-0.1875rem_-0.1875rem_0.5rem_rgba(0,0,0,0.08),0_0.25rem_0.5rem_rgba(0,0,0,0.3),0_0.625rem_1.25rem_rgba(233,155,155,0.4),0_0_1rem_rgba(255,200,200,0.2)] transition-transform duration-200 ease-in-out before:absolute before:inset-[-0.25rem] before:-z-10 before:rounded-[7rem] before:border-[0.125rem] before:[border-color:rgba(255,255,255,0.4)] before:shadow-[0_0_0.75rem_rgba(255,255,255,0.4),inset_0_0_0.75rem_rgba(233,155,155,0.25)] before:content-[''] hover:-translate-y-[0.125rem] focus-visible:-translate-y-[0.125rem] hover:scale-[1.08] focus-visible:scale-[1.08] hover:shadow-[inset_0.1875rem_0.1875rem_0.375rem_rgba(255,255,255,0.85),inset_-0.1875rem_-0.1875rem_0.5rem_rgba(0,0,0,0.1),0_0.5rem_1rem_rgba(0,0,0,0.35),0_0.75rem_1.5rem_rgba(233,155,155,0.5)] focus-visible:shadow-[inset_0.1875rem_0.1875rem_0.375rem_rgba(255,255,255,0.85),inset_-0.1875rem_-0.1875rem_0.5rem_rgba(0,0,0,0.1),0_0.5rem_1rem_rgba(0,0,0,0.35),0_0.75rem_1.5rem_rgba(233,155,155,0.5)]">
          <span className="text-medium-salmon animate-glowGold">Offer Home❤️</span>
        </a>
        <a href="/donate" className="text-medium-salmon bg-soft-peach border-medium-salmon relative inline-flex items-center justify-center gap-[0.3rem] overflow-hidden rounded-[7rem] border-[0.1875rem] px-[0.5rem] py-[0.3rem] text-[1.1rem] leading-[1.2] font-extrabold tracking-[0.08rem] uppercase no-underline shadow-[inset_0.1875rem_0.1875rem_0.375rem_rgba(255,255,255,0.85),inset_-0.1875rem_-0.1875rem_0.5rem_rgba(0,0,0,0.08),0_0.25rem_0.5rem_rgba(0,0,0,0.3),0_0.625rem_1.25rem_rgba(233,155,155,0.4),0_0_1rem_rgba(255,200,200,0.2)] transition-transform duration-200 ease-in-out before:absolute before:inset-[-0.25rem] before:-z-10 before:rounded-[7rem] before:border-[0.125rem] before:[border-color:rgba(255,255,255,0.4)] before:shadow-[0_0_0.75rem_rgba(255,255,255,0.4),inset_0_0_0.75rem_rgba(233,155,155,0.25)] before:content-[''] hover:-translate-y-[0.125rem] focus-visible:-translate-y-[0.125rem] hover:scale-[1.08] focus-visible:scale-[1.08] hover:shadow-[inset_0.1875rem_0.1875rem_0.375rem_rgba(255,255,255,0.85),inset_-0.1875rem_-0.1875rem_0.5rem_rgba(0,0,0,0.1),0_0.5rem_1rem_rgba(0,0,0,0.35),0_0.75rem_1.5rem_rgba(233,155,155,0.5)] focus-visible:shadow-[inset_0.1875rem_0.1875rem_0.375rem_rgba(255,255,255,0.85),inset_-0.1875rem_-0.1875rem_0.5rem_rgba(0,0,0,0.1),0_0.5rem_1rem_rgba(0,0,0,0.35),0_0.75rem_1.5rem_rgba(233,155,155,0.5)]">
          <span className="text-medium-salmon animate-glowGold">Donate❤️</span>
        </a>
      </div>

      {/* Preview note: inquiries are connected in issue #1 */}
      <p className="text-medium-brown mt-[0.3rem] text-[0.9rem]">
        Online adoption inquiries are not available in this preview yet. Please contact the shelter using the details above.
      </p>
    </main>
  );
}