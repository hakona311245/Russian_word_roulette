import { Component, useEffect, useMemo, useState, type ReactNode } from "react";
import { TegakiRenderer, type TegakiBundle } from "tegaki";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

type CandidateModule = {
  default: TegakiBundle;
};

type CandidateDefinition = {
  importBundle: () => Promise<CandidateModule>;
  name: string;
  sizeLabel: string;
  slug: string;
};

type LoadedCandidate = {
  bundle: TegakiBundle | null;
  error: string | null;
  isLoading: boolean;
};

type PreviewBoundaryProps = {
  children: ReactNode;
  fallback: ReactNode;
  resetKey: string;
};

type PreviewBoundaryState = {
  hasError: boolean;
};

const CANDIDATES: CandidateDefinition[] = [
  {
    importBundle: () =>
      import("../assets/tegaki/candidates/bad-script/bad_script/bundle"),
    name: "Bad Script",
    sizeLabel: "299.0 KB",
    slug: "bad-script",
  },
  {
    importBundle: () =>
      import(
        "../assets/tegaki/candidates/cormorant-garamond/cormorant/bundle"
      ),
    name: "Cormorant Garamond",
    sizeLabel: "408.7 KB",
    slug: "cormorant-garamond",
  },
  {
    importBundle: () =>
      import("../assets/tegaki/candidates/lora/lora/bundle"),
    name: "Lora",
    sizeLabel: "341.8 KB",
    slug: "lora",
  },
];

const PREVIEW_SAMPLE_GROUPS = [
  {
    label: "English",
    samples: ["The meeting starts at nine."],
  },
  {
    label: "Russian",
    samples: [
      "\u0412\u0441\u0442\u0440\u0435\u0447\u0430 \u043d\u0430\u0447\u0438\u043d\u0430\u0435\u0442\u0441\u044f \u0432 \u0434\u0435\u0432\u044f\u0442\u044c \u0447\u0430\u0441\u043e\u0432.",
      "\u042f \u043f\u044c\u044e \u0447\u0430\u0439 \u0443\u0442\u0440\u043e\u043c.",
    ],
  },
  {
    label: "Vietnamese",
    samples: [
      "T\u00f4i u\u1ed1ng tr\u00e0 v\u00e0o bu\u1ed5i s\u00e1ng.",
      "T\u00f4i mu\u1ed1n h\u1ecdc ti\u1ebfng Nga m\u1ed7i ng\u00e0y.",
    ],
  },
  {
    label: "Long fallback samples",
    samples: [
      "\u042f \u0445\u043e\u0447\u0443 \u0437\u0430\u043d\u0438\u043c\u0430\u0442\u044c\u0441\u044f \u0440\u0443\u0441\u0441\u043a\u0438\u043c \u044f\u0437\u044b\u043a\u043e\u043c \u043a\u0430\u0436\u0434\u044b\u0439 \u0434\u0435\u043d\u044c, \u0434\u0430\u0436\u0435 \u0435\u0441\u043b\u0438 \u0443 \u043c\u0435\u043d\u044f \u043c\u0430\u043b\u043e \u0441\u0432\u043e\u0431\u043e\u0434\u043d\u043e\u0433\u043e \u0432\u0440\u0435\u043c\u0435\u043d\u0438.",
      "T\u00f4i mu\u1ed1n luy\u1ec7n d\u1ecbch m\u1ed7i ng\u00e0y, ngay c\u1ea3 khi h\u00f4m \u0111\u00f3 t\u00f4i ch\u1ec9 c\u00f3 m\u1ed9t \u00edt th\u1eddi gian r\u1ea3nh.",
    ],
  },
];

class PreviewBoundary extends Component<
  PreviewBoundaryProps,
  PreviewBoundaryState
