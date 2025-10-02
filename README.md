# 📊 i-timeGraph
Módulo de visualización jerárquica y temporal de datos de producción Este proyecto es la extensión gráfica del sistema i-time. Mientras que i-time gestiona la captura y almacenamiento de datos de producción, i-timeGraph se encarga de representarlos visualmente, permitiendo un análisis más intuitivo y dinámico.

# 🔗 Relación entre proyectos
i-time → Primer módulo desarrollado. Se centra en la gestión de datos: empleados, categorías, familias y registros de horas.

i-timeGraph → Segundo módulo. Depende de i-time para obtener la información y transformarla en gráficos jerárquicos y temporales.

👉 En otras palabras: sin i-time no hay datos, y sin i-timeGraph no hay visualización.

# 📂 Estructura del repositorio
```bash
i-timeGraph/
├── css/          # Estilos de la interfaz
├── js/           # Scripts de interacción y gráficos
├── media/        # Recursos multimedia (iconos, capturas, imágenes)
├── php/          # Consultas SQL y lógica de servidor
└── index.html    # Página principal de visualización
```
# 🔍 Consultas principales
Listados jerárquicos: selección de categorías, familias, subfamilias y subcategorías.

Horas por empleado: unión entre empleado_asuntoproduccion, empleados y jerarquías.

Filtros dinámicos: por fechas (fechaGrabacion), empleados y niveles jerárquicos.

Inserción de registros: con validación de campos nulos en jerarquías.

# 📈 Visualizaciones
El sistema genera gráficos dinámicos a partir de las consultas SQL, con posibilidad de:

Barras: horas por empleado y categoría

Líneas de tiempo: evolución de horas por fecha

Jerarquías: navegación desde categoría hasta subcategoría2

(La librería de gráficos puede adaptarse: Chart.js, D3.js, etc.)

# 🚀 Instalación y uso
Clonar el repositorio:

```bash
git clone https://github.com/Francisco-Sole/i-timeGraph.git
```
Configurar conexión a la base de datos i-time en los scripts PHP.

Importar el esquema schemas.sql si es necesario.

Abrir index.html en el navegador.

# 👨‍💻 Autor
Francisco Solé 

📍 Barcelona, España 
