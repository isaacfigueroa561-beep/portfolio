import { Link } from "wouter";

const SKILLS = [
  "Brand Identity", "Art Direction", "Campaign Design", "Social Content",
  "Web Design", "Typography", "Print & Merch", "Motion Basics",
];

const TOOLS = ["Illustrator", "Photoshop", "InDesign", "After Effects", "Figma", "Lightroom", "Premiere", "Notion"];

const TRAINING = [
  { title: "Google UX/UI Design", sub: "Coursera / Google" },
  { title: "Typography & Design", sub: "The Futur / Chris Do" },
  { title: "Figma for Designers", sub: "Max Brinckmann" },
];

const LANGUAGES = [
  { name: "English", level: "Fluent" },
  { name: "Spanish", level: "Fluent" },
];

const EXPERIENCE = [
  {
    start: "2025",
    end: "Present",
    title: "Founder & Creative Director",
    company: "Wave Creative House / Remote",
    bullets: [
      "Founded and run a remote creative studio delivering brand identity, web design, and marketing design for small brands and businesses.",
      "Design and build marketing websites end to end, including Assunta, a heritage Italian food brand, Little Pilot, a marketing agency, and a seasonal holiday campaign site.",
      "Own each project from discovery and concept through art direction, design, build, and handoff, including scope, timeline, and the client relationship.",
      "Build complete identity systems covering logo, type, color, and brand guidelines, plus the social and print assets that run on them.",
      "Built the studio's own brand, website, and operating system from zero with a business partner.",
    ],
  },
  {
    start: "2021",
    end: "2026",
    title: "Creative Designer",
    company: "Church Media Squad",
    bullets: [
      "Delivered 1,000+ design assets for a client base of 500+ churches and non-profits nationwide, covering brand, print, merch, and social.",
      "Built cohesive visual systems for fundraising campaigns, youth events, and seasonal series, turning mission-driven messaging into work people actually engage with.",
      "Partnered directly with leadership and marketing teams to shape brand voice and campaign strategy from concept through delivery.",
      "Held consistent quality across a high-volume subscription workflow with tight, recurring turnaround windows.",
    ],
  },
  {
    start: "2021",
    end: "",
    title: "Graphic Designer",
    company: "Vive Media",
    bullets: [
      "Created social graphics, thumbnails, and marketing assets for digital campaigns and live events.",
      "Produced on-brand visuals on fast turnaround across multiple concurrent campaigns.",
    ],
  },
  {
    start: "2020",
    end: "2021",
    title: "Junior Graphic Designer",
    company: "Vibrant Media",
    bullets: [
      "Designed social and digital graphics for multiple client brands simultaneously.",
      "Produced promotional visuals for campaigns, events, and digital ad placements.",
    ],
  },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-sans font-light text-[10px] uppercase tracking-[0.25em] text-[#FF4D00] pb-3 mb-6 border-b border-[#1a1a1a]">
      {children}
    </div>
  );
}

