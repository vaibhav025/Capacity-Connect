interface VantaEffect {
  destroy(): void;
  resize(): void;
  renderer?: { dispose(): void; forceContextLoss(): void };
}
declare module "vanta/dist/vanta.net.min.js" {
  export default function NET(options: {
    el: HTMLElement;
    THREE: typeof import("three");
    mouseControls: boolean;
    touchControls: boolean;
    gyroControls: boolean;
    minHeight: number;
    minWidth: number;
    scale: number;
    scaleMobile: number;
    color: number;
    backgroundColor: number;
    points: number;
    maxDistance: number;
    spacing: number;
    showDots: boolean;
  }): VantaEffect;
}
