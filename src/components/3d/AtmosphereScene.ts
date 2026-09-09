import {
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  SphereGeometry,
  TorusGeometry,
  BoxGeometry,
  IcosahedronGeometry,
} from "three";

export function createAtmosphere() {
  const group = new Group();
  const instrument = new Group();
  const globe = new Mesh(
    new SphereGeometry(1.05, 28, 20),
    new MeshStandardMaterial({
      color: 0x0c345b,
      metalness: 0.45,
      roughness: 0.45,
    }),
  );
  instrument.add(globe);
  instrument.add(
    new Mesh(
      new SphereGeometry(1.065, 24, 14),
      new MeshBasicMaterial({
        color: 0x55bbef,
        wireframe: true,
        transparent: true,
        opacity: 0.23,
      }),
    ),
  );
  [1.45, 1.82, 2.12].forEach((radius, i) => {
    const ring = new Mesh(
      new TorusGeometry(radius, 0.008, 6, 96),
      new MeshBasicMaterial({
        color: i === 1 ? 0x38bdf8 : 0x38719d,
        transparent: true,
        opacity: 0.65,
      }),
    );
    ring.rotation.set(Math.PI / 2.5 + i * 0.3, i * 0.3, 0.15);
    group.add(ring);
  });
  for (let i = 0; i < 10; i++) {
    const node = new Mesh(
      new IcosahedronGeometry(i % 3 === 0 ? 0.06 : 0.025, 0),
      new MeshBasicMaterial({ color: 0x7dd3fc }),
    );
    const angle = (i * Math.PI * 2) / 10;
    node.position.set(
      Math.cos(angle) * 1.85,
      Math.sin(angle) * 1.3,
      Math.sin(angle * 2) * 0.7,
    );
    group.add(node);
  }
  const board = new Group();
  const plate = new Mesh(
    new BoxGeometry(1.7, 0.95, 0.06),
    new MeshStandardMaterial({
      color: 0x123e64,
      metalness: 0.3,
      roughness: 0.5,
    }),
  );
  board.add(plate);
  for (let i = 0; i < 5; i++) {
    const bar = new Mesh(
      new BoxGeometry(0.15, 0.16 + i * 0.1, 0.025),
      new MeshBasicMaterial({ color: i > 2 ? 0x7dd3fc : 0x0969da }),
    );
    bar.position.set(-0.55 + i * 0.27, -0.24 + i * 0.05, 0.05);
    board.add(bar);
  }
  board.position.set(0.85, -0.8, 1.05);
  board.rotation.set(-0.08, -0.25, 0);
  group.add(instrument, board);
  return { group, instrument, board };
}
