import Link from "next/link";

export default function DogNotFound() {
  return (
    <main className="py-[3rem] text-center">
      <h1 className="text-soft-dark-purple mb-[0.5rem] text-[1.5rem] font-semibold">
        Dog not found 🐾
      </h1>
      <p className="text-dark-brown mb-[1rem]">
        This dog may already have found a home, or the link is wrong.
      </p>
      <Link href="/dogs" className="font-semibold underline text-soft-dark-purple">
        Back to all dogs
      </Link>
    </main>
  );
}
