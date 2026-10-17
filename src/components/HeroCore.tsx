import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const ACCENT = new THREE.Color("#c6ff3d");
const BASE = new THREE.Color("#d8d8de");

/* ------------------------------------------------------------------ */
/*  Point-cloud sphere with breathing displacement (custom shader)     */
/* ------------------------------------------------------------------ */

const pointsVertex = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  attribute float aRandom;
  varying float vRandom;
  varying float vDepth;

  void main() {
    vRandom = aRandom;
    vec3 p = position;
    float wave = sin(uTime * 0.9 + aRandom * 6.2831 + position.y * 2.4) * 0.035;
    p *= 1.0 + wave;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vDepth = clamp((-mv.z - 2.4) / 3.0, 0.0, 1.0);
    gl_Position = projectionMatrix * mv;

    float size = aRandom > 0.94 ? 3.6 : 1.9;
    gl_PointSize = size * uPixelRatio * (4.2 / -mv.z);
  }
`;

const pointsFragment = /* glsl */ `
  uniform vec3 uBase;
  uniform vec3 uAccent;
  varying float vRandom;
  varying float vDepth;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.1, d);
    vec3 color = vRandom > 0.94 ? uAccent : uBase;
    float fade = mix(1.0, 0.18, vDepth);
    gl_FragColor = vec4(color, alpha * fade * (vRandom > 0.94 ? 1.0 : 0.55));
  }
`;

function fibonacciSphere(count: number, radius: number) {
  const positions = new Float32Array(count * 3);
  const randoms = new Float32Array(count);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    positions[i * 3] = Math.cos(theta) * r * radius;
    positions[i * 3 + 1] = y * radius;
    positions[i * 3 + 2] = Math.sin(theta) * r * radius;
    randoms[i] = Math.random();
  }
  return { positions, randoms };
}

function PointSphere() {
  const ref = useRef<THREE.Points>(null);
  const { positions, randoms } = useMemo(() => fibonacciSphere(2200, 1.35), []);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uBase: { value: BASE },
      uAccent: { value: ACCENT },
    }),
    []
  );

  useFrame((_, delta) => {
    uniforms.uTime.value += delta;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aRandom" args={[randoms, 1]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={pointsVertex}
        fragmentShader={pointsFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ------------------------------------------------------------------ */
/*  Inner lattice + orbit rings with satellites                         */
/* ------------------------------------------------------------------ */

function Lattice() {
  const geo = useMemo(() => new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(0.78, 1)), []);
  const ref = useRef<THREE.LineSegments>(null);
  useFrame((_, d) => {
    if (ref.current) {
      ref.current.rotation.x -= d * 0.08;
      ref.current.rotation.z += d * 0.05;
    }
  });
  return (
    <lineSegments ref={ref} geometry={geo}>
      <lineBasicMaterial color="#ffffff" transparent opacity={0.14} />
    </lineSegments>
  );
}

function Orbit({ radius, tilt, speed, phase = 0 }: { radius: number; tilt: [number, number, number]; speed: number; phase?: number }) {
  const sat = useRef<THREE.Mesh>(null);
  const ring = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 128; i++) {
      const a = (i / 128) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [radius]);

  useFrame(({ clock }) => {
    const a = clock.getElapsedTime() * speed + phase;
    sat.current?.position.set(Math.cos(a) * radius, 0, Math.sin(a) * radius);
  });

  return (
    <group rotation={tilt}>
      <lineLoop geometry={ring}>
        <lineBasicMaterial color="#ffffff" transparent opacity={0.09} />
      </lineLoop>
      <mesh ref={sat}>
        <sphereGeometry args={[0.028, 12, 12]} />
        <meshBasicMaterial color={ACCENT} />
      </mesh>
    </group>
  );
}

function Core({ pointer }: { pointer: React.MutableRefObject<{ x: number; y: number }> }) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    g.rotation.y += delta * 0.12;
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, pointer.current.y * 0.35, 0.04);
    g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, -pointer.current.x * 0.2, 0.04);
  });

  return (
    <group ref={group}>
      <PointSphere />
      <Lattice />
      <Orbit radius={1.75} tilt={[Math.PI / 2.6, 0, 0.2]} speed={0.45} />
      <Orbit radius={2.05} tilt={[Math.PI / 1.8, 0.4, -0.3]} speed={-0.3} phase={2} />
      <Orbit radius={1.55} tilt={[0.2, 0, Math.PI / 3]} speed={0.6} phase={4} />
    </group>
  );
}

/** Tech "core" hero visual. Pauses rendering when off-screen. */
export default function HeroCore() {
  const wrap = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const [inView, setInView] = useState(true);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      setSupported(!!(c.getContext("webgl2") || c.getContext("webgl")));
    } catch {
      setSupported(false);
    }

    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0 });
    if (wrap.current) io.observe(wrap.current);

    return () => {
      window.removeEventListener("pointermove", onMove);
      io.disconnect();
    };
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0">
      {supported ? (
        <Canvas
          dpr={[1, 1.75]}
          frameloop={inView ? "always" : "never"}
          camera={{ position: [0, 0, 4.6], fov: 42 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        >
          <Core pointer={pointer} />
        </Canvas>
      ) : (
        <div className="absolute inset-0 bg-dots mask-radial" />
      )}
    </div>
  );
}
