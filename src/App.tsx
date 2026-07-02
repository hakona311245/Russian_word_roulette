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
      <header className="poster-header">
        <div className="poster-mark" aria-hidden="true">
          +
        </div>
        <p className="script-title">Practice Hall</p>
        <p className="poster-note">manual study</p>
        <h1>Russian Word Roulette</h1>
      </header>

      <FilterBar
        filters={filters}
        levels={levels}
        onChange={updateFilters}
        topics={topics}
      />

      {error ? <p className="error-message">{error}</p> : null}

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
    </main>
  );
}
