# Lineal Transform Studio

**Visualización interactiva de transformaciones lineales en ℝ²**  
Matemática Discreta · 1AMA0708 · Trabajo Grupal TB1

---

## Descripción

Lineal Transform Studio es una aplicación de escritorio que visualiza el efecto geométrico de las transformaciones lineales más importantes del álgebra lineal. El usuario puede aplicar rotaciones, reflexiones, homotecias y cizallamientos sobre distintas figuras planas, observar la animación del proceso y consultar la matriz de transformación en tiempo real.

El proyecto combina un backend en Python (cálculo matricial con NumPy) con una interfaz web renderizada localmente mediante pywebview, lo que permite una UI moderna sin depender de servidores externos ni conexión a internet.

El programa simula el tipo de operaciones que se usan en gráficos por computadora y videojuegos, donde los objetos se mueven, escalan y reflejan continuamente mediante multiplicación matricial. Todas las transformaciones se aplican mediante la operación:

```
P' = M · P
```

donde `M` es la matriz de transformación y `P` el vector de cada punto de la figura.

---

## Capturas
<p align="center">
  <img width="1919" height="989" alt="image" src="https://github.com/user-attachments/assets/b56566a9-9f48-4e1e-94a7-87bc7fa1f168" />
</p>
<p align="center">
  <img width="1919" height="992" alt="image" src="https://github.com/user-attachments/assets/ac224b75-686d-46fe-95ee-486c98c9cdea" />
</p>
<p align="center">  
  <img width="1919" height="987" alt="image" src="https://github.com/user-attachments/assets/185ae585-6359-4527-a376-4f281b6f0dc3" />
</p>

---

## Transformaciones implementadas

| # | Transformación | Matriz | Tecla |
|---|----------------|--------|-------|
| 1 | Rotación | `[[cos θ, −sin θ], [sin θ, cos θ]]` | `1` |
| 2 | Homotecia (escalado uniforme) | `[[k, 0], [0, k]]` | `2` |
| 3 | Reflexión respecto al eje X | `[[1, 0], [0, −1]]` | `3` |
| 4 | Reflexión respecto al eje Y | `[[−1, 0], [0, 1]]` | `4` |
| 5 | Reflexión respecto a y = x | `[[0, 1], [1, 0]]` | `5` |
| 6 | Reflexión respecto a y = −x | `[[0, −1], [−1, 0]]` | `6` |
| 7 | Cizallamiento horizontal (X) | `[[1, k], [0, 1]]` | `7` |
| 8 | Cizallamiento vertical (Y) | `[[1, 0], [k, 1]]` | `8` |

---

## Figuras disponibles

Triángulo · Cuadrado · Flecha · Letra F · Estrella · Casa

---

## Requisitos

- Python **3.11.9** (recomendado)
- Sistema operativo: Windows, macOS o Linux

Las dependencias están listadas en `requirements.txt`:

```
pywebview==6.2.1
numpy==2.4.4
```

---

## Instalación y ejecución

```bash
# 1. Clonar el repositorio
git clone https://github.com/mauricioadcw/lineal-transform-studio.git
cd lineal-transform-studio

# 2. Crear entorno virtual (recomendado)
python -m venv venv

# En Windows:
venv\Scripts\activate

# En macOS / Linux:
source venv/bin/activate

# 3. Instalar dependencias
pip install -r requirements.txt

# 4. Ejecutar
python main.py
```

> **Nota para Linux:** pywebview puede requerir `python3-gi`, `gir1.2-webkit2-4.0` y `libgtk-3-dev`. Instálalos con:
> ```bash
> sudo apt install python3-gi gir1.2-webkit2-4.0 libgtk-3-dev
> ```

---

## Controles

| Acción | Descripción |
|--------|-------------|
| Click en figura | Selecciona la figura a transformar |
| Click en transformación | Cambia la transformación activa |
| `1` … `8` | Selecciona transformación por número |
| `↑` / `↓` | Navega entre transformaciones |
| `←` / `→` | Navega entre figuras |
| `Espacio` | Lanza la animación de la transformación activa |
| `+` / `−` | Ajusta el parámetro (ángulo θ, escala k o cizalla k) |
| `A` | Mostrar / ocultar todas las transformadas simultáneas |
| `G` | Mostrar / ocultar cuadrícula |
| `M` | Mostrar / ocultar panel de matriz |
| `R` | Reiniciar parámetros a valores por defecto |
| Botón `▶` (esquina inferior derecha) | Abre el panel de aplicaciones reales |

