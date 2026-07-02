import { useEffect, useRef } from "react";
import { animate } from "animejs";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

type DeckProgressProps = {
  deckSize: number;
  remainingInPass: number;
  shownCount: number;
};

export function DeckProgress({
  deckSize,
  remainingInPass,
  shownCount,
}: DeckProgressProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const strongRef = useRef<HTMLElement | null>(null);
  const safeDeckSize = Math.max(deckSize, 0);
  const remaining = Math.min(Math.max(remainingInPass, 0), safeDeckSize);
  const previousProgressRef = useRef({
    deckSize: safeDeckSize,
    remaining,
  });
  const shownInPass = Math.min(Math.max(shownCount, 0), safeDeckSize);
  const progressNote =
    safeDeckSize === 0
      ? "No matching cards"
      : remaining === 0
        ? "Ready to reshuffle"
        : `${remaining} remaining`;

  useEffect(() => {
    const previousProgress = previousProgressRef.current;
    const didChange =
      previousProgress.remaining !== remaining ||
      previousProgress.deckSize !== safeDeckSize;

    previousProgressRef.current = {
      deckSize: safeDeckSize,
      remaining,
    };

    if (prefersReducedMotion || !didChange || !strongRef.current) {
      return;
    }

    const strongElement = strongRef.current;
    const counter = { value: previousProgress.remaining };
    const countAnimation = animate(counter, {
      value: remaining,
      duration: 680,
      ease: "outCubic",
      onUpdate: () => {
        strongElement.textContent = `${Math.round(counter.value)} / ${safeDeckSize}`;
      },
    });
    const emphasisAnimation = animate(strongElement, {
      opacity: [0.55, 1],
      translateY: [3, 0],
      duration: 480,
      ease: "outSine",
    });

    return () => {
      countAnimation.cancel();
      emphasisAnimation.cancel();
    };
  }, [remaining, safeDeckSize, prefersReducedMotion]);

  return (
    <aside
      className="deck-progress-shell"
      aria-label={`Deck progress, ${remaining} remaining out of ${safeDeckSize}, ${shownInPass} shown`}
    >
      <span>Deck progress</span>
      <strong ref={strongRef}>
        {remaining} / {safeDeckSize}
      </strong>
      <small>{progressNote}</small>
    </aside>
  );
}
