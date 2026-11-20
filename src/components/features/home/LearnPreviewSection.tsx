"use client";

import React, { useCallback } from "react";
import * as THREE from "three";
import { Button } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";

function buildMusicHead(): THREE.Group {
  const headGroup = new THREE.Group();
  headGroup.name = "CustomMusicHead";

  const cabinetMat = new THREE.MeshStandardMaterial({
    color: 0x141622,
    roughness: 0.35,
    metalness: 0.65,
  });
  const faceMat = new THREE.MeshStandardMaterial({
    color: 0x0a0c14,
    roughness: 0.5,
    metalness: 0.5,
  });
  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xd4d8e8,
    roughness: 0.15,
    metalness: 0.9,
  });
  const cyanGlowMat = new THREE.MeshBasicMaterial({
    color: 0x22d3ee,
  });
  const violetGlowMat = new THREE.MeshBasicMaterial({
    color: 0xa855f7,
  });
  const goldKnobMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.25,
    metalness: 0.85,
  });

  const bodyGeo = new THREE.BoxGeometry(110, 80, 55);
  const bodyMesh = new THREE.Mesh(bodyGeo, cabinetMat);
  bodyMesh.position.set(0, 42, 0);
  headGroup.add(bodyMesh);

  const topRimGeo = new THREE.BoxGeometry(112, 3, 56);
  const topRim = new THREE.Mesh(topRimGeo, violetGlowMat);
  topRim.position.set(0, 82, 0);
  headGroup.add(topRim);

  const botRimGeo = new THREE.BoxGeometry(112, 3, 56);
  const botRim = new THREE.Mesh(botRimGeo, cyanGlowMat);
  botRim.position.set(0, 2, 0);
  headGroup.add(botRim);

  const faceGeo = new THREE.BoxGeometry(104, 72, 3);
  const faceMesh = new THREE.Mesh(faceGeo, faceMat);
  faceMesh.position.set(0, 42, 28);
  headGroup.add(faceMesh);

  const cdOuterGeo = new THREE.CylinderGeometry(24, 24, 3, 32);
  cdOuterGeo.rotateX(Math.PI / 2);
  const cdOuterMat = new THREE.MeshStandardMaterial({
    color: 0x111118,
    roughness: 0.2,
    metalness: 0.8,
  });
  const cdMesh = new THREE.Mesh(cdOuterGeo, cdOuterMat);
  cdMesh.position.set(0, 36, 29);
  headGroup.add(cdMesh);

  const cdRingGeo = new THREE.RingGeometry(12, 22, 32);
  const cdRingMat = new THREE.MeshBasicMaterial({
    color: 0x06b6d4,
    side: THREE.DoubleSide,
  });
  const cdRing = new THREE.Mesh(cdRingGeo, cdRingMat);
  cdRing.position.set(0, 36, 31);
  headGroup.add(cdRing);

  const cdCenterGeo = new THREE.CylinderGeometry(5, 5, 4, 24);
  cdCenterGeo.rotateX(Math.PI / 2);
  const cdCenter = new THREE.Mesh(cdCenterGeo, chromeMat);
  cdCenter.position.set(0, 36, 30);
  headGroup.add(cdCenter);

  [-38, 38].forEach((xPos) => {
    const speakerRimGeo = new THREE.CylinderGeometry(14, 14, 3, 24);
    speakerRimGeo.rotateX(Math.PI / 2);
    const speakerRim = new THREE.Mesh(speakerRimGeo, chromeMat);
    speakerRim.position.set(xPos, 36, 29);
    headGroup.add(speakerRim);

    const speakerConeGeo = new THREE.CylinderGeometry(11, 8, 3, 24);
    speakerConeGeo.rotateX(Math.PI / 2);
    const speakerMat = new THREE.MeshStandardMaterial({
      color: 0x1e202e,
      roughness: 0.7,
      metalness: 0.3,
    });
    const speakerCone = new THREE.Mesh(speakerConeGeo, speakerMat);
    speakerCone.position.set(xPos, 36, 29.5);
    headGroup.add(speakerCone);

    const capGeo = new THREE.SphereGeometry(3.5, 16, 16);
    const cap = new THREE.Mesh(capGeo, goldKnobMat);
    cap.position.set(xPos, 36, 31.5);
    headGroup.add(cap);
  });

  const tunerBgGeo = new THREE.BoxGeometry(70, 16, 2);
  const tunerBgMat = new THREE.MeshBasicMaterial({ color: 0x080c18 });
  const tunerBg = new THREE.Mesh(tunerBgGeo, tunerBgMat);
  tunerBg.position.set(0, 64, 29);
  headGroup.add(tunerBg);

  const needleGeo = new THREE.BoxGeometry(2, 14, 2);
  const needle = new THREE.Mesh(needleGeo, violetGlowMat);
  needle.position.set(-6, 64, 30.5);
  headGroup.add(needle);

  [-24, -16, -8, 0, 8, 16, 24].forEach((xPos) => {
    const tickGeo = new THREE.BoxGeometry(1.5, 5, 1);
    const tick = new THREE.Mesh(tickGeo, cyanGlowMat);
    tick.position.set(xPos, 66, 30.2);
    headGroup.add(tick);
  });

  [-30, -10, 10, 30].forEach((xPos, idx) => {
    const knobGeo = new THREE.CylinderGeometry(4.5, 4.5, 6, 20);
    const knob = new THREE.Mesh(knobGeo, idx % 2 === 0 ? goldKnobMat : chromeMat);
    knob.position.set(xPos, 84, 8);
    headGroup.add(knob);
  });

  const antennaBaseGeo = new THREE.CylinderGeometry(3, 4, 6, 16);
  const antennaBase = new THREE.Mesh(antennaBaseGeo, chromeMat);
  antennaBase.position.set(42, 84, -12);
  headGroup.add(antennaBase);

  const antennaRodGeo = new THREE.CylinderGeometry(1.2, 1.5, 55, 12);
  antennaRodGeo.rotateZ(-Math.PI / 12);
  antennaRodGeo.rotateX(-Math.PI / 16);
  const antennaRod = new THREE.Mesh(antennaRodGeo, chromeMat);
  antennaRod.position.set(48, 108, -18);
  headGroup.add(antennaRod);

  const tipGeo = new THREE.SphereGeometry(2.5, 12, 12);
  const tip = new THREE.Mesh(tipGeo, cyanGlowMat);
  tip.position.set(55, 134, -23);
  headGroup.add(tip);

  const handleGeo = new THREE.TorusGeometry(32, 2.5, 12, 32, Math.PI);
  const handle = new THREE.Mesh(handleGeo, chromeMat);
  handle.position.set(0, 82, 0);
  headGroup.add(handle);

  return headGroup;
}

