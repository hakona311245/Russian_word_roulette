import {
  lazy,
  Suspense,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createScope, createTimeline, stagger } from "animejs";
import { DeckProgress } from "./components/DeckProgress";
import { FilterBar } from "./components/FilterBar";
import { IntroLoader } from "./components/IntroLoader";
import { PracticeCard } from "./components/PracticeCard";
import { useSentenceDeck } from "./hooks/useSentenceDeck";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";

const INTRO_PLAY_MODE: "session" | "always" = "session";
const INTRO_STORAGE_KEY = "russian-word-roulette:intro-seen";
const SHOW_TEGAKI_FONT_PREVIEW = true;

const LazyTegakiFontCandidatePreview = SHOW_TEGAKI_FONT_PREVIEW
  ? lazy(() =>
      import("./components/TegakiFontCandidatePreview").then((module) => ({
        default: module.TegakiFontCandidatePreview,
      })),
    )
  : null;

function shouldShowIntroOnLoad() {
  if (INTRO_PLAY_MODE === "always") {
    return true;
  }

  if (typeof window === "undefined") {
    return true;
  }

  try {
    return window.sessionStorage.getItem(INTRO_STORAGE_KEY) !== "true";
  } catch {
    return true;
  }
}

export default function App() {
  const rootRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const titleUnderlineRef = useRef<SVGPathElement | null>(null);
  const [showIntro, setShowIntro] = useState(shouldShowIntroOnLoad);
  const prefersReducedMotion = usePrefersReducedMotion();
  const {
    currentSentence,
    deckSize,
    error,
    filters,
    isLoading,
    levels,
    nextSentence,
    remainingInPass,
    shownCount,
    topics,
    updateFilters,
  } = useSentenceDeck();

  useLayoutEffect(() => {
    if (prefersReducedMotion || !rootRef.current) {
      return;
    }

    const root = rootRef.current;
    const title = titleRef.current;
    const underline = titleUnderlineRef.current;

    if (!title || !underline) {
      return;
    }

    const underlineLength = underline.getTotalLength();

    const scope = createScope({ root }).add(() => {
      title.style.setProperty("--title-write-mask", "100%");
      underline.style.strokeDasharray = `${underlineLength}`;
      underline.style.strokeDashoffset = `${underlineLength}`;

      const subtitleWords = root.querySelectorAll(".poster-subtitle__word");
      subtitleWords.forEach((word) => {
        const element = word as HTMLElement;
        element.style.opacity = "0";
        element.style.transform = "translateY(0.4em)";
      });

      createTimeline({
        defaults: {
          ease: "outCubic",
        },
      })
        .add(root, { translateY: [6, 0], duration: 520 }, 0)
        .add(
          title,
          {
            "--title-write-mask": ["100%", "0%"],
            duration: 1200,
          },
          90,
        )
        .add(
          underline,
          {
            strokeDashoffset: 0,
            duration: 920,
            ease: "inOutSine",
          },
          460,
        )
        .add(
          subtitleWords,
          {
            opacity: 1,
            translateY: 0,
            delay: stagger(76),
            duration: 360,
          },
          760,
        );
    });

    return () => {
      scope.revert();
    };
  }, [prefersReducedMotion]);

  const handleIntroComplete = useCallback(() => {
    if (INTRO_PLAY_MODE === "session") {
      try {
        window.sessionStorage.setItem(INTRO_STORAGE_KEY, "true");
      } catch {
        // Storage can fail in private modes; the intro should still dismiss.
      }
    }

    setShowIntro(false);
  }, []);

  if (LazyTegakiFontCandidatePreview) {
    return (
      <Suspense
        fallback={
          <main className="tegaki-preview-shell">
            <p className="status-line">Loading Tegaki font preview...</p>
          </main>
        }
      >
        <LazyTegakiFontCandidatePreview />
      </Suspense>
    );
  }

  return (
    <>
      <main
        className={`app-shell ${showIntro ? "app-shell--intro-active" : ""}`}
        ref={rootRef}
        aria-hidden={showIntro ? "true" : undefined}
      >
        <header className="study-header" aria-labelledby="app-title">
          <div className="title-lockup">
            <p className="study-identity__title">Translation practice</p>
            <h1 className="written-title" id="app-title" ref={titleRef}>
              <span className="title-word title-word--russian">Russian</span>{" "}
              <span className="title-word title-word--roulette">Roulette</span>
            </h1>
            <svg
              className="title-ink-line"
              viewBox="0 0 360 28"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                ref={titleUnderlineRef}
                d="M5 18 C 58 7, 108 22, 157 15 S 256 8, 355 17"
              />
            </svg>
            <p
              className="poster-subtitle"
              aria-label="Read, translate, reveal, compare."
            >
              <span className="poster-subtitle__word" aria-hidden="true">
                Read,
              </span>{" "}
              <span className="poster-subtitle__word" aria-hidden="true">
                translate,
              </span>{" "}
              <span className="poster-subtitle__word" aria-hidden="true">
                reveal,
              </span>{" "}
              <span className="poster-subtitle__word" aria-hidden="true">
                compare.
              </span>
            </p>
          </div>

          <DeckProgress
            deckSize={deckSize}
            remainingInPass={remainingInPass}
            shownCount={shownCount}
          />
        </header>

        <div className="study-layout">
          <section className="control-rail" aria-label="Practice setup">
            <FilterBar
              filters={filters}
              levels={levels}
              onChange={updateFilters}
              topics={topics}
            />
          </section>

          <section className="practice-workspace" aria-label="Practice workspace">
            {error ? <p className="error-message">{error}</p> : null}

            <PracticeCard
              isLoading={isLoading}
              onNext={nextSentence}
              remainingInPass={remainingInPass}
              sentence={currentSentence}
              sourceLanguage={filters.sourceLanguage}
              targetLanguage={filters.targetLanguage}
            />
          </section>
        </div>
      </main>

      {showIntro ? <IntroLoader onComplete={handleIntroComplete} /> : null}
    </>
  );
}
