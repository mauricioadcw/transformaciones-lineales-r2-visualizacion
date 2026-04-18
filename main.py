"""
TRABAJO 02 - Visualización computacional de transformaciones lineales en ℝ²
Matemática Discreta - 1AMA0708
Avance 30% - Semana 03

Transformaciones implementadas:
  - Rotación:    R(θ) = [[cos θ, -sin θ], [sin θ, cos θ]]
  - Homotecia:   H(k) = [[k, 0], [0, k]]
  - Reflexión X: Fx   = [[1, 0], [0, -1]]

Librerías: pygame, numpy, math, sys
"""

import pygame
import numpy as np
import math
import sys

# ── Configuración ──
WIDTH, HEIGHT = 900, 600
SCALE      = 60    # píxeles por unidad
ANIM_STEPS = 60    # fotogramas de duración de cada animación

# ── Colores ──
BG         = (20, 20, 35)
GRID_COLOR = (45, 45, 65)
AXIS_COLOR = (100, 120, 160)
COL_ORIG   = (80, 200, 255)    # azul - figura original
COL_ROT    = (255, 180, 50)    # naranja - rotación
COL_HOM    = (100, 240, 130)   # verde - homotecia
COL_REF    = (255, 80, 120)    # rojo - reflexión
WHITE      = (220, 230, 255)
GRAY       = (140, 150, 170)


# ─────────────────────────────────────────────
# FIGURA: triángulo simple centrado en origen
# ─────────────────────────────────────────────
FIGURA = np.array([
    [0.0,  2.0],
    [1.5, -1.0],
    [-1.5, -1.0],
], dtype=float)

SEGMENTOS = [(0, 1), (1, 2), (2, 0)]


# ─────────────────────────────────────────────
# MATRICES DE TRANSFORMACIÓN
# ─────────────────────────────────────────────
def mat_rotacion(grados):
    r = math.radians(grados)
    return np.array([[math.cos(r), -math.sin(r)],
                     [math.sin(r),  math.cos(r)]])

def mat_homotecia(k):
    return np.array([[k,   0.0],
                     [0.0, k  ]])

def mat_reflexion_x():
    return np.array([[1.0,  0.0],
                     [0.0, -1.0]])

def aplicar(puntos, matriz):
    return (matriz @ puntos.T).T

# ─────────────────────────────────────────────
# ANIMACIÓN: interpolación suave entre figuras
# ─────────────────────────────────────────────
def ease_in_out(t):
    """Curva de aceleración suave: lento → rápido → lento."""
    return t * t * (3 - 2 * t)

class Animacion:
    def __init__(self):
        self.activa   = False
        self.origen   = None   # puntos de inicio
        self.destino  = None   # puntos de fin
        self.actual   = None   # puntos interpolados (lo que se dibuja)
        self.paso     = 0
        self.color    = WHITE
        self.etiqueta = ""

    def iniciar(self, desde, hasta, color, etiqueta):
        self.origen   = desde.copy()
        self.destino  = hasta.copy()
        self.actual   = desde.copy()
        self.paso     = 0
        self.color    = color
        self.etiqueta = etiqueta
        self.activa   = True

    def tick(self):
        """Avanza un fotograma. Devuelve True mientras sigue animando."""
        if not self.activa:
            return False
        if self.paso >= ANIM_STEPS:
            self.activa = False
            self.actual = self.destino.copy()
            return False
        t = ease_in_out(self.paso / ANIM_STEPS)
        self.actual = (1 - t) * self.origen + t * self.destino
        self.paso  += 1
        return True


# ─────────────────────────────────────────────
# CONVERSIÓN COORDENADAS ↔ PANTALLA
# ─────────────────────────────────────────────
PANEL_W = 220
OX = PANEL_W + (WIDTH - PANEL_W) // 2
OY = HEIGHT // 2

def to_screen(x, y):
    return (int(OX + x * SCALE), int(OY - y * SCALE))