function buildMusicLegs(): THREE.Group {
  const legsGroup = new THREE.Group();
  legsGroup.name = "CustomMusicLegs";

  const limbMat = new THREE.MeshStandardMaterial({
    color: 0x141622,
    roughness: 0.35,
    metalness: 0.7,
  });
  const jointMat = new THREE.MeshStandardMaterial({
    color: 0xd4d8e8,
    roughness: 0.2,
    metalness: 0.9,
  });
  const cyanAccentMat = new THREE.MeshBasicMaterial({
    color: 0x06b6d4,
  });
  const shoeMat = new THREE.MeshStandardMaterial({
    color: 0x0d0e16,
    roughness: 0.4,
    metalness: 0.6,
  });
  const soleMat = new THREE.MeshBasicMaterial({
    color: 0x8b5cf6,
  });

  [-44, 44].forEach((xOffset) => {
    const leg = new THREE.Group();
    leg.position.set(xOffset, 0, 0);

    const hipGeo = new THREE.SphereGeometry(12, 20, 20);
    const hip = new THREE.Mesh(hipGeo, jointMat);
    hip.position.set(0, 0, 0);
    leg.add(hip);

    const hipRingGeo = new THREE.TorusGeometry(12.5, 2, 12, 24);
    hipRingGeo.rotateX(Math.PI / 2);
    const hipRing = new THREE.Mesh(hipRingGeo, cyanAccentMat);
    hipRing.position.set(0, 0, 0);
    leg.add(hipRing);

    const thighGeo = new THREE.CylinderGeometry(9, 10, 60, 20);
    const thigh = new THREE.Mesh(thighGeo, limbMat);
    thigh.position.set(0, -34, 0);
    leg.add(thigh);

    const kneeGeo = new THREE.SphereGeometry(10, 20, 20);
    const knee = new THREE.Mesh(kneeGeo, jointMat);
    knee.position.set(0, -68, 2);
    leg.add(knee);

    const kneeCapGeo = new THREE.CylinderGeometry(7, 7, 4, 16);
    kneeCapGeo.rotateX(Math.PI / 2);
    const kneeCap = new THREE.Mesh(kneeCapGeo, cyanAccentMat);
    kneeCap.position.set(0, -68, 10);
    leg.add(kneeCap);

    const shinGeo = new THREE.CylinderGeometry(8, 7, 65, 20);
    const shin = new THREE.Mesh(shinGeo, limbMat);
    shin.position.set(0, -104, 0);
    leg.add(shin);

    const ankleGeo = new THREE.SphereGeometry(8, 16, 16);
    const ankle = new THREE.Mesh(ankleGeo, jointMat);
    ankle.position.set(0, -140, 0);
    leg.add(ankle);

    const footBodyGeo = new THREE.BoxGeometry(22, 14, 46);
    const footBody = new THREE.Mesh(footBodyGeo, shoeMat);
    footBody.position.set(0, -148, 12);
    leg.add(footBody);

    const toeGeo = new THREE.CylinderGeometry(10.8, 10.8, 14, 20, 1, false, 0, Math.PI);
    toeGeo.rotateY(Math.PI / 2);
    const toe = new THREE.Mesh(toeGeo, shoeMat);
    toe.position.set(0, -148, 35);
    leg.add(toe);

    const soleGeo = new THREE.BoxGeometry(24, 4, 52);
    const sole = new THREE.Mesh(soleGeo, soleMat);
    sole.position.set(0, -156, 14);
    leg.add(sole);

    legsGroup.add(leg);
  });

  return legsGroup;
}

