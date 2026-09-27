import { BrickStats } from "@/components/sections/BrickStats";
import { Builds } from "@/components/sections/Builds";
import { Contact } from "@/components/sections/Contact";
import { Conveyor } from "@/components/sections/Conveyor";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { Lab } from "@/components/sections/Lab";
import { Nav } from "@/components/sections/Nav";
import { TrophyShelf } from "@/components/sections/TrophyShelf";
import { Workshop } from "@/components/sections/Workshop";
import { person } from "@/content/site";
import { resumeHref } from "@/lib/resume";

export default function Home() {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-toast focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-white">
        Skip to content
      </a>
      <Nav name={person.name} />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero resumeHref={resumeHref()} />
        <Workshop />
        <Builds />
        <Lab />
        <Conveyor />
        <BrickStats />
        <TrophyShelf />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