---

## Estructura del proyecto

```
lineal-transform-studio/
├── src/           # Todo el código fuente
│   ├── main.py        # Backend Python: API de transformaciones + lanzador de ventana
│   └── frontend/        # Interfaz completa
│       ├── index.html
│       ├── css/
│       │   └── style.css
│       └── js/
│           └── script.js
├── requirements.txt  # Dependencias del proyecto
└── README.md
```

### Arquitectura

```
frontend/index.html  ──(window.pywebview.api)──►  TransformAPI (main.py)
          ▲                                           │
          │                                     numpy (cálculo)
          └──────────── resultado JSON ◄──────────────┘
```

La clase `TransformAPI` expone los siguientes métodos al frontend JavaScript:

| Método | Descripción |
|--------|-------------|
| `get_matrix(name, ang, esc, ciz)` | Devuelve la matriz 2×2 de la transformación |
| `apply_transform(name, points, ...)` | Aplica una transformación a una lista de puntos |
| `apply_all_transforms(points, ...)` | Aplica las 8 transformaciones en una sola llamada |
| `get_matrix_label(name, ...)` | Valores de la matriz formateados como strings |
| `get_determinant(name, ...)` | Determinante de la matriz |
| `get_eigenvalues(name, ...)` | Autovalores (pueden ser complejos) |
| `compose_transforms(names, ...)` | Composición de varias transformaciones en orden |

---

## Detalles técnicos

### Interpolación con ease in-out

Para animar la transformación de forma suave se interpola cuadro a cuadro entre la figura original y la figura transformada:

```
P(t) = (1 − t) · P_origen + t · P_destino
```

donde `t` no avanza de forma lineal sino siguiendo la curva:

```
t_suave = t² · (3 − 2t)
```

Esto produce que el movimiento arranque despacio, acelere en el centro y frene al llegar, imitando el comportamiento físico natural.

### Sistema de coordenadas

El origen `(0, 0)` del plano cartesiano está centrado en la ventana. La conversión a píxeles es:

```
pixel_x = OX + x · SCALE
pixel_y = OY − y · SCALE   ← eje Y invertido (en pantalla crece hacia abajo)
```

---

## Panel de aplicaciones reales

El botón `▶` en la esquina inferior derecha despliega un panel lateral con las áreas donde las transformaciones lineales tienen aplicación directa:

- **Videojuegos 2D / 3D** — movimiento de sprites, cámaras y física de personajes
- **Gráficos por Computadora** — pipeline de renderizado y proyección perspectiva
- **Robótica y Cinemática** — orientación de articulaciones y brazos robóticos
- **Visión Artificial** — corrección de perspectiva y normalización de imágenes
- **Animación y VFX** — interpolación de poses clave y efectos de espejo
- **Simulación Física** — modelado de deformaciones con tensores de cizalla

---

## Empaquetado como ejecutable

Para generar un `.exe` (Windows) o binario standalone:

```bash
pip install pyinstaller

# Windows
pyinstaller src/main.py --onefile --add-data "src/frontend;frontend" --noconsole --name "LinealTransformStudio"

# macOS / Linux
pyinstaller src/main.py --onefile --add-data "src/frontend:frontend" --noconsole --name "LinealTransformStudio"
```

El ejecutable quedará en la carpeta `dist/`.

---

## Autores

Trabajo Grupal — Grupo 6 · Sección 15242 · Ciclo 202610

| Integrante | Código |
|---|---|
| Del Castillo Wan, Mauricio Adriel | U202517849 |
| Ñique Matta, Alessandra Nicolle | U202514929 |
| Bravo Canchanya, Paolo Cesar | U20251B279 |
| Figueroa Huanay, Esteban Alonso | U202512031 |
| Mariño Jacobe, James Christopher | U202511010 |

---

## Créditos académicos

Curso: **Matemática Discreta** · 1AMA0708  
Insumos: Matemática Discreta y Álgebra Lineal  
Referencia: Epp S. (2012). *Discrete Mathematics with Applications*. Cengage Learning.
