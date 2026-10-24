// Loaded on demand by StackMatrix.tsx. Matcaps are baked in Blender with the
// boot-screen TM mark's light rig (design/blender/stack-matrix-matcaps/stack-matrix-matcaps.blend)
// so the towers match it. Renders at 1/PIXEL resolution, upscaled nearest-neighbour.
import * as THREE from "three";

export type SceneApi = {
  select: (index: number) => void;
  resize: () => void;
  setVisible: (v: boolean) => void;
  dispose: () => void;
};

const PIXEL = 3;
const STEP_MS = 1000 / 12; // animation is stepped at 12 fps
const SLAB_H = 0.5, GAP = 0.09, SIZE = 1.6, SPACING_X = 2.75;
const GLITCH_MS = 420;

export function createStackScene(
  host: HTMLDivElement,
  groups: { count: number }[],
  opts: {
    reduceMotion: boolean;
    selected: number;
    onPick: (i: number) => void;
    onHover: (i: number | null) => void;
    onLabels: (pts: { x: number; y: number }[]) => void;
  },
): SceneApi {
  const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "low-power" });
  renderer.setPixelRatio(1); // the low-res pixel look makes DPR irrelevant
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const canvas = renderer.domElement;
  Object.assign(canvas.style, { position: "absolute", inset: "0", width: "100%", height: "100%", imageRendering: "pixelated", display: "block" });
  host.appendChild(canvas);

  const scene = new THREE.Scene();
  const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
  const target = new THREE.Vector3(0, 1.9, 0);
  const basePos = new THREE.Vector3(6.5, 7.2, 14);
  const camGoal = basePos.clone();
  cam.position.copy(basePos);
  cam.lookAt(target);

  const loader = new THREE.TextureLoader();
  const matcap = (k: string) => {
    const t = loader.load(`/wd2/matcap-${k}.webp`, () => invalidate());
    t.colorSpace = THREE.SRGBColorSpace;
    return new THREE.MeshMatcapMaterial({ matcap: t });
  };
  const M = { white: matcap("white"), blue: matcap("blue"), graphite: matcap("graphite"), green: matcap("green") };

  // ~40 slabs share two geometries; with per-slab material swaps and drop
  // animation, plain meshes are simpler than instancing at this count.
  const slabGeo = new THREE.BoxGeometry(SIZE, SLAB_H, SIZE);
  const plateGeo = new THREE.BoxGeometry(SIZE + 0.6, 0.18, SIZE + 0.6);
  const towers = groups.map((g, i) => {
    const group = new THREE.Group();
    group.position.x = (i - (groups.length - 1) / 2) * SPACING_X;
    const plate = new THREE.Mesh(plateGeo, M.graphite);
    plate.position.y = -0.09;
    group.add(plate);
    const slabs = Array.from({ length: g.count }, (_, s) => {
      const m = new THREE.Mesh(slabGeo, M.white);
      m.position.y = SLAB_H / 2 + s * (SLAB_H + GAP);
      m.userData = { tower: i, restY: m.position.y };
      group.add(m);
      return m;
    });
    scene.add(group);
    return { x: group.position.x, slabs, top: g.count * (SLAB_H + GAP) };
  });
  const allSlabs = towers.flatMap((t) => t.slabs);

  const grid = new THREE.GridHelper(22, 44, 0x1f2a3a, 0x141a24);
  grid.position.y = -0.19;
  scene.add(grid);

  let selected = opts.selected;
  let hovered: number | null = null;
  let visible = true;
  let dirty = true;
  let labelsDirty = true;
  let raf = 0;
  let lastStep = 0;
  let glitchTower = -1, glitchUntil = 0;
  let px = 0, py = 0;
  const startAt = performance.now();
  const buildEnd = opts.reduceMotion ? 0
    : startAt + (groups.length - 1) * 140 + (Math.max(...groups.map((g) => g.count)) - 1) * 55 + 360;

  function paint() {
    towers.forEach((t, i) => t.slabs.forEach((s, k) => {
      s.material = k === t.slabs.length - 1 ? M.green : i === selected ? M.blue : M.white;
    }));
  }
  paint();

  // slabs drop into place tower by tower, layer by layer, in 5 steps
  function dropOffset(towerIdx: number, slabIdx: number, now: number) {
    const p = (now - (startAt + towerIdx * 140 + slabIdx * 55)) / 360;
    if (p >= 1) return 0;
    return (1 - Math.floor(Math.max(0, p) * 5) / 5) * 7;
  }

  function step(now: number) {
    const building = now < buildEnd;
    const glitching = now < glitchUntil;
    if (building || glitchTower >= 0) {
      towers.forEach((t, i) => t.slabs.forEach((s, k) => {
        let jx = 0, jz = 0;
        if (glitching && glitchTower === i && Math.random() >= 0.25) {
          jx = (Math.random() - 0.5) * 0.7; jz = (Math.random() - 0.5) * 0.35;
        }
        s.position.set(jx, s.userData.restY + (building ? dropOffset(i, k, now) : 0), jz);
      }));
      if (!glitching) glitchTower = -1;
      dirty = true;
    }

    camGoal.set(basePos.x + px * 0.9, basePos.y + py * 0.6, basePos.z - px * 0.9);
    if (cam.position.distanceTo(camGoal) > 0.02) {
      cam.position.lerp(camGoal, 0.25);
      cam.lookAt(target);
      dirty = labelsDirty = true;
    }
  }

  function projectLabels() {
    const w = host.clientWidth, h = host.clientHeight;
    const v = new THREE.Vector3();
    opts.onLabels(towers.map((t) => {
      v.set(t.x, t.top + 0.35, 0).project(cam);
      return { x: (v.x * 0.5 + 0.5) * w, y: (-v.y * 0.5 + 0.5) * h };
    }));
  }

  const isAnimating = (now: number) =>
    now < buildEnd || glitchTower >= 0 || cam.position.distanceTo(camGoal) > 0.02;

  // The loop only runs while something moves or a redraw is pending, and
  // stops while offscreen; invalidate() restarts it.
  function frame(now: number) {
    raf = 0;
    if (!visible) return;
    if (now - lastStep >= STEP_MS) {
      lastStep = now;
      step(now);
      if (dirty) { renderer.render(scene, cam); dirty = false; }
      if (labelsDirty) { projectLabels(); labelsDirty = false; }
    }
    if (dirty || isAnimating(now)) raf = requestAnimationFrame(frame);
  }
  function invalidate() {
    dirty = true;
    if (!raf && visible) raf = requestAnimationFrame(frame);
  }

  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  function pick(e: PointerEvent, r: DOMRect) {
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, cam);
    const hit = ray.intersectObjects(allSlabs, false)[0];
    return hit ? (hit.object.userData.tower as number) : null;
  }
  const onMove = (e: PointerEvent) => {
    const r = host.getBoundingClientRect();
    if (!opts.reduceMotion) {
      px = ((e.clientX - r.left) / r.width) * 2 - 1;
      py = ((e.clientY - r.top) / r.height) * 2 - 1;
      invalidate();
    }
    const h = pick(e, r);
    if (h !== hovered) { hovered = h; host.style.cursor = h === null ? "" : "pointer"; opts.onHover(h); }
  };
  const onLeave = () => {
    px = 0; py = 0; invalidate();
    if (hovered !== null) { hovered = null; opts.onHover(null); }
  };
  const onDown = (e: PointerEvent) => {
    const h = pick(e, host.getBoundingClientRect());
    if (h !== null) opts.onPick(h);
  };
  host.addEventListener("pointermove", onMove);
  host.addEventListener("pointerleave", onLeave);
  host.addEventListener("pointerdown", onDown);

  function resize() {
    const w = host.clientWidth, h = host.clientHeight;
    if (!w || !h) return;
    renderer.setSize(Math.round(w / PIXEL), Math.round(h / PIXEL), false);
    const aspect = w / h;
    const view = Math.max((aspect < 1.8 ? 8.7 : 9.6) / aspect, 4.6); // fit the row of towers
    cam.left = -view * aspect; cam.right = view * aspect; cam.top = view; cam.bottom = -view;
    cam.updateProjectionMatrix();
    labelsDirty = true;
    invalidate();
  }
  resize();

  return {
    select(i) {
      if (i === selected) return;
      selected = i;
      paint();
      if (!opts.reduceMotion) { glitchTower = i; glitchUntil = performance.now() + GLITCH_MS; }
      invalidate();
    },
    resize,
    setVisible(v) {
      visible = v;
      if (v) invalidate();
      else if (raf) { cancelAnimationFrame(raf); raf = 0; }
    },
    dispose() {
      cancelAnimationFrame(raf);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointerdown", onDown);
      host.style.cursor = "";
      slabGeo.dispose(); plateGeo.dispose();
      grid.geometry.dispose(); grid.material.dispose();
      Object.values(M).forEach((m) => { m.matcap?.dispose(); m.dispose(); });
      renderer.dispose();
      canvas.remove();
    },
  };
}
