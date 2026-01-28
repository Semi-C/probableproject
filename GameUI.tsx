import { useProbabilityGame } from "@/lib/stores/useProbabilityGame";
import { useAudio } from "@/lib/stores/useAudio";
import { Volume2, VolumeX } from "lucide-react";

export function GameUI() {
  const { currentGame, returnToSpinner, stats, totalScore, resetStats } = useProbabilityGame();
  const { isMuted, toggleMute } = useAudio();

  const gameNames: Record<string, string> = {
    spinner: "Probability Spinner",
    coinFlip: "Coin Flip Challenge",
    diceKingdom: "Dice Kingdom",
    marbleCollector: "Monster Marble Collector",
    plinko: "Probability Plinko",
  };

  return (
    <>
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black to-transparent p-6 z-10">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-white text-3xl font-bold">{gameNames[currentGame]}</h1>
            <p className="text-gray-300 text-sm">Learn probability through fun mini-games!</p>
          </div>
          
          <div className="flex gap-4 items-center">
            <div className="bg-black bg-opacity-70 px-6 py-3 rounded-lg">
              <p className="text-yellow-400 text-2xl font-bold">Score: {totalScore}</p>
            </div>
            
            <button
              onClick={toggleMute}
              className="bg-black bg-opacity-70 p-3 rounded-lg hover:bg-opacity-90 transition-all"
            >
              {isMuted ? (
                <VolumeX className="w-6 h-6 text-white" />
              ) : (
                <Volume2 className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Back to Spinner Button (only show when not on spinner) */}
      {currentGame !== "spinner" && (
        <div className="absolute top-24 left-6 z-10">
          <button
            onClick={returnToSpinner}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-bold transition-all hover:scale-105"
          >
            ← Back to Spinner
          </button>
        </div>
      )}

      {/* Statistics Panel */}
      <div className="absolute top-24 right-6 bg-black bg-opacity-70 p-4 rounded-lg z-10 max-w-sm">
        <h3 className="text-white text-lg font-bold mb-3">Statistics</h3>
        
        <div className="space-y-2 text-sm">
          <div className="text-white">
            <p className="font-semibold text-red-400">Coin Flip</p>
            <p>Flips: {stats.coinFlip.totalFlips} | Accuracy: {stats.coinFlip.accuracy.toFixed(1)}%</p>
          </div>
          
          <div className="text-white">
            <p className="font-semibold text-teal-400">Dice Kingdom</p>
            <p>Rolls: {stats.diceKingdom.totalRolls} | Resources: {stats.diceKingdom.resourcesCollected}</p>
          </div>
          
          <div className="text-white">
            <p className="font-semibold text-yellow-400">Marble Collector</p>
            <p>Draws: {stats.marbleCollector.totalDraws} | Accuracy: {stats.marbleCollector.accuracy.toFixed(1)}%</p>
          </div>
          
          <div className="text-white">
            <p className="font-semibold text-green-400">Plinko</p>
            <p>Drops: {stats.plinko.totalDrops} | Accuracy: {stats.plinko.accuracy.toFixed(1)}%</p>
          </div>
        </div>
        
        <button
          onClick={resetStats}
          className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-bold text-sm transition-all"
        >
          Reset All Stats
        </button>
      </div>

      {/* Educational Tooltips (shown on spinner) */}
      {currentGame === "spinner" && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 px-8 py-4 rounded-lg max-w-2xl">
          <p className="text-white text-center text-lg">
            🎯 <span className="font-bold">Click the spinner</span> to randomly select a probability mini-game!
          </p>
          <p className="text-gray-300 text-center text-sm mt-2">
            Each game teaches different probability concepts through interactive play
          </p>
        </div>
      )}
    </>
  );
}
