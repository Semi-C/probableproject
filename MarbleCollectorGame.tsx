import { useState, useMemo } from "react";
import { useProbabilityGame } from "@/lib/stores/useProbabilityGame";
import { useAudio } from "@/lib/stores/useAudio";

export function MarbleCollectorUI() {
  const colorOptions = [
    { name: "red", hex: "#EF4444", initial: 3 },
    { name: "blue", hex: "#3B82F6", initial: 2 },
    { name: "green", hex: "#10B981", initial: 3 },
    { name: "yellow", hex: "#F59E0B", initial: 2 },
  ];

  const [marbles, setMarbles] = useState(
    colorOptions.flatMap((c) => Array(c.initial).fill(c.name))
  );
  const [drawnMarble, setDrawnMarble] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const { updateMarbleCollectorStats, addScore, stats } = useProbabilityGame();
  const { playHit, playSuccess } = useAudio();

  const drawMarble = (pred: string) => {
    if (marbles.length === 0 || drawnMarble) return;
    
    setPrediction(pred);
    
    const randomIndex = Math.floor(Math.random() * marbles.length);
    const drawn = marbles[randomIndex];
    setDrawnMarble(drawn);
    
    const newMarbles = marbles.filter((_, i) => i !== randomIndex);
    setMarbles(newMarbles);
    
    const correct = pred === drawn;
    updateMarbleCollectorStats(correct);
    if (correct) {
      addScore(15);
      playSuccess();
    } else {
      playHit();
    }
  };

  const resetJar = () => {
    setMarbles(colorOptions.flatMap((c) => Array(c.initial).fill(c.name)));
    setDrawnMarble(null);
    setPrediction(null);
  };

  const getColorCount = (colorName: string) => {
    return marbles.filter((m) => m === colorName).length;
  };

  const getProbability = (colorName: string) => {
    if (marbles.length === 0) return 0;
    return ((getColorCount(colorName) / marbles.length) * 100).toFixed(1);
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="bg-black bg-opacity-80 p-8 rounded-lg max-w-2xl">
        <h2 className="text-white text-3xl font-bold mb-6 text-center">Monster Marble Collector</h2>
        
        {/* Jar visualization */}
        <div className="bg-gray-800 p-6 rounded-lg mb-6 min-h-[200px] flex flex-wrap gap-2 justify-center items-center">
          {marbles.map((color, i) => (
            <div
              key={i}
              className="w-8 h-8 rounded-full shadow-lg"
              style={{ backgroundColor: colorOptions.find((c) => c.name === color)?.hex }}
            />
          ))}
          {marbles.length === 0 && (
            <p className="text-gray-400 text-xl">Jar is empty!</p>
          )}
        </div>
        
        {/* Drawn marble */}
        {drawnMarble && (
          <div className="mb-6 text-center">
            <p className="text-white text-xl mb-2">You drew:</p>
            <div
              className="w-16 h-16 rounded-full mx-auto shadow-2xl"
              style={{ backgroundColor: colorOptions.find((c) => c.name === drawnMarble)?.hex }}
            />
            <p className={`text-2xl font-bold mt-3 ${prediction === drawnMarble ? "text-green-400" : "text-red-400"}`}>
              {prediction === drawnMarble ? "✓ Correct!" : "✗ Wrong"}
            </p>
          </div>
        )}
        
        {/* Color probabilities and buttons */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {colorOptions.map((color) => (
            <button
              key={color.name}
              onClick={() => drawMarble(color.name)}
              disabled={marbles.length === 0 || drawnMarble !== null}
              className="p-4 rounded-lg text-white font-bold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              style={{ backgroundColor: color.hex }}
            >
              <div className="text-lg capitalize">{color.name}</div>
              <div className="text-sm">
                {getColorCount(color.name)}/{marbles.length} ({getProbability(color.name)}%)
              </div>
            </button>
          ))}
        </div>
        
        {/* Reset button */}
        <button
          onClick={resetJar}
          className="w-full py-3 bg-gray-700 text-white rounded-lg font-bold hover:bg-gray-600 transition-all"
        >
          Reset Jar
        </button>
        
        <div className="mt-4 text-center text-gray-300 text-sm">
          <p className="mb-2">Drawing without replacement - probabilities change after each draw!</p>
          <p>Accuracy: {stats.marbleCollector.accuracy.toFixed(1)}%</p>
          <p className="text-xs mt-2">Total Draws: {stats.marbleCollector.totalDraws}</p>
        </div>
      </div>
    </div>
  );
}
