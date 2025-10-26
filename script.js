//  Dibujar en un mapa utilizando Leaflet.

const map = L.map('map').setView([20, 0], 2); // vista global

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

//Petición HTTP para obtener los terremotos disponibles en la API.

async function getData(){
    try{
        const res = await fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson");
        const data = await res.json();
        return data.features;
    }
    catch(e){
        console.log(e);
    }
}

// //Marcador 
// const markerMap = L.marker([51.5, -0.09])
// .bindPopup("cheese house")
// .addTo(map);


//Dibujar los marcadores de cada terremoto en el mapa
//Añadir popup en cada marcador con los siguientes datos:


getData().then(data => {
    data.forEach(pin => {
        const coords = [pin.geometry.coordinates[1], pin.geometry.coordinates[0]];
        const props = pin.properties;
        const mag = props.mag;

        let color;
        if(mag < 1) color = '#f0f0f0';
        else if(mag < 2) color = '#1d8919';
        else if(mag < 3) color = '#8e911c';
        else if(mag < 4) color = '#f9f016';
        else if(mag < 5) color = '#f6ce1d';
        else if(mag < 6) color = '#fc9d16';
        else if(mag < 7) color = '#f61719';
        else if(mag < 8) color = "#f818fa";
        else color = 'black';

        const marker = L.circleMarker(coords, {
            radius: mag * 3,
            color: color,
            fillColor: color,
            fillOpacity: 0.7,
            weight: 1
        }).addTo(map);

        const fechaEvento = new Date(props.time).toLocaleString();
        
        // Preparar datos del terremoto para guardar
        const earthquakeData = {
            title: props.title,
            place: props.place,
            code: props.code,
            magnitude: props.mag,
            magType: props.magType,
            url:props.url,
            time: props.time,
            coordinates: pin.geometry.coordinates
        };

        // Convertir a JSON y escapar comillas
        const dataStr = JSON.stringify(earthquakeData).replace(/"/g, '&quot;');

        marker.bindPopup(`
            <div class="earthquake-popup">
                <b>${props.title}</b><br>
                <strong>Fecha del evento:</strong> ${fechaEvento}<br>
                <strong>Ubicación:</strong> ${props.place}<br>
                <strong>Código:</strong> ${props.code}<br>
                <strong>Magnitud:</strong> ${props.mag} (${props.magType})<br>
                <a href="${props.url}" target="_blank">Ver en USGS 🌍</a>

                <button onclick='addToFavorites("${pin.id}", ${dataStr})'">
                    ⭐Añadir a Favoritos
                </button>
            </div>
        `);
    });
});



/* Dibuja un segundo mapa en la misma pantalla con las coordenadas de posiciones donde hay terremotos filtrando por magnitud y por fecha de inicio/fin
Revisar el funcionamiento de los endpoints dados para:

Añadir filtro por magnitud en el HTML
Input magnitud

Añadir filtro por fechas en el HTML
Input start date
Input end date*/

const mapFiltered = L.map('mapFiltered').setView([20, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(mapFiltered);



//Marcador segun fecha.
function dibujarTerremotosEnMapa(mapTarget, data) {
    mapTarget.eachLayer(layer => {
        if(layer instanceof L.Marker || layer instanceof L.CircleMarker) mapTarget.removeLayer(layer);
    });

    data.forEach(pin => {
        const coords = [pin.geometry.coordinates[1], pin.geometry.coordinates[0]];
        const props = pin.properties;

    
        let color = 'green';
        const mag = props.mag;
        if(mag < 1) color = '#f0f0f0';
        else if(mag < 2) color = '#1d8919';
        else if(mag < 3) color = '#8e911c';
        else if(mag < 4) color = '#f9f016';
        else if(mag < 5) color = '#f6ce1d';
        else if(mag < 6) color = '#fc9d16';
        else if(mag < 7) color = '#f61719';
        else if(mag < 8) color = "#f818fa";

        const marker = L.circleMarker(coords, {
            radius: mag * 3,
            color: color,
            fillColor: color,
            fillOpacity: 0.7,
            weight: 1
        }).addTo(mapTarget);

        const fechaEvento = new Date(props.time).toLocaleString();
        marker.bindPopup(`
            <b>${props.title}</b><br>
            <strong>Fecha:</strong> ${fechaEvento}<br>
            <strong>Ubicación:</strong> ${props.place}<br>
            <strong>Código:</strong> ${props.code}<br>
            <strong>Magnitud:</strong> ${props.mag} (${props.magType})
           

        `);
    });
}


// Función para obtener datos filtrados de terremotos según magnitud y fechas
async function getDataFiltered(minMag = 0, startDate = null, endDate = null) {
    try {
        // Construir endpoint con query parameters
        let url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minmagnitude=${minMag}`;
        if(startDate) url += `&starttime=${startDate}`;
        if(endDate) url += `&endtime=${endDate}`;

        const res = await fetch(url);
        const data = await res.json();
        return data.features;
    } catch(e) {
        console.log(e);
        return [];
    }
}

// Event listener para el botón de filtrado
document.getElementById('filterBtn').addEventListener('click', async () => {
    const minMag = parseFloat(document.getElementById('minMag').value);
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    const dataFiltrada = await getDataFiltered(minMag, startDate, endDate);
    dibujarTerremotosEnMapa(mapFiltered, dataFiltrada);
});



/*******************  3. Firebase Firestore.    ******************/
const firebaseConfig = {
  apiKey: "AIzaSyA679g1f_BUBtCH_zWjwwLqsfwmDDkFEvk",
  authDomain: "fir-web-edb1a.firebaseapp.com",
  projectId: "fir-web-edb1a",
  storageBucket: "fir-web-edb1a.firebasestorage.app",
  messagingSenderId: "565813690025",/*  */
  appId: "1:565813690025:web:98ad2051d9aa9ca718b3b8"
};

firebase.initializeApp(firebaseConfig);// Inicializaar app Firebase

const db = firebase.firestore();// db representa mi BBDD //inicia Firestore // Representa todo el dashboard.


// Creacion del usuario.

const createUser = (user) => {
  db.collection("users")
    .doc(user.id) // Usar el UID del usuario como ID del documento en Firestore
    .set({
      email: user.email,
      favorites: [] // Crear array de favoritos vacío
    })
    .then(() => console.log("Usuario creado con ID: ", user.id))
    .catch((error) => console.error("Error creando usuario: ", error));
};


// Sign up
const signUpUser = (email, password) => {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      let user = userCredential.user;
      console.log(`se ha registrado ${user.email} ID:${user.uid}`)
      // ...
      // Saves user in firestore
      createUser({
        id: user.uid,
        email: user.email
      });

    })
    .catch((error) => {
      console.log("Error en el sistema" + error.message, "Error: " + error.code);
    });
    
};

document.getElementById("form1").addEventListener("submit", function (event) {
  event.preventDefault();
  let email = event.target.elements.email.value;
  let pass = event.target.elements.pass.value;
  let pass2 = event.target.elements.pass2.value;



  //REGEX

  
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
  
  if (!passwordRegex.test(pass)) {
    Swal.fire({
    title: "¡Error!",
    text: "La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula y un número",
    icon: "error",
    timer: 3000,
    showConfirmButton: false
  });
    return; // Detiene el envío del formulario
  }


  if (pass === pass2) {
    signUpUser(email, pass);
    Swal.fire({
    title: "¡REGISTRADO!",
    text: "Ya tienes nueva cuenta",
    icon: "success",
    timer: 2000,
    showConfirmButton: false
  });
  // Limpiar formulario y localStorage después de enviar
  localStorage.removeItem("form_data");
  event.target.reset();
  console.log("LocalStorage limpiado después del envío"); //Clcik limpiar localstage
} else {
  Swal.fire({
    title: "Uups",
    text: "Las contraseñas no coinciden",
    icon: "error",
    timer: 2000,
    showConfirmButton: false
  });
}
})




// Sign in
const signInUser = (email, password) => {
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log(`Se ha logado ${user.email} ID:${user.uid}`);

      Swal.fire({
        text: "✅ Acabas de acceder al sistema",
        icon: "success",
        timer: 2000,
        showConfirmButton: false
      });
    })


  /////////PREGUNTAAAAAAAR//////////



    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);

      // Muestra un mensaje personalizado según el tipo de error
 let mensaje = "Ocurrió un error al iniciar sesión";

      // switch (errorCode) {
      //   case "auth/invalid-email":
      //     mensaje = "El formato del correo electrónico no es válido.";
      //     break;
      //   case "auth/user-not-found":
      //     mensaje = "No existe una cuenta con ese correo.";
      //     break;
      //   case "auth/wrong-password":
      //     mensaje = "La contraseña es incorrecta.";
      //     break;
      //   case "auth/missing-password":
      //     mensaje = "Por favor, introduce una contraseña.";
      //     break;
      //   default:
      //     mensaje = "Error: " + errorMessage;
      // }
      Swal.fire({
        icon: "error",
        title: "Error al iniciar sesión",
        text: "Email o contraseña incorrecto",
        confirmButtonText: "Entendido"
      });
    });
};
document.getElementById("form2").addEventListener("submit", function (event) {
  event.preventDefault();
  let email = event.target.elements.email2.value;
  let pass = event.target.elements.pass3.value;
  signInUser(email, pass)
})


// Sign out user
const signOut = () => {
  let user = firebase.auth().currentUser;

  firebase.auth().signOut().then(() => {
    Swal.fire({
    title: "",
    text: "Acabas de salir del sistema",
    icon: "success",
    timer: 2000,
    showConfirmButton: false
  });
  }).catch((error) => {
    console.log("hubo un error: " + error);
  });
}

document.getElementById("salir").addEventListener("click", signOut);



//Cambio de estado de autenticacion

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    console.log(`Está en el sistema:${user.email} ${user.uid}`);
    document.getElementById("message").innerText = `Esta en el sistema: ID: ${user.uid}`;
  } else {
    console.log("no hay usuarios en el sistema");
    document.getElementById("message").innerText = `No hay usuarios en el sistema`;
  }
});


//Añadir favoritos


let currentView = 'api';

// Función para añadir terremotos a favoritos del usuario
const addToFavorites = (earthquakeId, earthquakeData) => {
  const user = firebase.auth().currentUser;

  if (!user) {
    Swal.fire({
    title: "Uups",
    text: "Debes estar registrado para añadir favoritos",
    icon: "error",
    timer: 2000,
    showConfirmButton: false
  });
  }

  const userRef = db.collection('users').doc(user.uid);

  userRef.get()
    .then((doc) => {
      if (doc.exists) {
        const favorites = doc.data().favorites || [];
        
        // Verificar si ya existe
        const alreadyExists = favorites.some(fav => fav.id === earthquakeId);
        
        if (alreadyExists) {
          Swal.fire({
    title: "Uups",
    text: "Este terremoto ya está en tus favoritos.",
    icon: "error",
    timer: 2000,
    showConfirmButton: false
  });
          return;
        }
        
        const updatedFavorites = [...favorites, { id: earthquakeId, ...earthquakeData }];

        userRef.update({ favorites: updatedFavorites })
          .then(() => {
            Swal.fire({
    title: "✅",
    text: "Terremoto añadido a favoritos",
    icon: "success",
    timer: 2000,
    showConfirmButton: false
  });
          })
          .catch((error) => {
            console.error('Error actualizando favoritos: ', error);
            alert('Error al añadir a favoritos.');
          });
      } else {
        console.log('No se encontró el usuario.');
      }
    })
    .catch((error) => {
      console.error('Error: ', error);
    });
};

// Función para eliminar terremoto de favoritos
const removeFromFavorites = (earthquakeId) => {
  const user = firebase.auth().currentUser;

  if (!user) {
    alert('Debes estar logueado.');  //NO TIENE sentido
    return;
  }

  const userRef = db.collection('users').doc(user.uid);

  userRef.get()
    .then((doc) => {
      if (doc.exists) {
        const favorites = doc.data().favorites || [];
        const updatedFavorites = favorites.filter(fav => fav.id !== earthquakeId);

        userRef.update({ favorites: updatedFavorites })
          .then(() => {
            Swal.fire({
    title: "",
    text: "Terremoto eliminado",
    icon: "success",
    timer: 2000,
    showConfirmButton: false
  });
            // Recargar mapa de favoritos
            loadFavoritesMap();
          })
          .catch((error) => {
            console.error('Error eliminando favorito: ', error);
          });
      }
    })
    .catch((error) => {
      console.error('Error: ', error);
    });
};

// Función para obtener favoritos del usuario desde Firestore
const getFavorites = () => {
  return new Promise((resolve, reject) => {
    const user = firebase.auth().currentUser;

    if (!user) {
      reject('Usuario no autenticado');
      return;
    }

    const userRef = db.collection('users').doc(user.uid);

    userRef.get()
      .then((doc) => {
        if (doc.exists) {
          const favorites = doc.data().favorites || [];
          resolve(favorites);
        } else {
          resolve([]);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// Función para cargar y mostrar los terremotos favoritos en el mapa
function loadFavoritesMap() {
  currentView = 'favorites';
  
  // Limpiar marcadores del primer mapa
  map.eachLayer(layer => {
    if(layer instanceof L.Marker || layer instanceof L.CircleMarker) {
      map.removeLayer(layer);
    }
  });

  getFavorites()
    .then(favorites => {
      if (favorites.length === 0) {
        alert('No tienes terremotos favoritos aún.');
        return;
      }

      favorites.forEach(earthquake => {
        const coords = [earthquake.coordinates[1], earthquake.coordinates[0]];
        const mag = earthquake.magnitude;

        let color;
        if(mag < 1) color = '#f0f0f0';
        else if(mag < 2) color = '#1d8919';
        else if(mag < 3) color = '#8e911c';
        else if(mag < 4) color = '#f9f016';
        else if(mag < 5) color = '#f6ce1d';
        else if(mag < 6) color = '#fc9d16';
        else if(mag < 7) color = '#f61719';
        else if(mag < 8) color = "#f818fa";
        else color = 'black';

        const marker = L.circleMarker(coords, {
          radius: mag * 3,
          color: color,
          fillColor: color,
          fillOpacity: 0.7,
          weight: 1
        }).addTo(map);

        const fechaEvento = new Date(earthquake.time).toLocaleString();
        marker.bindPopup(`
          <div class="earthquake-popup">
            <b>${earthquake.title}</b><br>
            <strong>Fecha del evento:</strong> ${fechaEvento}<br>
            <strong>Ubicación:</strong> ${earthquake.place}<br>
            <strong>Código:</strong> ${earthquake.code}<br>
            <strong>Magnitud:</strong> ${earthquake.magnitude} (${earthquake.magType})<br> 
            <a href="${earthquake.url}" target="_blank" style="color:#007BFF;">Ver en USGS 🌍</a><br>
            <button onclick="removeFromFavorites('${earthquake.id}')" class="remove-btn" style="margin-top:20px; padding:0px 0px; background:#f5576c; color:white; border:none; border-radius:15px; cursor:pointer; width:100%; font-weight:100;"><br><br>
            🗑️ Eliminar de Favoritos
            </button>
          </div>
        `);
      });
    })
    .catch(error => {
      console.error('Error cargando favoritos:', error);
      Swal.fire({
    title: "Uups",
    text: "Debes estar registrado para ver favoritos",
    icon: "error",
    timer: 2000,
    showConfirmButton: false
  });
    });
}

// Función para cargar y mostrar los terremotos de la API en el mapa
function loadApiMap() {
  currentView = 'api';
  
  // Limpiar marcadores
  map.eachLayer(layer => {
    if(layer instanceof L.Marker || layer instanceof L.CircleMarker) {
      map.removeLayer(layer);
    }
  });

  // Recargar los terremotos de la API
  getData().then(data => {
    data.forEach(pin => {
      const coords = [pin.geometry.coordinates[1], pin.geometry.coordinates[0]];
      const props = pin.properties;
      const mag = props.mag;

      let color;
      if(mag < 1) color = '#f0f0f0';
      else if(mag < 2) color = '#1d8919';
      else if(mag < 3) color = '#8e911c';
      else if(mag < 4) color = '#f9f016';
      else if(mag < 5) color = '#f6ce1d';
      else if(mag < 6) color = '#fc9d16';
      else if(mag < 7) color = '#f61719';
      else if(mag < 8) color = "#f818fa";
      else color = 'black';

      const marker = L.circleMarker(coords, {
        radius: mag * 3,
        color: color,
        fillColor: color,
        fillOpacity: 0.7,
        weight: 1
      }).addTo(map);

      const fechaEvento = new Date(props.time).toLocaleString();
      
      // Preparar datos del terremoto para guardar
      const earthquakeData = {
        title: props.title,
        place: props.place,
        code: props.code,
        magnitude: props.mag,
        magType: props.magType,
        url:props.url,
        time: props.time,
        coordinates: pin.geometry.coordinates
      };

      // Convertir a JSON y escapar comillas
      const dataStr = JSON.stringify(earthquakeData).replace(/"/g, '&quot;');

      marker.bindPopup(`
        <div class="earthquake-popup">
          <b>${props.title}</b><br>
          <strong>Fecha del evento:</strong> ${fechaEvento}<br>
          <strong>Ubicación:</strong> ${props.place}<br>
          <strong>Código:</strong> ${props.code}<br>
          <strong>Magnitud:</strong> ${props.mag} (${props.magType})<br>
          <a href="${props.url}" target="_blank">Ver en USGS 🌍</a>

          <button onclick='addToFavorites("${pin.id}", ${dataStr})'">
            ⭐ Añadir a Favoritos
          </button>
        </div>
      `);
    });
  });
}

//============== EVENT LISTENERS BOTONES FILTRO ==============
// Event listener para el botón de ver terremotos de la API
document.getElementById('btn-api').addEventListener('click', function() {
    // document.getElementById('btn-api').classList.add('active');
    document.getElementById('btn-favorites').classList.remove('active');
    loadApiMap();
});

// Event listener para el botón de ver terremotos favoritos
document.getElementById('btn-favorites').addEventListener('click', function() {
    document.getElementById('btn-favorites').classList.add('active');
    document.getElementById('btn-api').classList.remove('active');
    loadFavoritesMap();
});



// ======================= LOCAL STORAGE FORMULARIO =======================

// Campos a guardar
const campos = ["email", "password"];

// Guardar cambios del formulario al escribir
campos.forEach(id => {
  const input = document.getElementById(id);
  if (input) input.addEventListener("input", guardarFormulario);
});

// Función para guardar datos en localStorage
function guardarFormulario() {
  const formData = {};
  campos.forEach(id => {
    const input = document.getElementById(id);
    if (input) formData[id] = input.value;
  });
  localStorage.setItem("form_data", JSON.stringify(formData));
}

// Función para cargar formulario cacheado desde localStorage
function cargarFormulario() {
  const data = JSON.parse(localStorage.getItem("form_data"));
  if (data) {
    campos.forEach(id => {
      const input = document.getElementById(id);
      if (input) input.value = data[id] || "";
    });
  }
}

// Función para limpiar formulario y caché
function limpiarFormulario() {
  const form = document.getElementById("form1");
  if (form) form.reset();
  localStorage.removeItem("form_data");
  Swal.fire({
    title: "¡Limpiado!",
    text: "Formulario y caché limpiados correctamente",
    icon: "success",
    timer: 1500,
    showConfirmButton: false
  });
}

// Iniciar carga de formulario y eventos
document.addEventListener("DOMContentLoaded", () => {
  cargarFormulario();

});