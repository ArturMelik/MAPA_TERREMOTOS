🌍 Proyecto: Mapas Interactivos de Terremotos 💥🌋

Este proyecto es una aplicación web interactiva que permite explorar terremotos en tiempo real mediante mapas dinámicos, con funcionalidades de filtrado, favoritos y autenticación de usuarios.

🔹 Funcionalidades principales
1️⃣ Mapa de terremotos en tiempo real

Muestra la ubicación de terremotos usando la API de Earthquake.

Cada marcador incluye un popup con:

📌 Título del evento

🕒 Fecha y hora

🌎 Ubicación

🔢 Código del evento

📊 Magnitud (con tipo de medida)

Colores de los marcadores según la magnitud (0–7) para fácil visualización.

Interactividad completa: zoom, desplazamiento y popups informativos.

2️⃣ Mapa filtrable por magnitud y fecha

Filtrado dinámico de terremotos por:

🎚 Magnitud

📅 Fecha de inicio y fin

Los filtros actualizan el mapa en tiempo real mostrando solo los terremotos que cumplen los criterios.

3️⃣ Favoritos con Firebase Firestore

Guardar terremotos como favoritos directamente desde el popup: ⭐

Evita duplicados en la base de datos.

Botones de filtro para alternar entre:

🌐 Todos los terremotos de la API

💖 Favoritos del usuario

Eliminar favoritos con un clic desde la vista de favoritos.

4️⃣ Autenticación con Firebase Auth

Solo los usuarios registrados pueden guardar y gestionar favoritos. 🔒

Cada usuario ve solo sus propios favoritos.

Login rápido con correo y contraseña mediante Firebase.

🛠 Tecnologías utilizadas

Frontend: HTML, CSS, JavaScript

Mapas: Leaflet.js

API: Earthquake API (datos de terremotos en tiempo real)

Base de datos: Firebase Firestore

Autenticación: Firebase Auth

📱 Diseño responsive

Optimizado para móviles, tablets y escritorio

Grid de formularios adaptable y mapas que escalan automáticamente

Inputs y botones que se ajustan al tamaño de la pantalla

🚀 Cómo usar el proyecto

Clonar el repositorio:

git clone : https://github.com/ArturMelik/MAPA_TERREMOTOS.git


Abrir index.html en un navegador moderno.

Explorar los mapas, filtrar terremotos y gestionar favoritos (login requerido).

🎨 Ejemplos visuales

Mapa principal: marcadores de terremotos con popups informativos.

Mapa filtrable: selecciona magnitud y fechas para ver solo terremotos relevantes.

Favoritos: lista de terremotos guardados, con opción de eliminar.

✅ Buenas prácticas incluidas

No se guardan terremotos repetidos en Firestore.

Experiencia de usuario cuidada: colores claros, tipografía legible y popups informativos.

Mapas interactivos y fáciles de usar en cualquier dispositivo.# MAPA_TERREMOTOS
