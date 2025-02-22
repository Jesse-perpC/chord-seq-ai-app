"use client";
import { useEffect, useState, useRef } from "react";
import { useStore } from "@/state/use_store";
import { shallow } from "zustand/shallow";
import { useInit } from "@/state/use_init";

import Image from "next/image";

import Overlay from "../ui/overlay";

export default function NewFeaturesOverlay() {
  const [
    welcomeFirstTime,
    version,
    setVersion,
    isNewFeaturesOverlayOpen,
    setIsNewFeaturesOverlayOpen,
    setIsWelcomeOverlayOpen,
  ] = useStore(
    (state) => [
      state.welcomeFirstTime,
      state.version,
      state.setVersion,
      state.isNewFeaturesOverlayOpen,
      state.setIsNewFeaturesOverlayOpen,
      state.setIsWelcomeOverlayOpen,
    ],
    shallow,
  );

  const [showPrev, setShowPrev] = useState(false);
  const showPrevRef = useRef(showPrev);
  useEffect(() => {
    showPrevRef.current = showPrev;
  }, [showPrev]);

  const [showFeatures, setShowFeatures] = useState<number[]>([]);
  const latestVersion = 5;

  // If it's the first time after the update, show the overlay
  useInit(() => {
    if (version < latestVersion) {
      // Show all features since the previous version
      let features = [];
      for (let i = version + 1; i <= latestVersion; i++) {
        features.push(i);
      }
      setShowFeatures(features);

      setVersion(latestVersion);

      if (!welcomeFirstTime) {
        setIsNewFeaturesOverlayOpen(true);
        return;
      }
    }

    setShowPrev(true);
  });

  // If it is open from the help menu, show all features
  useEffect(() => {
    if (showPrev) {
      let features = Array.from(Array(latestVersion + 1).keys()).slice(1);
      setShowFeatures(features);
    }
  }, [showPrev]);

  // Keyboard shortcuts
  const otherShortcuts = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft" && showPrevRef.current) {
      setIsWelcomeOverlayOpen(true);
      setIsNewFeaturesOverlayOpen(false);
    }
  };

  const callOnClose = () => {
    setShowPrev(true);
  };

  let features: { [key: number]: JSX.Element[] } = {
    1: [
      <li key={0}>
        Delete all{" "}
        <Image
          src="/trash-all.svg"
          alt=""
          className="inline h-[4dvh] w-[4dvh]"
          width={100}
          height={100}
        />{" "}
        and chord variants{" "}
        <Image
          src="/variants.svg"
          alt=""
          className="inline h-[4dvh] w-[4dvh]"
          width={100}
          height={100}
        />{" "}
        now have their own buttons.
      </li>,
      <li key={1}>Added new shortcuts to make your workflow faster.</li>,
      <li key={2}>
        Improved the layout to be responsive on more screen sizes.
      </li>,
    ],
    2: [<li key={3}>Reworked MIDI import to be more reliable.</li>],
    3: [
      <li key={4}>
        Improved models to be more accurate and suggest chords faster.
      </li>,
    ],
    4: [
      <li key={5}>
        Created a{" "}
        <a
          className="text-blue-400 hover:underline"
          href="/wiki"
          target="_blank"
          rel="noopener noreferrer"
        >
          brand-new wiki
        </a>{" "}
        integrated into the app.
      </li>,
    ],
    5: [
      <li key={6}>
        Mobile devices and touchpad interactions are now supported.
      </li>,
      <li key={7}>
        Added the ability to reorder chords by dragging and dropping them.
      </li>,
    ],
  };

  return (
    <Overlay
      isOverlayOpen={isNewFeaturesOverlayOpen}
      setIsOverlayOpen={setIsNewFeaturesOverlayOpen}
      otherShortcuts={otherShortcuts}
      callOnClose={callOnClose}
    >
      <p className="w-full text-center text-[5dvh] font-semibold">
        What&apos;s new
      </p>
      <ul className="max-w-[75%] list-outside list-disc space-y-[1dvh] text-justify text-[3dvh]">
        {showFeatures.map((feature) => features[feature])}
      </ul>
      <p className="max-w-[75%] text-justify text-[3dvh]">
        For more information, check the{" "}
        <a
          className="text-blue-400 hover:underline"
          href="/wiki/features/change-log"
          target="_blank"
          rel="noopener noreferrer"
        >
          change log
        </a>
        .
      </p>

      <div className="flex h-[2px] w-[75%] flex-row items-center justify-center">
        <hr className="my-8 h-[2px] w-1/2 border-0 bg-gradient-to-r from-transparent to-zinc-800" />
        <hr className="my-8 h-[2px] w-1/2 border-0 bg-gradient-to-l from-transparent to-zinc-800" />
      </div>

      <p className="max-w-[60%] text-center text-[2.5dvh]">
        Would you like to see more features or vote for the next ones? You can
        do so on{" "}
        <a
          className="text-blue-400 hover:underline"
          href="https://github.com/PetrIvan/chord-seq-ai-app/discussions/categories/feature-requests?discussions_q=category%3A%22Feature+requests%22+sort%3Atop"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub Discussions
        </a>
        .
      </p>
      {showPrev && (
        <button
          className="absolute bottom-[50%] left-[1dvh] h-[5dvh] w-[5dvh] filter active:brightness-90"
          title="Show welcome overlay (Left arrow key)"
          onClick={() => {
            setIsWelcomeOverlayOpen(true);
            setIsNewFeaturesOverlayOpen(false);
          }}
        >
          <svg
            className="inline-block h-full w-full"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 10"
          >
            <path
              transform="rotate(90 5 5)"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1"
              d="m1 1 4 4 4-4"
            />
          </svg>
        </button>
      )}
    </Overlay>
  );
}