# ─────────────────────────────────────────────
# DIBUJO
# ─────────────────────────────────────────────
def draw_grid(surface):
    for n in range(-10, 11):
        x = OX + n * SCALE
        y = OY + n * SCALE
        pygame.draw.line(surface, GRID_COLOR, (x, 0), (x, HEIGHT))
        pygame.draw.line(surface, GRID_COLOR, (0, y), (WIDTH, y))
    # Ejes
    pygame.draw.line(surface, AXIS_COLOR, (0, OY), (WIDTH, OY), 2)
    pygame.draw.line(surface, AXIS_COLOR, (OX, 0), (OX, HEIGHT), 2)
    # Números
    font = pygame.font.SysFont("consolas", 11)
    for n in range(-7, 8):
        if n == 0:
            continue
        lbl = font.render(str(n), True, AXIS_COLOR)
        surface.blit(lbl, (OX + n * SCALE - 6, OY + 6))
        lbl = font.render(str(n), True, AXIS_COLOR)
        surface.blit(lbl, (OX + 6, OY - n * SCALE - 6))

def draw_figure(surface, puntos, color, label, font):
    pts_screen = [to_screen(*p) for p in puntos]
    for i, j in SEGMENTOS:
        pygame.draw.line(surface, color, pts_screen[i], pts_screen[j], 2)
    for p in pts_screen:
        pygame.draw.circle(surface, color, p, 5)
    # Etiqueta junto al primer vértice
    txt = font.render(label, True, color)
    surface.blit(txt, (pts_screen[0][0] + 6, pts_screen[0][1] - 18))

def draw_panel(surface, angulo, escala, modo, anim, font_b, font_s):
    panel = pygame.Rect(0, 0, 220, HEIGHT)
    pygame.draw.rect(surface, (15, 18, 32), panel)
    pygame.draw.line(surface, (50, 60, 90), (220, 0), (220, HEIGHT), 2)

    t = font_b.render("Transformaciones", True, (120, 180, 255))
    surface.blit(t, (14, 14))
    t2 = font_b.render("Lineales en R²", True, (120, 180, 255))
    surface.blit(t2, (14, 36))

    pygame.draw.line(surface, (50, 60, 90), (10, 65), (210, 65))

    instrucciones = [
        ("Teclas:", (180, 180, 200)),
        ("  [1]  Rotación", COL_ROT),
        ("  [2]  Homotecia", COL_HOM),
        ("  [3]  Reflexión X", COL_REF),
        ("  [0]  Mostrar todo", WHITE),
        ("", WHITE),
        ("  [SPACE] Animar", (180, 220, 255)),
        ("  [+]  Aumentar valor", GRAY),
        ("  [-]  Disminuir valor", GRAY),
        ("  [R]  Reiniciar", GRAY),
    ]
    y = 68
    for texto, color in instrucciones:
        s = font_s.render(texto, True, color)
        surface.blit(s, (14, y))
        y += 20

    pygame.draw.line(surface, (50, 60, 90), (10, y + 4), (210, y + 4))
    y += 14

    params = [
        (f"Ángulo θ = {angulo:.0f}°", COL_ROT),
        (f"Escala  k = {escala:.1f}",  COL_HOM),
    ]
    for texto, color in params:
        s = font_s.render(texto, True, color)
        surface.blit(s, (14, y))
        y += 20

    pygame.draw.line(surface, (50, 60, 90), (10, y + 4), (210, y + 4))
    y += 14

    modo_lbl = {0: "Todo", 1: "Rotación", 2: "Homotecia", 3: "Reflexión X"}
    m = font_s.render(f"Modo: {modo_lbl[modo]}", True, WHITE)
    surface.blit(m, (14, y))
    y += 20

    # Estado de la animación
    if anim.activa:
        progreso = int((anim.paso / ANIM_STEPS) * 100)
        barra_w  = int((PANEL_W - 28) * anim.paso / ANIM_STEPS)
        pygame.draw.rect(surface, (40, 50, 70), (14, y + 2, PANEL_W - 28, 10), border_radius=5)
        pygame.draw.rect(surface, anim.color,   (14, y + 2, barra_w,       10), border_radius=5)
        lbl = font_s.render(f"Animando... {progreso}%", True, anim.color)
        surface.blit(lbl, (14, y + 14))
        y += 34
    y += 4

    pygame.draw.line(surface, (50, 60, 90), (10, y), (210, y))
    y += 10

    leyenda = [
        (COL_ORIG, "Original"),
        (COL_ROT,  "Rotación"),
        (COL_HOM,  "Homotecia"),
        (COL_REF,  "Reflexión X"),
    ]
    for col, nombre in leyenda:
        pygame.draw.rect(surface, col, (14, y + 3, 12, 12), border_radius=3)
        s = font_s.render(nombre, True, col)
        surface.blit(s, (32, y))
        y += 20


