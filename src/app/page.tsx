import {
  ArrowUpRight,
  FolderKanban,
  Instagram,
  Linkedin,
  Mail,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AudioGuide, AudioGuidePlayButton } from "@/components/audio-guide";
import { EntreeCarousel } from "@/components/entree-carousel";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const projects = [
  {
    title: "BlaBlaAHA! Learn Spanish",
    description:
      "An audio-first language app for Spanish, Italian, and German, built around short listening sessions that train real-world confidence.",
    href: "https://apps.apple.com/gb/app/blablaaha-learn-spanish/id6755297500",
    tags: ["iOS", "Full-stack", "Product", "Design"],
    visualStyle: {
      backgroundImage: "url('/blablaaha-composite-phone.png')",
      backgroundPosition: "50% 38%",
    },
  },
  {
    title: "Happy Floor",
    description:
      "A pelvic-health app with audio-guided exercises, video tutorials, daily goals, and progression plans for building a consistent practice.",
    href: "https://www.happyfloorapp.com",
    tags: ["iOS", "Full-stack", "Product", "Design"],
    visualStyle: {
      backgroundImage: "url('/happy-floor-composite-phone.png')",
      backgroundPosition: "50% 38%",
    },
  },
  {
    title: "bend.com",
    description:
      "Owned AI, social, and backend feature work for one of the world's most popular stretching apps.",
    href: "https://www.bend.com",
    tags: ["AI", "Backend", "Product"],
    visualStyle: {
      backgroundImage: "url('/bend-composite-phone-opposite-corner-yinyang.png')",
      backgroundPosition: "50% 38%",
    },
  },
  {
    title: "Looselips",
    description:
      "A conversation app with 1000+ prompts for dating, relationships, friends, and family, designed to make better questions easier to ask.",
    href: "https://apps.apple.com/gb/app/looselips/id1578749536",
    tags: ["iOS", "Full-stack", "Product"],
    visualStyle: {
      backgroundImage: "url('/looselips-composite-phone.png')",
      backgroundPosition: "50% 38%",
    },
  },
  {
    title: "Active in Time",
    description:
      "A SaaS platform helping UK leisure operators manage pool timetables and communicate programme changes clearly.",
    tags: ["Backend", "Product"],
    visualStyle: {
      backgroundImage: "url('/active-in-time-cover.jpg')",
      backgroundPosition: "50% 42%",
    },
  },
  {
    title: "Speedo Fit",
    description:
      "Swim training and tracking tools for people building confidence, technique, and consistency in the water.",
    tags: ["iOS", "Full-stack", "Product", "Design"],
    visualStyle: {
      backgroundImage: "url('/speedo-fit-composite-phone.png')",
      backgroundPosition: "50% 38%",
    },
  },
];

const experiments = [
  {
    title: "ElevenLabs Hack X Stripe",
    description:
      "A Stripe-powered ElevenLabs experiment for adding deliberate pauses, pacing, and payment flow to generated voice experiences.",
    href: "https://www.instagram.com/reel/DYmr8UeoC6-/?igsh=MWpobmZ5c21ucjE1dQ==",
    tags: [],
    visualStyle: {
      backgroundImage: "url('/elevenlabs-stripe-cover.png')",
      backgroundPosition: "center",
    },
  },
  {
    title: "ElevenLabs Hack X Vercel",
    description:
      "A Gold-winning cinematic short built with v0, turning the ElevenLabs site into a launch film for its latest voice model.",
    href: "https://www.instagram.com/reel/DYBAKTMIMBD/?igsh=MWozM3o3bXY0NGtmeg==",
    tags: [],
    visualStyle: {
      backgroundImage: "url('/elevenlabs-vercel-cover.jpg')",
      backgroundPosition: "center",
    },
  },
  {
    title: "ElevenLabs Hack X Speech Engine",
    description:
      "A voice-personality prototype where creators train AI versions of themselves to answer with their own tone, taste, and point of view.",
    href: "https://www.instagram.com/reel/DY408K9oTWy/?igsh=MTltejU4cXE4dmt2eQ==",
    tags: [],
    visualStyle: {
      backgroundImage: "url('/elevenlabs-voice-engine-earflips.png')",
      backgroundPosition: "center",
    },
  },
  {
    title: "Queer Encounters",
    description:
      "A visual and audio storytelling project documenting queer spaces, encounters, and the people who make them feel alive.",
    href: "https://www.instagram.com/reel/DZNFhtSxp8O/?igsh=Ym1zYzhhOHBnbG1v",
    tags: [],
    visualStyle: {
      backgroundImage: "url('/queer-encounters-channoc.jpg')",
      backgroundPosition: "50% 32%",
    },
  },
  {
    title: "Remotion Video Creator",
    description:
      "A Next.js and Remotion video editor for prompting, composing, and rendering videos directly from code.",
    href: "https://www.instagram.com/reel/DZCtGsAoa7a/?igsh=NnRoM2l3bHUzaGJ4",
    tags: [],
    visualStyle: {
      backgroundImage: "url('/remotion-video-creator-cover.png')",
      backgroundPosition: "center",
    },
  },
  {
    title: "Padel Robot Trainer",
    description:
      "A smarter companion app for my padel ball machine, using AI to make solo training sessions more structured and useful.",
    href: "https://youtu.be/jFRsRQzNuS8?si=knrtcjwRDFuH6KZw",
    tags: [],
    visualVideo: "/padel-robot-trainer.mp4",
    visualStyle: {
      backgroundImage:
        "linear-gradient(135deg, #d8ff4d 0%, #ff4638 50%, #4412ff 100%)",
    },
  },
  {
    title: "Photo to Playlist",
    description:
      "A Hermes agent skill that reads a flyer or festival poster from a photo and turns it into a playlist.",
    tags: [],
    visualStyle: {
      backgroundImage: "url('/photo-to-playlist-cover.png')",
      backgroundPosition: "50% 45%",
    },
  },
];

