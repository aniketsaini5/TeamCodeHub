import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import axios from "../utils/axiosConfig";

const LoginPage = () => {
  const [isVisible, setIsVisible] = useState(true);
  const backgroundRef = useRef(null);

  const handleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/github";
  };

  useEffect(() => {
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); // black background

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 100;

    const renderer = new THREE.WebGLRenderer({ canvas: backgroundRef.current, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Star geometry
    const geometry = new THREE.BufferGeometry();
    const starCount = 1000;
    const positions = new Float32Array(starCount * 3);
    const velocities = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 600;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 600;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 600;

      velocities[i * 3 + 0] = (Math.random() - 0.5) * 0.2;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.2;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x6b21a8, // purple-800
      size: 1.5,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const onMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    document.addEventListener("mousemove", onMouseMove);

    const animate = () => {
      requestAnimationFrame(animate);

      const positions = geometry.attributes.position.array;

      for (let i = 0; i < starCount; i++) {
        const index = i * 3;
        positions[index] += velocities[index];
        positions[index + 1] += velocities[index + 1];
        positions[index + 2] += velocities[index + 2];

        // Bounce back when out of bounds
        if (positions[index] > 300 || positions[index] < -300) velocities[index] *= -1;
        if (positions[index + 1] > 300 || positions[index + 1] < -300) velocities[index + 1] *= -1;
        if (positions[index + 2] > 300 || positions[index + 2] < -300) velocities[index + 2] *= -1;
      }

      geometry.attributes.position.needsUpdate = true;

      // slight camera movement based on mouse
      targetX = mouseX * 50;
      targetY = mouseY * 50;
      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.y += (targetY - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousemove", onMouseMove);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50">
      {/* Three.js Canvas */}
      <canvas
        ref={backgroundRef}
        className="absolute inset-0 w-full h-full z-0"
      />

      {/* Login Modal */}
      <div className="absolute inset-0 flex justify-center items-center z-10">
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg text-center max-w-md w-full mx-4">
          <div>
            <img src="/logo.svg" alt="TeamCode Logo" className="h-16 w-auto mb-6 mx-auto" />
          </div>

          <h2 className="text-4xl font-bold mb-6 text-purple-500">Welcome to TeamCode Hub</h2>

          <p className="mb-8 text-gray-300 text-lg">
            Collaborate, code, and create amazing projects together
          </p>

          <button
            onClick={handleLogin}
            className="bg-gray-700 hover:bg-purple-800 text-white px-6 py-3 rounded-md flex items-center justify-center w-full mb-6"
          >
            <svg className="mr-2" width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M12 0c-6.626 0-12 5.373-12 12..."></path>
            </svg>
            Continue with GitHub
          </button>

          <p className="text-gray-500 text-sm">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
