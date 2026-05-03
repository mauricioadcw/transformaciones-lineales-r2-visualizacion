/* ══════════════════════════════════════════════════════════
   LINEAL TRANSFORM STUDIO  ·  Lógica JavaScript
   Matemática Discreta · 1AMA0708
   ══════════════════════════════════════════════════════════ */

/* ─── DATOS DE APPS REALES ───────────────────────────────── */
const APPS_DATA = [
  {
    icon: "⩺",
    title: "Videojuegos 2D / 3D",
    color: "#ffaa28",
    preview: "Los motores aplican rotaciones y escalados sobre sprites y modelos cada fotograma.",
    desc: "Los motores como Unity o Unreal representan la posición de cada objeto como una matriz de transformación. Cada fotograma, esa matriz se multiplica por los vértices del modelo para obtener la posición en pantalla. Sin álgebra lineal no existirían los movimientos fluidos, la perspectiva de cámara ni las colisiones precisas.",
    transforms: ["Rotación", "Homotecia", "Reflexión eje X"],
    exTitle: "Ejemplos en un motor de juego",
    bullets: [
      "Rotar un personaje al girar: se aplica R(θ) a su posición cada frame.",
      "Efecto espejo al caminar a la izquierda: reflexión sobre el eje Y.",
      "Zoom de cámara: homotecia aplicada al espacio de vista.",
      "Animación de esqueleto: composición de rotaciones por articulación.",
    ],
  },
  {
    icon: "⩺",
    title: "Gráficos por Computadora",
    color: "#3de878",
    preview: "El pipeline de renderizado transforma vértices 3D a píxeles con matrices encadenadas.",
    desc: "El pipeline gráfico de OpenGL/DirectX transforma cada vértice 3D a coordenadas de pantalla con tres matrices: Model (posición del objeto), View (cámara) y Projection (perspectiva). Todo ocurre en la GPU millones de veces por segundo.",
    transforms: ["Rotación", "Homotecia", "Cizallamiento X"],
    exTitle: "Las 3 matrices del pipeline MVP",
    bullets: [
      "Matriz Model: rotar y escalar el objeto en su espacio local.",
      "Matriz View: mover el mundo relativo a la cámara.",
      "Matriz Projection: cizallamiento para simular perspectiva (objetos lejanos se ven pequeños).",
      "Normal Matrix: transpuesta inversa de Model, para iluminación correcta.",
    ],
  },
  {
    icon: "⩺",
    title: "Robótica y Cinemática",
    color: "#28e8b0",
    preview: "La orientación de un brazo robótico se calcula como composición de rotaciones sucesivas.",
    desc: "La cinemática directa calcula la posición del extremo de un brazo a partir de los ángulos de cada articulación. Cada eslabón aplica una rotación y la posición final es el producto de todas esas matrices. Los algoritmos de control invierten este proceso (cinemática inversa) en tiempo real.",
    transforms: ["Rotación", "Reflexión y = x"],
    exTitle: "Cadena cinemática de un brazo de 3 ejes",
    bullets: [
      "Articulación 1 (base): R(θ₁) — gira el brazo horizontalmente.",
      "Articulación 2 (hombro): R(θ₂) — eleva o baja el brazo.",
      "Articulación 3 (codo): R(θ₃) — controla la extensión del antebrazo.",
      "Posición final = M₁ · M₂ · M₃ · punto_origen.",
    ],
  },
  {
    icon: "⩺",
    title: "Visión Artificial",
    color: "#a055ff",
    preview: "Corregir perspectiva, alinear imágenes de satélite o detectar rostros requiere transformaciones afines.",
    desc: "Los sistemas de visión artificial normalizan imágenes antes de analizarlas. Una foto en ángulo necesita corrección de perspectiva (homografía). Los algoritmos de reconocimiento facial alinean rostros antes de compararlos. La realidad aumentada superpone objetos 3D aplicando la transformación inversa de la cámara.",
    transforms: ["Reflexión eje Y", "Homotecia", "Cizallamiento Y"],
    exTitle: "Operaciones en preprocesado de imagen",
    bullets: [
      "Corrección de perspectiva: homografía (cizallamiento + escala).",
      "Data augmentation en deep learning: rotaciones y reflexiones aleatorias.",
      "Normalización de rostros: escalar y rotar para alinear ojos en posición estándar.",
      "Rectificación estéreo: alinear dos cámaras para calcular profundidad.",
    ],
  },
  {
    icon: "⩺",
    title: "Animación y Efectos Visuales",
    color: "#ff3d7a",
    preview: "Las interpolaciones entre fotogramas clave se implementan como combinaciones de rotaciones y escalados.",
    desc: "En animación por computadora, el software interpola automáticamente entre poses clave descomponiendo la matriz en traslación, rotación y escala, e interpolando cada componente por separado. Los efectos de espejo, flip o squash-and-stretch son transformaciones lineales directas.",
    transforms: ["Rotación", "Reflexión eje X", "Reflexión y = −x"],
    exTitle: "Técnicas de animación basadas en transformaciones",
    bullets: [
      "Squash and stretch: homotecia no uniforme para sensación de peso.",
      "Flip horizontal del sprite al cambiar dirección: reflexión sobre eje Y.",
      "Interpolación de rotación entre frames: SLERP (interpolación esférica).",
      "Skinning de personajes: suma ponderada de matrices de huesos.",
    ],
  },
  {
    icon: "⩺",
    title: "Simulación Física",
    color: "#ffd832",
    preview: "La respuesta elástica de materiales y fluidos se modela con tensores de deformación que incluyen cizallamientos.",
    desc: "En mecánica de medios continuos, el tensor de deformación describe cómo se deforma un material bajo fuerzas externas. Este tensor es una combinación de cizallamientos, compresiones y rotaciones. Los simuladores de telas, fluidos y materiales blandos en VFX resuelven ecuaciones diferenciales con estos tensores cada frame.",
    transforms: ["Cizallamiento X", "Cizallamiento Y"],
    exTitle: "Deformaciones en simulación de materiales",
    bullets: [
      "Cizallamiento puro: el material se deforma sin cambiar volumen (det = 1).",
      "Tensión uniaxial: escala en una dirección con cizallamiento lateral.",
      "Simulación de tela: cada triángulo tiene su propio tensor de deformación.",
      "Fluidos incompresibles: el cizallamiento modela la viscosidad del fluido.",
    ],
  },
];

