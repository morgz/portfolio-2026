"use client";

import type { CSSProperties } from "react";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Video,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const INITIAL_ACTIVE_INDEX = 1;
const AUDIO_GUIDE_MANUAL_PAUSE_MS = 10_000;
const AUDIO_GUIDE_CURRENT_TARGET_REQUEST_EVENT =
  "audio-guide-current-target-request";

type Entree = {
  title: string;
  description: string;
  href?: string;
  tags: string[];
  visualStyle: CSSProperties;
  visualVideo?: string;
};

function EntreeTitle({ title }: { title: string }) {
  const [prefix, suffix] = title.split(" X ");

  if (!suffix) {
    return title;
  }

  return (
    <>
      {prefix} <span className="text-muted-foreground/45">X</span> {suffix}
    </>
  );
}

function isVideoLink(href?: string) {
  return href
    ? /(?:instagram\.com|youtube\.com|youtu\.be)/i.test(href)
    : false;
}

function EntreeVideo({
  isActive,
  src,
}: {
  isActive: boolean;
  src: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    if (!isActive) {
      video.pause();
      return;
    }

    void video.play().catch(() => {
      video.pause();
    });
  }, [isActive]);

  return (
    <video
      aria-hidden="true"
      className={cn(
        "audio-guide-visual h-[120px] w-full shrink-0 object-cover transition duration-500 ease-out group-hover:scale-[1.03]",
        isActive ? "audio-guide-visual-active" : null,
      )}
      loop
      muted
      playsInline
      preload="metadata"
      ref={videoRef}
      src={src}
    />
  );
}

