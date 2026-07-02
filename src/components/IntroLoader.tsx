import { useCallback, useEffect, useRef } from "react";
import { createTimeline, stagger } from "animejs";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

type IntroLoaderProps = {
  onComplete: () => void;
};

const INTRO_EXIT_START_MS = 3000;
const INTRO_EXIT_DURATION_MS = 360;
const INTRO_FAILSAFE_MS = 3900;
const INTRO_REDUCED_MOTION_HOLD_MS = 1200;

export function IntroLoader({ onComplete }: IntroLoaderProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const theaterRef = useRef<HTMLDivElement | null>(null);
  const backLayerRef = useRef<HTMLDivElement | null>(null);
  const frontLayerRef = useRef<HTMLDivElement | null>(null);
  const starRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const messageRef = useRef<HTMLSpanElement | null>(null);
  const particleRefs = useRef<HTMLSpanElement[]>([]);
  const timelineRef = useRef<ReturnType<typeof createTimeline> | null>(null);
  const hasCompletedRef = useRef(false);

  const completeIntro = useCallback(() => {
    if (hasCompletedRef.current) {
      return;
    }

    hasCompletedRef.current = true;
    timelineRef.current?.cancel();
    timelineRef.current = null;
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    const root = rootRef.current;
    const theater = theaterRef.current;
    const backLayer = backLayerRef.current;
    const frontLayer = frontLayerRef.current;
    const star = starRef.current;
    const frame = frameRef.current;
    const message = messageRef.current;

    if (
      !root ||
      !theater ||
      !backLayer ||
      !frontLayer ||
      !star ||
      !frame ||
      !message
    ) {
      const fallbackTimer = window.setTimeout(completeIntro, INTRO_FAILSAFE_MS);

      return () => {
        window.clearTimeout(fallbackTimer);
      };
    }

    if (prefersReducedMotion) {
      root.style.opacity = "1";
      theater.style.opacity = "1";
      theater.style.transform = "none";
      backLayer.style.opacity = "1";
      backLayer.style.transform = "none";
      frontLayer.style.opacity = "1";
      frontLayer.style.transform = "none";
      star.style.opacity = "0.72";
      star.style.transform = "scale(1)";
      frame.style.opacity = "1";
      frame.style.transform = "none";
      message.style.opacity = "1";
      message.style.transform = "none";

      const reducedTimer = window.setTimeout(
        completeIntro,
        INTRO_REDUCED_MOTION_HOLD_MS,
      );

      return () => {
        window.clearTimeout(reducedTimer);
      };
    }

    const particles = particleRefs.current;

    root.style.opacity = "1";
    theater.style.opacity = "0";
    theater.style.transform = "translateY(8px)";
    backLayer.style.opacity = "0.42";
    backLayer.style.transform = "translate3d(-5px, 5px, 0)";
    frontLayer.style.opacity = "0.48";
    frontLayer.style.transform = "translate3d(5px, 4px, 0)";
    star.style.opacity = "0";
    star.style.transform = "scale(0.8)";
    frame.style.opacity = "0";
    frame.style.transform = "translateY(6px) scale(0.985)";
    message.style.opacity = "0";
    message.style.transform = "translateY(0.45em)";

    particles.forEach((particle) => {
      particle.style.opacity = "0";
      particle.style.transform = "translate3d(0, 8px, 0) rotate(0deg)";
    });

    const timeline = createTimeline({
      defaults: {
        ease: "outCubic",
      },
      onComplete: completeIntro,
    })
      .add(theater, { opacity: 1, translateY: 0, duration: 280 }, 0)
      .add(star, { opacity: 1, scale: 1, duration: 320 }, 80)
      .add(
        backLayer,
        {
          opacity: [0.42, 1],
          translateX: [-5, 0],
          translateY: [5, 0],
          duration: 650,
        },
        180,
      )
      .add(
        frontLayer,
        {
          opacity: [0.48, 1],
          translateX: [5, 0],
          translateY: [4, 0],
          duration: 650,
        },
        220,
      )
      .add(
        frame,
        {
          opacity: 1,
          translateY: 0,
          scale: 1,
          duration: 520,
          ease: "outSine",
        },
        360,
      )
      .add(
        message,
        {
          opacity: 1,
          translateY: 0,
          duration: 720,
          ease: "inOutSine",
        },
        680,
      )
      .add(
        particles,
        {
          opacity: [0, 0.82, 0.28],
          translateY: [8, -18],
          translateX: [-3, 7],
          rotate: ["-6deg", "8deg"],
          delay: stagger(56, { from: "center" }),
          duration: 900,
          ease: "inOutSine",
        },
        920,
      )
      .add(
        root,
        {
          opacity: 0,
          translateY: -8,
          duration: INTRO_EXIT_DURATION_MS,
          ease: "inOutQuad",
        },
        INTRO_EXIT_START_MS,
      );

    timelineRef.current = timeline;

    const failSafeTimer = window.setTimeout(completeIntro, INTRO_FAILSAFE_MS);

    return () => {
      window.clearTimeout(failSafeTimer);
      timeline.cancel();
      if (timelineRef.current === timeline) {
        timelineRef.current = null;
      }
    };
  }, [completeIntro, prefersReducedMotion]);

  const particles = Array.from({ length: 12 }, (_, index) => index);

  return (
    <div className="intro-overlay" ref={rootRef}>
      <div className="intro-theater" ref={theaterRef}>
        <div
          className="intro-paper-layer intro-paper-layer--back"
          ref={backLayerRef}
          aria-hidden="true"
        />
        <div
          className="intro-paper-layer intro-paper-layer--front"
          ref={frontLayerRef}
          aria-hidden="true"
        />

        <div className="intro-star" ref={starRef} aria-hidden="true" />

        <div className="intro-frame" ref={frameRef} aria-hidden="true">
          <span className="intro-frame__corner intro-frame__corner--tl" />
          <span className="intro-frame__corner intro-frame__corner--tr" />
          <span className="intro-frame__corner intro-frame__corner--bl" />
          <span className="intro-frame__corner intro-frame__corner--br" />
        </div>

        <p className="intro-message">
          <span className="intro-message__sr">Only for you</span>
          <span
            className="intro-message__text"
            ref={messageRef}
            aria-hidden="true"
          >
            Only for you
          </span>
        </p>

        <div className="intro-particles" aria-hidden="true">
          {particles.map((particle) => (
            <span
              className="intro-particle"
              key={particle}
              ref={(element) => {
                if (element) {
                  particleRefs.current[particle] = element;
                }
              }}
            />
          ))}
        </div>
      </div>

      <button className="intro-skip" type="button" onClick={completeIntro}>
        Skip
      </button>
    </div>
  );
}
