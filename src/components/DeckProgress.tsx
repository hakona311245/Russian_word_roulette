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
  const safeDeckSize = Math.max(deckSize, 0);
  const remaining = Math.min(Math.max(remainingInPass, 0), safeDeckSize);
  const shownInPass = Math.min(Math.max(shownCount, 0), safeDeckSize);
  const progressNote =
    safeDeckSize === 0
      ? "No matching cards"
      : remaining === 0
        ? "Ready to reshuffle"
        : `${remaining} remaining`;

  return (
    <aside
      className="deck-progress-shell"
      aria-label={`Deck progress, ${remaining} remaining out of ${safeDeckSize}, ${shownInPass} shown`}
    >
      <span>Deck progress</span>
      <strong>
        {remaining} / {safeDeckSize}
      </strong>
      <small>{progressNote}</small>
    </aside>
  );
}
