"use client";

import { AudioLines, CirclePlay, Pause } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

type AudioCue = {
  start: number;
  end: number;
  label: string;
  target: string;
};

const audioCues: AudioCue[] = [
  {
    start: 0.56,
    end: 27.9,
    label: "Meet Dan",
    target: "intro",
  },
  {
    start: 27.9,
    end: 48.94,
    label: "ElevenLabs and Stripe",
    target: "ElevenLabs Hack X Stripe",
  },
  {
    start: 48.94,
    end: 84.98,
    label: "ElevenLabs and Vercel",
    target: "ElevenLabs Hack X Vercel",
  },
  {
    start: 84.98,
    end: 120.24,
    label: "Speech Engine",
    target: "ElevenLabs Hack X Speech Engine",
  },
  {
    start: 120.24,
    end: 133.34,
    label: "Queer Encounters",
    target: "Queer Encounters",
  },
  {
    start: 133.34,
    end: 162.88,
    label: "Remotion Video Creator",
    target: "Remotion Video Creator",
  },
  {
    start: 162.88,
    end: 184.26,
    label: "Padel Robot Trainer",
    target: "Padel Robot Trainer",
  },
  {
    start: 184.26,
    end: 228.34,
    label: "Photo to Playlist",
    target: "Photo to Playlist",
  },
  {
    start: 228.34,
    end: 252.16,
    label: "BlaBlaAHA!",
    target: "BlaBlaAHA! Learn Spanish",
  },
  {
    start: 252.16,
    end: 284.7,
    label: "Happy Floor",
    target: "Happy Floor",
  },
  {
    start: 284.7,
    end: 309.66,
    label: "bend.com",
    target: "bend.com",
  },
  {
    start: 309.66,
    end: 329.64,
    label: "Looselips",
    target: "Looselips",
  },
  {
    start: 329.64,
    end: 356.3,
    label: "Active in Time",
    target: "Active in Time",
  },
  {
    start: 356.3,
    end: 388.8,
    label: "Speedo Fit",
    target: "Speedo Fit",
  },
  {
    start: 388.8,
    end: 402.98,
    label: "Contact",
    target: "contact",
  },
];

const highlightClass = "audio-guide-highlight";
const playbackRates = [1, 1.25, 1.5, 2];
const defaultPlaybackRate = 1.5;
const playbackStateEvent = "audio-guide-playback-state";
const playbackRateEvent = "audio-guide-playback-rate";
const currentTargetRequestEvent = "audio-guide-current-target-request";
const tourPlayingClass = "audio-guide-is-playing";

function findCue(time: number) {
  return audioCues.find((cue) => time >= cue.start && time < cue.end) ?? null;
}

function getTargetElements(target: string) {
  return Array.from(
    document.querySelectorAll<HTMLElement>(
      `[data-audio-target="${CSS.escape(target)}"]`,
    ),
  );
}

function dispatchPlaybackState(isPlaying: boolean) {
  document.documentElement.classList.toggle(tourPlayingClass, isPlaying);
  window.dispatchEvent(
    new CustomEvent(playbackStateEvent, {
      detail: { isPlaying },
    }),
  );
}

function dispatchPlaybackRate(rate: number) {
  window.dispatchEvent(
    new CustomEvent(playbackRateEvent, {
      detail: { rate },
    }),
  );
}

function dispatchAudioGuideTarget(target: string) {
  window.dispatchEvent(
    new CustomEvent("audio-guide-target", {
      detail: { target },
    }),
  );
}

