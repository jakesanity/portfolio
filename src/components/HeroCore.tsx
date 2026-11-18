import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { sfx, useSystemTheme, type CoreMode } from "../lib/system";

const BASE = new THREE.Color("#d8d8de");
const PARTICLE_COUNT = 2200;

/* ------------------------------------------------------------------ */
/*  Morphing point-cloud shader with click-pulse shockwave             */
/* ------------------------------------------------------------------ */

const pointsVertex = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uPulse;
  attribute float aRandom;
  varying float vRandom;
  varying float vDepth;
  varying float vPulse;

  void main() {
    vRandom = aRandom;
    vec3 p = position;
    float wave = sin(uTime * 0.9 + aRandom * 6.2831 + position.y * 2.4) * 0.035;
    float shock = sin(length(p) * 6.0 - uTime * 8.0) * uPulse * 0.18;
    p *= 1.0 + wave + shock;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vDepth = clamp((-mv.z - 2.4) / 3.0, 0.0, 1.0);
    vPulse = uPulse;
    gl_Position = projectionMatrix * mv;

    float size = (aRandom > 0.92 ? 3.8 : 1.95) * (1.0 + uPulse * 0.45);
    gl_PointSize = size * uPixelRatio * (4.2 / -mv.z);
  }
`;

const pointsFragment = /* glsl */ `
  uniform vec3 uBase;
  uniform vec3 uAccent;
  varying float vRandom;
  varying float vDepth;
  varying float vPulse;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.1, d);
    float isAccent = step(0.92 - vPulse * 0.35, vRandom);
    vec3 color = mix(uBase, uAccent, isAccent);
    float fade = mix(1.0, 0.18, vDepth);
    gl_FragColor = vec4(color, alpha * fade * mix(0.55, 1.0, isAccent));
  }
`;

function buildGeometries(count: number) {
  const sphere = new Float32Array(count * 3);
  const torus = new Float32Array(count * 3);
  const helix = new Float32Array(count * 3);
  const randoms = new Float32Array(count);

  const golden = Math.PI * (3 - Math.sqrt(5));
  const R = 1.15;
  const rTube = 0.42;

  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    randoms[i] = Math.random();

    // 1. Fibonacci Sphere
    const y = 1 - t * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    sphere[i * 3] = Math.cos(theta) * r * 1.35;
    sphere[i * 3 + 1] = y * 1.35;
    sphere[i * 3 + 2] = Math.sin(theta) * r * 1.35;

    // 2. Orbital Torus
    const u = t * Math.PI * 2 * 13;
    const v = golden * i;
    torus[i * 3] = (R + rTube * Math.cos(v)) * Math.cos(u);
    torus[i * 3 + 1] = rTube * Math.sin(v);
    torus[i * 3 + 2] = (R + rTube * Math.cos(v)) * Math.sin(u);

    // 3. Double Data Helix
    const strand = i % 2 === 0 ? 1 : -1;
    const hAngle = t * Math.PI * 8 + (strand > 0 ? 0 : Math.PI);
    const hRadius = 0.85 + (randoms[i] - 0.5) * 0.18;
    helix[i * 3] = Math.cos(hAngle) * hRadius;
    helix[i * 3 + 1] = (t - 0.5) * 2.7;
    helix[i * 3 + 2] = Math.sin(hAngle) * hRadius;
  }

  return { sphere, torus, helix, randoms };
}

function PointCloud({
  mode,
  accentHex,
  pulseRef,
}: {
  mode: CoreMode;
  accentHex: string;
  pulseRef: React.MutableRefObject<number>;
}) {
  const { sphere, torus, helix, randoms } = useMemo(() => buildGeometries(PARTICLE_COUNT), []);
  const currentPositions = useMemo(() => new Float32Array(sphere), [sphere]);
  const posAttrRef = useRef<THREE.BufferAttribute>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uPulse: { value: 0 },
      uBase: { value: BASE },
      uAccent: { value: new THREE.Color(accentHex) },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    uniforms.uAccent.value.set(accentHex);
  }, [accentHex, uniforms]);

  useFrame((_, delta) => {
    uniforms.uTime.value += delta;
    pulseRef.current = THREE.MathUtils.lerp(pulseRef.current, 0, Math.min(1, delta * 3.2));
    uniforms.uPulse.value = pulseRef.current;

    const target = mode === "torus" ? torus : mode === "helix" ? helix : sphere;
    const attr = posAttrRef.current;
    if (!attr) return;

    const arr = attr.array as Float32Array;
    const speed = Math.min(1, delta * 4.5);
    let dirty = false;
    for (let i = 0; i < arr.length; i++) {
      const diff = target[i] - arr[i];
      if (Math.abs(diff) > 0.0005) {
        arr[i] += diff * speed;
        dirty = true;
      }
    }
    if (dirty) attr.needsUpdate = true;
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute ref={posAttrRef} attach="attributes-position" args={[currentPositions, 3]} />
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

function Orbit({
  radius,
  tilt,
  speed,
  phase = 0,
  accentHex,
}: {
  radius: number;
  tilt: [number, number, number];
  speed: number;
  phase?: number;
  accentHex: string;
}) {
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
        <sphereGeometry args={[0.032, 12, 12]} />
        <meshBasicMaterial color={accentHex} />
      </mesh>
    </group>
  );
}

function Core({
  pointer,
  mode,
  accentHex,
  pulseRef,
}: {
  pointer: React.MutableRefObject<{ x: number; y: number }>;
  mode: CoreMode;
  accentHex: string;
  pulseRef: React.MutableRefObject<number>;
}) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    g.rotation.y += delta * (0.12 + pulseRef.current * 0.65);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, pointer.current.y * 0.35, 0.04);
    g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, -pointer.current.x * 0.2, 0.04);
  });

  return (
    <group ref={group}>
      <PointCloud mode={mode} accentHex={accentHex} pulseRef={pulseRef} />
      <Lattice />
      <Orbit radius={1.75} tilt={[Math.PI / 2.6, 0, 0.2]} speed={0.45} accentHex={accentHex} />
      <Orbit radius={2.05} tilt={[Math.PI / 1.8, 0.4, -0.3]} speed={-0.3} phase={2} accentHex={accentHex} />
      <Orbit radius={1.55} tilt={[0.2, 0, Math.PI / 3]} speed={0.6} phase={4} accentHex={accentHex} />
    </group>
  );
}

interface Props {
  mode?: CoreMode;
  pulseCount?: number;
}

/** Interactive tech "core" hero visual. Pauses rendering when off-screen. */
export default function HeroCore({ mode = "sphere", pulseCount = 0 }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const pulseRef = useRef(0);
  const { spec } = useSystemTheme();
  const [inView, setInView] = useState(true);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (pulseCount > 0) {
      pulseRef.current = 1;
    }
  }, [pulseCount]);

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

  const triggerPulse = () => {
    pulseRef.current = 1;
    sfx.pulse();
  };

  return (
    <div
      ref={wrap}
      onClick={triggerPulse}
      title="Click to send an energy pulse through the core"
      className="absolute inset-0 cursor-pointer"
    >
      {supported ? (
        <Canvas
          dpr={[1, 1.75]}
          frameloop={inView ? "always" : "never"}
          camera={{ position: [0, 0, 4.6], fov: 42 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        >
          <Core pointer={pointer} mode={mode} accentHex={spec.hex} pulseRef={pulseRef} />
        </Canvas>
      ) : (
        <div className="absolute inset-0 bg-dots mask-radial" />
      )}
    </div>
  );
}
