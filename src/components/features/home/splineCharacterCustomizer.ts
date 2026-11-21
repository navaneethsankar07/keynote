import * as THREE from "three";

interface SplineAppLike {
  _scene?: THREE.Scene;
  _camera?: THREE.PerspectiveCamera & { zoom?: number };
  _requestRenderAutoMode?: () => void;
  findObjectByName?: (name: string) => (THREE.Object3D & { hide?: () => void }) | undefined;
}

export function customizeMusicCharacter(app: unknown) {
  if (!app) return;
  const splineApp = app as SplineAppLike;

  try {
    const micNames = ["MIc", "mic", "Head 2", "SubdivGeometry"];
    for (const name of micNames) {
      const obj = splineApp.findObjectByName?.(name);
      if (obj) {
        obj.visible = false;
        if (typeof obj.hide === "function") obj.hide();
      }
    }

    if (splineApp._scene) {
      splineApp._scene.traverse((child: THREE.Object3D) => {
        if (child.name && /mic|head 2/i.test(child.name)) {
          child.visible = false;
        }
      });
    }

    const bot = splineApp.findObjectByName?.("Bot");
    if (bot) {
      bot.scale.set(0.74, 0.74, 0.74);
      bot.position.y += 120;
    }

    if (splineApp._camera) {
      splineApp._camera.zoom = 0.72;
      splineApp._camera.position.y -= 40;
      splineApp._camera.updateProjectionMatrix?.();
    }

    let headAnchor: THREE.Object3D | null = null;
    if (splineApp._scene) {
      splineApp._scene.traverse((child: THREE.Object3D) => {
        if (child.name === "Head" || child.name === "Neck") {
          if (!headAnchor || child.name === "Head") {
            headAnchor = child;
          }
        }
      });
    }
    if (!headAnchor && splineApp.findObjectByName) {
      headAnchor = splineApp.findObjectByName("Head") || splineApp.findObjectByName("Neck") || null;
    }

    if (headAnchor && !headAnchor.getObjectByName("KeynoteRadioHead")) {
      const radioHead = createRetroRadioHead();
      headAnchor.add(radioHead);
    }

    enhanceRobotFeet(splineApp);

    if (typeof splineApp._requestRenderAutoMode === "function") {
      splineApp._requestRenderAutoMode();
    }
  } catch (err) {
    console.warn("Spline customization:", err);
  }
}

