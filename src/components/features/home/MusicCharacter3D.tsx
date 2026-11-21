"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export function MusicCharacter3D({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    let renderer: THREE.WebGLRenderer;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 4.4);

    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.replaceChildren(renderer.domElement);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.outline = "none";

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 2.2);
    mainLight.position.set(3, 5, 4);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    scene.add(mainLight);

    const cyanRim = new THREE.DirectionalLight(0x06b6d4, 3.2);
    cyanRim.position.set(-4, 2, -2);
    scene.add(cyanRim);

    const violetRim = new THREE.DirectionalLight(0x8b5cf6, 4.0);
    violetRim.position.set(4, 3, -3);
    scene.add(violetRim);

    const softFill = new THREE.PointLight(0xa855f7, 1.5, 8);
    softFill.position.set(0, -1, 2);
    scene.add(softFill);

    const darkMetalMat = new THREE.MeshStandardMaterial({
      color: 0x181a24,
      metalness: 0.85,
      roughness: 0.3,
    });

    const polishedTitaniumMat = new THREE.MeshStandardMaterial({
      color: 0x222738,
      metalness: 0.9,
      roughness: 0.2,
    });

    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xdde4f0,
      metalness: 0.95,
      roughness: 0.1,
    });

    const goldAccentMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.8,
      roughness: 0.25,
    });

    const cyanGlowMat = new THREE.MeshStandardMaterial({
      color: 0x22d3ee,
      emissive: 0x06b6d4,
      emissiveIntensity: 2.2,
      roughness: 0.2,
      metalness: 0.5,
    });

    const violetGlowMat = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      emissive: 0x8b5cf6,
      emissiveIntensity: 2.0,
      roughness: 0.2,
      metalness: 0.5,
    });

    const speakerConeMat = new THREE.MeshStandardMaterial({
      color: 0x0d0e14,
      roughness: 0.55,
      metalness: 0.4,
    });

    const rootGroup = new THREE.Group();
    rootGroup.position.set(0, -0.2, 0);
    scene.add(rootGroup);

    const characterGroup = new THREE.Group();
    rootGroup.add(characterGroup);

    const pelvisGroup = new THREE.Group();
    pelvisGroup.position.set(0, -0.4, 0);
    characterGroup.add(pelvisGroup);

    const pelvisGeo = new THREE.BoxGeometry(0.52, 0.26, 0.36);
    const pelvisMesh = new THREE.Mesh(pelvisGeo, darkMetalMat);
    pelvisMesh.castShadow = true;
    pelvisGroup.add(pelvisMesh);

    const pelvisBelt = new THREE.Mesh(
      new THREE.BoxGeometry(0.54, 0.06, 0.38),
      chromeMat
    );
    pelvisBelt.position.y = 0.08;
    pelvisGroup.add(pelvisBelt);

    const beltBuckle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 0.04, 16),
      cyanGlowMat
    );
    beltBuckle.rotation.x = Math.PI / 2;
    beltBuckle.position.set(0, 0.08, 0.2);
    pelvisGroup.add(beltBuckle);

    const leftLeg = new THREE.Group();
    leftLeg.position.set(-0.24, -0.15, 0);
    pelvisGroup.add(leftLeg);

    const rightLeg = new THREE.Group();
    rightLeg.position.set(0.24, -0.15, 0);
    pelvisGroup.add(rightLeg);

    function buildLeg(parent: THREE.Group) {
      const hipJoint = new THREE.Mesh(
        new THREE.SphereGeometry(0.09, 16, 16),
        polishedTitaniumMat
      );
      parent.add(hipJoint);

      const thigh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.085, 0.075, 0.42, 16),
        darkMetalMat
      );
      thigh.position.y = -0.21;
      thigh.castShadow = true;
      parent.add(thigh);

      const thighArmor = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.28, 0.16),
        polishedTitaniumMat
      );
      thighArmor.position.set(0, -0.2, 0.02);
      thighArmor.castShadow = true;
      parent.add(thighArmor);

      const knee = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 0.14, 16),
        chromeMat
      );
      knee.rotation.z = Math.PI / 2;
      knee.position.y = -0.44;
      parent.add(knee);

      const kneeCap = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.1, 0.08),
        cyanGlowMat
      );
      kneeCap.position.set(0, -0.44, 0.08);
      parent.add(kneeCap);

      const calf = new THREE.Mesh(
        new THREE.CylinderGeometry(0.075, 0.065, 0.44, 16),
        darkMetalMat
      );
      calf.position.y = -0.68;
      calf.castShadow = true;
      parent.add(calf);

      const shinGuard = new THREE.Mesh(
        new THREE.BoxGeometry(0.16, 0.32, 0.1),
        polishedTitaniumMat
      );
      shinGuard.position.set(0, -0.68, 0.06);
      shinGuard.castShadow = true;
      parent.add(shinGuard);

      const ankle = new THREE.Mesh(
        new THREE.SphereGeometry(0.065, 14, 14),
        chromeMat
      );
      ankle.position.y = -0.92;
      parent.add(ankle);

      const foot = new THREE.Group();
      foot.position.set(0, -0.96, 0.08);
      parent.add(foot);

      const footSole = new THREE.Mesh(
        new THREE.BoxGeometry(0.19, 0.07, 0.38),
        cyanGlowMat
      );
      footSole.position.set(0, -0.04, 0.04);
      footSole.castShadow = true;
      foot.add(footSole);

      const footBase = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.12, 0.36),
        darkMetalMat
      );
      footBase.position.set(0, 0.03, 0.04);
      footBase.castShadow = true;
      foot.add(footBase);

      const toeCap = new THREE.Mesh(
        new THREE.BoxGeometry(0.17, 0.1, 0.16),
        polishedTitaniumMat
      );
      toeCap.position.set(0, 0.04, 0.15);
      foot.add(toeCap);

      const heelPlate = new THREE.Mesh(
        new THREE.BoxGeometry(0.17, 0.14, 0.12),
        chromeMat
      );
      heelPlate.position.set(0, 0.06, -0.08);
      foot.add(heelPlate);

      const laceStrap = new THREE.Mesh(
        new THREE.BoxGeometry(0.16, 0.03, 0.08),
        goldAccentMat
      );
      laceStrap.position.set(0, 0.1, 0.06);
      foot.add(laceStrap);
    }

    buildLeg(leftLeg);
    buildLeg(rightLeg);

    leftLeg.rotation.x = -0.05;
    leftLeg.rotation.z = 0.06;
    rightLeg.rotation.x = 0.08;
    rightLeg.rotation.z = -0.06;

    const torsoGroup = new THREE.Group();
    torsoGroup.position.set(0, 0, 0);
    characterGroup.add(torsoGroup);

    const spine = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.15, 0.28, 16),
      darkMetalMat
    );
    spine.position.y = -0.16;
    torsoGroup.add(spine);

    const spineRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.16, 0.03, 12, 24),
      chromeMat
    );
    spineRing.rotation.x = Math.PI / 2;
    spineRing.position.y = -0.16;
    torsoGroup.add(spineRing);

    const chestGeo = new THREE.BoxGeometry(0.72, 0.58, 0.44);
    const chestMesh = new THREE.Mesh(chestGeo, darkMetalMat);
    chestMesh.position.y = 0.22;
    chestMesh.castShadow = true;
    torsoGroup.add(chestMesh);

    const chestArmorFront = new THREE.Mesh(
      new THREE.BoxGeometry(0.66, 0.48, 0.08),
      polishedTitaniumMat
    );
    chestArmorFront.position.set(0, 0.22, 0.21);
    torsoGroup.add(chestArmorFront);

    const coreLight = new THREE.Mesh(
      new THREE.CylinderGeometry(0.13, 0.13, 0.05, 32),
      cyanGlowMat
    );
    coreLight.rotation.x = Math.PI / 2;
    coreLight.position.set(0, 0.22, 0.25);
    torsoGroup.add(coreLight);

    const coreRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.16, 0.02, 16, 32),
      chromeMat
    );
    coreRing.position.set(0, 0.22, 0.26);
    torsoGroup.add(coreRing);

    const corePointLight = new THREE.PointLight(0x06b6d4, 1.8, 3.5);
    corePointLight.position.set(0, 0.22, 0.4);
    torsoGroup.add(corePointLight);

    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-0.46, 0.4, 0);
    torsoGroup.add(leftArmGroup);

    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(0.46, 0.4, 0);
    torsoGroup.add(rightArmGroup);

    function buildArm(parent: THREE.Group, isLeft: boolean) {
      const shoulderJoint = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 16, 16),
        chromeMat
      );
      parent.add(shoulderJoint);

      const shoulderPad = new THREE.Mesh(
        new THREE.SphereGeometry(0.16, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2),
        polishedTitaniumMat
      );
      shoulderPad.position.y = 0.04;
      shoulderPad.rotation.z = isLeft ? 0.3 : -0.3;
      parent.add(shoulderPad);

      const bicep = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.07, 0.32, 16),
        darkMetalMat
      );
      bicep.position.y = -0.18;
      parent.add(bicep);

      const elbow = new THREE.Mesh(
        new THREE.SphereGeometry(0.075, 14, 14),
        chromeMat
      );
      elbow.position.y = -0.36;
      parent.add(elbow);

      const forearm = new THREE.Mesh(
        new THREE.CylinderGeometry(0.075, 0.065, 0.32, 16),
        polishedTitaniumMat
      );
      forearm.position.y = -0.54;
      parent.add(forearm);

      const wristRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.07, 0.015, 12, 20),
        cyanGlowMat
      );
      wristRing.rotation.x = Math.PI / 2;
      wristRing.position.y = -0.7;
      parent.add(wristRing);

      const hand = new THREE.Group();
      hand.position.set(0, -0.76, 0);
      parent.add(hand);

      const palm = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.1, 0.06),
        darkMetalMat
      );
      hand.add(palm);

      for (let f = 0; f < 3; f++) {
        const finger = new THREE.Mesh(
          new THREE.CylinderGeometry(0.018, 0.015, 0.09, 8),
          chromeMat
        );
        finger.position.set(-0.04 + f * 0.04, -0.08, 0);
        hand.add(finger);
      }
      const thumb = new THREE.Mesh(
        new THREE.CylinderGeometry(0.018, 0.015, 0.08, 8),
        chromeMat
      );
      thumb.position.set(isLeft ? 0.06 : -0.06, -0.03, 0.02);
      thumb.rotation.z = isLeft ? -0.5 : 0.5;
      hand.add(thumb);
    }

    buildArm(leftArmGroup, true);
    buildArm(rightArmGroup, false);

    leftArmGroup.rotation.z = 0.25;
    leftArmGroup.rotation.x = 0.15;
    rightArmGroup.rotation.z = -0.3;
    rightArmGroup.rotation.x = -0.15;

    const neck = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.12, 0.14, 16),
      chromeMat
    );
    neck.position.y = 0.56;
    torsoGroup.add(neck);

    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.98, 0);
    torsoGroup.add(headGroup);

    const radioBoxGeo = new THREE.BoxGeometry(0.96, 0.62, 0.54);
    const radioBody = new THREE.Mesh(radioBoxGeo, darkMetalMat);
    radioBody.castShadow = true;
    headGroup.add(radioBody);

    const radioTrim = new THREE.Mesh(
      new THREE.BoxGeometry(1.0, 0.66, 0.04),
      chromeMat
    );
    radioTrim.position.set(0, 0, 0.27);
    headGroup.add(radioTrim);

    const radioFace = new THREE.Mesh(
      new THREE.BoxGeometry(0.92, 0.58, 0.03),
      polishedTitaniumMat
    );
    radioFace.position.set(0, 0, 0.28);
    headGroup.add(radioFace);

    const speakerCones: THREE.Mesh[] = [];

    function buildSpeaker(x: number) {
      const rim = new THREE.Mesh(
        new THREE.TorusGeometry(0.18, 0.025, 16, 32),
        chromeMat
      );
      rim.position.set(x, -0.04, 0.3);
      headGroup.add(rim);

      const cone = new THREE.Mesh(
        new THREE.CylinderGeometry(0.16, 0.06, 0.06, 24),
        speakerConeMat
      );
      cone.rotation.x = Math.PI / 2;
      cone.position.set(x, -0.04, 0.29);
      headGroup.add(cone);
      speakerCones.push(cone);

      const dustCap = new THREE.Mesh(
        new THREE.SphereGeometry(0.05, 16, 16),
        cyanGlowMat
      );
      dustCap.position.set(x, -0.04, 0.33);
      headGroup.add(dustCap);

      const glowRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.19, 0.01, 16, 32),
        violetGlowMat
      );
      glowRing.position.set(x, -0.04, 0.3);
      headGroup.add(glowRing);
    }

    buildSpeaker(-0.27);
    buildSpeaker(0.27);

    const displayGlass = new THREE.Mesh(
      new THREE.BoxGeometry(0.36, 0.16, 0.02),
      new THREE.MeshStandardMaterial({
        color: 0x05070f,
        roughness: 0.1,
        metalness: 0.9,
      })
    );
    displayGlass.position.set(0, 0.14, 0.3);
    headGroup.add(displayGlass);

    const vuBar1 = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.08, 0.03),
      cyanGlowMat
    );
    vuBar1.position.set(-0.09, 0.14, 0.31);
    headGroup.add(vuBar1);

    const vuBar2 = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.12, 0.03),
      violetGlowMat
    );
    vuBar2.position.set(0, 0.14, 0.31);
    headGroup.add(vuBar2);

    const vuBar3 = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.07, 0.03),
      cyanGlowMat
    );
    vuBar3.position.set(0.09, 0.14, 0.31);
    headGroup.add(vuBar3);

    const cdTray = new THREE.Mesh(
      new THREE.BoxGeometry(0.34, 0.03, 0.03),
      chromeMat
    );
    cdTray.position.set(0, -0.18, 0.3);
    headGroup.add(cdTray);

    const leftKnob = new THREE.Mesh(
      new THREE.CylinderGeometry(0.065, 0.065, 0.08, 16),
      goldAccentMat
    );
    leftKnob.rotation.z = Math.PI / 2;
    leftKnob.position.set(-0.51, 0.12, 0.08);
    headGroup.add(leftKnob);

    const rightKnob = new THREE.Mesh(
      new THREE.CylinderGeometry(0.065, 0.065, 0.08, 16),
      goldAccentMat
    );
    rightKnob.rotation.z = Math.PI / 2;
    rightKnob.position.set(0.51, 0.12, 0.08);
    headGroup.add(rightKnob);

    const antennaBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.04, 0.08, 12),
      chromeMat
    );
    antennaBase.position.set(0.36, 0.34, -0.12);
    headGroup.add(antennaBase);

    const antennaRod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.018, 0.55, 12),
      chromeMat
    );
    antennaRod.position.set(0.44, 0.58, -0.15);
    antennaRod.rotation.z = -0.35;
    antennaRod.rotation.x = -0.15;
    headGroup.add(antennaRod);

    const antennaTip = new THREE.Mesh(
      new THREE.SphereGeometry(0.035, 16, 16),
      cyanGlowMat
    );
    antennaTip.position.set(0.53, 0.82, -0.19);
    headGroup.add(antennaTip);

    const handleBar = new THREE.Mesh(
      new THREE.TorusGeometry(0.24, 0.024, 12, 24, Math.PI),
      chromeMat
    );
    handleBar.rotation.z = -Math.PI;
    handleBar.position.set(0, 0.34, 0);
    headGroup.add(handleBar);

    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      mouse.targetX = (e.clientX - centerX) / (window.innerWidth / 2);
      mouse.targetY = -(e.clientY - centerY) / (window.innerHeight / 2);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      const idleBob = Math.sin(elapsedTime * 1.8) * 0.08;
      characterGroup.position.y = idleBob;

      torsoGroup.rotation.y = mouse.x * 0.45;
      torsoGroup.rotation.x = -mouse.y * 0.25;

      headGroup.rotation.y = mouse.x * 0.65;
      headGroup.rotation.x = -mouse.y * 0.45;
      headGroup.rotation.z = -mouse.x * 0.12;

      leftArmGroup.rotation.z = 0.22 + Math.sin(elapsedTime * 1.8) * 0.05;
      rightArmGroup.rotation.z = -0.28 - Math.cos(elapsedTime * 1.8) * 0.05;

      leftLeg.rotation.x = -0.05 + Math.sin(elapsedTime * 1.8) * 0.04;
      rightLeg.rotation.x = 0.08 - Math.sin(elapsedTime * 1.8) * 0.04;

      const pulse = 1.0 + Math.sin(elapsedTime * 6.0) * 0.08;
      speakerCones.forEach((cone) => {
        cone.scale.set(pulse, pulse, 1.0);
      });

      vuBar1.scale.y = 0.6 + Math.sin(elapsedTime * 8.0) * 0.4;
      vuBar2.scale.y = 0.8 + Math.cos(elapsedTime * 10.0) * 0.5;
      vuBar3.scale.y = 0.5 + Math.sin(elapsedTime * 9.0) * 0.45;

      corePointLight.intensity = 1.4 + Math.sin(elapsedTime * 3.5) * 0.4;

      renderer.render(scene, camera);
    };

    animate();

    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      if (newWidth === 0 || newHeight === 0) return;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    });

    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      resizeObserver.disconnect();
      renderer.dispose();
      scene.clear();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing ${className}`}
    />
  );
}