> {
  state: PreviewBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): PreviewBoundaryState {
    return { hasError: true };
  }

  componentDidUpdate(previousProps: PreviewBoundaryProps) {
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

function isCompatibleBundle(bundle: TegakiBundle) {
  return Boolean(
    bundle &&
      bundle.fontUrl &&
      bundle.glyphData &&
      bundle.glyphDataById &&
      bundle.family,
  );
}

function withPreviewFamily(bundle: TegakiBundle, slug: string): TegakiBundle {
  const family = `Tegaki Preview ${slug}`;

  return {
    ...bundle,
    family,
    fontFaceCSS: `@font-face { font-family: '${family}'; src: url(${bundle.fontUrl}); }`,
  };
}

function StaticSample({ text }: { text: string }) {
  return <p className="tegaki-preview__static-sample">{text}</p>;
}

function CandidateCard({
  candidate,
  replayKey,
  reducedMotion,
}: {
  candidate: CandidateDefinition;
  replayKey: number;
  reducedMotion: boolean;
}) {
  const [loaded, setLoaded] = useState<LoadedCandidate>({
    bundle: null,
    error: null,
    isLoading: true,
  });

  useEffect(() => {
    let isMounted = true;

    setLoaded({
      bundle: null,
      error: null,
      isLoading: true,
    });

    candidate
      .importBundle()
      .then((module) => {
        if (!isMounted) {
          return;
        }

        if (!isCompatibleBundle(module.default)) {
          setLoaded({
            bundle: null,
            error: "Bundle is missing Tegaki font data.",
            isLoading: false,
          });
          return;
        }

        setLoaded({
          bundle: withPreviewFamily(module.default, candidate.slug),
          error: null,
          isLoading: false,
        });
      })
      .catch((error: unknown) => {
        if (!isMounted) {
          return;
        }

        setLoaded({
          bundle: null,
          error: error instanceof Error ? error.message : String(error),
          isLoading: false,
        });
      });

    return () => {
      isMounted = false;
    };
  }, [candidate]);

  const status = reducedMotion
    ? "Reduced motion: static preview"
    : loaded.error
      ? "Load error"
      : loaded.isLoading
        ? "Loading bundle"
        : "Tegaki-compatible";

  return (
    <article className="tegaki-preview-card">
      <header className="tegaki-preview-card__header">
        <div>
          <p className="tegaki-preview-card__eyebrow">Candidate</p>
          <h2>{candidate.name}</h2>
        </div>
        <dl>
          <div>
            <dt>Folder size</dt>
            <dd>{candidate.sizeLabel}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{status}</dd>
          </div>
        </dl>
      </header>

      {loaded.error ? (
        <p className="tegaki-preview-card__error">{loaded.error}</p>
      ) : null}

      <div className="tegaki-preview-card__samples">
        {PREVIEW_SAMPLE_GROUPS.map((group) => (
          <section key={group.label}>
            <h3>{group.label}</h3>
            {group.samples.map((sample) => {
              const sampleKey = `${candidate.slug}:${group.label}:${sample}:${replayKey}`;
              const fallback = <StaticSample text={sample} />;

              if (
                reducedMotion ||
                loaded.error ||
                loaded.isLoading ||
                !loaded.bundle
              ) {
                return <div key={sampleKey}>{fallback}</div>;
              }

              return (
                <PreviewBoundary
                  fallback={fallback}
                  key={sampleKey}
                  resetKey={sampleKey}
                >
                  <p className="tegaki-preview__sample">
                    <span className="sr-only">{sample}</span>
                    <TegakiRenderer
                      aria-hidden="true"
                      className="tegaki-preview__renderer"
                      font={loaded.bundle}
                      time={{ mode: "uncontrolled", speed: 8, loop: false }}
                    >
                      {sample}
                    </TegakiRenderer>
                  </p>
                </PreviewBoundary>
              );
            })}
          </section>
        ))}
      </div>
    </article>
  );
}

export function TegakiFontCandidatePreview() {
  const [replayKey, setReplayKey] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();
  const candidates = useMemo(() => CANDIDATES, []);

  return (
    <main className="tegaki-preview-shell">
      <header className="tegaki-preview-header">
        <div>
          <p className="study-identity__title">Tegaki font candidate preview</p>
          <h1>Source sentence handwriting candidates</h1>
        </div>
        <button
          className="paper-button paper-button--primary"
          onClick={() => setReplayKey((current) => current + 1)}
          type="button"
        >
          Replay
        </button>
      </header>

      <div className="tegaki-preview-grid">
        {candidates.map((candidate) => (
          <CandidateCard
            candidate={candidate}
            key={candidate.slug}
            reducedMotion={prefersReducedMotion}
            replayKey={replayKey}
          />
        ))}
      </div>
    </main>
  );
}