export function AudioGuide() {
  const [activeCue, setActiveCue] = useState<AudioCue | null>(null);
  const [playbackRate, setPlaybackRate] = useState(defaultPlaybackRate);
  const activeTargetRef = useRef<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  const allTargets = useMemo(
    () => Array.from(new Set(audioCues.map((cue) => cue.target))),
    [],
  );

  useEffect(() => {
    document.documentElement.classList.remove(tourPlayingClass);

    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }

      document.documentElement.classList.remove(tourPlayingClass);
      document
        .querySelectorAll(`.${highlightClass}`)
        .forEach((element) => element.classList.remove(highlightClass));
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.playbackRate = playbackRate;
  }, [playbackRate]);

  useEffect(() => {
    function onPlaybackRate(event: Event) {
      const rate = (event as CustomEvent<{ rate?: number }>).detail?.rate;

      if (!rate || !playbackRates.includes(rate)) {
        return;
      }

      setPlaybackRate(rate);
    }

    window.addEventListener(playbackRateEvent, onPlaybackRate);

    return () => {
      window.removeEventListener(playbackRateEvent, onPlaybackRate);
    };
  }, []);

  function clearHighlights() {
    allTargets.forEach((target) => {
      getTargetElements(target).forEach((element) => {
        element.classList.remove(highlightClass);
      });
    });
  }

  function activateCue(
    cue: AudioCue | null,
    options: { forceTargetEvent?: boolean; scrollPage?: boolean } = {},
  ) {
    setActiveCue(cue);

    if (activeTargetRef.current === cue?.target) {
      if (cue && options.forceTargetEvent) {
        dispatchAudioGuideTarget(cue.target);
      }

      return;
    }

    activeTargetRef.current = cue?.target ?? null;
    clearHighlights();

    if (!cue) {
      return;
    }

    const elements = getTargetElements(cue.target);
    elements.forEach((element) => {
      element.classList.add(highlightClass);
    });

    dispatchAudioGuideTarget(cue.target);

    const visibleElement =
      elements.find((element) => element.getAttribute("aria-hidden") !== "true") ??
      elements[0];

    if (options.scrollPage !== false) {
      visibleElement?.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }

  function syncCueToAudio(
    options: { forceTargetEvent?: boolean; scrollPage?: boolean } = {},
  ) {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    activateCue(findCue(audio.currentTime), options);
  }

  function stopCueSyncLoop() {
    if (animationFrameRef.current === null) {
      return;
    }

    window.cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = null;
  }

  function startCueSyncLoop() {
    stopCueSyncLoop();

    function tick() {
      const audio = audioRef.current;

      if (!audio || audio.paused || audio.ended) {
        animationFrameRef.current = null;
        return;
      }

      activateCue(findCue(audio.currentTime));
      animationFrameRef.current = window.requestAnimationFrame(tick);
    }

    animationFrameRef.current = window.requestAnimationFrame(tick);
  }

  useEffect(() => {
    function onCurrentTargetRequest(event: Event) {
      syncCueToAudio({
        forceTargetEvent: true,
        scrollPage:
          (event as CustomEvent<{ scrollPage?: boolean }>).detail?.scrollPage,
      });
    }

    window.addEventListener(currentTargetRequestEvent, onCurrentTargetRequest);

    return () => {
      window.removeEventListener(
        currentTargetRequestEvent,
        onCurrentTargetRequest,
      );
    };
  });

  return (
    <aside
      aria-label="Audio-guided portfolio tour"
      className="fixed bottom-4 left-1/2 z-50 w-[calc(100vw-2rem)] max-w-xl -translate-x-1/2 rounded-lg border bg-background/95 p-3 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/85"
      style={{ borderColor: "var(--subtle-border)" }}
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <AudioLines className="size-4 shrink-0 text-muted-foreground" />
          <p className="truncate font-mono text-[0.7rem] uppercase text-muted-foreground">
            Audio tour
          </p>
        </div>
        <div className="flex min-w-0 items-center gap-2">
          {activeCue ? (
            <Badge className="hidden max-w-40 truncate sm:inline-flex" variant="outline">
              {activeCue.label}
            </Badge>
          ) : null}
          <div className="flex rounded-md border p-0.5" style={{ borderColor: "var(--subtle-border)" }}>
            {playbackRates.map((rate) => (
              <button
                aria-label={`Play at ${rate} times speed`}
                aria-pressed={playbackRate === rate}
                className="h-6 rounded-[calc(var(--radius)-3px)] px-2 font-mono text-[0.65rem] leading-none text-muted-foreground transition hover:text-foreground aria-pressed:bg-foreground aria-pressed:text-background"
                key={rate}
                onClick={() => {
                  setPlaybackRate(rate);
                  dispatchPlaybackRate(rate);
                }}
                type="button"
              >
                {rate}x
              </button>
            ))}
          </div>
        </div>
      </div>
      <audio
        className="h-9 w-full"
        controls
        data-audio-guide-player
        onEnded={() => {
          stopCueSyncLoop();
          activateCue(null);
          dispatchPlaybackState(false);
        }}
        onPause={() => {
          stopCueSyncLoop();
          dispatchPlaybackState(false);

          if (!audioRef.current?.ended) {
            return;
          }

          activateCue(null);
        }}
        onPlay={() => {
          syncCueToAudio({ forceTargetEvent: true });
          startCueSyncLoop();
          dispatchPlaybackState(true);
        }}
        onSeeked={() => {
          syncCueToAudio({ forceTargetEvent: true });
        }}
        onTimeUpdate={(event) => {
          activateCue(findCue(event.currentTarget.currentTime));
        }}
        onLoadedMetadata={(event) => {
          event.currentTarget.playbackRate = playbackRate;
        }}
        preload="metadata"
        ref={audioRef}
        src="/audio/audio-3.m4a"
      />
    </aside>
  );
}

export function AudioGuidePlayButton() {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    function onPlaybackState(event: Event) {
      setIsPlaying(
        Boolean(
          (event as CustomEvent<{ isPlaying?: boolean }>).detail?.isPlaying,
        ),
      );
    }

    window.addEventListener(playbackStateEvent, onPlaybackState);

    return () => {
      window.removeEventListener(playbackStateEvent, onPlaybackState);
    };
  }, []);

  function toggleAudioGuide() {
    const audio = document.querySelector<HTMLAudioElement>(
      "[data-audio-guide-player]",
    );

    if (!audio) {
      return;
    }

    if (!audio.paused && !audio.ended) {
      audio.pause();
      return;
    }

    audio.playbackRate = defaultPlaybackRate;
    dispatchPlaybackRate(defaultPlaybackRate);
    void audio.play();
  }

  return (
    <button
      aria-label={isPlaying ? "Pause audio tour" : "Play audio tour"}
      className={buttonVariants({ variant: "outline", size: "default" })}
      onClick={toggleAudioGuide}
      type="button"
    >
      {isPlaying ? (
        <>
          <Pause aria-hidden="true" />
          Pause
        </>
      ) : (
        <>
          <CirclePlay aria-hidden="true" />
          Audio Tour
        </>
      )}
    </button>
  );
}
