import { Suspense, useRef, Component, ErrorInfo, ReactNode, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Center } from "@react-three/drei";
import * as THREE from "three";

// Robust Error Boundary
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("WebGL / R3F Canvas Render Error caught by Boundary:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Procedural Interactive Terrain Grid
function TerrainGrid({ mouseCoords }: { mouseCoords: React.MutableRefObject<THREE.Vector2> }) {
  const geomRef = useRef<THREE.PlaneGeometry>(null);

  // Procedural wave grid movement + mouse coordinate distortion loop
  useFrame((state) => {
    if (geomRef.current) {
      const time = state.clock.getElapsedTime();
      const posAttr = geomRef.current.attributes.position;
      
      for (let i = 0; i < posAttr.count; i++) {
        // Read native X & Y coordinates of the plane geometry vertices
        const x = posAttr.getX(i);
        const y = posAttr.getY(i);
        
        // Calculate rolling wave equations
        const zWave = Math.sin(x * 0.35 + time * 1.3) * Math.cos(y * 0.35 + time * 0.9) * 0.35
                    + Math.sin(x * 0.15 - time * 0.4) * 0.12;

        // Mouse ripple coordinate distortion
        // Map cursor range (-1 to 1) into relative plane 3D coordinates
        const targetMouseX = mouseCoords.current.x * 6;
        const targetMouseY = mouseCoords.current.y * 6;
        const dist = Math.sqrt((x - targetMouseX) ** 2 + (y - targetMouseY) ** 2);
        
        // Dynamic peak deformation on proximity
        const cursorPeak = Math.exp(-dist * 0.7) * 0.45;
        
        // Write the calculated coordinate height to the position buffer
        posAttr.setZ(i, zWave + cursorPeak);
      }
      
      posAttr.needsUpdate = true;
    }
  });

  return (
    <mesh 
      rotation={[-Math.PI / 2.05, 0, 0]} 
      position={[0, -1.9, -0.8]}
    >
      <planeGeometry ref={geomRef} args={[16, 16, 32, 32]} />
      <meshBasicMaterial 
        color="#06b6d4" 
        wireframe 
        transparent 
        opacity={0.16} 
      />
    </mesh>
  );
}

function BmoModel({
  targetPos,
  targetRot,
  mouseCoords
}: {
  targetPos: React.MutableRefObject<THREE.Vector3>;
  targetRot: React.MutableRefObject<THREE.Euler>;
  mouseCoords: React.MutableRefObject<THREE.Vector2>;
}) {
  const gltf = useGLTF("/3dmodel/bmo_adventure_time_copy_copy.gltf");
  const modelRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (modelRef.current) {
      // Smoothly lerp BMO position to follow target coordinates
      modelRef.current.position.lerp(targetPos.current, 0.05);

      // Dynamically combine target rotation with mouse tilt offsets
      const targetX = targetRot.current.x - mouseCoords.current.y * 0.18;
      const targetY = targetRot.current.y + mouseCoords.current.x * 0.22;
      const targetZ = targetRot.current.z;

      // Lerp rotation smoothly
      modelRef.current.rotation.x = THREE.MathUtils.lerp(modelRef.current.rotation.x, targetX, 0.05);
      modelRef.current.rotation.y = THREE.MathUtils.lerp(modelRef.current.rotation.y, targetY, 0.05);
      modelRef.current.rotation.z = THREE.MathUtils.lerp(modelRef.current.rotation.z, targetZ, 0.05);

      // Slow floating sinusoidal movement
      modelRef.current.position.y += Math.sin(state.clock.getElapsedTime() * 1.6) * 0.003;
    }
  });

  return (
    <group ref={modelRef}>
      <Center>
        <primitive 
          object={gltf.scene} 
          scale={0.75} 
          rotation={[0, Math.PI / 4, 0]}
        />
      </Center>
    </group>
  );
}

function LoadingPlaceholder() {
  return null; // Silent in-background loader
}

function ErrorFallback() {
  return null; // Silent in-background error fallback
}

export default function BmoViewer() {
  const targetPosition = useRef(new THREE.Vector3(1.3, 0, 0));
  const targetRotation = useRef(new THREE.Euler(0.1, Math.PI / 4, 0));
  const mouseCoordinates = useRef(new THREE.Vector2(0, 0));

  useEffect(() => {
    const handleScrollAndResize = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? scrollY / docHeight : 0;
      const isMobile = window.innerWidth < 1024;

      if (isMobile) {
        // Mobile positioning: floats centrally in background with low opacity
        if (scrollPercent < 0.25) {
          targetPosition.current.set(0, -0.6, -2);
          targetRotation.current.set(0.1, Math.PI / 4, 0);
        } else if (scrollPercent < 0.55) {
          targetPosition.current.set(0, 0.4, -2.5);
          targetRotation.current.set(0.1, -Math.PI / 4, 0.1);
        } else {
          targetPosition.current.set(0, -0.4, -2);
          targetRotation.current.set(0.1, Math.PI, 0);
        }
      } else {
        // Desktop positioning: moves left and right on margins to avoid text overlap
        if (scrollPercent < 0.2) {
          // Hero (right margin)
          targetPosition.current.set(1.3, 0, 0);
          targetRotation.current.set(0.1, Math.PI / 5, 0);
        } else if (scrollPercent < 0.45) {
          // About (left margin)
          targetPosition.current.set(-1.4, -0.3, -0.5);
          targetRotation.current.set(0.2, -Math.PI / 4, 0.1);
        } else if (scrollPercent < 0.75) {
          // Skills & Projects (right margin)
          targetPosition.current.set(1.4, 0.2, -0.2);
          targetRotation.current.set(0.15, Math.PI / 3, -0.05);
        } else {
          // Contact / Footer (left margin)
          targetPosition.current.set(-1.3, -0.4, 0);
          targetRotation.current.set(0.1, -Math.PI / 6, 0);
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseCoordinates.current.set(x, y);
    };

    window.addEventListener("scroll", handleScrollAndResize, { passive: true });
    window.addEventListener("resize", handleScrollAndResize);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    
    // Initial compute
    handleScrollAndResize();

    return () => {
      window.removeEventListener("scroll", handleScrollAndResize);
      window.removeEventListener("resize", handleScrollAndResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
      <ErrorBoundary fallback={<ErrorFallback />}>
        <Suspense fallback={<LoadingPlaceholder />}>
          <Canvas
            camera={{ position: [0, 0, 4.5], fov: 45 }}
            gl={{ antialias: true, alpha: true }}
            style={{ background: "transparent" }}
          >
            {/* Lighting Rig */}
            <ambientLight intensity={1.5} />
            <directionalLight position={[5, 10, 5]} intensity={2.0} />
            <directionalLight position={[-5, -5, -5]} intensity={0.6} />
            <pointLight position={[0, 4, 2]} intensity={1.8} color="#60a5fa" />
            
            <BmoModel 
              targetPos={targetPosition} 
              targetRot={targetRotation} 
              mouseCoords={mouseCoordinates} 
            />

            {/* Interactive Terrain Grid Component */}
            <TerrainGrid mouseCoords={mouseCoordinates} />
          </Canvas>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
