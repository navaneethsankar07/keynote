"use client";

import * as THREE from "three";

interface SplineAppInstance {
  _scene?: THREE.Scene;
  _camera?: THREE.PerspectiveCamera;
  setZoom?: (zoom: number) => void;
  [key: string]: unknown;
}

export function createMusicHead(): { group: THREE.Group; cdMesh: THREE.Mesh } {
  const headGroup = new THREE.Group();
  headGroup.name = "CustomMusicHead";

  const whiteMat = new THREE.MeshStandardMaterial({
    color: 0xf3f4f6,
    roughness: 0.22,
    metalness: 0.12,
  });

  const darkMat = new THREE.MeshStandardMaterial({
    color: 0x111318,
    roughness: 0.45,
    metalness: 0.25,
  });

  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xd4d9e2,
    roughness: 0.08,
    metalness: 0.92,
  });

  const cyanGlowMat = new THREE.MeshStandardMaterial({
    color: 0x06b6d4,
    emissive: 0x06b6d4,
    emissiveIntensity: 0.85,
    roughness: 0.2,
  });

  const violetGlowMat = new THREE.MeshStandardMaterial({
    color: 0x8b5cf6,
    emissive: 0x8b5cf6,
    emissiveIntensity: 0.8,
    roughness: 0.2,
  });

  const chassisGeo = new THREE.BoxGeometry(116, 82, 68);
  const chassis = new THREE.Mesh(chassisGeo, whiteMat);
  chassis.castShadow = true;
  chassis.receiveShadow = true;
  headGroup.add(chassis);

  const faceGeo = new THREE.BoxGeometry(104, 70, 6);
  const face = new THREE.Mesh(faceGeo, darkMat);
  face.position.set(0, 0, 34);
  headGroup.add(face);

  const speakerRimGeo = new THREE.CylinderGeometry(19, 19, 4, 32);
  speakerRimGeo.rotateX(Math.PI / 2);
  const speakerConeGeo = new THREE.CylinderGeometry(15, 11, 5, 24);
  speakerConeGeo.rotateX(Math.PI / 2);
  const dustCapGeo = new THREE.SphereGeometry(4.5, 16, 16);

  const leftRim = new THREE.Mesh(speakerRimGeo, chromeMat);
  leftRim.position.set(-32, 6, 37);
  const leftCone = new THREE.Mesh(speakerConeGeo, darkMat);
  leftCone.position.set(-32, 6, 37);
  const leftCap = new THREE.Mesh(dustCapGeo, chromeMat);
  leftCap.position.set(-32, 6, 39);
  headGroup.add(leftRim, leftCone, leftCap);

  const rightRim = new THREE.Mesh(speakerRimGeo, chromeMat);
  rightRim.position.set(32, 6, 37);
  const rightCone = new THREE.Mesh(speakerConeGeo, darkMat);
  rightCone.position.set(32, 6, 37);
  const rightCap = new THREE.Mesh(dustCapGeo, chromeMat);
  rightCap.position.set(32, 6, 39);
  headGroup.add(rightRim, rightCone, rightCap);

  const cdGeo = new THREE.CylinderGeometry(13, 13, 1.8, 32);
  cdGeo.rotateX(Math.PI / 2);
  const cdMat = new THREE.MeshStandardMaterial({
    color: 0x1e2230,
    metalness: 0.95,
    roughness: 0.08,
  });
  const cdMesh = new THREE.Mesh(cdGeo, cdMat);
  cdMesh.position.set(0, 10, 37.5);
  headGroup.add(cdMesh);

  const cdRingGeo = new THREE.TorusGeometry(8, 0.6, 8, 32);
  const cdRing = new THREE.Mesh(cdRingGeo, cyanGlowMat);
  cdRing.position.set(0, 10, 38.5);
  headGroup.add(cdRing);

  const cdCenterGeo = new THREE.CylinderGeometry(3.5, 3.5, 2.2, 24);
  cdCenterGeo.rotateX(Math.PI / 2);
  const cdCenter = new THREE.Mesh(cdCenterGeo, chromeMat);
  cdCenter.position.set(0, 10, 38.6);
  headGroup.add(cdCenter);

  for (let i = -3; i <= 3; i++) {
    const barHeight = 4 + Math.sin(Math.abs(i) * 1.1) * 7;
    const barGeo = new THREE.BoxGeometry(3.2, barHeight, 2);
    const barMat = Math.abs(i) <= 1 ? cyanGlowMat : violetGlowMat;
    const bar = new THREE.Mesh(barGeo, barMat);
    bar.position.set(i * 5.8, -19, 37.5);
    headGroup.add(bar);
  }

  const handleGeo = new THREE.TorusGeometry(28, 4.5, 16, 32, Math.PI);
  handleGeo.rotateX(Math.PI);
  const handle = new THREE.Mesh(handleGeo, chromeMat);
  handle.position.set(0, 44, 0);
  headGroup.add(handle);

  const knobGeo = new THREE.CylinderGeometry(6.5, 6.5, 8, 24);
  const knobL = new THREE.Mesh(knobGeo, chromeMat);
  knobL.position.set(-30, 45, -6);
  const knobR = new THREE.Mesh(knobGeo, chromeMat);
  knobR.position.set(30, 45, -6);
  headGroup.add(knobL, knobR);

  const antennaBase = new THREE.Mesh(new THREE.CylinderGeometry(3, 4, 7, 16), chromeMat);
  antennaBase.position.set(40, 44, -16);
  const antennaPole = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.8, 50, 16), chromeMat);
  antennaPole.position.set(48, 66, -20);
  antennaPole.rotation.z = -0.32;
  antennaPole.rotation.x = -0.15;
  const antennaTip = new THREE.Mesh(new THREE.SphereGeometry(2.8, 16, 16), cyanGlowMat);
  antennaTip.position.set(56, 88, -23);
  headGroup.add(antennaBase, antennaPole, antennaTip);

  return { group: headGroup, cdMesh };
}

