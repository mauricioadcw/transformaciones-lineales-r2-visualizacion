"""
╔══════════════════════════════════════════════════════════════════════╗
║   LINEAL TRANSFORM STUDIO  ·  Backend Python + pywebview             ║
║   Matemática Discreta · 1AMA0708                                     ║
║                                                                      ║
║   Ejecución:   python main_v3.py                                     ║
╚══════════════════════════════════════════════════════════════════════╝
Empaquetado: pyinstaller --noconfirm --onefile --windowed --add-data "index.html;." main_v3.py
"""

import webview
import numpy as np
import math
import json
import os
import sys


# ═══════════════════════════════════════════════════════════
# API  — funciones expuestas al JavaScript via pywebview
# ═══════════════════════════════════════════════════════════
class TransformAPI:
    """
    Todos los métodos públicos de esta clase son accesibles
    desde JavaScript como:  window.pywebview.api.<método>(args)
    Los valores de retorno se serializan automáticamente a JSON.
    """

    # ── Matrices ────────────────────────────────────────────
    def get_matrix(self, name: str, ang: float, esc: float, ciz: float) -> list:
        """Devuelve la matriz 2x2 como lista [[a,b],[c,d]]."""
        mat = self._build_matrix(name, ang, esc, ciz)
        return mat.tolist()

    def apply_transform(self, name: str, points: list,
                        ang: float, esc: float, ciz: float) -> list:
        """
        Aplica la transformación a una lista de puntos [[x,y], ...].
        Retorna los puntos transformados como lista.
        """
        pts = np.array(points, dtype=float)
        mat = self._build_matrix(name, ang, esc, ciz)
        result = (mat @ pts.T).T
        return result.tolist()

    def apply_all_transforms(self, points: list,
                             ang: float, esc: float, ciz: float) -> dict:
        """
        Aplica todas las transformaciones de una vez.
        Evita 8 roundtrips JS→Python por frame.
        Retorna { "Rotación": [[x,y],...], "Homotecia": [...], ... }
        """
        pts = np.array(points, dtype=float)
        result = {}
        for name in self._transform_names():
            mat = self._build_matrix(name, ang, esc, ciz)
            result[name] = (mat @ pts.T).T.tolist()
        return result

    def get_matrix_label(self, name: str,
                         ang: float, esc: float, ciz: float) -> list:
        """
        Devuelve los valores de la matriz como strings formateados
        para mostrar en el panel info.
        """
        r  = math.radians(ang)
        c  = round(math.cos(r), 3)
        s  = round(math.sin(r), 3)
        ms = round(-s, 3)
        labels = {
            "Rotación":          [[str(c),  str(ms)], [str(s),  str(c)]],
            "Homotecia":         [[f"{esc:.2f}", "0"], ["0", f"{esc:.2f}"]],
            "Reflexión eje X":   [["1",  "0"],  ["0", "-1"]],
            "Reflexión eje Y":   [["-1", "0"],  ["0",  "1"]],
            "Reflexión y = x":   [["0",  "1"],  ["1",  "0"]],
            "Reflexión y = -x":  [["0",  "-1"], ["-1", "0"]],
            "Cizallamiento X":   [["1", f"{ciz:.2f}"], ["0", "1"]],
            "Cizallamiento Y":   [["1", "0"], [f"{ciz:.2f}", "1"]],
        }
        return labels.get(name, [["1","0"],["0","1"]])

    def get_determinant(self, name: str,
                        ang: float, esc: float, ciz: float) -> float:
        """Determinante de la matriz de transformación."""
        mat = self._build_matrix(name, ang, esc, ciz)
        return float(np.linalg.det(mat))

    def get_eigenvalues(self, name: str,
                        ang: float, esc: float, ciz: float) -> dict:
        """
        Autovalores de la matriz (como strings, pueden ser complejos).
        Útil para análisis avanzado.
        """
        mat = self._build_matrix(name, ang, esc, ciz)
        vals = np.linalg.eigvals(mat)
        return {
            "lambda1": str(np.round(vals[0], 4)),
            "lambda2": str(np.round(vals[1], 4)),
        }

    def compose_transforms(self, names: list,
                           ang: float, esc: float, ciz: float) -> list:
        """
        Composición de transformaciones: aplica las matrices en orden.
        names: ["Rotación", "Homotecia", ...]
        Retorna la matriz compuesta como lista.
        """
        result = np.eye(2)
        for name in names:
            mat = self._build_matrix(name, ang, esc, ciz)
            result = mat @ result
        return result.tolist()

    # ── Helpers privados ─────────────────────────────────────
    def _build_matrix(self, name: str, ang: float, esc: float, ciz: float) -> np.ndarray:
        r = math.radians(ang)
        c, s = math.cos(r), math.sin(r)
        matrices = {
            "Rotación":          np.array([[c, -s], [s,  c]]),
            "Homotecia":         np.array([[esc, 0], [0, esc]]),
            "Reflexión eje X":   np.array([[1, 0], [0, -1]]),
            "Reflexión eje Y":   np.array([[-1, 0], [0, 1]]),
            "Reflexión y = x":   np.array([[0, 1], [1, 0]]),
            "Reflexión y = -x":  np.array([[0, -1], [-1, 0]]),
            "Cizallamiento X":   np.array([[1, ciz], [0, 1]]),
            "Cizallamiento Y":   np.array([[1, 0], [ciz, 1]]),
        }
        return matrices.get(name, np.eye(2))

    def _transform_names(self):
        return [
            "Rotación","Homotecia",
            "Reflexión eje X","Reflexión eje Y",
            "Reflexión y = x","Reflexión y = -x",
            "Cizallamiento X","Cizallamiento Y",
        ]


# ═══════════════════════════════════════════════════════════
# UTILIDAD  — ruta correcta al HTML
# ═══════════════════════════════════════════════════════════
def resource_path(relative: str) -> str:
    """
    Resuelve rutas de recursos tanto en desarrollo
    como en ejecutables generados por PyInstaller.
    """
    if hasattr(sys, '_MEIPASS'):
        # PyInstaller extrae archivos en una carpeta temp
        base = sys._MEIPASS
    else:
        base = os.path.dirname(os.path.abspath(__file__))
    return os.path.join(base, relative)


# ═══════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════
def main():
    api  = TransformAPI()
    html = resource_path("frontend/index.html")

    window = webview.create_window(
        title      = "Lineal Transform Studio · Matemática Discreta 1AMA0708",
        url        = f"file://{html}",
        js_api     = api,
        width      = 1280,
        height     = 780,
        min_size   = (900, 600),
        resizable  = True,
        background_color = "#07090f",   # evita flash blanco al cargar
    )

    webview.start(debug=False)   # debug=True abre DevTools


if __name__ == "__main__":
    main()