/* Mapa de colores hex por transformación (para pills) */
const TR_COLORS_HEX_MAP = {
  "Rotación":         "#ffaa28",
  "Homotecia":        "#3de878",
  "Reflexión eje X":  "#ff3d7a",
  "Reflexión eje Y":  "#ff7848",
  "Reflexión y = x":  "#a055ff",
  "Reflexión y = −x": "#c040ff",
  "Cizallamiento X":  "#28e8b0",
  "Cizallamiento Y":  "#ffd832",
};

/* ─── CONSTANTES ─────────────────────────────────────────── */
const FIGURAS = {
  "Triángulo": [[0, 2.5], [2, -1.5], [-2, -1.5]],
  "Cuadrado":  [[-1.5, 1.5], [1.5, 1.5], [1.5, -1.5], [-1.5, -1.5]],
  "Flecha":    [[0, .8], [1.8, 0], [0, -.8], [0, -.3], [-1.8, -.3], [-1.8, .3], [0, .3]],
  "Letra F":   [[-1, 2], [-1, -2], [-.2, -2], [-.2, .2], [1, .2], [1, .9], [-.2, .9], [-.2, 2]],
  "Estrella":  [[0, 2.2], [.5, .7], [2.1, .7], [.8, -.3], [1.3, -2], [0, -1], [-1.3, -2], [-.8, -.3], [-2.1, .7], [-.5, .7]],
  "Casa":      [[0, 2.5], [2, .5], [2, -2], [-2, -2], [-2, .5]],
};
const FIG_NAMES = Object.keys(FIGURAS);

const TRANSFORMS = [
  "Rotación", "Homotecia",
  "Reflexión eje X", "Reflexión eje Y", "Reflexión y = x", "Reflexión y = −x",
  "Cizallamiento X", "Cizallamiento Y",
];

const TR_COLORS = {
  "Rotación":         "var(--rot)",
  "Homotecia":        "var(--hom)",
  "Reflexión eje X":  "var(--ref)",
  "Reflexión eje Y":  "var(--ref2)",
  "Reflexión y = x":  "var(--refd)",
  "Reflexión y = −x": "var(--refd2)",
  "Cizallamiento X":  "var(--shrx)",
  "Cizallamiento Y":  "var(--shry)",
};

const TR_COLORS_HEX = {
  "Rotación":         "#ffaa28",
  "Homotecia":        "#3de878",
  "Reflexión eje X":  "#ff3d7a",
  "Reflexión eje Y":  "#ff7848",
  "Reflexión y = x":  "#a055ff",
  "Reflexión y = −x": "#c040ff",
  "Cizallamiento X":  "#28e8b0",
  "Cizallamiento Y":  "#ffd832",
};

/* ─── ESTADO ─────────────────────────────────────────────── */
const state = {
  figIdx: 0,
  trIdx:  0,
  ang:    45,
  esc:    2.0,
  ciz:    1.0,
  showAll:    true,
  showGrid:   true,
  showInfo:   true,
  showAxes:   true,
  ghostMode:  true,
  animActive: false,
  animStep:   0,
  animSteps:  90,
  animFrom:   null,
  animTo:     null,
  animCurrent: null,
  transPts:   {},
  appsPanelOpen: false,
  modalOpen:     false,
  zoom:   1.0,
  panX:   0,
  panY:   0,
  isPanning:  false,
  panSX: 0, panSY: 0, panStartX: 0, panStartY: 0,
  mouseX:    null,
  mouseY:    null,
  hoveredPt: null,
};

/* ─── MATEMÁTICAS ────────────────────────────────────────── */
function deg2rad(d) { return d * Math.PI / 180; }

function getMatrix(name, ang, esc, ciz) {
  const c = Math.cos(deg2rad(ang)), s = Math.sin(deg2rad(ang));
  const m = {
    "Rotación":         [[c, -s], [s,  c]],
    "Homotecia":        [[esc, 0], [0, esc]],
    "Reflexión eje X":  [[1, 0], [0, -1]],
    "Reflexión eje Y":  [[-1, 0], [0, 1]],
    "Reflexión y = x":  [[0, 1], [1, 0]],
    "Reflexión y = −x": [[0, -1], [-1, 0]],
    "Cizallamiento X":  [[1, ciz], [0, 1]],
    "Cizallamiento Y":  [[1, 0], [ciz, 1]],
  };
  return m[name] || [[1, 0], [0, 1]];
}

function applyMatrix(pts, mat) {
  return pts.map(([x, y]) => [
    mat[0][0] * x + mat[0][1] * y,
    mat[1][0] * x + mat[1][1] * y,
  ]);
}

