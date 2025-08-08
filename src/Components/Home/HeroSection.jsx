// "use client"

// import { useRef, useState } from "react"
// import { Canvas, useFrame } from "@react-three/fiber"
// import { OrbitControls, Environment, Text3D, Sphere, Points, PointMaterial } from "@react-three/drei"
// import type * as THREE from "three"

// // Hero object component with subtle animations and hover effect
// function HeroObject() {
//   const meshRef = useRef<THREE.Mesh>(null!)
//   const [hovered, setHovered] = useState(false)

//   useFrame((state, delta) => {
//     if (meshRef.current) {
//       // Continuous rotation
//       meshRef.current.rotation.x += delta * 0.2
//       meshRef.current.rotation.y += delta * 0.15
//       // Subtle pulsation
//       meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.05)
//     }
//   })

//   return (
//     <Sphere
//       ref={meshRef}
//       args={[1, 32, 32]} // Radius, widthSegments, heightSegments
//       onPointerOver={() => setHovered(true)}
//       onPointerOut={() => setHovered(false)}
//     >
//       {/* Material changes color on hover */}
//       <meshStandardMaterial color={hovered ? "#8884d8" : "#6a5acd"} metalness={0.8} roughness={0.2} />
//     </Sphere>
//   )
// }

// // Floating Text component with gentle bobbing and rotation
// function FloatingText() {
//   const textRef = useRef<THREE.Mesh>(null!)

//   useFrame((state) => {
//     if (textRef.current) {
//       // Gentle bobbing motion
//       textRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2 + 2 // Base position + bobbing
//       // Gentle rotation
//       textRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05
//     }
//   })

//   return (
//     <Text3D
//       ref={textRef}
//       font="/fonts/Geist-Bold.ttf" // Using Geist-Bold font
//       size={0.8}
//       height={0.2}
//       curveSegments={12}
//       bevelEnabled
//       bevelThickness={0.03}
//       bevelSize={0.02}
//       position={[0, 0, 0]} // Initial position, Y is adjusted in useFrame
//       castShadowaa
//     >
//       Welcome to v0
//       <meshStandardMaterial color="#e0e0e0" metalness={0.9} roughness={0.1} />
//     </Text3D>
//   )
// }

// // Star Field component for a dynamic background
// function StarField({ count = 2000 }) {
//   const pointsRef = useRef<THREE.Points>(null!)

//   // Generate random positions for stars
//   const particlesPosition = useState(() => {
//     const positions = new Float32Array(count * 3)
//     for (let i = 0; i < count; i++) {
//       positions[i * 3] = (Math.random() - 0.5) * 20
//       positions[i * 3 + 1] = (Math.random() - 0.5) * 20
//       positions[i * 3 + 2] = (Math.random() - 0.5) * 20
//     }
//     return positions
//   })[0]

//   useFrame((state, delta) => {
//     if (pointsRef.current) {
//       // Continuous slow rotation of the star field
//       pointsRef.current.rotation.y += delta * 0.01
//       pointsRef.current.rotation.x += delta * 0.005
//     }
//   })

//   return (
//     <Points ref={pointsRef} positions={particlesPosition} stride={3} frustumCulled={false}>
//       <PointMaterial transparent color="#ffffff" size={0.05} sizeAttenuation={true} depthWrite={false} />
//     </Points>
//   )
// }

// export default function HomePage3D() {
//   return (
//     <div className="w-full h-screen bg-gradient-to-br from-gray-900 to-black relative">
//       <Canvas
//         shadows
//         camera={{
//           position: [0, 0, 5],
//           fov: 75,
//         }}
//       >
//         <color attach="background" args={["#000000"]} /> {/* Pure black background for the scene */}
//         <ambientLight intensity={0.5} /> {/* General ambient light */}
//         <directionalLight position={[5, 5, 5]} intensity={1} castShadow /> {/* Main light source */}
//         <directionalLight position={[-5, -5, -5]} intensity={0.7} /> {/* Secondary light source */}
//         <Environment preset="warehouse" /> {/* Provides realistic ambient lighting and reflections */}
//         <HeroObject />
//         <FloatingText />
//         <StarField />
//         {/* OrbitControls allow user interaction and auto-rotation */}
//         <OrbitControls autoRotate autoRotateSpeed={0.5} enableZoom={true} enablePan={false} />
//       </Canvas>
//       {/* Overlay UI elements */}
//       <div className="absolute top-4 left-4 text-white text-lg font-bold z-10">v0 3D Home</div>
//       <div className="absolute bottom-4 right-4 text-white text-sm z-10">Drag to rotate, scroll to zoom</div>
//     </div>
//   )
// }
