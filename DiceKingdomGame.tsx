import { useState } from "react";
import { useProbabilityGame } from "@/lib/stores/useProbabilityGame";
import { useAudio } from "@/lib/stores/useAudio";

export function DiceKingdomUI() {
  const [isRolling, setIsRolling] = useState(false);
  const [result1, setResult1] = useState(1);
  const [result2, setResult2] = useState(1);
  const { updateDiceKingdomStats, addScore, stats } = useProbabilityGame();
  const { playSuccess } = useAudio();

  const rollDice = () => {
    if (!isRolling) {
      setIsRolling(true);
      
      setTimeout(() => {
        const val1 = Math.floor(Math.random() * 6) + 1;
        const val2 = Math.floor(Math.random() * 6) + 1;
        setResult1(val1);
        setResult2(val2);
        
        const sum = val1 + val2;
        const resources = Math.floor(sum / 2);
        updateDiceKingdomStats(resources);
        addScore(resources * 5);
        
        playSuccess();
        setIsRolling(false);
      }, 800);
    }
  };

  const getProbabilityInfo = () => {
    const probabilities: Record<number, number> = {
      2: 2.8, 3: 5.6, 4: 8.3, 5: 11.1, 6: 13.9, 7: 16.7,
      8: 13.9, 9: 11.1, 10: 8.3, 11: 5.6, 12: 2.8
    };
    const sum = result1 + result2;
    return probabilities[sum] || 0;
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="bg-black bg-opacity-80 p-8 rounded-lg max-w-2xl">
        <h2 className="text-white text-3xl font-bold mb-6 text-center">Dice Kingdom</h2>
        
        <div className="flex gap-8 mb-6 justify-center">
          <div 
            className={`w-24 h-24 bg-red-500 rounded-lg flex items-center justify-center text-white text-5xl font-bold ${
              isRolling ? 'animate-bounce' : ''
            }`}
          >
            {result1}
          </div>
          <div 
            className={`w-24 h-24 bg-teal-500 rounded-lg flex items-center justify-center text-white text-5xl font-bold ${
              isRolling ? 'animate-bounce' : ''
            }`}
          >
            {result2}
          </div>
        </div>
        
        <div className="mb-6 text-center bg-gray-800 p-4 rounded-lg">
          <p className="text-white text-xl">Sum: {result1 + result2}</p>
          <p className="text-gray-300 text-sm">Probability of this sum: {getProbabilityInfo().toFixed(1)}%</p>
          <p className="text-yellow-400 text-lg mt-2">Resources: {Math.floor((result1 + result2) / 2)}</p>
        </div>
        
        <button
          onClick={rollDice}
          disabled={isRolling}
          className={`w-full px-10 py-5 rounded-lg font-bold text-white text-2xl ${
            isRolling ? "bg-gray-600 opacity-50 cursor-not-allowed" : "bg-yellow-600 hover:scale-105"
          } transition-all`}
        >
          {isRolling ? "Rolling..." : "Roll Dice"}
        </button>
        
        <div className="mt-6 text-center text-gray-300 text-sm">
          <p className="mb-2">Higher sums are more likely (7 is most common at 16.7%)</p>
          <p>Total Resources Collected: {stats.diceKingdom.resourcesCollected}</p>
          <p className="text-xs mt-2">Total Rolls: {stats.diceKingdom.totalRolls}</p>
        </div>
      </div>
    </div>
  );
}