function createRetroRadioHead(): THREE.Group {
  const group = new THREE.Group();
  group.name = "KeynoteRadioHead";
  group.position.set(0, 26, 0);

  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x161822,
    metalness: 0.65,
    roughness: 0.32,
  });

  const faceMat = new THREE.MeshStandardMaterial({
    color: 0x0c0d14,
    metalness: 0.45,
    roughness: 0.55,
  });

  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    metalness: 0.95,
    roughness: 0.15,
  });

  const speakerMeshMat = new THREE.MeshStandardMaterial({
    color: 0x181a26,
    metalness: 0.7,
    roughness: 0.6,
  });

  const cyanGlowMat = new THREE.MeshStandardMaterial({
    color: 0x06b6d4,
    emissive: 0x06b6d4,
    emissiveIntensity: 0.6,
    roughness: 0.2,
  });

  const violetAccentMat = new THREE.MeshStandardMaterial({
    color: 0x8b5cf6,
    emissive: 0x8b5cf6,
    emissiveIntensity: 0.45,
    roughness: 0.25,
  });

  const cabinetGeo = new THREE.BoxGeometry(86, 56, 42);
  const cabinet = new THREE.Mesh(cabinetGeo, bodyMat);
  cabinet.castShadow = true;
  group.add(cabinet);

  const faceplateGeo = new THREE.BoxGeometry(78, 48, 4);
  const faceplate = new THREE.Mesh(faceplateGeo, faceMat);
  faceplate.position.set(0, 0, 20);
  group.add(faceplate);

  const speakerRimGeo = new THREE.TorusGeometry(13, 1.6, 16, 32);
  const leftSpeakerRim = new THREE.Mesh(speakerRimGeo, violetAccentMat);
  leftSpeakerRim.position.set(-23, 3, 22.2);
  group.add(leftSpeakerRim);

  const speakerConeGeo = new THREE.CylinderGeometry(12, 12, 1.2, 32);
  speakerConeGeo.rotateX(Math.PI / 2);
  const leftSpeakerCone = new THREE.Mesh(speakerConeGeo, speakerMeshMat);
  leftSpeakerCone.position.set(-23, 3, 21.8);
  group.add(leftSpeakerCone);

  const leftCapGeo = new THREE.SphereGeometry(3.5, 16, 16);
  const leftCap = new THREE.Mesh(leftCapGeo, chromeMat);
  leftCap.position.set(-23, 3, 22.8);
  leftCap.scale.set(1, 1, 0.4);
  group.add(leftCap);

  const tunerWindowGeo = new THREE.BoxGeometry(22, 17, 1);
  const tunerWindow = new THREE.Mesh(tunerWindowGeo, cyanGlowMat);
  tunerWindow.position.set(2, 9, 22.2);
  group.add(tunerWindow);

  const needleGeo = new THREE.BoxGeometry(1.5, 15, 1.5);
  const needle = new THREE.Mesh(needleGeo, chromeMat);
  needle.position.set(3, 9, 22.8);
  group.add(needle);

  const cdSlotGeo = new THREE.BoxGeometry(26, 3.2, 2);
  const cdSlot = new THREE.Mesh(
    cdSlotGeo,
    new THREE.MeshStandardMaterial({ color: 0x050608, roughness: 0.9 })
  );
  cdSlot.position.set(2, -5, 22.2);
  group.add(cdSlot);

  const cdDiscGeo = new THREE.CylinderGeometry(11, 11, 0.8, 32);
  cdDiscGeo.rotateX(Math.PI / 2);
  const cdDisc = new THREE.Mesh(
    cdDiscGeo,
    new THREE.MeshStandardMaterial({
      color: 0xc4b5fd,
      metalness: 0.92,
      roughness: 0.12,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.35,
    })
  );
  cdDisc.position.set(2, -5, 23.2);
  group.add(cdDisc);

  const knobGeo = new THREE.CylinderGeometry(5.5, 5.5, 4, 24);
  knobGeo.rotateX(Math.PI / 2);

  const topKnob = new THREE.Mesh(knobGeo, chromeMat);
  topKnob.position.set(25, 9, 22.2);
  group.add(topKnob);

  const bottomKnob = new THREE.Mesh(knobGeo, chromeMat);
  bottomKnob.position.set(25, -5, 22.2);
  group.add(bottomKnob);

  const antennaBaseGeo = new THREE.CylinderGeometry(2.5, 3.2, 5, 16);
  const antennaBase = new THREE.Mesh(antennaBaseGeo, bodyMat);
  antennaBase.position.set(-27, 30, -5);
  antennaBase.rotation.z = -0.22;
  group.add(antennaBase);

  const antennaRodGeo = new THREE.CylinderGeometry(1.2, 1.2, 36, 16);
  const antennaRod = new THREE.Mesh(antennaRodGeo, chromeMat);
  antennaRod.position.set(-33, 47, -5);
  antennaRod.rotation.z = -0.22;
  group.add(antennaRod);

  const antennaTipGeo = new THREE.SphereGeometry(2.8, 16, 16);
  const antennaTip = new THREE.Mesh(antennaTipGeo, cyanGlowMat);
  antennaTip.position.set(-37, 65, -5);
  group.add(antennaTip);

  const handleGeo = new THREE.TorusGeometry(17, 2.2, 12, 24, Math.PI);
  const handle = new THREE.Mesh(handleGeo, chromeMat);
  handle.position.set(3, 28, 0);
  handle.rotation.x = Math.PI;
  group.add(handle);

  return group;
}

function enhanceRobotFeet(splineApp: SplineAppLike) {
  const footNodes: THREE.Object3D[] = [];
  if (splineApp._scene) {
    splineApp._scene.traverse((child: THREE.Object3D) => {
      if (child.name && /foot/i.test(child.name)) {
        footNodes.push(child);
      }
    });
  }

  const soleMat = new THREE.MeshStandardMaterial({
    color: 0x141620,
    metalness: 0.6,
    roughness: 0.4,
  });

  const accentMat = new THREE.MeshStandardMaterial({
    color: 0x06b6d4,
    emissive: 0x06b6d4,
    emissiveIntensity: 0.35,
    roughness: 0.3,
  });

  footNodes.forEach((foot) => {
    if (foot.getObjectByName("KeynoteFootEnhancement")) return;

    const footGroup = new THREE.Group();
    footGroup.name = "KeynoteFootEnhancement";

    const soleGeo = new THREE.BoxGeometry(20, 8, 32);
    const sole = new THREE.Mesh(soleGeo, soleMat);
    sole.position.set(0, -4, 5);
    footGroup.add(sole);

    const stripeGeo = new THREE.BoxGeometry(21, 2, 30);
    const stripe = new THREE.Mesh(stripeGeo, accentMat);
    stripe.position.set(0, -5, 5);
    footGroup.add(stripe);

    const toeGeo = new THREE.CylinderGeometry(10, 10, 7, 16, 1, false, 0, Math.PI);
    toeGeo.rotateZ(Math.PI / 2);
    const toe = new THREE.Mesh(toeGeo, soleMat);
    toe.position.set(0, -4, 21);
    toe.scale.set(1, 0.9, 0.8);
    footGroup.add(toe);

    foot.add(footGroup);
  });
}