function getMatLabel(name, ang, esc, ciz) {
  const c  = +Math.cos(deg2rad(ang)).toFixed(3);
  const s  = +Math.sin(deg2rad(ang)).toFixed(3);
  const ms = -s;
  const l = {
    "Rotación":         [[`${c}`, `${ms}`], [`${s}`, `${c}`]],
    "Homotecia":        [[`${esc.toFixed(2)}`, "0"], ["0", `${esc.toFixed(2)}`]],
    "Reflexión eje X":  [["1", "0"], ["0", "−1"]],
    "Reflexión eje Y":  [["−1", "0"], ["0", "1"]],
    "Reflexión y = x":  [["0", "1"], ["1", "0"]],
    "Reflexión y = −x": [["0", "−1"], ["−1", "0"]],
    "Cizallamiento X":  [["1", `${ciz.toFixed(2)}`], ["0", "1"]],
    "Cizallamiento Y":  [["1", "0"], [`${ciz.toFixed(2)}`, "1"]],
  };
  return l[name] || [["1", "0"], ["0", "1"]];
}

function recalcular() {
  const fig = FIGURAS[FIG_NAMES[state.figIdx]];
  state.transPts = {};
  for (const name of TRANSFORMS) {
    state.transPts[name] = applyMatrix(fig, getMatrix(name, state.ang, state.esc, state.ciz));
  }
}

function easeInOut(t) { return t * t * (3 - 2 * t); }

function interpPts(a, b, t) {
  return a.map((_, i) => [
    a[i][0] + (b[i][0] - a[i][0]) * t,
    a[i][1] + (b[i][1] - a[i][1]) * t,
  ]);
}

/* ─── CANVAS ─────────────────────────────────────────────── */
const canvas = document.getElementById('main-canvas');
const ctx    = canvas.getContext('2d');
let SCALE = 55;

function resizeCanvas() {
  const wrap = document.getElementById('canvas-wrap');
  canvas.width  = wrap.clientWidth;
  canvas.height = wrap.clientHeight;
  SCALE = Math.min(canvas.width, canvas.height) / 16;
}

function S()          { return SCALE * state.zoom; }
function toScreen(x, y) {
  return [canvas.width / 2 + state.panX + x * S(), canvas.height / 2 + state.panY - y * S()];
}
function toMath(sx, sy) {
  return [(sx - canvas.width / 2 - state.panX) / S(), (-(sy - canvas.height / 2 - state.panY)) / S()];
}

function drawGrid() {
  const w = canvas.width, h = canvas.height;
  const originX = w / 2 + state.panX, originY = h / 2 + state.panY;
  const Sv = S();

  let step = 1;
  if (Sv < 18)       step = 10;
  else if (Sv < 36)  step = 5;
  else if (Sv < 72)  step = 2;
  else if (Sv > 200) step = 0.5;
  if (Sv > 400)      step = 0.25;
  const pxStep = Sv * step;

  const x0 = (-originX) / Sv, x1 = (w - originX) / Sv;
  const y0 = (originY - h) / Sv, y1 = originY / Sv;
  const nxMin = Math.floor(x0 / step) - 1, nxMax = Math.ceil(x1 / step) + 1;
  const nyMin = Math.floor(y0 / step) - 1, nyMax = Math.ceil(y1 / step) + 1;

  for (let n = nxMin; n <= nxMax; n++) {
    const val = n * step, sx = originX + val * Sv;
    ctx.beginPath();
    ctx.strokeStyle = (Number.isInteger(val / 5) && step <= 1) ? '#1e2742' : '#111628';
    ctx.lineWidth = 1;
    ctx.moveTo(sx, 0); ctx.lineTo(sx, h); ctx.stroke();
  }
  for (let n = nyMin; n <= nyMax; n++) {
    const val = n * step, sy = originY - val * Sv;
    ctx.beginPath();
    ctx.strokeStyle = (Number.isInteger(val / 5) && step <= 1) ? '#1e2742' : '#111628';
    ctx.lineWidth = 1;
    ctx.moveTo(0, sy); ctx.lineTo(w, sy); ctx.stroke();
  }

  ctx.strokeStyle = '#374f90'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(0, originY); ctx.lineTo(w, originY); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(originX, 0); ctx.lineTo(originX, h); ctx.stroke();

  function at(x, y, a) {
    ctx.beginPath(); ctx.fillStyle = '#374f90';
    ctx.moveTo(x, y);
    ctx.lineTo(x - 9 * Math.cos(a - .38), y - 9 * Math.sin(a - .38));
    ctx.lineTo(x - 9 * Math.cos(a + .38), y - 9 * Math.sin(a + .38));
    ctx.closePath(); ctx.fill();
  }
  at(w - 6, originY, 0); at(originX, 6, -Math.PI / 2);

  if (state.showAxes) {
    ctx.fillStyle = '#374f90'; ctx.font = '11px DM Mono,monospace';
    ctx.fillText('x', w - 20, originY - 10); ctx.fillText('y', originX + 8, 18);
    ctx.font = '10px DM Mono,monospace';

    for (let n = nxMin; n <= nxMax; n++) {
      if (!n) continue;
      const val = +(n * step).toFixed(10), sx = originX + val * Sv;
      if (sx < 20 || sx > w - 20) continue;
      const lbl = Number.isInteger(val) ? String(val) : val.toFixed(step < 1 ? 2 : 1);
      ctx.strokeStyle = '#374f90'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(sx, originY - 3); ctx.lineTo(sx, originY + 3); ctx.stroke();
      ctx.fillStyle = '#2a3860';
      ctx.fillText(lbl, sx - ctx.measureText(lbl).width / 2, originY + 15);
    }
    for (let n = nyMin; n <= nyMax; n++) {
      if (!n) continue;
      const val = +(n * step).toFixed(10), sy = originY - val * Sv;
      if (sy < 20 || sy > h - 20) continue;
      const lbl = Number.isInteger(val) ? String(val) : val.toFixed(step < 1 ? 2 : 1);
      ctx.strokeStyle = '#374f90'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(originX - 3, sy); ctx.lineTo(originX + 3, sy); ctx.stroke();
      ctx.fillStyle = '#2a3860';
      ctx.fillText(lbl, originX + 6, sy + 4);
    }
  }

  const d = Math.max(w, h);
  ctx.strokeStyle = 'rgba(45,58,95,.5)'; ctx.lineWidth = 1; ctx.setLineDash([4, 6]);
  ctx.beginPath(); ctx.moveTo(originX - d, originY + d); ctx.lineTo(originX + d, originY - d); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(originX - d, originY - d); ctx.lineTo(originX + d, originY + d); ctx.stroke();
  ctx.setLineDash([]);
}

