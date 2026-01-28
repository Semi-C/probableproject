import { useState } from "react";
import { useProbabilityGame } from "@/lib/stores/useProbabilityGame";
import { useAudio } from "@/lib/stores/useAudio";

export function PlinkoUI() {
  const [slotCounts, setSlotCounts] = useState<number[]>(Array(9).fill(0));
  const [prediction, setPrediction] = useState<number | null>(null);
  const [lastSlot, setLastSlot] = useState<number | null>(null);
  const { updatePlinkoStats, addScore, stats } = useProbabilityGame();
  const { playHit, playSuccess } = useAudio();

  const dropBall = () => {
    if (prediction === null) return;
    
    // Simulate Plinko drop - tends toward center (binomial distribution)
    let position = 4;
    const bounces = 8;
    
    for (let i = 0; i < bounces; i++) {
      position += Math.random() < 0.5 ? -0.5 : 0.5;
    }
    
    const slot = Math.max(0, Math.min(8, Math.round(position)));
    setLastSlot(slot);
    
    const newCounts = [...slotCounts];
    newCounts[slot]++;
    setSlotCounts(newCounts);
    
    // Check if prediction was in nearby slots (center slots more likely)
    const centerSlots = [3, 4, 5];
    const correct = (prediction === slot) || (centerSlots.includes(prediction) && centerSlots.includes(slot));
    
    updatePlinkoStats(correct);
    if (correct) {
      addScore(20);
      playSuccess();
    } else {
      playHit();
    }
  };

  const resetBoard = () => {
    setSlotCounts(Array(9).fill(0));
    setLastSlot(null);
    setPrediction(null);
  };

  const maxCount = Math.max(...slotCounts, 1);

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="bg-black bg-opacity-80 p-8 rounded-lg max-w-3xl">
        <h2 className="text-white text-3xl font-bold mb-6 text-center">Probability Plinko</h2>
        
        {/* Slot distribution visualization */}
        <div className="flex items-end gap-2 justify-center mb-6 h-48">
          {slotCounts.map((count, i) => {
            const heightPercent = (count / maxCount) * 100;
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className="w-12 bg-teal-500 rounded-t transition-all"
                  style={{ height: `${Math.max(heightPercent, 5)}%` }}
                />
                <div className="text-white text-sm font-bold">{count}</div>
                <button
                  onClick={() => setPrediction(i)}
                  className={`w-12 h-8 rounded text-white text-xs font-bold transition-all ${
                    prediction === i ? "bg-green-600 scale-110" : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  {i}
                </button>
              </div>
            );
          })}
        </div>
        
        {lastSlot !== null && (
          <div className="mb-4 text-center bg-gray-800 p-3 rounded-lg">
            <p className="text-white text-lg">
              Landed in slot <span className="font-bold text-teal-400">{lastSlot}</span>
              {prediction === lastSlot && " - ✓ Correct!"}
            </p>
          </div>
        )}
        
        <div className="flex gap-4 justify-center mb-4">
          <button
            onClick={dropBall}
            disabled={prediction === null}
            className="px-8 py-4 bg-yellow-600 text-white rounded-lg font-bold text-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Drop Ball
          </button>
          <button
            onClick={resetBoard}
            className="px-8 py-4 bg-gray-700 text-white rounded-lg font-bold text-xl hover:bg-gray-600 transition-all"
          >
            Reset
          </button>
        </div>
        
        <div className="text-center text-gray-300 text-sm">
          <p className="mb-2">Select a slot prediction, then drop the ball!</p>
          <p>Accuracy: {stats.plinko.accuracy.toFixed(1)}%</p>
          <p className="text-xs mt-2">Tip: Center slots (3-5) are most likely due to binomial distribution!</p>
        </div>
      </div>
    </div>
  );
}
