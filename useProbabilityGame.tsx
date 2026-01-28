import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type MiniGame = "spinner" | "coinFlip" | "diceKingdom" | "marbleCollector" | "plinko";

export interface GameStats {
  coinFlip: {
    totalFlips: number;
    correctPredictions: number;
    accuracy: number;
  };
  diceKingdom: {
    totalRolls: number;
    resourcesCollected: number;
  };
  marbleCollector: {
    totalDraws: number;
    correctPredictions: number;
    accuracy: number;
  };
  plinko: {
    totalDrops: number;
    correctPredictions: number;
    accuracy: number;
  };
}

interface ProbabilityGameState {
  currentGame: MiniGame;
  isTransitioning: boolean;
  stats: GameStats;
  totalScore: number;
  
  // Actions
  setCurrentGame: (game: MiniGame) => void;
  setTransitioning: (transitioning: boolean) => void;
  updateCoinFlipStats: (correct: boolean) => void;
  updateDiceKingdomStats: (resources: number) => void;
  updateMarbleCollectorStats: (correct: boolean) => void;
  updatePlinkoStats: (correct: boolean) => void;
  addScore: (points: number) => void;
  resetStats: () => void;
  returnToSpinner: () => void;
}

const initialStats: GameStats = {
  coinFlip: {
    totalFlips: 0,
    correctPredictions: 0,
    accuracy: 0,
  },
  diceKingdom: {
    totalRolls: 0,
    resourcesCollected: 0,
  },
  marbleCollector: {
    totalDraws: 0,
    correctPredictions: 0,
    accuracy: 0,
  },
  plinko: {
    totalDrops: 0,
    correctPredictions: 0,
    accuracy: 0,
  },
};

export const useProbabilityGame = create<ProbabilityGameState>()(
  subscribeWithSelector((set) => ({
    currentGame: "spinner",
    isTransitioning: false,
    stats: initialStats,
    totalScore: 0,
    
    setCurrentGame: (game) => {
      set({ currentGame: game });
    },
    
    setTransitioning: (transitioning) => {
      set({ isTransitioning: transitioning });
    },
    
    updateCoinFlipStats: (correct) => {
      set((state) => {
        const newTotalFlips = state.stats.coinFlip.totalFlips + 1;
        const newCorrectPredictions = state.stats.coinFlip.correctPredictions + (correct ? 1 : 0);
        const newAccuracy = (newCorrectPredictions / newTotalFlips) * 100;
        
        return {
          stats: {
            ...state.stats,
            coinFlip: {
              totalFlips: newTotalFlips,
              correctPredictions: newCorrectPredictions,
              accuracy: newAccuracy,
            },
          },
        };
      });
    },
    
    updateDiceKingdomStats: (resources) => {
      set((state) => ({
        stats: {
          ...state.stats,
          diceKingdom: {
            totalRolls: state.stats.diceKingdom.totalRolls + 1,
            resourcesCollected: state.stats.diceKingdom.resourcesCollected + resources,
          },
        },
      }));
    },
    
    updateMarbleCollectorStats: (correct) => {
      set((state) => {
        const newTotalDraws = state.stats.marbleCollector.totalDraws + 1;
        const newCorrectPredictions = state.stats.marbleCollector.correctPredictions + (correct ? 1 : 0);
        const newAccuracy = (newCorrectPredictions / newTotalDraws) * 100;
        
        return {
          stats: {
            ...state.stats,
            marbleCollector: {
              totalDraws: newTotalDraws,
              correctPredictions: newCorrectPredictions,
              accuracy: newAccuracy,
            },
          },
        };
      });
    },
    
    updatePlinkoStats: (correct) => {
      set((state) => {
        const newTotalDrops = state.stats.plinko.totalDrops + 1;
        const newCorrectPredictions = state.stats.plinko.correctPredictions + (correct ? 1 : 0);
        const newAccuracy = (newCorrectPredictions / newTotalDrops) * 100;
        
        return {
          stats: {
            ...state.stats,
            plinko: {
              totalDrops: newTotalDrops,
              correctPredictions: newCorrectPredictions,
              accuracy: newAccuracy,
            },
          },
        };
      });
    },
    
    addScore: (points) => {
      set((state) => ({ totalScore: state.totalScore + points }));
    },
    
    resetStats: () => {
      set({ stats: initialStats, totalScore: 0 });
    },
    
    returnToSpinner: () => {
      set({ currentGame: "spinner", isTransitioning: false });
    },
  }))
);
