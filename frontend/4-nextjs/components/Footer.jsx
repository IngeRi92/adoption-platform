// Ported from frontend/2-tailwind/3-html-partials/footer.html
export default function Footer() {
  return (
    <footer
      role="contentinfo"
      className="bg-muted-teal text-warm-white border-deep-green-teal mt-[0.5rem] border-y-[0.125rem] p-[0.2rem] text-center text-[0.9rem] shadow-[inset_0_0.1rem_0_0_#BFD7EA,inset_0_-0.1rem_0_0_#BFD7EA]"
    >
      <div className="mx-auto max-w-[75rem]">
        <p>
          &copy; {new Date().getFullYear()} Dogeli |
          <a
            href="#"
            title="Contact Dogs of Europe"
            className="text-muted-coral mx-[0.3rem] font-medium no-underline hover:underline focus:underline"
            >Contact</a
          >
          | All rights reserved.
        </p>
      </div>
    </footer>
  );
}
