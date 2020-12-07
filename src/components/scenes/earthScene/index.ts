import {
  Mesh,
  MeshBasicMaterial,
  Scene,
  SphereBufferGeometry,
  TextureLoader,
} from "three";

const geometry = new SphereBufferGeometry(500, 60, 40);
// invert the geometry on the x-axis so that all of the faces point inward
geometry.scale(-1, 1, 1);

const scene = new Scene();

const texture = new TextureLoader().load("earth.jpg");
const material = new MeshBasicMaterial({ map: texture });

const mesh = new Mesh(geometry, material);

scene.add(mesh);

export { scene as earthScene };
