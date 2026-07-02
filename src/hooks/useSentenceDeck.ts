import { useCallback, useEffect, useMemo, useState } from "react";
import { filterSentences, uniqueOptions } from "../lib/sentenceFilters";
import { shuffle } from "../lib/shuffle";
import type { Level, Sentence, SentenceFilters, Topic } from "../types";

const initialFilters: SentenceFilters = {
  sourceLanguage: "ru",
  targetLanguage: "en",
  topic: "all",
  level: "all",
};

type DeckState = {
  current: Sentence | null;
  queue: Sentence[];
  shownCount: number;
};

function createDeck(sentences: Sentence[]): DeckState {
  const queue = shuffle(sentences);

  return {
    current: queue[0] ?? null,
    queue: queue.slice(1),
    shownCount: queue.length > 0 ? 1 : 0,
  };
}

export function useSentenceDeck() {
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [filters, setFilters] = useState<SentenceFilters>(initialFilters);
  const [deck, setDeck] = useState<DeckState>(() => createDeck([]));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadSentences() {
      try {
        const response = await fetch("/data/sentences.json");

        if (!response.ok) {
          throw new Error("Could not load the sentence deck.");
        }

        const data = (await response.json()) as Sentence[];

        if (isMounted) {
          setSentences(data);
          setIsLoading(false);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Could not load the sentence deck.",
          );
          setIsLoading(false);
        }
      }
    }

    loadSentences();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredSentences = useMemo(
    () => filterSentences(sentences, filters),
    [sentences, filters],
  );

  useEffect(() => {
    setDeck(createDeck(filteredSentences));
  }, [filteredSentences]);

  const nextSentence = useCallback(() => {
    setDeck((currentDeck) => {
      if (filteredSentences.length === 0) {
        return createDeck([]);
      }

      if (currentDeck.queue.length === 0) {
        return createDeck(filteredSentences);
      }

      const [next, ...remaining] = currentDeck.queue;

      return {
        current: next,
        queue: remaining,
        shownCount: currentDeck.shownCount + 1,
      };
    });
  }, [filteredSentences]);

  const updateFilters = useCallback((nextFilters: SentenceFilters) => {
    setFilters(nextFilters);
  }, []);

  const topics = useMemo(
    () => uniqueOptions<Topic>(sentences, "topic").sort(),
    [sentences],
  );

  const levels = useMemo(
    () => uniqueOptions<Level>(sentences, "level").sort(),
    [sentences],
  );

  return {
    currentSentence: deck.current,
    deckSize: filteredSentences.length,
    error,
    filters,
    isLoading,
    levels,
    nextSentence,
    remainingInPass: deck.queue.length,
    shownCount: deck.shownCount,
    topics,
    updateFilters,
  };
}
