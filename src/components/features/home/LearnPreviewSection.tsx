"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { Button } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";

interface SplineEntity extends THREE.Object3D {
  name: string;
}

interface SplineAppInstance {
  setZoom?: (zoom: number) => void;
  findObjectByName?: (name: string) => { position?: { x: number; y: number; z: number } } | null;
  _findEntity?: (name: string) => SplineEntity | null;
  _scene?: {
    getObjectByName?: (name: string) => SplineEntity | null;
    traverse?: (callback: (obj: THREE.Object3D) => void) => void;
  };
  requestRender?: () => void;
}

function buildRadioHead() {
  const radioGroup = new THREE.Group();
  radioGroup.name = "CustomRadioHead";

  const obsidianMat = new THREE.MeshStandardMaterial({
    color: 0x141620,
    roughness: 0.35,
    metalness: 0.8,
  });

  const darkMetalMat = new THREE.MeshStandardMaterial({
    color: 0x0c0e14,
    roughness: 0.5,
    metalness: 0.7,
  });

  const silverMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    roughness: 0.2,
    metalness: 0.9,
  });

  const violetGlowMat = new THREE.MeshStandardMaterial({
    color: 0x8b5cf6,
    emissive: 0x8b5cf6,
    emissiveIntensity: 0.85,
    roughness: 0.2,
  });

  const cyanGlowMat = new THREE.MeshStandardMaterial({
    color: 0x06b6d4,
    emissive: 0x06b6d4,
    emissiveIntensity: 0.85,
    roughness: 0.2,
  });

  const bodyGeo = new THREE.BoxGeometry(86, 54, 40);
  const bodyMesh = new THREE.Mesh(bodyGeo, obsidianMat);
  radioGroup.add(bodyMesh);

  const faceGeo = new THREE.BoxGeometry(82, 50, 2);
  const faceMesh = new THREE.Mesh(faceGeo, darkMetalMat);
  faceMesh.position.set(0, 0, 20.5);
  radioGroup.add(faceMesh);

  const speakerRimGeo = new THREE.TorusGeometry(12, 1.2, 16, 32);
  const leftRim = new THREE.Mesh(speakerRimGeo, violetGlowMat);
  leftRim.position.set(-25, -2, 21.8);
  radioGroup.add(leftRim);

  const speakerConeGeo = new THREE.CylinderGeometry(11, 6, 4, 32);
  speakerConeGeo.rotateX(Math.PI / 2);
  const leftCone = new THREE.Mesh(speakerConeGeo, darkMetalMat);
  leftCone.position.set(-25, -2, 20);
  radioGroup.add(leftCone);

  const leftCap = new THREE.Mesh(new THREE.SphereGeometry(3, 16, 16), silverMat);
  leftCap.position.set(-25, -2, 21.5);
  radioGroup.add(leftCap);

  const rightRim = new THREE.Mesh(speakerRimGeo, cyanGlowMat);
  rightRim.position.set(25, -2, 21.8);
  radioGroup.add(rightRim);

  const rightCone = new THREE.Mesh(speakerConeGeo, darkMetalMat);
  rightCone.position.set(25, -2, 20);
  radioGroup.add(rightCone);

  const rightCap = new THREE.Mesh(new THREE.SphereGeometry(3, 16, 16), silverMat);
  rightCap.position.set(25, -2, 21.5);
  radioGroup.add(rightCap);

  const cassetteWindowGeo = new THREE.BoxGeometry(22, 20, 2);
  const cassetteWindowMat = new THREE.MeshStandardMaterial({
    color: 0x11131e,
    emissive: 0x3b1d60,
    emissiveIntensity: 0.5,
    roughness: 0.1,
    metalness: 0.5,
    transparent: true,
    opacity: 0.9,
  });
  const cassetteWindow = new THREE.Mesh(cassetteWindowGeo, cassetteWindowMat);
  cassetteWindow.position.set(0, -2, 21.5);
  radioGroup.add(cassetteWindow);

  const reelGeo = new THREE.TorusGeometry(3.5, 0.8, 12, 16);
  const leftReel = new THREE.Mesh(reelGeo, silverMat);
  leftReel.position.set(-5, -2, 22.2);
  radioGroup.add(leftReel);

  const rightReel = new THREE.Mesh(reelGeo, silverMat);
  rightReel.position.set(5, -2, 22.2);
  radioGroup.add(rightReel);

  const tunerBarGeo = new THREE.BoxGeometry(36, 6, 2);
  const tunerBarMat = new THREE.MeshStandardMaterial({
    color: 0x06b6d4,
    emissive: 0x06b6d4,
    emissiveIntensity: 0.7,
  });
  const tunerBar = new THREE.Mesh(tunerBarGeo, tunerBarMat);
  tunerBar.position.set(0, 16, 21.2);
  radioGroup.add(tunerBar);

  const handleGeo = new THREE.TorusGeometry(26, 2.5, 12, 32, Math.PI);
  const handleMesh = new THREE.Mesh(handleGeo, silverMat);
  handleMesh.position.set(0, 26, 0);
  handleMesh.rotation.z = Math.PI;
  radioGroup.add(handleMesh);

  const knobGeo = new THREE.CylinderGeometry(4, 4, 6, 16);
  const knob1 = new THREE.Mesh(knobGeo, silverMat);
  knob1.position.set(-24, 29, 0);
  radioGroup.add(knob1);

  const knob2 = new THREE.Mesh(knobGeo, silverMat);
  knob2.position.set(24, 29, 0);
  radioGroup.add(knob2);

  const antennaGeo = new THREE.CylinderGeometry(1, 1.4, 44, 12);
  const antLeft = new THREE.Mesh(antennaGeo, silverMat);
  antLeft.position.set(-34, 42, -5);
  antLeft.rotation.z = 0.28;
  radioGroup.add(antLeft);

  const antTipLeft = new THREE.Mesh(new THREE.SphereGeometry(2.5, 12, 12), violetGlowMat);
  antTipLeft.position.set(-40, 62, -5);
  radioGroup.add(antTipLeft);

  const antRight = new THREE.Mesh(antennaGeo, silverMat);
  antRight.position.set(34, 42, -5);
  antRight.rotation.z = -0.28;
  radioGroup.add(antRight);

  const antTipRight = new THREE.Mesh(new THREE.SphereGeometry(2.5, 12, 12), cyanGlowMat);
  antTipRight.position.set(40, 62, -5);
  radioGroup.add(antTipRight);

  return { radioGroup, leftReel, rightReel };
}