function drawPoly(pts, colorHex, label, ghost = false, lw = 2) {
  if (!pts || pts.length < 2) return;
  const sp = pts.map(([x, y]) => toScreen(x, y));
  if (pts.length >= 3) {
    ctx.beginPath(); ctx.moveTo(...sp[0]);
    for (let i = 1; i < sp.length; i++) ctx.lineTo(...sp[i]);
    ctx.closePath();
    ctx.fillStyle = hexA(colorHex, ghost ? .06 : .10); ctx.fill();
  }
  ctx.beginPath(); ctx.moveTo(...sp[0]);
  for (let i = 1; i < sp.length; i++) ctx.lineTo(...sp[i]);
  ctx.closePath();
  ctx.strokeStyle = ghost ? hexA(colorHex, .22) : colorHex;
  ctx.lineWidth = ghost ? 1 : lw; ctx.stroke();
  if (!ghost) {
    for (const [sx, sy] of sp) {
      ctx.beginPath(); ctx.arc(sx, sy, 3.5, 0, Math.PI * 2); ctx.fillStyle = colorHex; ctx.fill();
      ctx.beginPath(); ctx.arc(sx, sy, 2,   0, Math.PI * 2); ctx.fillStyle = '#07090f'; ctx.fill();
    }
    if (label) {
      const cx2 = sp.reduce((s, [x]) => s + x, 0) / sp.length;
      const cy2 = Math.min(...sp.map(([, y]) => y)) - 16;
      ctx.font = 'bold 10px DM Mono,monospace';
      ctx.fillStyle = colorHex; ctx.textAlign = 'center';
      ctx.fillText(label, cx2, cy2); ctx.textAlign = 'left';
    }
  }
}

function hexA(hex, a) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
}

function drawTooltip() {
  const hp = state.hoveredPt;
  if (!hp) return;
  const [sx, sy] = toScreen(hp.x, hp.y);
  ctx.beginPath(); ctx.arc(sx, sy, 8, 0, Math.PI * 2);
  ctx.strokeStyle = hp.color; ctx.lineWidth = 1.5; ctx.stroke();
  const decimals = S() > 150 ? 3 : S() > 60 ? 2 : 1;
  const txt = `(${hp.x.toFixed(decimals)}, ${hp.y.toFixed(decimals)})`;
  ctx.font = 'bold 11px DM Mono,monospace';
  const tw = ctx.measureText(txt).width;
  const pad = 6, bw = tw + pad * 2, bh = 20;
  let bx = sx + 12, by = sy - 28;
  if (bx + bw > canvas.width - 8)  bx = sx - bw - 12;
  if (by < 8)                       by = sy + 12;
  ctx.fillStyle = '#0d1020'; ctx.strokeStyle = hp.color; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 4); ctx.fill(); ctx.stroke();
  ctx.fillStyle = hp.color;
  ctx.fillText(txt, bx + pad, by + 14);
}

function collectAllPoints() {
  const pts  = [];
  const fig  = FIGURAS[FIG_NAMES[state.figIdx]];
  const tName = TRANSFORMS[state.trIdx];
  const OC   = '#38c4ff';
  fig.forEach(([x, y]) => pts.push({ x, y, label: 'Original', color: OC }));
  if (state.animActive) {
    (state.animCurrent || []).forEach(([x, y]) => pts.push({ x, y, label: tName, color: TR_COLORS_HEX[tName] }));
  } else if (state.showAll) {
    for (const name of TRANSFORMS) {
      const col = TR_COLORS_HEX[name];
      (state.transPts[name] || []).forEach(([x, y]) => pts.push({ x, y, label: name, color: col }));
    }
  } else {
    (state.transPts[tName] || []).forEach(([x, y]) => pts.push({ x, y, label: tName, color: TR_COLORS_HEX[tName] }));
  }
  return pts;
}

function renderCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#111628'; ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (state.showGrid) drawGrid();

  const fig   = FIGURAS[FIG_NAMES[state.figIdx]];
  const tName = TRANSFORMS[state.trIdx];
  const tColor = TR_COLORS_HEX[tName];
  const OC    = '#38c4ff';

  if (state.animActive) {
    if (state.ghostMode) drawPoly(state.animTo, tColor, '', true, 1);
    drawPoly(state.animCurrent, tColor, tName, false, 2);
    drawPoly(fig, OC, 'Original', false, 2);
  } else if (state.showAll) {
    for (const name of TRANSFORMS) {
      if (name === tName) continue;
      drawPoly(state.transPts[name], TR_COLORS_HEX[name], name, true, 1);
    }
    drawPoly(state.transPts[tName], tColor, tName, false, 2);
    drawPoly(fig, OC, 'Original', false, 2);
  } else {
    const pts = state.transPts[tName];
    if (state.ghostMode) drawPoly(pts, tColor, '', true, 1);
    drawPoly(pts, tColor, tName, false, 2);
    drawPoly(fig, OC, 'Original', false, 2);
  }

  drawTooltip();

  if (state.mouseX !== null) {
    const Sv = S();
    const decimals = Sv > 150 ? 3 : Sv > 60 ? 2 : 1;
    const txt = `x: ${state.mouseX.toFixed(decimals)}  y: ${state.mouseY.toFixed(decimals)}`;
    ctx.font = '10px DM Mono,monospace';
    const tw = ctx.measureText(txt).width;
    ctx.fillStyle = 'rgba(7,9,15,0.92)';
    ctx.fillRect(canvas.width - tw - 16, canvas.height - 26, tw + 12, 18);
    ctx.fillStyle = '#a0b4e0';
    ctx.fillText(txt, canvas.width - tw - 10, canvas.height - 12);
  }
}

/* ─── INFO PANEL ─────────────────────────────────────────── */
const FORMULAS = {
  "Rotación":         { main: "T(v) = R(θ)·v",    param: () => `θ = ${state.ang.toFixed(0)}°`,    note: "Preserva longitudes y ángulos" },
  "Homotecia":        { main: "T(v) = k·I·v",     param: () => `k = ${state.esc.toFixed(2)}`,     note: "Escala uniforme desde el origen" },
  "Reflexión eje X":  { main: "T(x,y) = (x, −y)", param: () => "Eje de reflexión: eje X",        note: "Invierte componente vertical" },
  "Reflexión eje Y":  { main: "T(x,y) = (−x, y)", param: () => "Eje de reflexión: eje Y",        note: "Invierte componente horizontal" },
  "Reflexión y = x":  { main: "T(x,y) = (y, x)",  param: () => "Eje: y = x",                     note: "Intercambia coordenadas" },
  "Reflexión y = -x": { main: "T(x,y) = (−y, −x)",param: () => "Eje: y = −x",                   note: "Intercambia e invierte" },
  "Cizallamiento X":  { main: "T(x,y) = (x+k·y, y)",  param: () => `k = ${state.ciz.toFixed(2)}`, note: "Desplaza horizontal según y" },
  "Cizallamiento Y":  { main: "T(x,y) = (x, k·x+y)", param: () => `k = ${state.ciz.toFixed(2)}`, note: "Desplaza vertical según x" },
};

const PROPS = {
  "Rotación":         [{ n: "Lineal", t: 1 }, { n: "Preserva área", t: 1 }, { n: "Isometría", t: 1 }, { n: "det = 1",  t: 1 }],
  "Homotecia":        [{ n: "Lineal", t: 1 }, { n: "Preserva área", t: 0 }, { n: "Isometría", t: 0 }, { n: "det = k²", t: 1 }],
  "Reflexión eje X":  [{ n: "Lineal", t: 1 }, { n: "Preserva área", t: 1 }, { n: "Isometría", t: 1 }, { n: "det = −1", t: 1 }],
  "Reflexión eje Y":  [{ n: "Lineal", t: 1 }, { n: "Preserva área", t: 1 }, { n: "Isometría", t: 1 }, { n: "det = −1", t: 1 }],
  "Reflexión y = x":  [{ n: "Lineal", t: 1 }, { n: "Preserva área", t: 1 }, { n: "Isometría", t: 1 }, { n: "det = −1", t: 1 }],
  "Reflexión y = −x": [{ n: "Lineal", t: 1 }, { n: "Preserva área", t: 1 }, { n: "Isometría", t: 1 }, { n: "det = −1", t: 1 }],
  "Cizallamiento X":  [{ n: "Lineal", t: 1 }, { n: "Preserva área", t: 1 }, { n: "Isometría", t: 0 }, { n: "det = 1",  t: 1 }],
  "Cizallamiento Y":  [{ n: "Lineal", t: 1 }, { n: "Preserva área", t: 1 }, { n: "Isometría", t: 0 }, { n: "det = 1",  t: 1 }],
};

function updateInfo() {
  const name  = TRANSFORMS[state.trIdx];
  const hex   = TR_COLORS_HEX[name];
  const mat   = getMatLabel(name, state.ang, state.esc, state.ciz);
  const f     = FORMULAS[name];
  const props = PROPS[name] || [];

  document.getElementById('tr-name-badge').textContent = name;
  document.getElementById('tr-name-badge').style.color = hex;
  document.getElementById('tr-formula').textContent = f.main;
  document.getElementById('tr-formula').style.color = hex;
  document.getElementById('tr-desc').textContent = f.note;

  document.getElementById('mat-br-l').style.setProperty('--c-tr', hex);
  document.getElementById('mat-br-r').style.setProperty('--c-tr', hex);
  ['m00', 'm01', 'm10', 'm11'].forEach((id, i) =>
    document.getElementById(id).textContent = mat[i >> 1][i & 1]
  );

  document.getElementById('eq-main').textContent  = f.main;
  document.getElementById('eq-param').textContent = f.param();
  document.getElementById('eq-param').style.color = hex;
  document.getElementById('eq-note').textContent  = f.note;

  document.getElementById('prop-grid').innerHTML = props.map(p =>
    `<div class="prop-tag ${p.t ? 'ok' : 'no'}"><span class="prop-icon">${p.t ? '✓' : '✗'}</span>${p.n}</div>`
  ).join('');

  document.querySelectorAll('.mat-cell.diag').forEach(el => el.style.setProperty('--c-tr', hex));
}