export function createRoboticFoot(isRight: boolean = false): THREE.Group {
  const footGroup = new THREE.Group();
  footGroup.name = isRight ? "RoboticFootRight" : "RoboticFootLeft";

  const whiteMat = new THREE.MeshStandardMaterial({
    color: 0xf3f4f6,
    roughness: 0.22,
    metalness: 0.12,
  });

  const darkMat = new THREE.MeshStandardMaterial({
    color: 0x14161e,
    roughness: 0.7,
    metalness: 0.25,
  });

  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xd4d9e2,
    roughness: 0.08,
    metalness: 0.92,
  });

  const accentMat = new THREE.MeshStandardMaterial({
    color: isRight ? 0x06b6d4 : 0x8b5cf6,
    emissive: isRight ? 0x06b6d4 : 0x8b5cf6,
    emissiveIntensity: 0.7,
  });

  const shinGeo = new THREE.CylinderGeometry(8.5, 9.5, 42, 24);
  const shinMesh = new THREE.Mesh(shinGeo, whiteMat);
  shinMesh.position.set(0, -20, 0);
  footGroup.add(shinMesh);

  const ankleGeo = new THREE.CylinderGeometry(12, 12, 9, 24);
  const ankle = new THREE.Mesh(ankleGeo, darkMat);
  ankle.position.set(0, -42, 0);
  footGroup.add(ankle);

  const soleGeo = new THREE.BoxGeometry(24, 11, 52);
  const sole = new THREE.Mesh(soleGeo, darkMat);
  sole.position.set(0, -51, 12);
  footGroup.add(sole);

  const upperGeo = new THREE.BoxGeometry(22, 18, 44);
  const upper = new THREE.Mesh(upperGeo, whiteMat);
  upper.position.set(0, -40, 10);
  footGroup.add(upper);

  const toeGeo = new THREE.SphereGeometry(11, 24, 16);
  toeGeo.scale(1, 0.75, 1.25);
  const toe = new THREE.Mesh(toeGeo, chromeMat);
  toe.position.set(0, -45, 31);
  footGroup.add(toe);

  const stripeGeo = new THREE.BoxGeometry(23, 3.5, 4);
  const stripe = new THREE.Mesh(stripeGeo, accentMat);
  stripe.position.set(0, -44, -13);
  footGroup.add(stripe);

  return footGroup;
}

export function customizeSplineBot(app: unknown): () => void {
  if (!app) return () => {};
  const splineApp = app as SplineAppInstance;

  if (typeof splineApp.setZoom === "function") {
    splineApp.setZoom(0.56);
  }

  const camera = splineApp._camera;
  if (camera) {
    if (camera.position) {
      camera.position.z *= 1.38;
      camera.position.y -= 45;
    }
    camera.updateProjectionMatrix();
  }

  const scene = splineApp._scene;
  if (!scene) return () => {};

  scene.traverse((child: THREE.Object3D) => {
    if (
      child.name === "Head 2" ||
      child.name === "Head" ||
      child.name === "eyE" ||
      (typeof child.name === "string" && child.name.toLowerCase().includes("head"))
    ) {
      if (child.name !== "CustomMusicHead") {
        child.visible = false;
        child.scale?.set(0.001, 0.001, 0.001);
      }
    }
  });

  let cdToSpin: THREE.Mesh | null = null;
  const neck =
    scene.getObjectByName("Neck") ||
    scene.getObjectByName("Top part") ||
    scene.getObjectByName("Bot");

  if (neck && !neck.getObjectByName("CustomMusicHead")) {
    const { group: musicHead, cdMesh } = createMusicHead();
    musicHead.position.set(0, 52, 6);
    musicHead.scale.set(0.92, 0.92, 0.92);
    neck.add(musicHead);
    cdToSpin = cdMesh;
  }

  const shinLeft = scene.getObjectByName("shin");
  if (shinLeft && !shinLeft.getObjectByName("RoboticFootLeft")) {
    const footLeft = createRoboticFoot(false);
    footLeft.position.set(0, -48, 0);
    shinLeft.add(footLeft);
  }

  const legRight = scene.getObjectByName("Leg Left Instance");
  if (legRight) {
    let rightShin: THREE.Object3D | null = null;
    legRight.traverse((c: THREE.Object3D) => {
      if (c.name === "shin" || c.name.toLowerCase().includes("shin")) {
        rightShin = c;
      }
    });
    const targetShin = rightShin || legRight;
    if (targetShin && !targetShin.getObjectByName("RoboticFootRight")) {
      const footRight = createRoboticFoot(true);
      footRight.position.set(0, rightShin ? -48 : -115, 0);
      targetShin.add(footRight);
    }
  }

  let animId: number | null = null;
  if (cdToSpin) {
    const spin = () => {
      if (cdToSpin) {
        cdToSpin.rotation.z += 0.04;
      }
      animId = requestAnimationFrame(spin);
    };
    spin();
  }

  return () => {
    if (animId !== null) {
      cancelAnimationFrame(animId);
    }
  };
}
