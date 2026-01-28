import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { useProbabilityGame, type MiniGame } from "@/lib/stores/useProbabilityGame";
import { useAudio } from "@/lib/stores/useAudio";

const SEGMENTS = [
  { game: "coinFlip" as MiniGame, color: "#FF6B6B", label: "Coin Flip" },
  { game: "diceKingdom" as MiniGame, color: "#4ECDC4", label: "Dice Kingdom" },
  { game: "marbleCollector" as MiniGame, color: "#FFD93D", label: "Marble Collector" },
  { game: "plinko" as MiniGame, color: "#95E1D3", label: "Plinko" },
];

export function SpinnerWheel() {
  const groupRef = useRef<THREE.Group>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinVelocity, setSpinVelocity] = useState(0);
  const { setCurrentGame, setTransitioning } = useProbabilityGame();
  const { playSuccess } = useAudio();

  const segmentAngle = (Math.PI * 2) / SEGMENTS.length;

  useFrame((state, delta) => {
    if (groupRef.current && isSpinning) {
      groupRef.current.rotation.z += spinVelocity * delta;
      
      setSpinVelocity((v) => {
        const newVel = v * 0.95;
        
        if (newVel < 0.01) {
          setIsSpinning(false);
          
          // Calculate which segment we landed on
          // The pointer is at the top (angle π/2 in world space)
          const pointerAngle = Math.PI / 2;
          const rotationZ = groupRef.current!.rotation.z;
          
          // Find which segment center is closest to the pointer
          // Each segment center is at: segmentStartAngle + segmentAngle/2 + rotationZ
          // Use THREE's euclidean modulo to properly normalize angles
          let closestIndex = 0;
          let minDistance = Infinity;
          
          for (let i = 0; i < SEGMENTS.length; i++) {
            // Calculate segment center and normalize to [0, 2π)
            let segmentCenter = i * segmentAngle + segmentAngle / 2 + rotationZ;
            segmentCenter = THREE.MathUtils.euclideanModulo(segmentCenter, Math.PI * 2);
            
            // Calculate shortest angular distance between segment center and pointer
            let delta = Math.abs(segmentCenter - pointerAngle);
            // Wrap around if distance is > π
            if (delta > Math.PI) {
              delta = Math.PI * 2 - delta;
            }
            
            if (delta < minDistance) {
              minDistance = delta;
              closestIndex = i;
            }
          }
          
          const selectedGame = SEGMENTS[closestIndex].game;
          
          console.log("Landed on:", selectedGame, "at index:", closestIndex);
          playSuccess();
          
          // Transition to the selected game after a brief delay
          setTimeout(() => {
            setTransitioning(true);
            setTimeout(() => {
              setCurrentGame(selectedGame);
              setTransitioning(false);
            }, 500);
          }, 500);
          
          return 0;
        }
        
        return newVel;
      });
    }
  });

  const spinWheel = () => {
    if (!isSpinning) {
      console.log("Spinning wheel!");
      setIsSpinning(true);
      setSpinVelocity(30 + Math.random() * 2);
    }
  };

  return (
    <group ref={groupRef} onClick={spinWheel}>
      {/* Draw wheel segments */}
      {SEGMENTS.map((segment, index) => {
        const startAngle = index * segmentAngle;
        
        return (
          <group key={index} rotation={[0, 0, startAngle]}>
            {/* Segment shape */}
            <mesh position={[0, 0, 0]}>
              <circleGeometry args={[3, 32, 0, segmentAngle]} />
              <meshStandardMaterial color={segment.color} />
            </mesh>
            
            {/* Label */}
            <Text
              position={[1.5, -1.25, 0.1]}
              rotation={[0, 0, segmentAngle / 2]}
              fontSize={0.25}
              color="white"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.02}
              outlineColor="#000000"
            >
              {segment.label}
            </Text>
          </group>
        );
      })}
      
      {/* Center circle */}
      <mesh position={[0, 0, 0.05]}>
        <circleGeometry args={[0.5, 32]} />
        <meshStandardMaterial color="#2C3E50" />
      </mesh>
      
      {/* Center text */}
      <Text
        position={[0, 0, 0.1]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        SPIN
      </Text>
      
      {/* Pointer at top */}
      <mesh position={[0, 3.5, 0.1]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[0.3, 0.6, 3]} />
        <meshStandardMaterial color="#E74C3C" />
      </mesh>
    </group>
  );
}
