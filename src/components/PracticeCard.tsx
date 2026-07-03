import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { animate, createTimeline } from "animejs";
import type { LanguageCode, Sentence } from "../types";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { HandwrittenSourceSentence } from "./HandwrittenSourceSentence";
import { PaperButton } from "./PaperButton";
import { PaperPanel } from "./PaperPanel";

const languageDisplayLabels: Record<LanguageCode, string> = {
  vi: "Vietnamese",
  en: "English",
  ru: "Russian",
};

function vietnameseTextClass(language: LanguageCode) {
  return language === "vi" ? "lang-vi" : "";
}

type PracticeCardProps = {
  isLoading: boolean;
  onNext: () => void;
  remainingInPass: number;
  sentence: Sentence | null;
  sourceLanguage: LanguageCode;
  targetLanguage: LanguageCode;
};

type TargetTicketCardProps = {
  isRevealed: boolean;
  targetLabel: string;
  targetSentence: string;
  targetSentenceClass: string;
  targetSentenceRef: RefObject<HTMLParagraphElement | null>;
  targetSurfaceRef: RefObject<HTMLDivElement | null>;
};

function TargetTicketCard({
  isRevealed,
  targetLabel,
  targetSentence,
  targetSentenceClass,
  targetSentenceRef,
  targetSurfaceRef,
}: TargetTicketCardProps) {
  const ticketStateClass = isRevealed
    ? "target-ticket--revealed"
    : "target-ticket--hidden";

  return (
    <aside
      className={`target-ticket ${ticketStateClass}`}
      aria-live="polite"
      data-reveal-state={isRevealed ? "revealed" : "hidden"}
    >
      <div className="target-ticket__surface" ref={targetSurfaceRef}>
        <span className="section-label">{targetLabel}</span>
        {isRevealed ? (
          <p
            className={`target-sentence ${targetSentenceClass}`}
            key="revealed-target"
            ref={targetSentenceRef}
          >
            {targetSentence}
          </p>
        ) : (
          <p
            className="target-sentence target-sentence--hidden"
            key="hidden-target"
            ref={targetSentenceRef}
          >
            Write your attempt first, then reveal the reference.
          </p>
        )}
        <div className="ornamental-divider ornamental-divider--target" aria-hidden="true" />

        <p className="study-note">
          Panic makes perfect. If you don't know the answer, just guess.
        </p>
      </div>
    </aside>
  );
}

