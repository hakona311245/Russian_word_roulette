import {
  Component,
  forwardRef,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { LanguageCode } from "../types";

const ENABLE_TEGAKI_SOURCE = true;
const MAX_TEGAKI_SOURCE_LENGTH = Number.POSITIVE_INFINITY;

type TegakiModule = typeof import("tegaki");
type TegakiFontBundle = typeof import("tegaki/fonts/caveat").default;

type LoadedTegaki = {
  bundle: TegakiFontBundle;
  Renderer: TegakiModule["TegakiRenderer"];
};

type HandwrittenSourceSentenceProps = {
  className: string;
  language: LanguageCode;
  reducedMotion: boolean;
  sentenceId: string;
  text: string;
};

type TegakiFallbackBoundaryProps = {
  children: ReactNode;
  fallback: ReactNode;
  resetKey: string;
};

type TegakiFallbackBoundaryState = {
  hasError: boolean;
};

class TegakiFallbackBoundary extends Component<
  TegakiFallbackBoundaryProps,
  TegakiFallbackBoundaryState
> {
  state: TegakiFallbackBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): TegakiFallbackBoundaryState {
    return { hasError: true };
  }

  componentDidUpdate(previousProps: TegakiFallbackBoundaryProps) {
    if (
      this.state.hasError &&
      previousProps.resetKey !== this.props.resetKey
    ) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

function shouldUseTegaki({
  language,
  reducedMotion,
  text,
}: Pick<
  HandwrittenSourceSentenceProps,
  "language" | "reducedMotion" | "text"
>) {
  return (
    ENABLE_TEGAKI_SOURCE &&
    language === "en" &&
    text.length <= MAX_TEGAKI_SOURCE_LENGTH &&
    !reducedMotion
  );
}

export const HandwrittenSourceSentence = forwardRef<
  HTMLQuoteElement,
  HandwrittenSourceSentenceProps
>(function HandwrittenSourceSentence(
  { className, language, reducedMotion, sentenceId, text },
  ref,
) {
  const [loadedTegaki, setLoadedTegaki] = useState<LoadedTegaki | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const canUseTegaki = shouldUseTegaki({ language, reducedMotion, text });
  const resetKey = `${sentenceId}:${language}:${text}`;

  useEffect(() => {
    if (!canUseTegaki || loadedTegaki || loadFailed) {
      return;
    }

    let isMounted = true;

    Promise.all([import("tegaki"), import("tegaki/fonts/caveat")])
      .then(([tegaki, caveat]) => {
        if (isMounted) {
          setLoadedTegaki({
            bundle: caveat.default,
            Renderer: tegaki.TegakiRenderer,
          });
        }
      })
      .catch(() => {
        if (isMounted) {
          setLoadFailed(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [canUseTegaki, loadFailed, loadedTegaki]);

  const fallback = (
    <blockquote className={className} ref={ref}>
      {text}
    </blockquote>
  );

  if (!canUseTegaki || !loadedTegaki || loadFailed) {
    return fallback;
  }

  const { Renderer, bundle } = loadedTegaki;

  return (
    <TegakiFallbackBoundary fallback={fallback} resetKey={resetKey}>
      <blockquote
        className={`${className} source-sentence--tegaki`}
        ref={ref}
      >
        <span className="sr-only">{text}</span>
        <Renderer
          aria-hidden="true"
          className="source-sentence__tegaki-renderer"
          font={bundle}
          key={resetKey}
          time={{ mode: "uncontrolled", speed: 15, loop: false }}
        >
          {text}
        </Renderer>
      </blockquote>
    </TegakiFallbackBoundary>
  );
});