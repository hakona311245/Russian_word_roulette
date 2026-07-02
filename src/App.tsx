import { FilterBar } from "./components/FilterBar";
import { PracticeCard } from "./components/PracticeCard";
import { useSentenceDeck } from "./hooks/useSentenceDeck";

export default function App() {
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

  const shownInPass = Math.min(shownCount, deckSize);
  const progressNote =
    remainingInPass === 0 ? "Ready to reshuffle" : `${remainingInPass} remaining`;

  return (
    <main className="app-shell">
      <header className="study-header" aria-labelledby="app-title">
        <section className="study-identity" aria-label="Practice context">
          <div className="study-identity__mark" aria-hidden="true">
            +
          </div>
          <div>
            <p className="study-identity__title">Practice Hall</p>
            <p className="study-identity__copy">
              A place for thoughtful practice and steady progress.
            </p>
          </div>
        </section>

        <div className="title-lockup">
          <h1 id="app-title">Russian Word Roulette</h1>
          <p className="poster-subtitle">
            Practice translation. Think deeply. Improve naturally.
          </p>
        </div>

        <aside className="deck-progress-shell" aria-label="Deck progress">
          <span>Deck progress</span>
          <strong>
            {shownInPass} / {deckSize}
          </strong>
          <small>{progressNote}</small>
        </aside>
      </header>

      <section className="control-rail" aria-label="Practice setup">
        <FilterBar
          filters={filters}
          levels={levels}
          onChange={updateFilters}
          topics={topics}
        />
      </section>

      {error ? <p className="error-message">{error}</p> : null}

      <section className="practice-workspace" aria-label="Practice workspace">
        <PracticeCard
          deckSize={deckSize}
          isLoading={isLoading}
          onNext={nextSentence}
          remainingInPass={remainingInPass}
          sentence={currentSentence}
          shownCount={shownCount}
          sourceLanguage={filters.sourceLanguage}
          targetLanguage={filters.targetLanguage}
        />
      </section>
    </main>
  );
}