export function ResumePage() {
  return (
    <div className="min-h-[100dvh] w-full bg-background text-foreground font-sans">
      <nav aria-label="Main navigation" className="w-full px-8 md:px-16 py-4 md:py-6 flex justify-between items-center border-b border-[#1a1a1a] bg-background/80 backdrop-blur-sm">
        <Link href="/" className="font-serif font-bold text-2xl text-[#F5F0E8] uppercase" aria-label="Isaac Figueroa, home">
          IF.
        </Link>
        <div className="flex gap-6 md:gap-8 font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <a href="/#work" className="hover:text-[#F5F0E8] transition-colors">WORK</a>
          <a href="/#about" className="hover:text-[#F5F0E8] transition-colors">ABOUT</a>
          <a href="/#contact" className="hover:text-[#F5F0E8] transition-colors">CONTACT</a>
        </div>
      </nav>

      <main className="px-8 md:px-16 py-16 md:py-24 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 pb-10 mb-16 border-b-2 border-[#F5F0E8]">
          <div>
            <h1 className="font-serif font-extrabold text-5xl md:text-7xl text-[#F5F0E8] lowercase first-letter:uppercase leading-[0.9] tracking-tight">
              Isaac<br /><span className="text-[#FF4D00] lowercase first-letter:uppercase inline-block">Figueroa</span>
            </h1>
            <p className="font-sans font-light text-xs text-muted-foreground uppercase tracking-[0.2em] mt-5">
              Creative Director / Brand, Social &amp; Digital Content
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-3 flex-shrink-0">
            <div className="font-serif font-medium text-xs text-[#F5F0E8] border border-[#2a2a2a] px-4 py-2 uppercase rounded-pill">
              Remote · U.S. Citizen · EN/ES
            </div>
            <div className="flex flex-col items-start md:items-end font-sans font-light text-sm text-muted-foreground">
              <a href="mailto:isaacfigueroa561@gmail.com" className="hover:text-[#F5F0E8] transition-colors">isaacfigueroa561@gmail.com</a>
              <a href="tel:+17027880115" className="hover:text-[#F5F0E8] transition-colors">+1 (702) 788-0115</a>
              <a href="https://wavecreativehouse.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#F5F0E8] transition-colors">wavecreativehouse.com</a>
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="font-sans font-light text-base md:text-lg text-[#F5F0E8]/80 leading-relaxed max-w-3xl mb-20 border-l-2 border-[#FF4D00] pl-6">
          Creative designer and studio founder with 6+ years of brand and campaign work, including design for
          500+ churches and non-profits across the U.S. I run identity, web, social, and print end to end,
          from concept through final delivery, and I move fast without losing the craft. Looking for a remote
          creative role where typography and visual storytelling actually matter.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16">
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-14">
            <section>
              <SectionLabel>Skills</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {SKILLS.map((s) => (
                  <span key={s} className="font-sans font-light text-xs uppercase tracking-[0.1em] text-[#F5F0E8] border border-[#2a2a2a] px-3 py-2 rounded-pill">
                    {s}
                  </span>
                ))}
              </div>
            </section>

            <section>
              <SectionLabel>Tools</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {TOOLS.map((t) => (
                  <span key={t} className="font-sans font-light text-xs uppercase tracking-[0.1em] text-[#F5F0E8] border border-[#2a2a2a] px-3 py-2 rounded-pill">
                    {t}
                  </span>
                ))}
              </div>
            </section>

            <section>
              <SectionLabel>Training</SectionLabel>
              <div className="flex flex-col gap-5">
                {TRAINING.map((t) => (
                  <div key={t.title}>
                    <div className="font-serif font-semibold text-sm text-[#F5F0E8]">{t.title}</div>
                    <div className="font-sans font-light text-xs text-muted-foreground mt-1">{t.sub}</div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <SectionLabel>Languages</SectionLabel>
              <div className="flex flex-col gap-3">
                {LANGUAGES.map((l) => (
                  <div key={l.name} className="flex items-center justify-between max-w-[220px] font-sans font-light text-sm">
                    <span className="flex items-center gap-2 text-[#F5F0E8]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D00]" aria-hidden="true" />
                      {l.name}
                    </span>
                    <span className="text-muted-foreground">{l.level}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <SectionLabel>Availability</SectionLabel>
              <div className="font-serif font-semibold text-sm text-[#F5F0E8]">Remote, Full-Time</div>
              <div className="font-sans font-light text-xs text-muted-foreground mt-1">U.S. business hours</div>
            </section>
          </div>

          {/* RIGHT COLUMN: Experience */}
          <section>
            <SectionLabel>Experience</SectionLabel>
            <div className="flex flex-col gap-14">
              {EXPERIENCE.map((job) => (
                <div key={job.company} className="grid grid-cols-[auto_1fr] gap-6 md:gap-10">
                  <div className="font-sans font-light text-xs text-muted-foreground uppercase tracking-widest pt-1 whitespace-nowrap">
                    {job.start}{job.end && <><br />{job.end}</>}
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-xl md:text-2xl text-[#F5F0E8] lowercase first-letter:uppercase">{job.title}</h3>
                    <div className="font-sans font-light text-xs text-[#FF4D00] uppercase tracking-widest mt-1 mb-4">{job.company}</div>
                    <ul className="flex flex-col gap-2">
                      {job.bullets.map((b, i) => (
                        <li key={i} className="flex items-start gap-2 font-sans font-light text-sm text-[#F5F0E8]/70 leading-relaxed">
                          <span className="text-[#FF4D00] mt-[2px] flex-shrink-0" aria-hidden="true">→</span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-24 pt-10 border-t border-[#1a1a1a] flex flex-wrap gap-8 font-sans font-light text-xs text-muted-foreground uppercase tracking-wide">
          <Link href="/" className="hover:text-[#F5F0E8] transition-colors">Back Home</Link>
          <a href="/#contact" className="hover:text-[#F5F0E8] transition-colors">Get In Touch</a>
        </div>
      </main>
    </div>
  );
}
