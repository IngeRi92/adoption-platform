import SearchForm from "@/components/SearchForm";

export const metadata = {
  alternates: { canonical: "/" },
};

// Ported from frontend/2-tailwind/1-home.html
export default function HomePage() {
  return (
    <main id="main-content" role="main">
          {/* Hero Section */}

          <section aria-labelledby="main-heading" className="bg-sage-green text-center">
            <div className="mx-auto max-w-screen-lg px-4">
              <h1
                id="main-heading"
                className="text-warm-golden-yellow animate-glow mb-0 pt-[0.6rem] text-[2.1rem] leading-[1.3] font-semibold"
              >
                Find Your New Best Friend !
              </h1>
              <p
                className="text-warm-white mt-0 text-[1.3rem] leading-[1.1] font-medium"
              >
                <span
                  className="text-medium-salmon mx-[0.5rem] align-middle text-[2.6rem]"
                  >♥</span
                >
                Give a loving home to a grateful dog
                <span
                  className="text-medium-salmon mx-[0.5rem] align-middle text-[2.6rem]"
                  >♥</span
                >
              </p>
            </div>
          </section>

          {/* Search Section */}

          <div
            className="border-soft-dark-purple bg-warm-white mx-auto my-[0.5rem] flex min-h-[9rem] max-w-[63rem] flex-col items-start justify-start overflow-hidden rounded-[1rem] border-[0.125rem] px-[0.5rem] py-[0.7rem] shadow-[inset_0_0_0_0.09rem_#b76e79,0_0.125rem_0.5rem_rgba(0,0,0,0.05)] md:flex-row"
          >
            {/* Sidebar */}
            <div
              className="mr-[0.2rem] ml-[0.7rem] flex min-w-[9.375rem] flex-col items-center gap-[1rem] text-center"
            >
              <h2
                className="text-soft-dark-purple text-[1.7rem] leading-[1.1] font-medium"
              >
                Dog Search
                <i className="fa-solid fa-location-dot align-middle"></i>
              </h2>

              <div className="relative inline-block">
                <img
                  src="/images/mascot.png"
                  alt="Mascot Dog"
                  className="border-dark-brown bg-warm-white mt-[0.5rem] h-[7rem] w-[7rem] rounded-full border-[0.125rem] object-cover p-[0.4rem]"
                />

                {/* Sparkles (with Tailwind animation + inline positioning/delay) */}
                <span
                  className="bg-golden-beige animate-sparkle absolute z-[2] h-[0.875rem] w-[0.875rem] shadow-[0_0_0.25rem_gold,0_0_0.625rem_rgba(255,215,0,0.7),0_0_0.875rem_rgba(255,255,200,0.5)] [clip-path:polygon(50%_0%,61%_35%,98%_35%,68%_57%,79%_91%,50%_70%,21%_91%,32%_57%,2%_35%,39%_35%)]"
                  style={{ top: "-0.75rem", left: "1.25rem", animationDelay: "0s" }}
                ></span>
                <span
                  className="bg-golden-beige animate-sparkle absolute z-[2] h-[0.875rem] w-[0.875rem] shadow-[0_0_0.25rem_gold,0_0_0.625rem_rgba(255,215,0,0.7),0_0_0.875rem_rgba(255,255,200,0.5)] [clip-path:polygon(50%_0%,61%_35%,98%_35%,68%_57%,79%_91%,50%_70%,21%_91%,32%_57%,2%_35%,39%_35%)]"
                  style={{ top: "0.625rem", right: "-0.875rem", animationDelay: "0.3s" }}
                ></span>
                <span
                  className="bg-golden-beige animate-sparkle absolute z-[2] h-[0.875rem] w-[0.875rem] shadow-[0_0_0.25rem_gold,0_0_0.625rem_rgba(255,215,0,0.7),0_0_0.875rem_rgba(255,255,200,0.5)] [clip-path:polygon(50%_0%,61%_35%,98%_35%,68%_57%,79%_91%,50%_70%,21%_91%,32%_57%,2%_35%,39%_35%)]"
                  style={{ top: "45%", left: "-1.125rem", animationDelay: "0.6s" }}
                ></span>
                <span
                  className="bg-golden-beige animate-sparkle absolute z-[2] h-[0.875rem] w-[0.875rem] shadow-[0_0_0.25rem_gold,0_0_0.625rem_rgba(255,215,0,0.7),0_0_0.875rem_rgba(255,255,200,0.5)] [clip-path:polygon(50%_0%,61%_35%,98%_35%,68%_57%,79%_91%,50%_70%,21%_91%,32%_57%,2%_35%,39%_35%)]"
                  style={{ bottom: "100%", left: "1.875rem", animationDelay: "0.9s" }}
                ></span>
                <span
                  className="bg-golden-beige animate-sparkle absolute z-[2] h-[0.875rem] w-[0.875rem] shadow-[0_0_0.25rem_gold,0_0_0.625rem_rgba(255,215,0,0.7),0_0_0.875rem_rgba(255,255,200,0.5)] [clip-path:polygon(50%_0%,61%_35%,98%_35%,68%_57%,79%_91%,50%_70%,21%_91%,32%_57%,2%_35%,39%_35%)]"
                  style={{ bottom: "-0.875rem", right: "0.5rem", animationDelay: "1.2s" }}
                ></span>
                <span
                  className="bg-golden-beige animate-sparkle absolute z-[2] h-[0.875rem] w-[0.875rem] shadow-[0_0_0.25rem_gold,0_0_0.625rem_rgba(255,215,0,0.7),0_0_0.875rem_rgba(255,255,200,0.5)] [clip-path:polygon(50%_0%,61%_35%,98%_35%,68%_57%,79%_91%,50%_70%,21%_91%,32%_57%,2%_35%,39%_35%)]"
                  style={{ top: "1.5625rem", left: "70%", animationDelay: "1.5s" }}
                ></span>
                <span
                  className="bg-golden-beige animate-sparkle absolute z-[2] h-[0.875rem] w-[0.875rem] shadow-[0_0_0.25rem_gold,0_0_0.625rem_rgba(255,215,0,0.7),0_0_0.875rem_rgba(255,255,200,0.5)] [clip-path:polygon(50%_0%,61%_35%,98%_35%,68%_57%,79%_91%,50%_70%,21%_91%,32%_57%,2%_35%,39%_35%)]"
                  style={{ bottom: "0.75rem", left: "0rem", animationDelay: "1.8s" }}
                ></span>
                <span
                  className="bg-golden-beige animate-sparkle absolute z-[2] h-[0.875rem] w-[0.875rem] shadow-[0_0_0.25rem_gold,0_0_0.625rem_rgba(255,215,0,0.7),0_0_0.875rem_rgba(255,255,200,0.5)] [clip-path:polygon(50%_0%,61%_35%,98%_35%,68%_57%,79%_91%,50%_70%,21%_91%,32%_57%,2%_35%,39%_35%)]"
                  style={{ top: "60%", right: "-0.625rem", animationDelay: "2.1s" }}
                  >✧</span
                >
              </div>
            </div>

            <SearchForm />
          </div>

          {/* Gallery Section */}

          <section
            aria-labelledby="gallery-heading"
            className="mx-auto mt-[0.5rem] max-w-screen-lg px-4"
          >
            <h2
              id="gallery-heading"
              className="text-deep-green mb-[0.5rem] text-center text-[1.3rem] font-semibold"
            >
              Bringing love, companionship & joy into your life
            </h2>

            <ul
              className="m-[0.2rem] grid w-full list-none grid-cols-2 gap-[1rem] p-0 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
            >
              <li>
                <img
                  src="/images/image1.jpg"
                  alt="A loving dog"
                  className="border-dark-brown aspect-[3.1/2.1] w-full rounded-[0.8rem] border-[0.19rem] object-cover object-[center_47%] shadow-[0_0.3rem_0.6rem_rgba(0,0,0,0.2),0_0.6rem_1.2rem_rgba(0,0,0,0.15),0_1rem_2rem_rgba(0,0,0,0.08)] transition-transform duration-400 ease-in-out"
                />
              </li>
              <li>
                <img
                  src="/images/image2.jpg"
                  alt="A grateful dog"
                  className="border-dark-brown aspect-[3.1/2.1] w-full rounded-[0.8rem] border-[0.19rem] object-cover object-[center_47%] shadow-[0_0.3rem_0.6rem_rgba(0,0,0,0.2),0_0.6rem_1.2rem_rgba(0,0,0,0.15),0_1rem_2rem_rgba(0,0,0,0.08)] transition-transform duration-400 ease-in-out"
                />
              </li>
              <li>
                <img
                  src="/images/image3.jpg"
                  alt="The best companion"
                  className="border-dark-brown aspect-[3.1/2.1] w-full rounded-[0.8rem] border-[0.19rem] object-cover object-[center_47%] shadow-[0_0.3rem_0.6rem_rgba(0,0,0,0.2),0_0.6rem_1.2rem_rgba(0,0,0,0.15),0_1rem_2rem_rgba(0,0,0,0.08)] transition-transform duration-400 ease-in-out"
                />
              </li>
              <li>
                <img
                  src="/images/image4.jpg"
                  alt="Your most loyal friend"
                  className="border-dark-brown aspect-[3.1/2.1] w-full rounded-[0.8rem] border-[0.19rem] object-cover object-[center_47%] shadow-[0_0.3rem_0.6rem_rgba(0,0,0,0.2),0_0.6rem_1.2rem_rgba(0,0,0,0.15),0_1rem_2rem_rgba(0,0,0,0.08)] transition-transform duration-400 ease-in-out"
                />
              </li>
              <li>
                <img
                  src="/images/image5.jpg"
                  alt="The perfect guard dog for your security"
                  className="border-dark-brown aspect-[3.1/2.1] w-full rounded-[0.8rem] border-[0.19rem] object-cover object-[center_47%] shadow-[0_0.3rem_0.6rem_rgba(0,0,0,0.2),0_0.6rem_1.2rem_rgba(0,0,0,0.15),0_1rem_2rem_rgba(0,0,0,0.08)] transition-transform duration-400 ease-in-out"
                />
              </li>
              <li>
                <img
                  src="/images/image6.jpg"
                  alt="A puppy who needs a loving home and family"
                  className="border-dark-brown aspect-[3.1/2.1] w-full rounded-[0.8rem] border-[0.19rem] object-cover object-[center_47%] shadow-[0_0.3rem_0.6rem_rgba(0,0,0,0.2),0_0.6rem_1.2rem_rgba(0,0,0,0.15),0_1rem_2rem_rgba(0,0,0,0.08)] transition-transform duration-400 ease-in-out"
                />
              </li>
            </ul>
          </section>
        </main>
  );
}
