'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { type AgentState, type TrackReference } from '@livekit/components-react';

interface SphereVisualizerProps {
  state: AgentState;
  audioTrack?: TrackReference;
  className?: string;
  size?: number;
}

export const SphereVisualizer: React.FC<SphereVisualizerProps> = ({
  state,
  audioTrack,
  className = '',
  size = 200
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    mesh: THREE.Mesh;
    uniforms: { [key: string]: { value: number } };
    clock: THREE.Clock;
    analyser?: AnalyserNode;
    audioContext?: AudioContext;
    source?: MediaStreamAudioSourceNode;
    animationId?: number;
  } | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    
    // Prevent duplicate scene creation
    if (sceneRef.current) {
      console.log('SphereVisualizer: Scene already exists, skipping creation');
      return;
    }

    console.log('SphereVisualizer: Creating new scene');

    // Clear any existing content first
    if (mountRef.current.children.length > 0) {
      mountRef.current.innerHTML = '';
    }

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      preserveDrawingBuffer: true 
    });
    
    renderer.setSize(size, size);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    camera.position.set(0, 0, 8);
    camera.lookAt(0, 0, 0);

    // Shader uniforms
    const uniforms = {
      u_time: { value: 0.0 },
      u_frequency: { value: 0.0 },
      u_red: { value: 0.2 },
      u_green: { value: 0.8 },
      u_blue: { value: 0.4 }
    };

    // Vertex shader with Perlin noise
    const vertexShader = `
      uniform float u_time;
      uniform float u_frequency;

      vec3 mod289(vec3 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
      }
      
      vec4 mod289(vec4 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
      }
      
      vec4 permute(vec4 x) {
        return mod289(((x*34.0)+10.0)*x);
      }
      
      vec4 taylorInvSqrt(vec4 r) {
        return 1.79284291400159 - 0.85373472095314 * r;
      }
      
      vec3 fade(vec3 t) {
        return t*t*t*(t*(t*6.0-15.0)+10.0);
      }

      float pnoise(vec3 P, vec3 rep) {
        vec3 Pi0 = mod(floor(P), rep);
        vec3 Pi1 = mod(Pi0 + vec3(1.0), rep);
        Pi0 = mod289(Pi0);
        Pi1 = mod289(Pi1);
        vec3 Pf0 = fract(P);
        vec3 Pf1 = Pf0 - vec3(1.0);
        vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
        vec4 iy = vec4(Pi0.yy, Pi1.yy);
        vec4 iz0 = Pi0.zzzz;
        vec4 iz1 = Pi1.zzzz;

        vec4 ixy = permute(permute(ix) + iy);
        vec4 ixy0 = permute(ixy + iz0);
        vec4 ixy1 = permute(ixy + iz1);

        vec4 gx0 = ixy0 * (1.0 / 7.0);
        vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
        gx0 = fract(gx0);
        vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
        vec4 sz0 = step(gz0, vec4(0.0));
        gx0 -= sz0 * (step(0.0, gx0) - 0.5);
        gy0 -= sz0 * (step(0.0, gy0) - 0.5);

        vec4 gx1 = ixy1 * (1.0 / 7.0);
        vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
        gx1 = fract(gx1);
        vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
        vec4 sz1 = step(gz1, vec4(0.0));
        gx1 -= sz1 * (step(0.0, gx1) - 0.5);
        gy1 -= sz1 * (step(0.0, gy1) - 0.5);

        vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
        vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
        vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
        vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
        vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
        vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
        vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
        vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

        vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
        g000 *= norm0.x;
        g010 *= norm0.y;
        g100 *= norm0.z;
        g110 *= norm0.w;
        vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
        g001 *= norm1.x;
        g011 *= norm1.y;
        g101 *= norm1.z;
        g111 *= norm1.w;

        float n000 = dot(g000, Pf0);
        float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
        float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
        float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
        float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
        float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
        float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
        float n111 = dot(g111, Pf1);

        vec3 fade_xyz = fade(Pf0);
        vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
        vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
        float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
        return 2.2 * n_xyz;
      }

      void main() {
        float noise = 3.0 * pnoise(position + u_time, vec3(10.0));
        float displacement = (u_frequency / 30.0) * (noise / 10.0);
        vec3 newPosition = position + normal * displacement;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
      }
    `;

    // Fragment shader
    const fragmentShader = `
      uniform float u_red;
      uniform float u_blue;
      uniform float u_green;
      void main() {
        gl_FragColor = vec4(vec3(u_red, u_green, u_blue), 1.0);
      }
    `;

    // Create material and geometry
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      wireframe: true,
      transparent: true
    });

    const geometry = new THREE.IcosahedronGeometry(2, 15);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const clock = new THREE.Clock();

    // Store references
    sceneRef.current = {
      scene,
      camera,
      renderer,
      mesh,
      uniforms,
      clock
    };

    // Animation loop
    const animate = () => {
      if (!sceneRef.current) return;

      const { uniforms, clock, renderer, scene, camera, analyser } = sceneRef.current;
      
      uniforms.u_time.value = clock.getElapsedTime();
      
      // Get frequency data from analyser if available
      if (analyser) {
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        uniforms.u_frequency.value = average;
      } else {
        // Fallback to state-based animation
        uniforms.u_frequency.value = state === 'speaking' ? 50 : 10;
      }

      // Update colors based on agent state
      switch (state) {
        case 'listening':
          uniforms.u_red.value = 0.2;
          uniforms.u_green.value = 0.8;
          uniforms.u_blue.value = 0.4;
          break;
        case 'thinking':
          uniforms.u_red.value = 0.8;
          uniforms.u_green.value = 0.6;
          uniforms.u_blue.value = 0.2;
          break;
        case 'speaking':
          uniforms.u_red.value = 0.8;
          uniforms.u_green.value = 0.2;
          uniforms.u_blue.value = 0.4;
          break;
        default:
          uniforms.u_red.value = 0.5;
          uniforms.u_green.value = 0.5;
          uniforms.u_blue.value = 0.5;
      }

      renderer.render(scene, camera);
      sceneRef.current.animationId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup function
    return () => {
      console.log('SphereVisualizer: Cleaning up scene');
      if (sceneRef.current?.animationId) {
        cancelAnimationFrame(sceneRef.current.animationId);
      }
      if (sceneRef.current?.audioContext) {
        sceneRef.current.audioContext.close();
      }
      if (mountRef.current && renderer.domElement && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      sceneRef.current = null;
    };
  }, [size]); // Only depend on size changes

  // Set up audio analysis when audioTrack changes
  useEffect(() => {
    if (!audioTrack?.publication?.track || !sceneRef.current) return;

    const track = audioTrack.publication.track;
    if (track.kind !== 'audio') return;

    try {
      // Get the MediaStreamTrack
      const mediaStreamTrack = track.mediaStreamTrack;
      if (!mediaStreamTrack) return;

      // Create audio context and analyser
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.8;

      // Create media stream and connect to analyser
      const mediaStream = new MediaStream([mediaStreamTrack]);
      const source = audioContext.createMediaStreamSource(mediaStream);
      source.connect(analyser);

      // Store references
      sceneRef.current.audioContext = audioContext;
      sceneRef.current.analyser = analyser;
      sceneRef.current.source = source;

    } catch (error) {
      console.warn('Failed to set up audio analysis:', error);
    }

    return () => {
      if (sceneRef.current?.audioContext) {
        sceneRef.current.audioContext.close();
      }
    };
  }, [audioTrack]);

  return (
    <div 
      ref={mountRef} 
      className={`inline-block ${className}`}
      style={{ width: size, height: size }}
    />
  );
}; 