export function LearnPreviewSection() {
  const handleSplineLoad = useCallback((splineApp: unknown) => {
    try {
      const app = splineApp as { _scene?: THREE.Scene };
      const scene = app?._scene;
      if (!scene) return;

      const headMesh = scene.getObjectByName("Head 2");
      if (headMesh) {
        headMesh.visible = false;
      }

      const headGroup = scene.getObjectByName("Head");
      if (headGroup) {
        const oldHead = headGroup.getObjectByName("CustomMusicHead");
        if (oldHead) headGroup.remove(oldHead);

        const musicHead = buildMusicHead();
        headGroup.add(musicHead);
      }

      const bottomGroup = scene.getObjectByName("Bottom") || scene.getObjectByName("Bot");
      if (bottomGroup) {
        const oldLegs = bottomGroup.getObjectByName("CustomMusicLegs");
        if (oldLegs) bottomGroup.remove(oldLegs);

        const musicLegs = buildMusicLegs();
        musicLegs.position.set(0, 10, 4);
        bottomGroup.add(musicLegs);
      }

      const bot = scene.getObjectByName("Bot");
      if (bot) {
        bot.scale.set(0.7, 0.7, 0.7);
        bot.position.y = 80;
      }

      const camera = scene.getObjectByName("Camera 2");
      if (camera) {
        camera.position.set(0, 140, 520);
        if (typeof camera.lookAt === "function") {
          camera.lookAt(0, 80, 0);
        }
      }
    } catch {
      // ignore
    }
  }, []);

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

          <div className="flex-1 relative w-full h-[460px] sm:h-[520px] lg:h-[620px] min-h-[440px]">
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
