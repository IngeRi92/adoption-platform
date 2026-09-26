"use client";

// Shown automatically if loading the dogs fails (e.g. the server can't be reached)
export default function SearchError({ reset }) {
  return (
    <main className="py-[3rem] text-center">
      <p className="text-dark-brown mb-[1rem] text-[1.1rem]">
        Sorry, we couldn’t load the dogs right now.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="bg-muted-teal cursor-pointer rounded-xl px-[1rem] py-[0.4rem] font-semibold text-white"
      >
        Try again
      </button>
    </main>
  );
}
