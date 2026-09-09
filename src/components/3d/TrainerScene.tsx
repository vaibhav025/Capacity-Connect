import { useEffect, useRef, useState } from "react";
import type { MotionValue } from "framer-motion";
import {
  AmbientLight,
  DirectionalLight,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";
import { createAtmosphere } from "./AtmosphereScene";
import { disposeObject, loadTrainerModel } from "./TrainerModel";
import { TrainerSceneFallback } from "./TrainerSceneFallback";

export default function TrainerScene({
  progress,
}: {
  progress: MotionValue<number>;
}) {
  const host = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
        preserveDrawingBuffer: true,
      });
    } catch {
      return;
    }
    let disposed = false;
    let visible = true;
    let frame = 0;
    let previousTime = 0;
    const pointer = { x: 0, y: 0 };
    const scene = new Scene();
    const camera = new PerspectiveCamera(38, 1, 0.1, 40);
    camera.position.set(0, 0.3, 7.8);
    const { group, instrument, board } = createAtmosphere();
    scene.add(group, new AmbientLight(0xc4e7ff, 1.1));
    const light = new DirectionalLight(0xffffff, 2);
    light.position.set(3, 4, 5);
    scene.add(light);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    element.appendChild(renderer.domElement);
    const resizeScene = () => {
      const { width, height } = element.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    const resize = new ResizeObserver(resizeScene);
    resize.observe(element);
    resizeScene();
    const start = performance.now();
    const tick = (time: number) => {
      if (disposed || !visible || document.hidden) {
        frame = 0;
        return;
      }
      frame = requestAnimationFrame(tick);
      if (time - previousTime < 32) return; // ~30fps is ample for this quiet scene.
      previousTime = time;
      const p = progress.get();
      const entrance = Math.min((time - start) / 1100, 1);
      group.scale.setScalar(0.9 + entrance * 0.1);
      group.rotation.y = -0.25 + p * 0.75;
      group.position.z = p < 0.55 ? -p * 0.7 : -0.385 + (p - 0.55) * 0.9;
      board.position.y = -0.85 + Math.min(p / 0.55, 1) * 0.35;
      camera.position.x += (pointer.x * 0.23 - camera.position.x) * 0.06;
      camera.position.y += (0.3 + pointer.y * 0.16 - camera.position.y) * 0.06;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    const sync = () => {
      if (visible && !document.hidden && !frame)
        frame = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(element);
    const move = (event: PointerEvent) => {
      const bounds = element.getBoundingClientRect();
      pointer.x = (event.clientX - bounds.left) / bounds.width - 0.5;
      pointer.y = (event.clientY - bounds.top) / bounds.height - 0.5;
    };
    const reset = () => {
      pointer.x = pointer.y = 0;
    };
    const lost = (event: Event) => {
      event.preventDefault();
      visible = false;
      setReady(false);
    };
    element.addEventListener("pointermove", move, { passive: true });
    element.addEventListener("pointerleave", reset);
    renderer.domElement.addEventListener("webglcontextlost", lost);
    document.addEventListener("visibilitychange", sync);
    void loadTrainerModel().then((model) => {
      if (!model) return;
      if (disposed) {
        disposeObject(model);
        return;
      }
      instrument.visible = false;
      group.add(model);
    });
    setReady(true);
    sync();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      resize.disconnect();
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerleave", reset);
      document.removeEventListener("visibilitychange", sync);
      renderer.domElement.removeEventListener("webglcontextlost", lost);
      disposeObject(group);
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, [progress]);
  return (
    <div className="trainer-scene" aria-hidden="true">
      {!ready && <TrainerSceneFallback />}
      <div ref={host} className={`trainer-canvas ${ready ? "is-ready" : ""}`} />
    </div>
  );
}
