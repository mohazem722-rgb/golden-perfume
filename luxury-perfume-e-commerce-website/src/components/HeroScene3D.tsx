"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox, Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";

export type ScrollRef = MutableRefObject<number>;

const ease = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x * x * (3 - 2 * x));
const seg  = (p: number, a: number, b: number) => ease((p - a) / (b - a));

/* ── camera ── */
function Rig() {
  const { camera, size } = useThree();
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    cam.fov = 34;
    cam.position.set(0, 0, size.width < 640 ? 8 : 6.2);
    cam.lookAt(0, 0, 0);
    cam.updateProjectionMatrix();
  }, [camera, size]);
  return null;
}

/* ── bottle ── */
function Bottle({ scrollRef }: { scrollRef: ScrollRef }) {
  const group  = useRef<THREE.Group>(null);
  const capGrp = useRef<THREE.Group>(null);
  const smoothed = useRef(0);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    smoothed.current += (scrollRef.current - smoothed.current) * 0.10;
    const p = smoothed.current;

    if (group.current) {
      group.current.rotation.y = t * 0.18 + p * 1.8;
      group.current.position.y = Math.sin(t * 0.7) * 0.06 - seg(p, 0.65, 1) * 0.7;
      group.current.scale.setScalar(1 - seg(p, 0.65, 1) * 0.18);
    }
    if (capGrp.current) {
      const lift = seg(p, 0.25, 0.5);
      capGrp.current.position.y = 2.68 + lift * 1.6;
      capGrp.current.position.x = lift * 0.8;
      capGrp.current.rotation.z = lift * 0.4;
    }
  });

  return (
    <group ref={group}>
      {/* ── body glass ── */}
      <RoundedBox args={[1.55, 2.55, 0.88]} radius={0.145} smoothness={10} position={[0, 0, 0]}>
        <meshPhysicalMaterial
          color="#08080f"
          roughness={0.06}
          metalness={0.0}
          clearcoat={1}
          clearcoatRoughness={0.04}
          transmission={0.55}
          thickness={1.4}
          ior={1.52}
          envMapIntensity={2.2}
        />
      </RoundedBox>

      {/* ── liquid inside ── */}
      <RoundedBox args={[1.24, 1.42, 0.62]} radius={0.1} smoothness={8} position={[0, -0.25, 0]}>
        <meshStandardMaterial
          color="#c49020"
          metalness={0.85}
          roughness={0.18}
          emissive="#3d2900"
          emissiveIntensity={0.45}
          envMapIntensity={2.5}
        />
      </RoundedBox>

      {/* liquid surface shimmer */}
      <mesh position={[0, 0.45, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.55, 48]} />
        <meshStandardMaterial
          color="#ffe080"
          metalness={1}
          roughness={0.08}
          emissive="#7a5800"
          emissiveIntensity={0.7}
        />
      </mesh>

      {/* ── gold base band ── */}
      <mesh position={[0, -1.31, 0]}>
        <cylinderGeometry args={[0.8, 0.84, 0.11, 64]} />
        <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.14} envMapIntensity={2.8} />
      </mesh>

      {/* ── neck ── */}
      <mesh position={[0, 1.62, 0]}>
        <cylinderGeometry args={[0.24, 0.28, 0.52, 48]} />
        <meshPhysicalMaterial
          color="#10101a"
          roughness={0.1}
          metalness={0.05}
          clearcoat={1}
          envMapIntensity={1.8}
        />
      </mesh>

      {/* ── gold collar ── */}
      <mesh position={[0, 1.39, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.055, 64]} />
        <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.12} envMapIntensity={3} />
      </mesh>
      <mesh position={[0, 1.42, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.295, 0.03, 12, 64]} />
        <meshStandardMaterial color="#ffe9a0" metalness={1} roughness={0.1} envMapIntensity={3} />
      </mesh>

      {/* ── label (dark, engraved look) ── */}
      <group position={[0, 0.08, 0.445]}>
        {/* gold frame */}
        <mesh>
          <boxGeometry args={[1.12, 0.82, 0.01]} />
          <meshStandardMaterial color="#b8912f" metalness={1} roughness={0.22} envMapIntensity={2} />
        </mesh>
        {/* black inner */}
        <mesh position={[0, 0, 0.009]}>
          <boxGeometry args={[1.0, 0.7, 0.01]} />
          <meshStandardMaterial color="#060609" roughness={0.4} metalness={0.2} />
        </mesh>
        {/* hexagon ring emblem */}
        <mesh position={[0, 0.17, 0.018]} rotation={[0, 0, Math.PI / 6]}>
          <ringGeometry args={[0.09, 0.115, 6]} />
          <meshStandardMaterial color="#ffd700" metalness={1} roughness={0.15} emissive="#5a3d00" emissiveIntensity={0.6} />
        </mesh>
        {/* brand line 1 */}
        <mesh position={[0, -0.04, 0.018]}>
          <boxGeometry args={[0.52, 0.025, 0.005]} />
          <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.25} />
        </mesh>
        {/* brand line 2 */}
        <mesh position={[0, -0.14, 0.018]}>
          <boxGeometry args={[0.36, 0.016, 0.005]} />
          <meshStandardMaterial color="#8a6d3b" metalness={1} roughness={0.3} />
        </mesh>
        {/* bottom accent strip */}
        <mesh position={[0, -0.27, 0.018]}>
          <boxGeometry args={[0.7, 0.01, 0.004]} />
          <meshStandardMaterial color="#5a4520" metalness={1} roughness={0.4} />
        </mesh>
      </group>

      {/* ── cap (lifts on scroll) ── */}
      <group ref={capGrp} position={[0, 2.68, 0]}>
        {/* main cap cylinder */}
        <mesh>
          <cylinderGeometry args={[0.46, 0.46, 0.95, 64]} />
          <meshStandardMaterial
            color="#c9a030"
            metalness={1}
            roughness={0.15}
            envMapIntensity={2.8}
          />
        </mesh>
        {/* cap top disc */}
        <mesh position={[0, 0.48, 0]}>
          <cylinderGeometry args={[0.44, 0.44, 0.03, 64]} />
          <meshStandardMaterial color="#ffe49a" metalness={1} roughness={0.08} envMapIntensity={3.2} />
        </mesh>
        {/* vertical ridges */}
        {Array.from({ length: 16 }).map((_, i) => (
          <mesh
            key={i}
            position={[
              Math.cos((i / 16) * Math.PI * 2) * 0.465,
              0,
              Math.sin((i / 16) * Math.PI * 2) * 0.465,
            ]}
            rotation={[0, -(i / 16) * Math.PI * 2, 0]}
          >
            <boxGeometry args={[0.012, 0.78, 0.028]} />
            <meshStandardMaterial color="#7a5c18" metalness={1} roughness={0.28} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* ── single silk ribbon ── */
function SilkRibbon({
  position,
  rotY,
  rotZ,
  width,
  height,
  speed,
  phase,
  amp,
  scrollRef,
}: {
  position: [number, number, number];
  rotY: number;
  rotZ: number;
  width: number;
  height: number;
  speed: number;
  phase: number;
  amp: number;
  scrollRef: ScrollRef;
}) {
  const meshRef  = useRef<THREE.Mesh>(null);
  const smoothed = useRef(0);

  const { geo, baseArr } = useMemo(() => {
    const geo = new THREE.PlaneGeometry(width, height, 80, 10);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const baseArr = new Float32Array(pos.array as Float32Array);

    const colors = new Float32Array(pos.count * 3);
    const dark   = new THREE.Color("#4a2f00");
    const mid    = new THREE.Color("#c9a86a");
    const bright = new THREE.Color("#ffe8a0");
    const tmp    = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      const v = pos.getY(i) / height + 0.5; // 0..1
      if (v < 0.5) tmp.lerpColors(dark, mid, v / 0.5);
      else         tmp.lerpColors(mid, bright, (v - 0.5) / 0.5);
      colors[i * 3]     = tmp.r;
      colors[i * 3 + 1] = tmp.g;
      colors[i * 3 + 2] = tmp.b;
    }
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return { geo, baseArr };
  }, [width, height]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    smoothed.current += (scrollRef.current - smoothed.current) * 0.10;
    const p = smoothed.current;

    const pos = geo.attributes.position as THREE.BufferAttribute;
    const e   = amp * (1 + p * 0.5);
    for (let i = 0; i < pos.count; i++) {
      const bx = baseArr[i * 3];
      const by = baseArr[i * 3 + 1];
      const tail = 0.4 + ((bx / width + 0.5) ** 0.8) * 0.7;
      pos.setZ(i,
        Math.sin(bx * 0.5 + t * speed + phase) * e * tail +
        Math.sin(by * 1.4 + t * speed * 0.65 + phase * 1.2) * e * 0.22,
      );
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();

    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(t * 0.5 + phase) * 0.12;
      meshRef.current.position.x = position[0] + Math.cos(t * 0.38 + phase) * 0.08;
    }
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geo}
      position={position}
      rotation={[0, rotY, rotZ]}
    >
      <meshStandardMaterial
        vertexColors
        metalness={0.82}
        roughness={0.28}
        side={THREE.DoubleSide}
        envMapIntensity={1.8}
      />
    </mesh>
  );
}

/* ── full scene ── */
function Scene({ scrollRef }: { scrollRef: ScrollRef }) {
  return (
    <>
      <Rig />

      {/* lighting */}
      <ambientLight intensity={0.18} />
      <spotLight
        position={[4, 7, 5]}
        intensity={260}
        angle={0.5}
        penumbra={0.85}
        color="#ffe5a8"
        castShadow={false}
      />
      <pointLight position={[-5, 2, -2]} intensity={14} color="#6699cc" />
      <pointLight position={[0, -3, 4]}  intensity={8}  color="#d4af37" />

      <Environment resolution={128}>
        <Lightformer intensity={2.6} position={[0, 5, -8]}  scale={[12, 1.2, 1]} color="#c9a86a" />
        <Lightformer intensity={1.4} position={[-7, 1, 1]}  rotation-y={Math.PI / 2}  scale={[1, 6, 1]}  color="#fff2c8" />
        <Lightformer intensity={0.8} position={[7, 0, 2]}   rotation-y={-Math.PI / 2} scale={[1, 5, 1]}  color="#aab8d4" />
        <Lightformer intensity={0.9} position={[0, -5, 0]}  rotation-x={Math.PI / 2}  scale={[10, 1, 1]} color="#5a3c00" />
      </Environment>

      <Bottle scrollRef={scrollRef} />

      {/* 4 silk ribbons — no touching the bottle frame */}
      <SilkRibbon scrollRef={scrollRef} position={[ 0.2,  0.2, -2.8]}  rotY={0}     rotZ={-Math.PI / 4.2} width={14}  height={1.6} speed={0.85} phase={0}   amp={0.52} />
      <SilkRibbon scrollRef={scrollRef} position={[ 3.2, -0.1, -0.4]}  rotY={-0.45} rotZ={-Math.PI / 4.5} width={7.5} height={1.1} speed={1.15} phase={2.2} amp={0.36} />
      <SilkRibbon scrollRef={scrollRef} position={[-3.1,  1.1, -1.2]}  rotY={0.4}   rotZ={-Math.PI / 4.4} width={8}   height={1.2} speed={1.0}  phase={4.5} amp={0.4}  />
      <SilkRibbon scrollRef={scrollRef} position={[-2.2, -1.3, -0.8]}  rotY={0.3}   rotZ={-Math.PI / 5}   width={6}   height={0.9} speed={1.3}  phase={1.4} amp={0.3}  />

      {/* soft gold floor glow */}
      <mesh position={[0, -1.9, -0.6]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[3, 48]} />
        <meshBasicMaterial color="#d4af37" transparent opacity={0.055} />
      </mesh>
    </>
  );
}

/* ── exported canvas ── */
export default function HeroScene3D({ scrollRef }: { scrollRef: ScrollRef }) {
  const [noWebGL, setNoWebGL] = useState(false);
  useEffect(() => {
    const c = document.createElement("canvas");
    if (!c.getContext("webgl") && !c.getContext("experimental-webgl")) setNoWebGL(true);
  }, []);

  if (noWebGL) {
    return (
      <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
        <div className="h-[50vh] w-[30vh] rounded-[2rem] border border-[#c9a86a44] bg-gradient-to-b from-[#0a0a12] to-[#050507] shadow-[0_0_80px_-20px_rgba(212,175,55,0.4)]" />
      </div>
    );
  }

  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0, 0, 6.2], fov: 34 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      className="!absolute inset-0"
    >
      <Scene scrollRef={scrollRef} />
    </Canvas>
  );
}
