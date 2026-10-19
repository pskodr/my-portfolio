import * as THREE from "three";

// Procedural canvas textures. Seeded so the room looks the same on every load.

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function canvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return [c, c.getContext("2d")!] as const;
}

function finish(c: HTMLCanvasElement, repeat: [number, number] = [1, 1]) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(...repeat);
  t.anisotropy = 8;
  return t;
}

export function floorTexture() {
  const [c, g] = canvas(1024, 1024);
  const r = rng(7);
  const rows = 9;
  const h = 1024 / rows;
  for (let i = 0; i < rows; i++) {
    let x = -r() * 400;
    while (x < 1024) {
      const len = 300 + r() * 380;
      const l = 19 + r() * 6;
      g.fillStyle = `hsl(24 ${16 + r() * 8}% ${l}%)`;
      g.fillRect(x, i * h, len, h);
      // grain
      for (let k = 0; k < 14; k++) {
        g.strokeStyle = `rgba(0,0,0,${0.05 + r() * 0.08})`;
        g.lineWidth = 1 + r() * 1.5;
        g.beginPath();
        const y = i * h + r() * h;
        g.moveTo(x, y);
        g.bezierCurveTo(x + len * 0.3, y + (r() - 0.5) * 8, x + len * 0.7, y + (r() - 0.5) * 8, x + len, y);
        g.stroke();
      }
      g.fillStyle = "rgba(0,0,0,0.55)";
      g.fillRect(x, i * h, 2, h);
      x += len;
    }
    g.fillStyle = "rgba(0,0,0,0.6)";
    g.fillRect(0, i * h, 1024, 2);
  }
  return finish(c, [1.5, 1.5]);
}

export function plasterTexture(base = "#2b2c30") {
  const [c, g] = canvas(512, 512);
  const r = rng(3);
  g.fillStyle = base;
  g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 9000; i++) {
    const a = r() * 0.06;
    g.fillStyle = r() > 0.5 ? `rgba(255,255,255,${a})` : `rgba(0,0,0,${a * 1.4})`;
    g.fillRect(r() * 512, r() * 512, 1 + r() * 2, 1 + r() * 2);
  }
  return finish(c, [3, 2]);
}

export function rugTexture() {
  const [c, g] = canvas(1024, 768);
  const r = rng(11);
  g.fillStyle = "#3d3b39";
  g.fillRect(0, 0, 1024, 768);
  // woven noise
  for (let i = 0; i < 26000; i++) {
    g.fillStyle = `rgba(${r() > 0.5 ? "255,250,240" : "0,0,0"},${r() * 0.05})`;
    g.fillRect(r() * 1024, r() * 768, 2, 1);
  }
  g.strokeStyle = "rgba(214,204,186,0.42)";
  g.lineWidth = 6;
  g.strokeRect(40, 40, 944, 688);
  g.lineWidth = 2;
  g.strokeRect(62, 62, 900, 644);
  // quiet geometric field
  g.strokeStyle = "rgba(214,204,186,0.14)";
  g.lineWidth = 2;
  for (let x = 120; x < 920; x += 80) {
    g.beginPath();
    g.moveTo(x, 110);
    g.lineTo(x + 40, 384);
    g.lineTo(x, 658);
    g.stroke();
  }
  return finish(c);
}

export function stripeTexture() {
  const [c, g] = canvas(256, 64);
  g.fillStyle = "#004d98";
  g.fillRect(0, 0, 128, 64);
  g.fillStyle = "#a50044";
  g.fillRect(128, 0, 128, 64);
  // thin pinstripe at each seam
  g.fillStyle = "rgba(237,187,0,0.55)";
  g.fillRect(126, 0, 4, 64);
  return finish(c, [5.5, 1]);
}

export function screenTexture() {
  const [c, g] = canvas(1024, 600);
  const bg = g.createLinearGradient(0, 0, 1024, 600);
  bg.addColorStop(0, "#1b2740");
  bg.addColorStop(1, "#0d1220");
  g.fillStyle = bg;
  g.fillRect(0, 0, 1024, 600);
  // menu bar
  g.fillStyle = "rgba(255,255,255,0.08)";
  g.fillRect(0, 0, 1024, 30);
  g.fillStyle = "rgba(236,235,230,0.8)";
  g.font = "600 17px sans-serif";
  g.fillText("Portfolio", 22, 21);
  // window
  g.fillStyle = "rgba(18,22,34,0.92)";
  g.fillRect(250, 110, 524, 340);
  g.fillStyle = "rgba(255,255,255,0.07)";
  g.fillRect(250, 110, 524, 34);
  g.fillStyle = "rgba(236,235,230,0.85)";
  g.font = "600 18px sans-serif";
  g.fillText("Projects", 272, 133);
  const rows = ["Case studies", "Apps", "Experience", "Résumé", "Contact"];
  rows.forEach((t, i) => {
    g.fillStyle = i === 0 ? "rgba(169,199,255,0.22)" : "rgba(255,255,255,0.04)";
    g.fillRect(272, 162 + i * 54, 480, 42);
    g.fillStyle = "rgba(236,235,230,0.75)";
    g.font = "16px sans-serif";
    g.fillText(t, 292, 189 + i * 54);
  });
  // desktop icons
  ["Projects", "Experience", "Résumé", "Contact"].forEach((t, i) => {
    g.fillStyle = "rgba(169,199,255,0.55)";
    g.fillRect(48, 70 + i * 120, 56, 46);
    g.fillStyle = "rgba(236,235,230,0.7)";
    g.font = "14px sans-serif";
    g.fillText(t, 42, 138 + i * 120);
  });
  const t = finish(c);
  t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
  return t;
}

export function bookSpineTexture() {
  const [c, g] = canvas(128, 256);
  const r = rng(19);
  const colors = ["#5b4636", "#3c4a57", "#6b5a3e", "#4a3a44", "#2f3d36", "#7a6a55"];
  let x = 0;
  while (x < 128) {
    const w = 10 + r() * 14;
    g.fillStyle = colors[Math.floor(r() * colors.length)];
    g.fillRect(x, 0, w, 256);
    g.fillStyle = "rgba(255,255,255,0.18)";
    g.fillRect(x + 2, 40 + r() * 40, w - 4, 3);
    x += w + 1;
  }
  return finish(c);
}

export function fabricTexture(base: string, seed = 5) {
  const [c, g] = canvas(256, 256);
  const r = rng(seed);
  g.fillStyle = base;
  g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 5000; i++) {
    g.fillStyle = `rgba(${r() > 0.5 ? "255,255,255" : "0,0,0"},${r() * 0.05})`;
    g.fillRect(r() * 256, r() * 256, 1, 2);
  }
  return finish(c, [2, 2]);
}