const interests = [
  {
    emoji: "🎾",
    title: "Playing Padel in 30° heat",
  },
  {
    emoji: "🏊",
    title: "Swimming MP3 players",
  },
  {
    emoji: "🎛️",
    title: "Techno (Eli Brown)",
  },
  {
    emoji: "🎸",
    title: "Heavy screamy rock music (Deafhaven)",
  },
  {
    emoji: "🐶",
    title: "My Silly Staffy sunbathing",
  },
  {
    emoji: "🏳️‍🌈",
    title: "Training for Valencia Gay Games",
  },
  {
    emoji: "🇪🇸",
    title: 'Using my new Spanish abilities to order more than just "un cerveza"',
  },
  {
    emoji: "🤖",
    title: "Talking to Wispr Flow using my new DJI mic",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen pb-32">
      <AudioGuide />
      <header className="relative mx-auto flex h-16 max-w-6xl items-center justify-center px-5">
        <a className="font-mono text-sm font-normal uppercase" href="#">
          Daniel Morgan
        </a>
        <div className="absolute right-5 top-1/2 -translate-y-1/2">
          <ThemeToggle />
        </div>
      </header>

      <section
        className="mx-auto grid max-w-6xl gap-8 px-5 py-12 md:grid-cols-[1.2fr_0.8fr] md:items-end md:py-16"
        data-audio-target="intro"
      >
        <div>
          <h1 className="max-w-3xl font-title text-4xl font-normal leading-tight tracking-normal text-balance md:text-5xl">
            Hello, I&apos;m Dan{" "}
            <span className="wave-emoji" aria-hidden="true">
              👋
            </span>
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
            I&apos;ve been making digital products for{" "}
            <span className="font-normal text-foreground">over 15 years</span>.
            I&apos;m a scrappy mix of{" "}
            <span className="font-normal text-foreground">
              creative, engineering, and design
            </span>
            {" "}✨. Originally from{" "}
            <span className="font-normal text-foreground">Wales</span>, I spent
            years in{" "}
            <span className="font-normal text-foreground">London</span>. Now my
            partner and I live in{" "}
            <span className="font-normal text-foreground">
              Torremolinos, Spain
            </span>
            {" "}🇪🇸, trying to learn Spanish (Spoiler: it&apos;s bloody hard).
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <AudioGuidePlayButton />
            <a
              aria-label="Email"
              className={buttonVariants({ variant: "outline", size: "icon" })}
              href="mailto:danmorgz@googlemail.com"
            >
              <Mail aria-hidden="true" />
            </a>
            <a
              aria-label="LinkedIn"
              className={buttonVariants({ variant: "outline", size: "icon" })}
              href="https://www.linkedin.com/in/daniel-morgan-london"
              rel="noreferrer"
              target="_blank"
            >
              <Linkedin aria-hidden="true" />
            </a>
            <a
              aria-label="Instagram"
              className={buttonVariants({ variant: "outline", size: "icon" })}
              href="https://www.instagram.com/danoflondon?igsh=MXB3bWpydG8xYjFkYQ%3D%3D&utm_source=qr"
              rel="noreferrer"
              target="_blank"
            >
              <Instagram aria-hidden="true" />
            </a>
          </div>
        </div>

        <figure>
          <div
            className="overflow-hidden rounded-lg border"
            style={{ borderColor: "var(--subtle-border)" }}
          >
            <video
              aria-label="Daniel Morgan"
              autoPlay
              className="aspect-[3/2] h-full w-full object-cover object-center"
              loop
              muted
              playsInline
              poster="/daniel-morgan-portrait.jpg"
              preload="metadata"
            >
              <source src="/daniel-morgan-loop.mp4" type="video/mp4" />
            </video>
          </div>
          <figcaption className="mt-2 font-mono text-[0.65rem] uppercase leading-none text-neutral-500">
            Someone had to buy it.
          </figcaption>
        </figure>
      </section>

      <div aria-hidden="true">
        <div
          className="border-t"
          style={{ borderColor: "var(--subtle-divider)" }}
        />
      </div>

      <section id="work">
        <EntreeCarousel entrees={experiments} />

        <section
          aria-labelledby="projects-heading"
          className="mx-auto max-w-6xl px-5 pb-14"
        >
          <div className="mb-6 flex items-center gap-2">
            <FolderKanban className="size-4 text-muted-foreground" />
            <h3
              id="projects-heading"
              className="font-mono text-xs uppercase text-muted-foreground"
            >
              Big Projects
            </h3>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {projects.map((project) => {
              const hasHref = "href" in project;
              const card = (
                <Card
                  className={cn(
                    "audio-guide-card grid min-h-44 grid-cols-[1fr_2fr] overflow-hidden p-0 transition duration-200 ease-out group-hover:-translate-y-0.5 group-hover:border-foreground/20 group-hover:shadow-md",
                    hasHref ? "cursor-pointer" : null,
                  )}
                >
                  <div className="overflow-hidden">
                    <div
                      aria-hidden="true"
                      className="audio-guide-visual h-full min-h-44 w-full bg-cover bg-center transition duration-500 ease-out group-hover:scale-[1.04]"
                      style={project.visualStyle}
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <CardHeader>
                      <CardTitle
                        className={cn(
                          "inline-flex items-center gap-1.5 transition group-hover:text-foreground",
                          hasHref ? "group-hover:font-medium" : null,
                        )}
                      >
                        {project.title}
                        {hasHref ? (
                          <ArrowUpRight
                            aria-hidden="true"
                            className="size-4"
                          />
                        ) : null}
                      </CardTitle>
                      <CardDescription>{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <Badge key={tag} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </div>
                </Card>
              );

              if (!hasHref) {
                return (
                  <div className="group" key={project.title}>
                    <div data-audio-target={project.title}>{card}</div>
                  </div>
                );
              }

              return (
                <a
                  className="group block cursor-pointer text-card-foreground no-underline outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  data-audio-target={project.title}
                  href={project.href}
                  key={project.title}
                  rel="noreferrer"
                  target="_blank"
                >
                  {card}
                </a>
              );
            })}
          </div>
        </section>
      </section>

      <div aria-hidden="true">
        <div
          className="border-t"
          style={{ borderColor: "var(--subtle-divider)" }}
        />
      </div>

      <section id="interests" className="py-14">
        <div className="mx-auto max-w-6xl px-5">
          <p className="font-mono text-xs uppercase text-muted-foreground">
            What&apos;s exciting me at the moment
          </p>
        </div>
        <div className="interest-carousel mt-6 overflow-hidden">
          <div className="interest-track flex w-max">
            {[0, 1].map((loopIndex) => (
              <div
                aria-hidden={loopIndex === 1}
                className="flex shrink-0 gap-3 pl-[var(--page-gutter)] pr-3"
                key={loopIndex}
              >
                {interests.map((interest) => (
                  <div
                    className="flex h-12 shrink-0 items-center gap-2 rounded-full border bg-card px-5 text-card-foreground"
                    key={`${loopIndex}-${interest.title}`}
                  >
                    <span className="text-xl leading-none" aria-hidden="true">
                      {interest.emoji}
                    </span>
                    <span className="whitespace-nowrap text-sm font-normal leading-tight">
                      {interest.title}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer
        id="contact"
        className="border-t text-foreground"
        data-audio-target="contact"
        style={{ borderColor: "var(--subtle-divider)" }}
      >
        <div className="mx-auto flex max-w-6xl justify-end px-5 py-8">
          <div className="flex gap-2">
            <a
              className={buttonVariants({ variant: "secondary", size: "icon" })}
              href="mailto:danmorgz@googlemail.com"
              aria-label="Email"
            >
              <Mail aria-hidden="true" />
            </a>
            <a
              aria-label="LinkedIn"
              className={buttonVariants({ variant: "secondary", size: "icon" })}
              href="https://www.linkedin.com/in/daniel-morgan-london"
              rel="noreferrer"
              target="_blank"
            >
              <Linkedin aria-hidden="true" />
            </a>
            <a
              aria-label="Instagram"
              className={buttonVariants({ variant: "secondary", size: "icon" })}
              href="https://www.instagram.com/danoflondon?igsh=MXB3bWpydG8xYjFkYQ%3D%3D&utm_source=qr"
              rel="noreferrer"
              target="_blank"
            >
              <Instagram aria-hidden="true" />
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