/* ─── LEFT SIDEBAR BUILD ─────────────────────────────────── */
function buildSidebar() {
  // Chips de figuras
  const fg = document.getElementById('fig-grid');
  FIG_NAMES.forEach((n, i) => {
    const d = document.createElement('div');
    d.className = 'fig-chip' + (i === state.figIdx ? ' active' : '');
    d.textContent = n;
    d.onclick = () => { state.figIdx = i; recalcular(); refreshSidebar(); };
    fg.appendChild(d);
  });

  // Botones de transformación
  const tl = document.getElementById('tr-list');
  TRANSFORMS.forEach((n, i) => {
    const d = document.createElement('div');
    d.className = 'tr-btn' + (i === state.trIdx ? ' active' : '');
    d.style.setProperty('--c', TR_COLORS[n]);
    d.innerHTML = `<div class="tr-dot"></div><span class="tr-name">${n}</span><span class="tr-key">${i + 1}</span>`;
    d.onclick = () => { state.trIdx = i; refreshSidebar(); updateInfo(); };
    tl.appendChild(d);
  });

  // Opciones de visualización
  const ol = document.getElementById('opt-list');
  [
    { k: 'showAll',   l: 'Mostrar todas',    sc: 'A' },
    { k: 'showGrid',  l: 'Cuadrícula',       sc: 'G' },
    { k: 'showInfo',  l: 'Info matemática',  sc: 'M' },
    { k: 'showAxes',  l: 'Etiquetas ejes',   sc: 'L' },
    { k: 'ghostMode', l: 'Modo fantasma',    sc: 'F' },
  ].forEach(({ k, l, sc }) => {
    const d = document.createElement('div');
    d.className = 'opt-row' + (state[k] ? ' active' : '');
    d.dataset.key = k;
    d.innerHTML = `
      <div class="chk">
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
          <path d="M1 4L3.5 6.5L9 1" stroke="white" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
      </div>
      <span class="opt-label">${l}</span>
      <span class="opt-key">${sc}</span>`;
    d.onclick = () => {
      state[k] = !state[k];
      d.classList.toggle('active', state[k]);
      if (k === 'showInfo') document.getElementById('info-panel').style.display = state[k] ? '' : 'none';
    };
    ol.appendChild(d);
  });
}

function refreshSidebar() {
  document.querySelectorAll('.fig-chip').forEach((el, i) => el.classList.toggle('active', i === state.figIdx));
  document.querySelectorAll('.tr-btn').forEach((el, i) => el.classList.toggle('active', i === state.trIdx));
  updateParams();
  document.getElementById('fig-badge').textContent = FIG_NAMES[state.figIdx];
}

function updateParams() {
  document.getElementById('fill-ang').style.width = ((state.ang + 180) / 360 * 100) + '%';
  document.getElementById('fill-esc').style.width = ((state.esc - .1) / 3.9 * 100) + '%';
  document.getElementById('fill-ciz').style.width = ((state.ciz + 3)  / 6   * 100) + '%';
  document.getElementById('val-ang').textContent  = state.ang.toFixed(0) + '°';
  document.getElementById('val-esc').textContent  = state.esc.toFixed(2);
  document.getElementById('val-ciz').textContent  = state.ciz.toFixed(2);
}

/* Parámetros arrastrables con el mouse */
let dragging = null;
document.querySelectorAll('.param-track').forEach(el => {
  el.addEventListener('mousedown', e => {
    dragging = el.dataset.param;
    setParamFromX(dragging, e.clientX, el);
  });
});
document.addEventListener('mousemove', e => {
  if (!dragging) return;
  setParamFromX(dragging, e.clientX, document.getElementById('track-' + dragging));
});
document.addEventListener('mouseup', () => { dragging = null; });

function setParamFromX(p, clientX, el) {
  const r = el.getBoundingClientRect();
  const t = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
  if (p === 'ang') state.ang = -180 + t * 360;
  if (p === 'esc') state.esc = .1   + t * 3.9;
  if (p === 'ciz') state.ciz = -3   + t * 6;
  recalcular(); updateParams(); updateInfo();
}

/* ─── ANIMACIÓN DE TRANSFORMACIÓN ───────────────────────── */
function launchAnim() {
  const fig  = FIGURAS[FIG_NAMES[state.figIdx]];
  const dest = state.transPts[TRANSFORMS[state.trIdx]];
  state.animFrom    = fig;
  state.animTo      = dest;
  state.animCurrent = fig.map(p => [...p]);
  state.animStep    = 0;
  state.animActive  = true;
  const color = TR_COLORS_HEX[TRANSFORMS[state.trIdx]];
  document.getElementById('anim-fill').style.background  = color;
  document.getElementById('anim-status').textContent     = 'Animando…';
  document.getElementById('anim-status').style.color     = color;
}

