import Link from "next/link";

// Ported from frontend/2-tailwind/3-html-partials/header.html
// Nav items without a page yet still point to "#".
export default function Header() {
  return (
    <header className="w-full relative mt-[0.2rem] bg-warm-white border-y-[0.2rem] border-powder-blue shadow-[0_-0.2rem_0_#38584F,0_0.2rem_0_#38584F] h-[3.6rem] z-[1]">
      <div className="max-w-[75rem] mx-auto flex items-center justify-between relative h-full px-4 sm:px-6 lg:px-8">
        {/* Logo */}
    <div
      className="absolute top-[3.9rem] left-[-2.4rem] -translate-y-1/2 z-10
             border-[0.2rem] border-powder-blue rounded-full
             shadow-[0_0_0_0.15625rem_#5C4326,0_0.125rem_0.375rem_rgba(0,0,0,0.08)]
             bg-logo-yellow
             overflow-hidden">
      <Link href="/" aria-label="Dogeli Home">
        <img
          src="/images/logoheader.png"
          alt="Dogeli logo"
          className="block h-[7rem] w-[7rem] object-cover rounded-full "
        />
      </Link>
    </div>


        {/* Nav */}
        <nav className="flex-grow flex justify-center pl-[3rem]" role="navigation" aria-label="Main navigation">
          <ul className="flex gap-4 items-center list-none m-0 p-0">
            <li><Link href="/" className="font-semibold uppercase text-soft-dark-purple text-[1.3rem] leading-[1.2] px-[0.4rem] py-[0.1rem] flex items-center transition-all duration-300 rounded hover:bg-muted-teal focus-visible:bg-muted-teal hover:text-white focus-visible:text-white hover:-translate-y-[0.0625rem] focus-visible:-translate-y-[0.0625rem]">🏠Home</Link></li>

            <li><a href="#" className="font-semibold uppercase text-soft-dark-purple text-[1.3rem] leading-[1.2] px-[0.4rem] py-[0.1rem] flex items-center transition-all duration-300 rounded ml-[-0.4rem] hover:bg-muted-teal focus-visible:bg-muted-teal hover:text-white focus-visible:text-white">🐾 <span className="ml-1">Our Mission</span></a></li>

            <li><a href="#" className="font-semibold uppercase text-soft-dark-purple text-[1.3rem] leading-[1.2] px-[0.4rem] py-[0.1rem] flex items-center transition-all duration-300 rounded ml-[-0.6rem] hover:bg-muted-teal focus-visible:bg-muted-teal hover:text-white focus-visible:text-white">👉 <span className="ml-1">Fun Quizzes</span></a></li>

            <li>
              <a
                href="/donate"
                className="text-medium-salmon bg-soft-peach border-medium-salmon relative inline-flex items-center justify-center gap-[0.3rem] overflow-hidden rounded-full border-[0.1875rem] px-[0.6rem] py-[0.3rem] text-[1.15rem] leading-[1.2] font-extrabold tracking-[0.08rem] uppercase no-underline shadow-[inset_0.1875rem_0.1875rem_0.375rem_rgba(255,255,255,0.85),inset_-0.1875rem_-0.1875rem_0.5rem_rgba(0,0,0,0.08),0_0.25rem_0.5rem_rgba(0,0,0,0.3),0_0.625rem_1.25rem_rgba(233,155,155,0.4),0_0_1rem_rgba(255,200,200,0.2)] transition-transform duration-200 ease-in-out before:absolute before:inset-[-0.25rem] before:-z-10 before:rounded-full before:border-[0.125rem] before:[border-color:rgba(255,255,255,0.4)] before:shadow-[0_0_0.75rem_rgba(255,255,255,0.4),inset_0_0_0.75rem_rgba(233,155,155,0.25)] before:content-[''] hover:-translate-y-[0.125rem] focus-visible:-translate-y-[0.125rem] hover:scale-[1.08] focus-visible:scale-[1.08] hover:shadow-[inset_0.1875rem_0.1875rem_0.375rem_rgba(255,255,255,0.85),inset_-0.1875rem_-0.1875rem_0.5rem_rgba(0,0,0,0.1),0_0.5rem_1rem_rgba(0,0,0,0.35),0_0.75rem_1.5rem_rgba(233,155,155,0.5)] focus-visible:shadow-[inset_0.1875rem_0.1875rem_0.375rem_rgba(255,255,255,0.85),inset_-0.1875rem_-0.1875rem_0.5rem_rgba(0,0,0,0.1),0_0.5rem_1rem_rgba(0,0,0,0.35),0_0.75rem_1.5rem_rgba(233,155,155,0.5)]"
              >
                <span className="text-medium-salmon animate-glowGold text-[1.3rem] leading-none">❤️</span>
                <span className="text-medium-salmon animate-glowGold text-[1.3rem]">Donate</span>
              </a>
            </li>




            <li><a href="#" className="font-semibold uppercase text-soft-dark-purple text-[1.3rem] leading-[1.2] px-[0.4rem] py-[0.1rem] flex items-center transition-all duration-300 rounded hover:bg-muted-teal focus-visible:bg-muted-teal hover:text-white focus-visible:text-white">🐶 Dog Tips &amp; Info</a></li>

            <li className="mt-[0.3rem]">
              <Link href="/upload" className="inline-flex items-center justify-center mt-[-0.4rem] ml-[-0.4rem] px-[0.6rem] py-[0.9rem] h-[2.2rem] text-[0.85rem] uppercase font-semibold bg-muted-teal text-white border-[2px] border-soft-peach rounded-full shadow-[0_0_0_0.08125rem_#E3C27E,inset_0.09375rem_0.09375rem_0.1875rem_rgba(255,255,255,0.35),inset_-0.09375rem_-0.09375rem_0.1875rem_rgba(0,0,0,0.15),0_0.1875rem_0.375rem_rgba(0,0,0,0.25),0_0.3125rem_0.625rem_rgba(0,0,0,0.15)] transition-[transform,box-shadow,background-color] duration-200 hover:bg-deep-green focus-visible:bg-deep-green hover:shadow-[0_0_0_0.0625rem_#5C4326,inset_0.0625rem_0.0625rem_0.125rem_rgba(255,255,255,0.3),inset_-0.0625rem_-0.0625rem_0.125rem_rgba(0,0,0,0.15),0_0.25rem_0.5rem_rgba(0,0,0,0.3),0_0.375rem_0.75rem_rgba(0,0,0,0.2)] focus-visible:shadow-[0_0_0_0.0625rem_#5C4326,inset_0.0625rem_0.0625rem_0.125rem_rgba(255,255,255,0.3),inset_-0.0625rem_-0.0625rem_0.125rem_rgba(0,0,0,0.15),0_0.25rem_0.5rem_rgba(0,0,0,0.3),0_0.375rem_0.75rem_rgba(0,0,0,0.2)] hover:scale-[1.03] focus-visible:scale-[1.03] hover:-translate-y-[0.125rem] focus-visible:-translate-y-[0.125rem]">
                <span className="text-[1.5rem] font-normal mr-[0.3rem]">+</span> Upload Dog 🐶
              </Link>
            </li>
          </ul>
        </nav>

        {/* Language menu */}
        <div className="absolute top-1/2 right-[-2.5rem] transform -translate-y-1/2 flex items-center justify-center z-10 group">

          {/* Trigger button */}
          <button className="bg-none border-none cursor-pointer p-0 pr-4 h-full flex items-center" aria-haspopup="true" aria-expanded="false">
            <span className="block h-[2.1rem] aspect-[3/2] overflow-hidden rounded border-[0.14rem] border-light-chestnut">
              <img src="/images/English.svg" alt="English" className="h-full w-full object-cover block" />
            </span>
          </button>

          {/* Dropdown menu */}
          <ul
            className="absolute top-full right-0 mt-0 translate-y-0
                  py-2 bg-warm-white border border-light-gray rounded-lg shadow-lg list-none z-50
                  invisible opacity-0 pointer-events-none
                  group-hover:visible group-hover:opacity-100 group-hover:pointer-events-auto
                  hover:visible hover:opacity-100 hover:pointer-events-auto
                  transition-opacity transition-transform duration-150"
          >
            <li className="px-4 py-1">
              <a href="#">
                <span className="block h-8 aspect-[3/2] overflow-hidden rounded border-[0.07rem] border-gray-900 hover:scale-110 transition-transform">
                  <img src="/images/Estonia.svg" alt="Estonia" className="h-full w-full object-cover block" />
                </span>
              </a>
            </li>
            <li className="px-4 py-1">
              <a href="#">
                <span className="block h-8 aspect-[3/2] overflow-hidden rounded border-[0.07rem] border-gray-900 hover:scale-110 transition-transform">
                  <img src="/images/Sweden.svg" alt="Svenska" className="h-full w-full object-cover block" />
                </span>
              </a>
            </li>
            <li className="px-4 py-1">
              <a href="#">
                <span className="block h-8 aspect-[3/2] overflow-hidden rounded border-[0.07rem] border-gray-900 hover:scale-110 transition-transform">
                  <img src="/images/Norway.svg" alt="Norsk" className="h-full w-full object-cover block" />
                </span>
              </a>
            </li>
            <li className="px-4 py-1">
              <a href="#">
                <span className="block h-8 aspect-[3/2] overflow-hidden rounded border-[0.07rem] border-gray-900 hover:scale-110 transition-transform">
                  <img src="/images/Finland.svg" alt="Suomi" className="h-full w-full object-cover block" />
                </span>
              </a>
            </li>
            <li className="px-4 py-1">
              <a href="#">
                <span className="block h-8 aspect-[3/2] overflow-hidden rounded border-[0.07rem] border-gray-900 hover:scale-110 transition-transform">
                  <img src="/images/Denmark.svg" alt="Dansk" className="h-full w-full object-cover block" />
                </span>
              </a>
            </li>
          </ul>
        </div>

      </div>
    </header>
  );
}
