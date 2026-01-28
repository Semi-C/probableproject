import { useState } from "react";
import { useProbabilityGame } from "@/lib/stores/useProbabilityGame";
import { useAudio } from "@/lib/stores/useAudio";

export function CoinFlipUI() {
  const [prediction, setPrediction] = useState<"heads" | "tails" | null>(null);
  const [result, setResult] = useState<"heads" | "tails" | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const { updateCoinFlipStats, addScore, stats } = useProbabilityGame();
  const { playHit, playSuccess } = useAudio();

  const flipCoin = (pred: "heads" | "tails") => {
    if (!isFlipping) {
      setPrediction(pred);
      setResult(null);
      setIsFlipping(true);
      
      setTimeout(() => {
        const finalResult = Math.random() < 0.5 ? "heads" : "tails";
        setResult(finalResult);
        setIsFlipping(false);
        
        const correct = pred === finalResult;
        updateCoinFlipStats(correct);
        if (correct) {
          addScore(50);
          playSuccess();
        } else {
          playHit();
        }
      }, 1000);
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="bg-black bg-opacity-80 p-8 rounded-lg max-w-2xl">
        <h2 className="text-white text-3xl font-bold mb-6 text-center">Coin Flip Challenge</h2>
        
        {/* Coin visualization */}
        <div className="flex justify-center mb-8">
          <div 
            className={`w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold transition-all ${
              isFlipping ? 'animate-spin' : ''
            }`}
            style={{
              backgroundColor: result === "heads" ? "#FFA500" : result === "tails" ? "#CD7F32" : "#FFD700",
            }}
          >
            {isFlipping ? "?" : result ? (result === "heads" ? "H" : "T") : "?"}
          </div>
        </div>
        
        {result && !isFlipping && (
          <div className="mb-6 text-center bg-gray-800 p-4 rounded-lg">
            <p className="text-white text-2xl font-bold">
              Result: {result.toUpperCase()}
            </p>
            <p className={`text-xl mt-2 ${result === prediction ? "text-green-400" : "text-red-400"}`}>
              {result === prediction ? "✓ Correct Prediction!" : "✗ Wrong Prediction"}
            </p>
          </div>
        )}
        
        <div className="flex gap-4 justify-center mb-6">
          <button
            onClick={() => flipCoin("heads")}
            disabled={isFlipping}
            className={`px-8 py-4 rounded-lg font-bold text-white text-xl ${
              prediction === "heads" && !isFlipping ? "bg-green-600" : "bg-gray-700"
            } ${isFlipping ? "opacity-50 cursor-not-allowed" : "hover:scale-105"} transition-all`}
          >
            Predict Heads
          </button>
          <button
            onClick={() => flipCoin("tails")}
            disabled={isFlipping}
            className={`px-8 py-4 rounded-lg font-bold text-white text-xl ${
              prediction === "tails" && !isFlipping ? "bg-green-600" : "bg-gray-700"
            } ${isFlipping ? "opacity-50 cursor-not-allowed" : "hover:scale-105"} transition-all`}
          >
            Predict Tails
          </button>
        </div>
        
        <div className="text-center text-gray-300 text-sm">
          <p className="mb-2">Each flip has a 50% chance for heads or tails</p>
          <p>Your Accuracy: {stats.coinFlip.accuracy.toFixed(1)}%</p>
          <p className="text-xs mt-2">Total Flips: {stats.coinFlip.totalFlips} | Correct: {stats.coinFlip.correctPredictions}</p>
        </div>
      </div>
    </div>
  );
}