function tickAnim() {
  if (!state.animActive) return;
  state.animStep++;
  if (state.animStep >= state.animSteps) {
    state.animActive  = false;
    state.animCurrent = state.animTo;
    document.getElementById('anim-fill').style.width    = '0%';
    document.getElementById('anim-status').textContent  = 'Listo';
    document.getElementById('anim-status').style.color  = 'var(--txt-muted)';
    document.getElementById('anim-pct').textContent     = '—';
    return;
  }
  const t   = easeInOut(state.animStep / state.animSteps);
  state.animCurrent = interpPts(state.animFrom, state.animTo, t);
  const pct = Math.round(t * 100);
  document.getElementById('anim-fill').style.width = pct + '%';
  document.getElementById('anim-pct').textContent  = pct + '%';
}

/* ─── APPS PANEL (derecho) ───────────────────────────────── */
function buildAppsPanel() {
  const body = document.getElementById('apps-panel-body');
  APPS_DATA.forEach(app => {
    const card = document.createElement('div');
    card.className = 'app-card';
    card.style.setProperty('--c-app', app.color);
    card.innerHTML = `
      <div class="app-card-top">
        <span class="app-card-icon">${app.icon}</span>
        <span class="app-card-title">${app.title}</span>
      </div>
      <div class="app-card-preview">${app.preview}</div>
      <div class="app-card-pills-wrap">
        <div class="app-card-pills">
          ${app.transforms.map(t =>
            `<span class="app-pill" style="--c-pill:${TR_COLORS_HEX_MAP[t] || '#4096ff'}">${t}</span>`
          ).join('')}
        </div>
      </div>
      <div class="app-card-hint">Clic para ver más</div>`;
    card.onclick = () => openModal(app);
    body.appendChild(card);
  });
}

function toggleAppsPanel() {
  state.appsPanelOpen = !state.appsPanelOpen;
  document.getElementById('apps-panel').classList.toggle('open', state.appsPanelOpen);
  document.getElementById('apps-tab').classList.toggle('open', state.appsPanelOpen);
  document.body.classList.toggle('apps-open', state.appsPanelOpen);
}
document.getElementById('apps-tab').addEventListener('click', toggleAppsPanel);

/* ─── MODAL ──────────────────────────────────────────────── */
function openModal(app) {
  state.modalOpen = true;
  document.getElementById('modal-icon').textContent  = app.icon;
  document.getElementById('modal-title').textContent = app.title;
  document.getElementById('modal-title').style.color = app.color;
  document.getElementById('modal-header').style.setProperty('--modal-color', app.color);
  document.getElementById('modal-card').style.setProperty('--modal-color', app.color);
  document.getElementById('modal-desc').textContent  = app.desc;
  document.getElementById('modal-pills').innerHTML   = app.transforms.map(t =>
    `<span class="modal-pill" style="--c-pill:${TR_COLORS_HEX_MAP[t] || '#4096ff'}">${t}</span>`
  ).join('');
  document.getElementById('modal-example-title').textContent = app.exTitle;
  document.getElementById('modal-bullets').innerHTML = app.bullets.map(b =>
    `<div class="modal-bullet"><div class="modal-bullet-dot"></div><span>${b}</span></div>`
  ).join('');
  document.getElementById('modal-overlay').classList.add('visible');
  document.getElementById('modal-card').classList.add('visible');
}

function closeModal() {
  state.modalOpen = false;
  document.getElementById('modal-overlay').classList.remove('visible');
  document.getElementById('modal-card').classList.remove('visible');
}

document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('modal-overlay').addEventListener('click', closeModal);
document.getElementById('modal-card').addEventListener('click', e => e.stopPropagation());

/* ─── SPLASH ─────────────────────────────────────────────── */
function hideSplash() {
  document.getElementById('splash').classList.add('hidden');
}
// Solo el botón cierra el splash; clicks en otras zonas no hacen nada
document.getElementById('splash-btn').addEventListener('click', e => { e.stopPropagation(); hideSplash(); });
document.getElementById('splash').addEventListener('click', e => e.stopPropagation());

