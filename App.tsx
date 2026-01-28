import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { OrbitControls } from "@react-three/drei";
import { useProbabilityGame } from "./lib/stores/useProbabilityGame";
import { SpinnerWheel } from "./components/SpinnerWheel";
import { CoinFlipUI } from "./components/CoinFlipGame";
import { DiceKingdomUI } from "./components/DiceKingdomGame";
import { MarbleCollectorUI } from "./components/MarbleCollectorGame";
import { PlinkoUI } from "./components/PlinkoGame";
import { GameUI } from "./components/GameUI";
import { GameTransition, TransitionOverlay } from "./components/GameTransition";
import { SoundManager } from "./components/SoundManager";
import "@fontsource/inter";

function Scene() {
  const { currentGame } = useProbabilityGame();

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[0, 0, 5]} intensity={0.5} />

      <Suspense fallback={null}>
        {/* Only show 3D spinner wheel on the spinner screen */}
        {currentGame === "spinner" && <SpinnerWheel />}
      </Suspense>

      {/* Camera controls */}
      <OrbitControls enablePan={false} enableZoom={true} maxDistance={15} minDistance={5} />
    </>
  );
}

function App() {
  const { currentGame } = useProbabilityGame();
  const [showCanvas, setShowCanvas] = useState(false);

  useEffect(() => {
    setShowCanvas(true);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {showCanvas && (
        <GameTransition>
          {/* 3D Canvas - only shows spinner */}
          <Canvas
            camera={{
              position: [0, 0, 10],
              fov: 50,
              near: 0.1,
              far: 1000
            }}
            gl={{
              antialias: true,
              powerPreference: "default"
            }}
          >
            <color attach="background" args={["#1a1a2e"]} />
            <Scene />
          </Canvas>

          {/* 2D UI Overlays */}
          <GameUI />
          <TransitionOverlay />
          
          {/* Mini-game UI overlays */}
          {currentGame === "coinFlip" && <CoinFlipUI />}
          {currentGame === "diceKingdom" && <DiceKingdomUI />}
          {currentGame === "marbleCollector" && <MarbleCollectorUI />}
          {currentGame === "plinko" && <PlinkoUI />}

          {/* Sound Manager */}
          <SoundManager />
        </GameTransition>
      )}
    </div>
  );
}

export default App;
