import { Suspense, useRef, Component, ErrorInfo, ReactNode, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Center } from "@react-three/drei";
import * as THREE from "three";

// Robust Error Boundary for WebGL/Canvas issues
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

function Basketball({
  targetPos,
  targetRot,
  mouseCoords,
  scrollVelocity,
}: {
  targetPos: React.MutableRefObject<THREE.Vector3>;
  targetRot: React.MutableRefObject<THREE.Euler>;
  mouseCoords: React.MutableRefObject<THREE.Vector2>;
  scrollVelocity: React.MutableRefObject<number>;
}) {
  const gltf = useGLTF("/3dmodel/wilson_basketball.glb");
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  
  // Physics & Animation Refs
  const spinSpeed = useRef(0.008);
  const targetSpinSpeed = useRef(0.008);
  const rollAngle = useRef(0);

  // Auto-preloading, cleaning background environment nodes, and auto-scaling
  useEffect(() => {
    if (gltf.scene) {
      // 1. Traverse and hide typical Sketchfab studio environment and backdrop meshes
      gltf.scene.traverse((child) => {
        const name = child.name.toLowerCase();
        if (
          name.includes("background") ||
          name.includes("floor") ||
          name.includes("ground") ||
          name.includes("studio") ||
          name.includes("skybox") ||
          name.includes("dome") ||
          name.includes("wall") ||
          name.includes("stage") ||
          name.includes("helper") ||
          name.includes("camera") ||
          name.includes("light") ||
          name.includes("backdrop") ||
          name.includes("env")
        ) {
          child.visible = false;
        }

        // Apply realistic leather material properties on the actual basketball mesh
        if (child.visible && (child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          if (mesh.material) {
            const mat = mesh.material as THREE.MeshStandardMaterial;
            mat.roughness = 0.55;
            mat.metalness = 0.15;
          }
        }
      });

      // 2. Reset scale to native unit size for measurement
      gltf.scene.scale.set(1, 1, 1);

      // 3. Measure bounding box of only visible meshes (the ball itself)
      const box = new THREE.Box3().setFromObject(gltf.scene);
      const size = new THREE.Vector3();
      box.getSize(size);
      
      const maxDim = Math.max(size.x, size.y, size.z);
      
      // 4. Scale to standard physical unit size (e.g. 1.2 diameter in Three.js space)
      if (maxDim > 0) {
        const targetSize = 1.2;
        const scaleFactor = targetSize / maxDim;
        gltf.scene.scale.set(scaleFactor, scaleFactor, scaleFactor);
        console.log(`Auto-scaled basketball model by factor: ${scaleFactor} (Native size: ${maxDim})`);
      }
    }
  }, [gltf]);

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime();

      // 1. Lerp to target position (scroll positions)
      groupRef.current.position.lerp(targetPos.current, 0.05);

      // 2. Smoothly adjust spin speed based on hover state
      targetSpinSpeed.current = hovered ? 0.075 : 0.008;
      spinSpeed.current = THREE.MathUtils.lerp(spinSpeed.current, targetSpinSpeed.current, 0.08);
      
      // Base spin + faster spin if hovered
      groupRef.current.rotation.y += spinSpeed.current;

      // 3. Roll rotation based on scrolling speed/direction
      rollAngle.current += scrollVelocity.current * 0.05;
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRot.current.z - rollAngle.current, 0.08);

      // 4. Combine base target rotation with mouse tilt tracking
      const mouseTiltX = targetRot.current.x - mouseCoords.current.y * 0.15;
      const mouseTiltY = targetRot.current.y + mouseCoords.current.x * 0.15;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, mouseTiltX, 0.08);
      
      // 5. Sinusoidal hover/floating bobbing motion in mid-air
      const bobFreq = hovered ? 2.5 : 1.4;
      const bobAmp = hovered ? 0.04 : 0.025;
      const extraBob = scrollVelocity.current * 0.08;
      groupRef.current.position.y += Math.sin(time * bobFreq) * bobAmp + Math.cos(time * 3) * extraBob * 0.02;
    }
  });

  return (
    <group 
      ref={groupRef}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
      }}
    >
      <Center>
        <primitive 
          object={gltf.scene} 
          rotation={[0, 0, 0]}
        />
      </Center>
    </group>
  );
}

