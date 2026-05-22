import { LiquidMetal } from "@paper-design/shaders-react";

import { cn } from "@/lib/utils";

const TIMBAL_SYMBOL_SRC = "/timbal-symbol.png";

const DEFAULT_SIZE = 64;
const TRANSPARENT_BACK = "#00000000";

export interface TimbalLiquidMetalIconProps {
  className?: string;
  /** Square size in CSS pixels (matches `--studio-chrome-pill-height` at 40). */
  size?: number;
}

/**
 * Timbal mark rendered with Paper Design LiquidMetal shader.
 * Uses the black symbol PNG as the metal mask (`shape="none"`).
 */
export function TimbalLiquidMetalIcon({
  className,
  size = DEFAULT_SIZE,
}: TimbalLiquidMetalIconProps) {
  return (
    <div
      className={cn("relative shrink-0 bg-transparent", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label="Timbal"
    >
      <LiquidMetal
        width={size}
        height={size}
        image={TIMBAL_SYMBOL_SRC}
        colorBack={TRANSPARENT_BACK}
        colorTint="#ffffff"
        shape="none"
        repetition={2}
        softness={0.1}
        shiftRed={0.3}
        shiftBlue={0.3}
        distortion={0.07}
        contour={0.4}
        angle={70}
        speed={1}
        scale={0.6}
        fit="contain"
        className="size-full bg-transparent"
        style={{ background: "transparent" }}
        webGlContextAttributes={{
          alpha: true,
          premultipliedAlpha: false,
        }}
      />
    </div>
  );
}
