import { DeckProgress } from "./components/DeckProgress";
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

  return (
    <main className="app-shell">
      <header className="study-header" aria-labelledby="app-title">
        <div className="title-lockup">
          <p className="study-identity__title">Translation practice</p>
          <h1 id="app-title">Russian Word Roulette</h1>
          <p className="poster-subtitle">
            Read, translate, reveal, compare.
          </p>
        </div>

        <DeckProgress
          deckSize={deckSize}
          remainingInPass={remainingInPass}
          shownCount={shownCount}
        />
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
          isLoading={isLoading}
          onNext={nextSentence}
          remainingInPass={remainingInPass}
          sentence={currentSentence}
          sourceLanguage={filters.sourceLanguage}
          targetLanguage={filters.targetLanguage}
        />
      </section>
    </main>
  );
}