export function PracticeCard({
  isLoading,
  onNext,
  remainingInPass,
  sentence,
  sourceLanguage,
  targetLanguage,
}: PracticeCardProps) {
  const [answer, setAnswer] = useState("");
  const [isRevealed, setIsRevealed] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const sourceSentenceRef = useRef<HTMLQuoteElement | null>(null);
  const sourceDividerRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const targetSurfaceRef = useRef<HTMLDivElement | null>(null);
  const targetSentenceRef = useRef<HTMLParagraphElement | null>(null);
  const hasAnimatedSourceRef = useRef(false);
  const hasAnimatedTextareaResetRef = useRef(false);
  const revealTimelineRef = useRef<ReturnType<typeof createTimeline> | null>(
    null,
  );

  useLayoutEffect(() => {
    setAnswer("");
    setIsRevealed(false);
  }, [sentence?.id, sourceLanguage, targetLanguage]);

  useEffect(() => {
    if (!hasAnimatedTextareaResetRef.current) {
      hasAnimatedTextareaResetRef.current = true;
      return;
    }

    if (prefersReducedMotion || !textareaRef.current) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      if (!textareaRef.current) {
        return;
      }

      animate(textareaRef.current, {
        opacity: [0.72, 1],
        translateY: [4, 0],
        duration: 300,
        ease: "outSine",
      });
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [sentence?.id, sourceLanguage, targetLanguage]);

  useEffect(() => {
    if (!hasAnimatedSourceRef.current) {
      hasAnimatedSourceRef.current = true;
      return;
    }

    if (prefersReducedMotion || !sourceSentenceRef.current) {
      return;
    }

    const sourceAnimation = animate(sourceSentenceRef.current, {
      opacity: [0, 1],
      translateY: [7, 0],
      filter: ["blur(1.5px)", "blur(0px)"],
      duration: 460,
      ease: "outCubic",
    });
    const dividerAnimation = sourceDividerRef.current
      ? animate(sourceDividerRef.current, {
          opacity: [0.35, 1],
          scaleX: [0.96, 1],
          duration: 420,
          ease: "outSine",
        })
      : null;

    return () => {
      sourceAnimation.cancel();
      dividerAnimation?.cancel();
    };
  }, [sentence?.id, sourceLanguage, targetLanguage]);

  useLayoutEffect(() => {
    revealTimelineRef.current?.cancel();
    revealTimelineRef.current = null;

    const targetSurface = targetSurfaceRef.current;
    const targetSentenceElement = targetSentenceRef.current;

    if (!targetSurface || !targetSentenceElement) {
      return;
    }

    targetSurface.style.opacity = "";
    targetSurface.style.transform = "";
    targetSentenceElement.style.opacity = "";
    targetSentenceElement.style.transform = "";
    targetSentenceElement.style.filter = "";

    if (!isRevealed || prefersReducedMotion) {
      return;
    }

    targetSurface.style.opacity = "0.94";
    targetSurface.style.transform = "translateY(3px)";
    targetSentenceElement.style.opacity = "0";
    targetSentenceElement.style.transform = "translateY(6px)";
    targetSentenceElement.style.filter = "blur(1.5px)";

    const revealTimeline = createTimeline({
      defaults: { ease: "outCubic" },
    })
      .add(
        targetSurface,
        {
          opacity: 1,
          translateY: 0,
          duration: 260,
        },
        0,
      )
      .add(
        targetSentenceElement,
        {
          opacity: 1,
          translateY: 0,
          filter: "blur(0px)",
          duration: 360,
        },
        0,
      );

    revealTimelineRef.current = revealTimeline;

    return () => {
      revealTimeline.cancel();
      if (revealTimelineRef.current === revealTimeline) {
        revealTimelineRef.current = null;
      }
    };
  }, [isRevealed, prefersReducedMotion, sentence?.id, targetLanguage]);

  function animateTextareaFocus() {
    if (prefersReducedMotion || !textareaRef.current) {
      return;
    }

    animate(textareaRef.current, {
      boxShadow: [
        "inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 0 22px rgba(112, 73, 30, 0.08)",
        "inset 0 1px 0 rgba(255, 255, 255, 0.45), inset 0 0 28px rgba(159, 36, 24, 0.11)",
      ],
      duration: 260,
      ease: "outSine",
    });
  }

  function handleNext() {
    onNext();
  }

  if (isLoading) {
    return (
      <PaperPanel className="practice-card practice-card--empty">
        <p className="status-line">Preparing the deck...</p>
      </PaperPanel>
    );
  }

  if (!sentence) {
    return (
      <PaperPanel className="practice-card practice-card--empty">
        <p className="status-line">No sentences match the selected filters.</p>
      </PaperPanel>
    );
  }

  const sourceSentence = sentence[sourceLanguage];
  const targetSentence = sentence[targetLanguage];
  const sourceLabel = `Source (${languageDisplayLabels[sourceLanguage]})`;
  const targetLabel = `Target (${languageDisplayLabels[targetLanguage]})`;
  const sourceSentenceClass = [
    "source-sentence",
    sourceSentence.length > 70 ? "source-sentence--long" : "",
    vietnameseTextClass(sourceLanguage),
  ]
    .filter(Boolean)
    .join(" ");
  const targetSentenceClass = vietnameseTextClass(targetLanguage);
  const answerClass = targetLanguage === "vi" ? "answer-field__textarea--vi" : "";

  return (
    <PaperPanel className="practice-card">
      <div className="practice-card__grid">
        <section className="source-column" aria-label="Source sentence">
          <span className="section-label">{sourceLabel}</span>
          <HandwrittenSourceSentence
            className={sourceSentenceClass}
            language={sourceLanguage}
            reducedMotion={prefersReducedMotion}
            ref={sourceSentenceRef}
            sentenceId={sentence.id}
            text={sourceSentence}
          />
          <div
            className="ornamental-divider"
            aria-hidden="true"
            ref={sourceDividerRef}
          />

          <label className="answer-field">
            <span>Your translation</span>
            <textarea
              className={answerClass}
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              onFocus={animateTextareaFocus}
              placeholder="Type your translation here..."
              ref={textareaRef}
            />
          </label>

          <div className="practice-card__actions">
            <p>
              {isRevealed
                ? remainingInPass === 0
                  ? "Next reshuffles this deck."
                  : `${remainingInPass} remaining after this card.`
                : "Type your translation, then reveal the reference."}
            </p>
            <div className="practice-card__action-buttons">
              {isRevealed ? (
                <>
                  <PaperButton
                    variant="secondary"
                    onClick={() => setIsRevealed(false)}
                  >
                    Hide
                  </PaperButton>
                  <PaperButton onClick={handleNext}>Next -&gt;</PaperButton>
                </>
              ) : (
                <PaperButton onClick={() => setIsRevealed(true)}>
                  Reveal
                </PaperButton>
              )}
            </div>
          </div>
        </section>

        <TargetTicketCard
          isRevealed={isRevealed}
          targetLabel={targetLabel}
          targetSentence={targetSentence}
          targetSentenceClass={targetSentenceClass}
          targetSentenceRef={targetSentenceRef}
          targetSurfaceRef={targetSurfaceRef}
        />
      </div>
    </PaperPanel>
  );
}
