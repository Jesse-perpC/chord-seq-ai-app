"use client";
import { useEffect, useState } from "react";
import { useStore } from "@/state/use_store";
import { shallow } from "zustand/shallow";

interface Props {
  top: boolean;
  availableSpace: number;
  timelineStart: number;
}

export default function Ticks({ top, availableSpace, timelineStart }: Props) {
  const [signature, zoom, timelinePosition, isStepByStepTutorialOpen] =
    useStore(
      (state) => [
        state.signature,
        state.zoom,
        state.timelinePosition,
        state.isStepByStepTutorialOpen,
      ],
      shallow,
    );

  const [tickIds, setTickIds] = useState<number[]>([]);

  // Only add ticks that are necessary (could be optimized further)
  useEffect(() => {
    let [signatureNumerator] = signature;
    let tickSpace = (zoom * 10) / signatureNumerator;
    let numTicks =
      Math.ceil(
        (availableSpace - timelinePosition + timelineStart) / tickSpace,
      ) + 1;

    const ids: number[] = [];
    for (let i = 0; i < numTicks; i++) {
      ids.push(i);
    }
    setTickIds(ids);
  }, [availableSpace, signature, zoom, timelinePosition, timelineStart]);

  // Render a tick
  const tick = (id: number) => {
    let [signatureNumerator] = signature;
    let tickSpace = (zoom * 10) / signatureNumerator;
    const tickStyle = {
      marginRight: id < tickIds.length - 1 ? `${tickSpace}dvw` : 0,
    };
    const isMajorTick = id % signatureNumerator === 0;
    return (
      <div
        key={id}
        className={`relative ${isMajorTick ? "h-[2dvh]" : "h-[1dvh]"}`}
        style={tickStyle}
      >
        {/* To make the tick width not influence the distribution while being visible */}
        <div className="absolute h-full w-full border-r-[0.3dvh] border-white" />
      </div>
    );
  };

  return (
    <div
      className={`flex max-w-full flex-row justify-start ${
        top ? "items-start" : "mt-[2dvh] items-end"
      }`}
      style={{
        transform: isStepByStepTutorialOpen
          ? "none"
          : `translateX(${timelinePosition}dvw)`,
      }}
    >
      {tickIds.map((id) => tick(id))}
    </div>
  );
}
