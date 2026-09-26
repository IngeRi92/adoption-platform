import Link from "next/link";

export default function NotFound() {
  return (
    <main className="py-[3rem] text-center">
      <h1 className="text-soft-dark-purple mb-[0.5rem] text-[1.5rem] font-semibold">
        Page not found 🐾
      </h1>
      <p className="text-dark-brown mb-[1rem]">This page doesn’t exist (yet).</p>
      <Link href="/" className="text-soft-dark-purple font-semibold underline">
        Back to the home page
      </Link>
    </main>
  );
}