function buildSneakerFoot(isLeft: boolean) {
  const sneakerGroup = new THREE.Group();
  sneakerGroup.name = isLeft ? "CustomSneakerLeft" : "CustomSneakerRight";

  const obsidianMat = new THREE.MeshStandardMaterial({
    color: 0x141620,
    roughness: 0.35,
    metalness: 0.8,
  });

  const darkMetalMat = new THREE.MeshStandardMaterial({
    color: 0x0c0e14,
    roughness: 0.5,
    metalness: 0.7,
  });

  const stripeMat = new THREE.MeshStandardMaterial({
    color: isLeft ? 0x8b5cf6 : 0x06b6d4,
    emissive: isLeft ? 0x8b5cf6 : 0x06b6d4,
    emissiveIntensity: 0.85,
    roughness: 0.2,
  });

  const soleGeo = new THREE.BoxGeometry(26, 9, 44);
  const soleMat = new THREE.MeshStandardMaterial({
    color: 0x0a0c12,
    roughness: 0.6,
    metalness: 0.4,
  });
  const soleMesh = new THREE.Mesh(soleGeo, soleMat);
  soleMesh.position.set(0, -4.5, 6);
  sneakerGroup.add(soleMesh);

  const soleStripeGeo = new THREE.BoxGeometry(26.6, 2, 44.6);
  const soleStripe = new THREE.Mesh(soleStripeGeo, stripeMat);
  soleStripe.position.set(0, -3.5, 6);
  sneakerGroup.add(soleStripe);

  const upperGeo = new THREE.BoxGeometry(24, 16, 36);
  const upperMesh = new THREE.Mesh(upperGeo, obsidianMat);
  upperMesh.position.set(0, 6, 4);
  sneakerGroup.add(upperMesh);

  const toeGeo = new THREE.CylinderGeometry(12, 12, 10, 24);
  toeGeo.rotateX(Math.PI / 2);
  const toeMesh = new THREE.Mesh(toeGeo, darkMetalMat);
  toeMesh.position.set(0, 3, 20);
  sneakerGroup.add(toeMesh);

  const heelGeo = new THREE.BoxGeometry(24.5, 14, 6);
  const heelMesh = new THREE.Mesh(heelGeo, darkMetalMat);
  heelMesh.position.set(0, 5, -12);
  sneakerGroup.add(heelMesh);

  const collarGeo = new THREE.CylinderGeometry(9, 10, 8, 20);
  const collarMesh = new THREE.Mesh(collarGeo, darkMetalMat);
  collarMesh.position.set(0, 15, 0);
  sneakerGroup.add(collarMesh);

  const badgeGeo = new THREE.BoxGeometry(1, 4, 16);
  const badgeMesh = new THREE.Mesh(badgeGeo, stripeMat);
  badgeMesh.position.set(isLeft ? 12.3 : -12.3, 6, 4);
  sneakerGroup.add(badgeMesh);

  return sneakerGroup;
}