# ─────────────────────────────────────────────
# BUCLE PRINCIPAL
# ─────────────────────────────────────────────
def main():
    pygame.init()
    screen = pygame.display.set_mode((WIDTH, HEIGHT))
    pygame.display.set_caption("Transformaciones Lineales en R² - Avance 30%")
    clock = pygame.time.Clock()

    font_b = pygame.font.SysFont("segoeui", 16, bold=True)
    font_s = pygame.font.SysFont("segoeui", 13)

    angulo = 45.0
    escala = 2.0
    modo   = 0    # 0=todo, 1=rotación, 2=homotecia, 3=reflexión

    anim = Animacion()

    # Puntos visibles de cada transformación (se actualizan al animar)
    rot_pts   = aplicar(FIGURA, mat_rotacion(angulo))
    hom_pts   = aplicar(FIGURA, mat_homotecia(escala))
    ref_pts   = aplicar(FIGURA, mat_reflexion_x())

    def recalcular():
        nonlocal rot_pts, hom_pts, ref_pts
        rot_pts = aplicar(FIGURA, mat_rotacion(angulo))
        hom_pts = aplicar(FIGURA, mat_homotecia(escala))
        ref_pts = aplicar(FIGURA, mat_reflexion_x())

    def lanzar_animacion():
        """Inicia animación de la transformación activa (modo 1-3)."""
        if modo == 1:
            anim.iniciar(FIGURA, rot_pts, COL_ROT, f"R({angulo:.0f}°)")
        elif modo == 2:
            anim.iniciar(FIGURA, hom_pts, COL_HOM, f"H(k={escala:.1f})")
        elif modo == 3:
            anim.iniciar(FIGURA, ref_pts, COL_REF, "Refl. X")

    running = True
    while running:
        clock.tick(60)

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False

            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_1:
                    modo = 1
                elif event.key == pygame.K_2:
                    modo = 2
                elif event.key == pygame.K_3:
                    modo = 3
                elif event.key == pygame.K_0:
                    modo = 0
                elif event.key in (pygame.K_PLUS, pygame.K_EQUALS):
                    if modo == 1: angulo = min(angulo + 15, 180)
                    if modo == 2: escala = min(escala + 0.5, 4.0)
                    recalcular()
                elif event.key == pygame.K_MINUS:
                    if modo == 1: angulo = max(angulo - 15, -180)
                    if modo == 2: escala = max(escala - 0.5, 0.5)
                    recalcular()
                elif event.key == pygame.K_r:
                    angulo = 45.0
                    escala = 2.0
                    modo   = 0
                    anim.activa = False
                    recalcular()
                elif event.key == pygame.K_SPACE:
                    lanzar_animacion()

        # Avanzar animación
        anim.tick()

        # ── Dibujar ──
        screen.fill(BG)

        # Canvas (zona del plano cartesiano)
        canvas = screen.subsurface(pygame.Rect(PANEL_W, 0, WIDTH - PANEL_W, HEIGHT))
        draw_grid(canvas)

        # Dibujar transformadas estáticas (semitransparentes si hay animación activa)
        if not anim.activa:
            if modo == 0 or modo == 2:
                draw_figure(canvas, hom_pts, COL_HOM, f"H(k={escala:.1f})", font_s)
            if modo == 0 or modo == 3:
                draw_figure(canvas, ref_pts, COL_REF, "Refl. X", font_s)
            if modo == 0 or modo == 1:
                draw_figure(canvas, rot_pts, COL_ROT, f"R({angulo:.0f}°)", font_s)
        else:
            # Durante la animación: mostrar destino semitransparente como guía
            target_surf = pygame.Surface(canvas.get_size(), pygame.SRCALPHA)
            destino_pts = anim.destino
            pts_screen  = [to_screen(*p) for p in destino_pts]
            for i, j in SEGMENTOS:
                pygame.draw.line(target_surf, (*anim.color, 50),
                                 pts_screen[i], pts_screen[j], 2)
            canvas.blit(target_surf, (0, 0))

            # Figura animada (interpolada)
            draw_figure(canvas, anim.actual, anim.color, anim.etiqueta, font_s)

        # Figura original siempre visible encima
        draw_figure(canvas, FIGURA, COL_ORIG, "Original", font_s)

        draw_panel(screen, angulo, escala, modo, anim, font_b, font_s)

        pygame.display.flip()

    pygame.quit()
    sys.exit()


if __name__ == "__main__":
    main()