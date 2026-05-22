import { useThread, type ThreadWelcomeProps } from "@timbal-ai/timbal-react";
import { motion } from "motion/react";

import { TimbalLiquidMetalIcon } from "@/components/studio/timbal-liquid-metal-icon";

/** Slow, soft deceleration — reads as premium rather than snappy. */
const luxuryEase = [0.16, 1, 0.3, 1] as const;

const welcomeStagger = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.16, delayChildren: 0.18 },
  },
};

const welcomeItem = {
  initial: { opacity: 0, y: 14 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: luxuryEase },
  },
};

const welcomeIcon = {
  initial: { opacity: 0, y: 10, scale: 0.96 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 1.1, ease: luxuryEase },
  },
};

/** Welcome screen without the default timbal-react sparkle icon. */
export function StudioWelcome({ config }: ThreadWelcomeProps) {
  const isEmpty = useThread((s) => s.messages.length === 0);
  if (!isEmpty) return null;

  return (
    <div className="aui-thread-welcome-root mx-auto my-auto flex w-full max-w-(--thread-max-width) grow flex-col">
      <div className="aui-thread-welcome-center flex w-full grow flex-col items-center justify-center">
        <motion.div
          className="aui-thread-welcome-message flex flex-col items-center justify-center px-4 text-center"
          variants={welcomeStagger}
          initial="initial"
          animate="animate"
        >
          <motion.div variants={welcomeIcon} className="mb-5">
            <TimbalLiquidMetalIcon size={112} />
          </motion.div>
          <motion.h1
            variants={welcomeItem}
            className="aui-thread-welcome-message-inner font-semibold text-2xl"
          >
            {config?.heading ?? "How can I help you today?"}
          </motion.h1>
          <motion.p
            variants={welcomeItem}
            className="aui-thread-welcome-message-inner mt-2 text-muted-foreground"
          >
            {config?.subheading ?? "Send a message to start a conversation."}
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