export function LearnPreviewSection() {
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  const handleSplineLoad = (app: unknown) => {
    if (!app) return;
    const splineApp = app as SplineAppInstance;

    if (typeof splineApp.setZoom === "function") {
      splineApp.setZoom(0.6);
    }

    const bot = typeof splineApp.findObjectByName === "function" ? splineApp.findObjectByName("Bot") : null;
    if (bot && bot.position) {
      bot.position.y = 85;
      bot.position.x = 0;
    }

    const scene = splineApp._scene;
    const findRealEntity = (name: string): SplineEntity | null => {
      if (typeof splineApp._findEntity === "function") {
        return splineApp._findEntity(name);
      }
      if (scene && typeof scene.getObjectByName === "function") {
        return scene.getObjectByName(name) || null;
      }
      return null;
    };

    const realHead = findRealEntity("Head");
    let reelA: THREE.Mesh | null = null;
    let reelB: THREE.Mesh | null = null;

    if (realHead && typeof realHead.add === "function") {
      if (!realHead.getObjectByName("CustomRadioHead")) {
        realHead.children.forEach((c: THREE.Object3D) => {
          c.visible = false;
          if (c.scale && typeof c.scale.set === "function") {
            c.scale.set(0.0001, 0.0001, 0.0001);
          }
        });

        const { radioGroup, leftReel, rightReel } = buildRadioHead();
        radioGroup.position.set(0, 0, 0);
        realHead.add(radioGroup);
        reelA = leftReel;
        reelB = rightReel;
      }
    }

    const realFeet: THREE.Object3D[] = [];
    if (scene && typeof scene.traverse === "function") {
      scene.traverse((obj: THREE.Object3D) => {
        if (obj.name === "Foot" && typeof obj.add === "function") {
          realFeet.push(obj);
        }
      });
    }

    realFeet.forEach((foot: THREE.Object3D, idx: number) => {
      const isLeft = idx === 0;
      const sneakerName = isLeft ? "CustomSneakerLeft" : "CustomSneakerRight";

      if (!foot.getObjectByName(sneakerName)) {
        foot.children.forEach((c: THREE.Object3D) => {
          if (c.name !== "CustomSneakerLeft" && c.name !== "CustomSneakerRight") {
            c.visible = false;
            if (c.scale && typeof c.scale.set === "function") {
              c.scale.set(0.0001, 0.0001, 0.0001);
            }
          }
        });

        const sneaker = buildSneakerFoot(isLeft);
        foot.add(sneaker);
      }
    });

    const animateReels = () => {
      if (reelA) reelA.rotation.z += 0.03;
      if (reelB) reelB.rotation.z += 0.03;
      if (typeof splineApp.requestRender === "function") {
        splineApp.requestRender();
      }
      animFrameRef.current = requestAnimationFrame(animateReels);
    };

    animFrameRef.current = requestAnimationFrame(animateReels);
  };

  return (
    <section className="relative py-20 sm:py-28 md:py-32 border-t border-white/5 bg-[#07080e]/50 overflow-hidden">
      <Spotlight
        className="-top-40 left-0 md:left-40 lg:left-60 md:-top-20"
        fill="white"
      />

      <div className="pointer-events-none absolute -top-24 right-1/4 w-[500px] h-[500px] rounded-full bg-accent-violet/10 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-24 left-1/4 w-[450px] h-[450px] rounded-full bg-accent-cyan/10 blur-[130px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16 min-h-[500px]">
          <div className="flex-1 flex flex-col justify-center items-start text-left max-w-2xl">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12]">
              Understand the language{" "}
              <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                of music.
              </span>
            </h2>

            <p className="mt-5 text-base sm:text-lg md:text-xl text-neutral-300 max-w-xl leading-relaxed font-sans">
              Learn music theory through clear explanations, visual demonstrations, guided
              lessons, and examples connected to the music you already love.
            </p>

            <div className="mt-8 sm:mt-10 flex items-center gap-4">
              <Button
                href="/learn"
                variant="primary"
                size="lg"
                icon={<ArrowRightIcon size={18} />}
                iconPosition="right"
              >
                Explore the learning hub
              </Button>
            </div>
          </div>

          <div className="flex-1 relative w-full h-[460px] sm:h-[540px] lg:h-[640px] min-h-[440px]">
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
              onLoad={handleSplineLoad}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
