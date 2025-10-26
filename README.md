🌍 Proyecto: Mapas Interactivos de Terremotos 💥🌋

Aplicación web interactiva que permite explorar terremotos en tiempo real mediante mapas dinámicos, con funcionalidades de filtrado, favoritos y autenticación de usuarios.


🔹 Funcionalidades principales
1️⃣ Mapa de terremotos en tiempo real

• Muestra la ubicación de terremotos usando la Earthquake API.

   • Cada marcador incluye un popup con:

      • 📌 Título del evento

      • 🕒 Fecha y hora

      • 🌎 Ubicación

      • 🔢 Código del evento

      • 📊 Magnitud (con tipo de medida)

• Colores de los marcadores según la magnitud (0–7) para fácil visualización.

• Interactividad completa: zoom, desplazamiento y popups informativos.



2️⃣ Mapa filtrable por magnitud y fecha

    •   Filtrado dinámico por:

    •   🎚 Magnitud

    •   📅 Fecha de inicio y fin

    •   Los filtros actualizan el mapa en tiempo real mostrando solo los terremotos que cumplen los criterios.



3️⃣ Favoritos con Firebase Firestore

    • Guardar terremotos como favoritos directamente desde el popup ⭐

    • Evita duplicados en la base de datos.

    • Botones de filtro para alternar entre:

    • 🌐 Todos los terremotos de la API

    • 💖 Favoritos del usuario

    • Eliminar favoritos con un clic desde la vista de favoritos.



4️⃣ Autenticación con Firebase Auth

    • 🔒 Solo los usuarios registrados pueden guardar y gestionar favoritos.

    • Cada usuario ve solo sus propios datos.

    • Login rápido con correo y contraseña mediante Firebase.

| Categoría         | Herramienta                             |
| ----------------- | --------------------------------------- |
| **Frontend**      | HTML, CSS, JavaScript                   |
| **Mapas**         | Leaflet.js                              |
| **API**           | Earthquake API *(datos en tiempo real)* |
| **Base de datos** | Firebase Firestore                      |
| **Autenticación** | Firebase Auth                           |



📱 Diseño Responsive

    • Optimizado para móviles, tablets y escritorio.

    • Formularios en grid adaptable.

    • Mapas escalables automáticamente.

    • Inputs y botones ajustables al tamaño de pantalla.



# Clonar el repositorio
git clone https://github.com/ArturMelik/MAPA_TERREMOTOS.git

    1. Abre index.html en un navegador moderno.

    2. Explora los mapas, aplica filtros y gestiona tus favoritos (login requerido).


🎨 Ejemplos visuales

    🗺 Mapa principal: marcadores con popups informativos.

    🔍 Mapa filtrable: selecciona magnitud y fechas.

    💾 Favoritos: lista de terremotos guardados, con opción de eliminar.



✅ Buenas prácticas

    • No se guardan terremotos repetidos en Firestore.

    • Experiencia de usuario cuidada: colores suaves, tipografía legible y popups claros.

    • Totalmente interactivo y accesible en cualquier dispositivo.