/* ─── TECLADO ────────────────────────────────────────────── */
document.addEventListener('keydown', e => {
  const splashVisible = !document.getElementById('splash').classList.contains('hidden');
  if (splashVisible) return; // ninguna tecla actúa sobre el splash

  const k = e.key;

  // Modal abierto: solo ESC actúa
  if (state.modalOpen) { if (k === 'Escape') closeModal(); return; }

  // ESC en el simulador → volver al splash
  if (k === 'Escape') { document.getElementById('splash').classList.remove('hidden'); return; }

  if (k >= '1' && k <= '8') {
    const i = parseInt(k) - 1;
    if (i < TRANSFORMS.length) { state.trIdx = i; refreshSidebar(); updateInfo(); }
    return;
  }
  if (k === 'ArrowUp')    { state.trIdx  = (state.trIdx  - 1 + TRANSFORMS.length) % TRANSFORMS.length; refreshSidebar(); updateInfo(); }
  if (k === 'ArrowDown')  { state.trIdx  = (state.trIdx  + 1) % TRANSFORMS.length; refreshSidebar(); updateInfo(); }
  if (k === 'ArrowLeft')  { state.figIdx = (state.figIdx - 1 + FIG_NAMES.length)   % FIG_NAMES.length;  recalcular(); refreshSidebar(); }
  if (k === 'ArrowRight') { state.figIdx = (state.figIdx + 1) % FIG_NAMES.length;  recalcular(); refreshSidebar(); }

  if (k === '+' || k === '=') {
    const n = TRANSFORMS[state.trIdx];
    if      (n === 'Rotación')          state.ang = Math.min(state.ang + 15, 180);
    else if (n === 'Homotecia')         state.esc = Math.min(state.esc + .25, 4);
    else if (n.includes('Cizalla'))     state.ciz = Math.min(state.ciz + .25, 3);
    recalcular(); updateParams(); updateInfo();
  }
  if (k === '-') {
    const n = TRANSFORMS[state.trIdx];
    if      (n === 'Rotación')          state.ang = Math.max(state.ang - 15, -180);
    else if (n === 'Homotecia')         state.esc = Math.max(state.esc - .25, .1);
    else if (n.includes('Cizalla'))     state.ciz = Math.max(state.ciz - .25, -3);
    recalcular(); updateParams(); updateInfo();
  }

  if (k === '[' || (k === '-' && e.ctrlKey)) { e.preventDefault(); state.zoom = Math.max(0.15, +(state.zoom / 1.25).toFixed(4)); }
  if (k === ']' || (k === '+' && e.ctrlKey)) { e.preventDefault(); state.zoom = Math.min(8,    +(state.zoom * 1.25).toFixed(4)); }
  if (k === '0' && e.ctrlKey) { e.preventDefault(); state.zoom = 1.0; }

  if (k === ' ')            { e.preventDefault(); launchAnim(); }
  if (k === 'r' || k === 'R') { state.ang = 45; state.esc = 2; state.ciz = 1; state.animActive = false; recalcular(); updateParams(); updateInfo(); }
  if (k === 'a' || k === 'A') { state.showAll   = !state.showAll;   document.querySelector('[data-key=showAll]').classList.toggle('active',   state.showAll); }
  if (k === 'g' || k === 'G') { state.showGrid  = !state.showGrid;  document.querySelector('[data-key=showGrid]').classList.toggle('active',  state.showGrid); }
  if (k === 'm' || k === 'M') {
    state.showInfo = !state.showInfo;
    document.querySelector('[data-key=showInfo]').classList.toggle('active', state.showInfo);
    document.getElementById('info-panel').style.display = state.showInfo ? '' : 'none';
  }
  if (k === 'l' || k === 'L') { state.showAxes  = !state.showAxes;  document.querySelector('[data-key=showAxes]').classList.toggle('active',  state.showAxes); }
  if (k === 'f' || k === 'F') { state.ghostMode = !state.ghostMode; document.querySelector('[data-key=ghostMode]').classList.toggle('active', state.ghostMode); }
});

/* ─── PAN Y ZOOM CON MOUSE ───────────────────────────────── */
const cw = document.getElementById('canvas-wrap');

cw.addEventListener('wheel', e => {
  e.preventDefault();
  const rect   = canvas.getBoundingClientRect();
  const mx     = e.clientX - rect.left, my = e.clientY - rect.top;
  const [mathX, mathY] = toMath(mx, my);
  const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
  state.zoom   = Math.min(12, Math.max(0.1, state.zoom * factor));
  const [newSx, newSy] = toScreen(mathX, mathY);
  state.panX  += mx - newSx;
  state.panY  += my - newSy;
}, { passive: false });

cw.addEventListener('mousedown', e => {
  if (e.button !== 0) return;
  state.isPanning  = true;
  state.panSX      = e.clientX; state.panSY      = e.clientY;
  state.panStartX  = state.panX; state.panStartY = state.panY;
  canvas.style.cursor = 'grabbing';
});
window.addEventListener('mouseup', () => { state.isPanning = false; canvas.style.cursor = 'crosshair'; });
window.addEventListener('mousemove', e => {
  if (state.isPanning) {
    state.panX = state.panStartX + (e.clientX - state.panSX);
    state.panY = state.panStartY + (e.clientY - state.panSY);
  }
  const rect = canvas.getBoundingClientRect();
  const mx   = e.clientX - rect.left, my = e.clientY - rect.top;
  if (mx >= 0 && mx <= canvas.width && my >= 0 && my <= canvas.height) {
    [state.mouseX, state.mouseY] = toMath(mx, my);
    const allPts = collectAllPoints();
    let best = null, bestD = 14;
    for (const p of allPts) {
      const [sx, sy] = toScreen(p.x, p.y);
      const d = Math.hypot(sx - mx, sy - my);
      if (d < bestD) { bestD = d; best = p; }
    }
    state.hoveredPt = best;
  } else {
    state.mouseX = null; state.mouseY = null; state.hoveredPt = null;
  }
});
cw.addEventListener('mouseleave', () => { state.mouseX = null; state.mouseY = null; state.hoveredPt = null; });
cw.addEventListener('dblclick',  () => { state.zoom = 1; state.panX = 0; state.panY = 0; });

/* ─── LOOP PRINCIPAL ─────────────────────────────────────── */
let fpsFrames = 0, fpsTimer = 0;
function loop() {
  tickAnim();
  renderCanvas();
  fpsFrames++; fpsTimer += 16;
  if (fpsTimer > 600) {
    document.getElementById('fps').textContent = fpsFrames + ' fps';
    fpsFrames = 0; fpsTimer = 0;
  }
  requestAnimationFrame(loop);
}

/* ─── INICIALIZACIÓN ─────────────────────────────────────── */
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
buildSidebar();
buildAppsPanel();
recalcular();
refreshSidebar();
updateInfo();
requestAnimationFrame(loop);