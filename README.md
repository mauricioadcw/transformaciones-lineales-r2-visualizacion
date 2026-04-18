# Transformaciones Lineales en ℝ² — Avance 30%

**Trabajo Grupal TB · Matemática Discreta (1AMA0708)**  
Trabajo 02: Visualización computacional de transformaciones lineales en ℝ²

---

## Descripción

Aplicación interactiva desarrollada en Python con Pygame que visualiza el efecto de transformaciones lineales sobre una figura geométrica en el plano cartesiano ℝ². Cada transformación se representa mediante su matriz correspondiente y puede animarse de forma progresiva para facilitar su comprensión visual.

El programa simula el tipo de operaciones que se usan en gráficos por computadora y videojuegos, donde los objetos se mueven, escalan y reflejan continuamente mediante multiplicación matricial.

---

## Transformaciones implementadas

| Transformación | Matriz | Tecla |
|---|---|---|
| Rotación | `R(θ) = [[cos θ, −sin θ], [sin θ, cos θ]]` | `1` |
| Homotecia (escala) | `H(k) = [[k, 0], [0, k]]` | `2` |
| Reflexión eje X | `Fx = [[1, 0], [0, −1]]` | `3` |

Todas se aplican mediante la operación `P' = M · P`, donde `M` es la matriz de transformación y `P` el vector de cada punto de la figura.

---

## Requisitos

- Python 3.8 o superior
- pygame
- numpy

Instalar dependencias:

```bash
pip install pygame numpy
```

---

## Ejecución

```bash
python main.py
```

---

## Controles

| Tecla | Acción |
|---|---|
| `1` | Seleccionar modo Rotación |
| `2` | Seleccionar modo Homotecia |
| `3` | Seleccionar modo Reflexión en X |
| `0` | Mostrar todas las transformaciones a la vez |
| `SPACE` | Animar la transformación seleccionada |
| `+` | Aumentar ángulo (modo 1) / escala (modo 2) |
| `-` | Disminuir ángulo (modo 1) / escala (modo 2) |
| `R` | Reiniciar valores por defecto |

> **Nota:** la animación solo se lanza en los modos 1, 2 o 3. En modo 0 se muestran todas las figuras transformadas simultáneamente sin animar.

---

## Estructura del código

```
main.py
│
├── Constantes y colores
├── FIGURA / SEGMENTOS          # triángulo por defecto en ℝ²
│
├── mat_rotacion(grados)        # genera matriz de rotación R(θ)
├── mat_homotecia(k)            # genera matriz de escala H(k)
├── mat_reflexion_x()           # genera matriz de reflexión Fx
├── aplicar(puntos, matriz)     # multiplica M · P para todos los puntos
│
├── ease_in_out(t)              # curva de aceleración suave: t²(3 − 2t)
├── class Animacion             # maneja la interpolación entre figuras
│   ├── iniciar(desde, hasta, color, etiqueta)
│   └── tick()                  # avanza un fotograma
│
├── to_screen(x, y)             # convierte coordenadas ℝ² → píxeles
├── draw_grid(surface)          # dibuja plano cartesiano con ejes y grilla
├── draw_figure(...)            # dibuja una figura a partir de sus puntos
├── draw_panel(...)             # dibuja el panel lateral de controles
│
└── main()                      # bucle principal de Pygame (60 FPS)
```

---

## Detalles técnicos

**Interpolación lineal con ease in-out**

Para animar la transformación de forma suave se interpola cuadro a cuadro entre la figura original y la figura transformada usando la fórmula:

```
P(t) = (1 − t) · P_origen + t · P_destino
```

donde `t` no avanza de forma lineal sino siguiendo la curva:

```
t_suave = t² · (3 − 2t)
```

Esto produce que el movimiento arranque despacio, acelere en el centro y frene al llegar, imitando el comportamiento físico natural.

**Sistema de coordenadas**

El origen `(0, 0)` del plano cartesiano está centrado en la ventana. La conversión a píxeles es:

```
pixel_x = OX + x · SCALE
pixel_y = OY − y · SCALE   ← eje Y invertido porque en pantalla crece hacia abajo
```

---

## Próximos avances

- Reflexión sobre el eje Y y la recta y = x
- Entrada de puntos personalizados por el usuario
- Sliders para ajustar ángulo y escala en tiempo real
- Visualización de la matriz aplicada en pantalla
- Comparación simultánea con animación de todas las transformaciones

---

## Autores

Trabajo Grupal — Grupo 6

- Del Castillo Wan, Mauricio Adriel - U202517849
- Ñique Matta, Alessandra Nicolle - U202514929
- Bravo Canchanya, Paolo Cesar - U20251B279
- Figueroa Huanay, Esteban Alonso - U202512031
- Mariño Jacobe, James Christopher - U202511010

Curso: Matemática Discreta · Sección 15242 · Ciclo 202610
