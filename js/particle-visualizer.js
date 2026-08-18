import { createParticleObject } from "./particle-object.js";

const TECH_MAP = {
  jsc: "img/jsc-logo.svg",
};

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("about-logo-canvas");
  if (!canvas) return;

  // Initialize the particle monogram JSC in the About Me section
  createParticleObject(
    { canvas },
    {
      src: TECH_MAP.jsc,
      count: 4000,
      size: 2.2,
      sizeVariance: 0.4,
      drift: 0.5,
      orbit: false,
      zoom: false,
      spring: 0.96,
      damping: 0.35,
      strength: 1.8,
      radius: 45,
      swirl: 0.7,
      scale: 1.5,
      autoRotate: false,
      autoRotateSpeed: 0.0,
      background: "",
    }
  );
});
