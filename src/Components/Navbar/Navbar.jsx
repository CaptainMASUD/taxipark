import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function NavbarWithParticles() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const width = canvasRef.current.clientWidth
    const height = canvasRef.current.clientHeight

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ alpha: true })
    renderer.setSize(width, height)
    canvasRef.current.appendChild(renderer.domElement)

    camera.position.z = 5

    // Create star particles
    const geometry = new THREE.BufferGeometry()
    const starCount = 500
    const positions = new Float32Array(starCount * 3)

    for (let i = 0; i < starCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 20
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const material = new THREE.PointsMaterial({
      color: 0x00fff0,
      size: 0.1,
      transparent: true,
      opacity: 0.8,
    })

    const stars = new THREE.Points(geometry, material)
    scene.add(stars)

    const animate = () => {
      stars.rotation.y += 0.001
      stars.rotation.x += 0.0005
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (canvasRef.current) {
        canvasRef.current.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div className="relative h-24 w-full text-white flex items-center justify-between px-8 shadow-lg bg-opacity-80 backdrop-blur-lg z-10">
      {/* 3D Background Canvas */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div ref={canvasRef} className="w-full h-full opacity-30" />
      </div>

      {/* Logo */}
      <div className="text-xl font-bold tracking-widest">
        <span className="text-teal-400">✨ 3DBrand</span>
      </div>

      {/* Links */}
      <ul className="hidden md:flex gap-8 text-gray-300 font-medium text-sm tracking-wide">
        <li className="hover:text-white transition">Home</li>
        <li className="hover:text-white transition">About</li>
        <li className="hover:text-white transition">Services</li>
        <li className="hover:text-white transition">Contact</li>
      </ul>

      {/* Button */}
      <button className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-5 py-2 rounded-lg shadow-md transition">
        Get Started
      </button>
    </div>
  )
}