export function EntreeCarousel({ entrees }: { entrees: Entree[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const initialIndex = Math.min(
    INITIAL_ACTIVE_INDEX,
    Math.max(entrees.length - 1, 0),
  );
  const snapIndexRef = useRef(initialIndex);
  const pausedRef = useRef(false);
  const audioGuideIsPlayingRef = useRef(false);
  const audioGuideControlsCarouselRef = useRef(false);
  const audioGuideTargetRef = useRef<string | null>(null);
  const manualPauseTimeoutRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(initialIndex);
  const [audioGuideTarget, setAudioGuideTarget] = useState<string | null>(null);
  const [audioGuideIsPlaying, setAudioGuideIsPlaying] = useState(false);
  const hasSetInitialPositionRef = useRef(false);

  const scrollToCard = useCallback(
    (
      index: number,
      direction: 1 | -1 = 1,
      behavior: ScrollBehavior = "smooth",
    ) => {
      const scroller = scrollerRef.current;
      const cards = Array.from(
        scroller?.querySelectorAll<HTMLElement>("[data-entree-card]") ?? [],
      );

      if (!scroller || !cards.length) {
        return;
      }

      const candidates = cards
        .filter((card) => Number(card.dataset.entreeIndex) === index)
        .map((card) => ({
          card,
          left: card.offsetLeft - (scroller.clientWidth - card.offsetWidth) / 2,
        }));

      const directionalCandidates = candidates.filter(({ left }) =>
        direction === 1
          ? left > scroller.scrollLeft + 1
          : left < scroller.scrollLeft - 1,
      );
      const sortedCandidates = [
        ...(directionalCandidates.length ? directionalCandidates : candidates),
      ].sort((a, b) =>
        direction === 1 ? a.left - b.left : b.left - a.left,
      );
      const target = sortedCandidates[0];

      if (!target) {
        return;
      }

      snapIndexRef.current = index;
      setActiveIndex(index);
      scroller.scrollTo({ behavior, left: target.left });
    },
    [],
  );

  useEffect(() => {
    const scroller = scrollerRef.current;

    if (!scroller) {
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let scrollFrameId = 0;
    const autoplayId = window.setInterval(() => {
      if (pausedRef.current || reduceMotion.matches) {
        return;
      }

      const currentIndex = snapIndexRef.current;
      const nextIndex = (currentIndex + 1) % entrees.length;
      const direction =
        currentIndex === entrees.length - 1 && nextIndex === 0 ? -1 : 1;

      scrollToCard(nextIndex, direction);
    }, 7200);

    function updateActiveCard() {
      if (activeIndex === null) {
        return;
      }

      const cards = Array.from(
        scroller?.querySelectorAll<HTMLElement>("[data-entree-card]") ?? [],
      );

      if (!scroller || !cards.length) {
        return;
      }

      const firstCard = cards[0];
      const firstDuplicateCard = cards[entrees.length];
      const loopWidth =
        firstCard && firstDuplicateCard
          ? firstDuplicateCard.offsetLeft - firstCard.offsetLeft
          : 0;

      if (loopWidth > 0 && scroller.scrollLeft >= loopWidth) {
        scroller.scrollLeft -= loopWidth;
      }

      const scrollerCenter = scroller.scrollLeft + scroller.clientWidth / 2;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      cards.forEach((card) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const distance = Math.abs(cardCenter - scrollerCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = Number(card.dataset.entreeIndex ?? 0);
        }
      });

      const normalizedIndex = closestIndex % entrees.length;
      snapIndexRef.current = normalizedIndex;
      setActiveIndex(normalizedIndex);
    }

    function onScroll() {
      window.cancelAnimationFrame(scrollFrameId);
      scrollFrameId = window.requestAnimationFrame(updateActiveCard);
    }

    if (!hasSetInitialPositionRef.current && entrees.length > 1) {
      hasSetInitialPositionRef.current = true;
      scrollToCard(initialIndex, 1, "instant");
    } else {
      updateActiveCard();
    }

    scroller.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      scroller.removeEventListener("scroll", onScroll);
      window.cancelAnimationFrame(scrollFrameId);
      window.clearInterval(autoplayId);
    };
  }, [activeIndex, entrees.length, initialIndex, scrollToCard]);

  useEffect(() => {
    function onAudioGuideTarget(event: Event) {
      const target = (event as CustomEvent<{ target?: string }>).detail?.target;
      audioGuideTargetRef.current = target ?? null;
      setAudioGuideTarget(target ?? null);
      const targetIndex = entrees.findIndex((entree) => entree.title === target);
      audioGuideControlsCarouselRef.current = targetIndex !== -1;

      if (targetIndex === -1) {
        if (audioGuideIsPlayingRef.current) {
          pausedRef.current = true;
          setActiveIndex(null);
        }

        return;
      }

      if (manualPauseTimeoutRef.current !== null) {
        return;
      }

      pausedRef.current = true;
      scrollToCard(targetIndex);
    }

    function onAudioGuidePlaybackState(event: Event) {
      audioGuideIsPlayingRef.current = Boolean(
        (event as CustomEvent<{ isPlaying?: boolean }>).detail?.isPlaying,
      );
      setAudioGuideIsPlaying(audioGuideIsPlayingRef.current);

      if (!audioGuideIsPlayingRef.current && manualPauseTimeoutRef.current === null) {
        pausedRef.current = false;
      }

      if (
        audioGuideIsPlayingRef.current &&
        !audioGuideControlsCarouselRef.current
      ) {
        pausedRef.current = true;
        setActiveIndex(null);
      }
    }

    window.addEventListener("audio-guide-target", onAudioGuideTarget);
    window.addEventListener(
      "audio-guide-playback-state",
      onAudioGuidePlaybackState,
    );

    return () => {
      window.removeEventListener("audio-guide-target", onAudioGuideTarget);
      window.removeEventListener(
        "audio-guide-playback-state",
        onAudioGuidePlaybackState,
      );
    };
  }, [entrees, scrollToCard]);

  useEffect(() => {
    return () => {
      if (manualPauseTimeoutRef.current !== null) {
        window.clearTimeout(manualPauseTimeoutRef.current);
      }
    };
  }, []);

  function canReleasePause() {
    return manualPauseTimeoutRef.current === null;
  }

  function pauseAutoScrollAfterManualNavigation() {
    if (manualPauseTimeoutRef.current !== null) {
      window.clearTimeout(manualPauseTimeoutRef.current);
    }

    pausedRef.current = true;
    manualPauseTimeoutRef.current = window.setTimeout(() => {
      manualPauseTimeoutRef.current = null;
      pausedRef.current =
        audioGuideIsPlayingRef.current || !audioGuideControlsCarouselRef.current;
      window.dispatchEvent(
        new CustomEvent(AUDIO_GUIDE_CURRENT_TARGET_REQUEST_EVENT, {
          detail: { scrollPage: false },
        }),
      );
    }, AUDIO_GUIDE_MANUAL_PAUSE_MS);
  }

  function scrollByCard(direction: 1 | -1) {
    const currentIndex = snapIndexRef.current;
    const nextIndex =
      (currentIndex + direction + entrees.length) % entrees.length;
    const scrollDirection =
      direction === 1 && currentIndex === entrees.length - 1 && nextIndex === 0
        ? -1
        : direction;

    pauseAutoScrollAfterManualNavigation();
    scrollToCard(nextIndex, scrollDirection);
  }

  return (
    <section aria-labelledby="latest-work-heading" className="py-14">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-muted-foreground" />
          <h3
            id="latest-work-heading"
            className="font-mono text-xs uppercase text-muted-foreground"
          >
            Latest Work/Experiments
          </h3>
        </div>
        <div className="flex gap-2">
          <Button
            aria-label="Previous latest work"
            onClick={() => scrollByCard(-1)}
            size="icon"
            type="button"
            variant="outline"
          >
            <ChevronLeft aria-hidden="true" />
          </Button>
          <Button
            aria-label="Next latest work"
            onClick={() => scrollByCard(1)}
            size="icon"
            type="button"
            variant="outline"
          >
            <ChevronRight aria-hidden="true" />
          </Button>
        </div>
      </div>

      <div
        className="entree-carousel mt-0 overflow-x-auto py-4"
        onBlur={() => {
          if (canReleasePause()) {
            pausedRef.current = audioGuideIsPlayingRef.current;
          }
        }}
        onFocus={() => {
          pausedRef.current = true;
        }}
        ref={scrollerRef}
      >
        <div className="entree-carousel-track flex w-max items-center gap-4">
          {[...entrees, ...entrees].map((entree, index) => {
            const isDuplicate = index >= entrees.length;
            const normalizedIndex = index % entrees.length;
            const isActive = activeIndex === normalizedIndex;
            const isAudioGuideHighlight =
              audioGuideIsPlaying && audioGuideTarget === entree.title;
            const isVisualActive = isActive || isAudioGuideHighlight;
            const isProminent = isActive || isAudioGuideHighlight;
            const card = (
              <Card
                aria-hidden={isDuplicate}
                className={cn(
                  "flex min-h-60 w-[82vw] max-w-[22rem] shrink-0 scroll-mx-[var(--page-gutter)] snap-center flex-col justify-between overflow-hidden p-0 transition duration-300 ease-out sm:w-[22rem] lg:w-[28rem] lg:max-w-[28rem]",
                  "audio-guide-card",
                  isAudioGuideHighlight ? "audio-guide-highlight" : null,
                  isProminent
                    ? "scale-100 border-foreground/30 shadow-lg"
                    : "scale-[0.92] opacity-55 shadow-none",
                  "group-hover:scale-100 group-hover:-translate-y-0.5 group-hover:border-foreground/20 group-hover:opacity-100 group-hover:shadow-md",
                )}
                data-entree-card
                data-entree-index={normalizedIndex}
                data-entree-position={index}
                data-audio-target={entree.title}
              >
                {entree.visualVideo ? (
                  <EntreeVideo
                    isActive={isVisualActive}
                    src={entree.visualVideo}
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className={cn(
                      "audio-guide-visual h-[120px] shrink-0 bg-cover bg-center transition duration-500 ease-out group-hover:scale-[1.03]",
                      isVisualActive ? "audio-guide-visual-active" : null,
                    )}
                    style={entree.visualStyle}
                  />
                )}
                <div
                  className={cn(
                    "flex flex-1 flex-col",
                    entree.tags.length ? "justify-between" : "justify-start",
                  )}
                >
                  <CardHeader className="p-4 pb-2">
                    <CardTitle
                      className={cn(
                        "inline-flex items-center gap-1.5 transition group-hover:text-foreground",
                        entree.href
                          ? "group-hover:underline group-hover:underline-offset-4"
                          : null,
                      )}
                    >
                      <EntreeTitle title={entree.title} />
                      {isVideoLink(entree.href) ? (
                        <Video aria-hidden="true" className="ml-2 size-4" />
                      ) : null}
                      {entree.href ? (
                        <ArrowUpRight aria-hidden="true" className="size-4" />
                      ) : null}
                    </CardTitle>
                    <CardDescription>{entree.description}</CardDescription>
                  </CardHeader>
                  {entree.tags.length ? (
                    <CardContent className="p-4 pt-1">
                      <div className="flex flex-wrap gap-2">
                        {entree.tags.map((tag) => (
                          <Badge key={tag} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  ) : null}
                </div>
              </Card>
            );

            if (!entree.href) {
              return (
                <div
                  className="group"
                  key={`${entree.title}-${index}`}
                  onPointerEnter={() => {
                    pausedRef.current = true;
                  }}
                  onPointerLeave={() => {
                    if (canReleasePause()) {
                      pausedRef.current = audioGuideIsPlayingRef.current;
                    }
                  }}
                >
                  {card}
                </div>
              );
            }

            return (
              <a
                aria-hidden={isDuplicate}
                className="group block text-card-foreground no-underline outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                href={entree.href}
                key={`${entree.title}-${index}`}
                onPointerEnter={() => {
                  pausedRef.current = true;
                }}
                onPointerLeave={() => {
                  if (canReleasePause()) {
                    pausedRef.current = audioGuideIsPlayingRef.current;
                  }
                }}
                rel="noreferrer"
                tabIndex={isDuplicate ? -1 : undefined}
                target="_blank"
              >
                {card}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
