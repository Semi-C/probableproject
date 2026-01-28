import { motion, AnimatePresence } from "framer-motion";
import { useProbabilityGame } from "@/lib/stores/useProbabilityGame";
import { ReactNode } from "react";

interface GameTransitionProps {
  children: ReactNode;
}

export function GameTransition({ children }: GameTransitionProps) {
  const { currentGame, isTransitioning } = useProbabilityGame();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentGame}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.5 }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export function TransitionOverlay() {
  const { isTransitioning } = useProbabilityGame();

  if (!isTransitioning) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black z-50 flex items-center justify-center"
    >
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 360],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
        className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full"
      />
    </motion.div>
  );
}