// Preload the GLTF file to prevent screen flickering
useGLTF.preload("/3dmodel/wilson_basketball.glb");

function LoadingPlaceholder() {
  return null;
}

function ErrorFallback() {
  return null;
}

export default function BasketballViewer() {
  const targetPosition = useRef(new THREE.Vector3(1.8, 0, 0));
  const targetRotation = useRef(new THREE.Euler(0.1, 0, 0));
  const mouseCoordinates = useRef(new THREE.Vector2(0, 0));
  
  const lastScrollY = useRef(0);
  const scrollVelocity = useRef(0);

  useEffect(() => {
    const handleScrollAndResize = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? scrollY / docHeight : 0;
      const isMobile = window.innerWidth < 1024;

      // Track scroll velocity
      const diff = scrollY - lastScrollY.current;
      scrollVelocity.current = diff;
      lastScrollY.current = scrollY;

      if (isMobile) {
        // Mobile positioning: floats centrally in background (small and deep)
        if (scrollPercent < 0.25) {
          targetPosition.current.set(0, -0.5, -2);
          targetRotation.current.set(0.1, 0, 0);
        } else if (scrollPercent < 0.55) {
          targetPosition.current.set(0, 0.3, -2.5);
          targetRotation.current.set(0.1, Math.PI / 4, 0.1);
        } else {
          targetPosition.current.set(0, -0.3, -2);
          targetRotation.current.set(0.1, -Math.PI / 4, 0);
        }
      } else {
        // Desktop positioning: transitions left and right through the margins
        if (scrollPercent < 0.2) {
          // Hero (far right margin)
          targetPosition.current.set(2.0, 0, 0);
          targetRotation.current.set(0.1, 0, 0);
        } else if (scrollPercent < 0.45) {
          // About (far left margin)
          targetPosition.current.set(-2.0, -0.2, -0.5);
          targetRotation.current.set(0.2, Math.PI / 4, 0.1);
        } else if (scrollPercent < 0.75) {
          // Skills & Projects (far right margin)
          targetPosition.current.set(2.0, 0.2, -0.2);
          targetRotation.current.set(0.15, -Math.PI / 4, -0.05);
        } else {
          // Contact / Footer (far left margin)
          targetPosition.current.set(-1.8, -0.3, 0);
          targetRotation.current.set(0.1, Math.PI / 6, 0);
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseCoordinates.current.set(x, y);
    };

    // Decay the scroll velocity continuously
    const interval = setInterval(() => {
      scrollVelocity.current = THREE.MathUtils.lerp(scrollVelocity.current, 0, 0.1);
    }, 16);

    window.addEventListener("scroll", handleScrollAndResize, { passive: true });
    window.addEventListener("resize", handleScrollAndResize);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    
    // Initial position compute
    handleScrollAndResize();

    return () => {
      clearInterval(interval);
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
            {/* Lighting Rig tailored for realistic 3D leather ball reflections */}
            <ambientLight intensity={1.2} />
            
            {/* Main sun-like directional light */}
            <directionalLight position={[5, 10, 5]} intensity={2.2} castShadow />
            <directionalLight position={[-5, 5, -5]} intensity={0.5} />
            
            {/* Colorful neon backlights to match portfolio styling */}
            <pointLight position={[-4, 3, 2]} intensity={2.0} color="#06b6d4" />
            <pointLight position={[4, -3, 2]} intensity={1.5} color="#3b82f6" />
            
            <Basketball 
              targetPos={targetPosition} 
              targetRot={targetRotation} 
              mouseCoords={mouseCoordinates}
              scrollVelocity={scrollVelocity}
            />
          </Canvas>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
