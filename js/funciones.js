/*function toRequestPromise(request) {
    return new Promise((resolve, reject) => {
        const unlisten = () => {
            request.removeEventListener('success', success);
            request.removeEventListener('error', error);
        };
        const success = () => {
            resolve(request.result);
            unlisten();
        };
        const error = () => {
            reject(request.error);
            unlisten();
        };
        request.addEventListener('success', success);
        request.addEventListener('error', error);
    });
  }
  
  function toTransactionPromise(db, transaction) {
    return new Promise((resolve, reject) => {
        const unlisten = () => {
            transaction.removeEventListener('success', success);
            transaction.removeEventListener('error', error);
        };
        const success = (e) => {
            resolve(db, e);
            unlisten();
        };
        const error = (e) => {
            reject(database, e);
            unlisten();
        };
        transaction.addEventListener('complete', success);
        transaction.addEventListener('error', error);
    });
  }

// Abrir una base de datos
var request = indexedDB.open('bd', 1);

// Crear los stores de la base de datos y los índices
request.onupgradeneeded = function(e) {
    const database = e.target.result;

    // Crear un objectStore y un índice
    const objectStore = database.createObjectStore("Usuario", { keyPath: "id", autoIncrement: true });
    objectStore.createIndex('nom', 'Nombre', {unique: false});
    objectStore.createIndex('pass', 'Contra', {unique: false});
    objectStore.createIndex('email', 'Correo', {unique: false});

    console.log('Base de datos creada');
};

toRequestPromise(request).then(function(database) {
    // Eliminar todos los datos de un store
    var transaction = database.transaction("Usuario", 'readwrite');
    var store = transaction.objectStore("Usuario");
    store.clear();
    return toTransactionPromise(database, transaction);
}).then(function(database) {
    // Insertar datos
    var transaction = database.transaction("Usuario", 'readwrite');
    var store = transaction.objectStore("Usuario");
    var item = { Nombre:"aldo" , Contra: 'picodotdev', Correo: '00000000A' };
    store.add(item);
    return toTransactionPromise(database, transaction);
}).then(function(database, e) {
    // Obtener datos de un store
    var transaction = database.transaction("Usuario", 'readonly');
    var store = transaction.objectStore("Usuario");
   console.log( store.get(1));
    return toTransactionPromise(database, transaction);
}).then(function(database, e) {
    // Obtener datos de un store por índice
    var transaction = database.transaction("Usuario", 'readonly');
    var store = transaction.objectStore("Usuario");
    var index = store.index('Id');
    index.get('00000000A');
    return toTransactionPromise(database, transaction);
}).then(function(database, e) {
    // Modificar datos
    var transaction = database.transaction("Usuario", 'readwrite');
    var store = transaction.objectStore("Usuario");
    var item = { id: 1, nombre: 'picodotdev', nombre: '11111111A' };
    store.put(item);
    return toTransactionPromise(database, transaction);
}).then(function(database, e) {
    // Eliminar datos
    var transaction = database.transaction("Usuario", 'readwrite');
    var store = transaction.objectStore("Usuario");
    store.delete(1);
    return toTransactionPromise(database, transaction);
});*/

//indexeddb
let indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

let db = null;

function startDB() {

    db = indexedDB.open('Usuarios', 1);

    db.onupgradeneeded = function (e) {
        let active = db.result;

        let object = active.createObjectStore("usuario", {keyPath: 'id', autoIncrement: true});
        object.createIndex('nom', 'nombre', {unique: false});
        object.createIndex('cc', 'cedula', {unique: true});
        object.createIndex('email', 'Correo', {unique: true});
    };

    db.onsuccess = function (e) {
        console.log('Base de Datos Creada');
        //loadAll();
    };
    db.onerror = function (e) {
        console.log('Error al cargar base de datos');
    };
}

//localstorage
mlclstg=window.localStorage || window.mozLocalStorage || window.webkitLocalStorage || window.msLocalStorage;



let registrar=document.querySelector("#Registrar");
let registrarbd=document.querySelector("#RegistrarBD");
let iniciar=document.querySelector("#login");

let vindb=document.querySelector("#ver_indb");
let vlcl=document.querySelector("#ver_local");

let dlindb=document.querySelector("#del_indb");
let dllcl=document.querySelector("#del_local");

dlindb.addEventListener("click",e=>{
    var active = db.result;
    var data = active.transaction(["usuario"], "readwrite");
    var object = data.objectStore("usuario");
    object.delete(1);
    location.reload();
    
});

dlindb.addEventListener("click",e=>{
    mlclstg.clear();
    location.reload();
});


if(document.querySelector('#container-slider')){
   setInterval('funcionEjecutar("siguiente")',5000);
}
//------------------------------ LIST SLIDER -------------------------
if(document.querySelector('.listslider')){
   let link = document.querySelectorAll(".listslider li a");
   link.forEach(function(link) {
      link.addEventListener('click', function(e){
         e.anteriorentDefault();
         let item = this.getAttribute('itlist');
         let arrItem = item.split("_");
         funcionEjecutar(arrItem[1]);
         return false;
      });
    });
}

function funcionEjecutar(side){
    let parentTarget = document.getElementById('slider');
    let elements = parentTarget.getElementsByTagName('li');
    let curElement, siguienteElement;

    for(var i=0; i<elements.length;i++){

        if(elements[i].style.opacity==1){
            curElement = i;
            break;
        }
    }
    if(side == 'anterior' || side == 'siguiente'){

        if(side=="anterior"){
            siguienteElement = (curElement == 0)?elements.length -1:curElement -1;
        }else{
            siguienteElement = (curElement == elements.length -1)?0:curElement +1;
        }
    }else{
        siguienteElement = side;
        side = (curElement > siguienteElement)?'anterior':'siguiente';

    }
    
    //PUNTOS INFERIORES
    let elementSel = document.getElementsByClassName("listslider")[0].getElementsByTagName("a");
    elementSel[curElement].classList.remove("item-select-slid");
    elementSel[siguienteElement].classList.add("item-select-slid");
    elements[curElement].style.opacity=0;
    elements[curElement].style.zIndex =0;
    elements[siguienteElement].style.opacity=1;
    elements[siguienteElement].style.zIndex =1;
}

vindb.addEventListener("click",e=>{
    loadAll();
});
vlcl.addEventListener("click",e=>{
    cargarLocal();
});
registrar.addEventListener("click",e=>{
    e.preventDefault();
    let noms=document.getElementById("nombre_reg").value;
    let cedula=document.getElementById("cedula").value;
    let corre=document.getElementById("correo").value;   
    if(noms.length>0){       
        if(cedula.length>0){            
            if(corre.length>0){   
                mlclstg.setItem("nombre",noms);
                mlclstg.setItem("cedula",cedula);
                mlclstg.setItem("email",corre);

                document.getElementById("nombre_reg").value = '';
                document.getElementById("cedula").value = '';
                document.getElementById("correo").value = '';
            }
        }
    }

});

registrarbd.addEventListener("click",e=>{
    e.preventDefault();
    let noms=document.getElementById("nombre_reg").value;
    let passw=document.getElementById("cedula").value;
    let corre=document.getElementById("correo").value;   
    if(noms.length>0){       
        if(passw.length>0){            
            if(corre.length>0){             
                add();
            }
        }
    }
    
});

function lista(correo){
    let active = db.result;
    let data = active.transaction(["usuario"], "readonly");
    let obj = data.objectStore("usuario");
    let respuesta=obj.get(correo);
    respuesta.onsuccess = function(event) {
        // All done, let's log our object to the console
        console.log(respuesta.result);
        if(respuesta.result===undefined){
            return 0;    
        }else{
            return 0;
        }
       // 
    };
    respuesta.onerror = function() {
        return 0;
        //console.error("Something went wrong when we tried to request the database!");
    };
    
}

function add() {
    var active = db.result;
    var data = active.transaction(["usuario"], "readwrite");
    var object = data.objectStore("usuario");

    var request = object.put({
        cedula: document.querySelector("#cedula").value,
        nombre: document.querySelector("#nombre_reg").value,
        correo: document.querySelector("#correo").value
    });

    request.onerror = function (e) {
        alert(request.error.nombre + '\n\n' + request.error.message);
    };

    data.oncomplete = function (e) {

        document.querySelector('#cedula').value = '';
        document.querySelector('#nombre_reg').value = '';
        document.querySelector('#correo').value = '';
        alert('Object successfully added');
        loadAll();
    };

}

function load(id) {
    var active = db.result;
    var data = active.transaction(["usuario"], "readonly");
    var object = data.objectStore("usuario");

    var request = object.get(parseInt(id));

    request.onsuccess = function () {
        var result = request.result;

        if (result !== undefined) {
            alert("ID: " + result.id + "\n\
                   cedula " + result.cedula + "\n\
                   nombre: " + result.nombre + "\n\
                   correo: " + result.correo);
        }
    };
}

function loadBycedula(cedula) {
    var active = db.result;
    var data = active.transaction(["usuario"], "readonly");
    var object = data.objectStore("usuario");
    var index = object.index("cc");
    var request = index.get(String(cedula));

    request.onsuccess = function () {
        var result = request.result;

        if (result !== undefined) {
            alert("ID: " + result.id + "\n\
                   cedula " + result.cedula + "\n\
                   nombre: " + result.nombre + "\n\
                   correo: " + result.correo);
        }
    };
}

function loadAll() {
    var active = db.result;
    var data = active.transaction(["usuario"], "readonly");
    var object = data.objectStore("usuario");

    var elements = [];

    object.openCursor().onsuccess = function (e) {

        var result = e.target.result;

        if (result === null) {
            return;
        }

        elements.push(result.value);
        result.continue();

    };

    data.oncomplete = function () {

        var outerHTML = '';

        for (var key in elements) {

            outerHTML += '\n\
            <tr>\n\
                <td>' + elements[key].cedula + '</td>\n\
                <td>' + elements[key].nombre + '</td>\n\
                <td>\n\
                    <button type="button" style="backgroud-color:red; opacity:0.8;" onclick="Eliminar(' + elements[key].id + ')">Eliminar</button>\n\
                    <button type="button" onclick="loadBycedula(' + elements[key].cedula + ')">mas Informacion</button>\n\
                </td>\n\
            </tr>';

        }

        elements = [];
        document.querySelector("#elementsList").innerHTML = outerHTML;
    };
}


function cargarLocal(){
    var outerHTML = '';
    for(let i = 0; i < mlclstg.length;  i++  ){

        let nombre = mlclstg.key(i);
        let valor = mlclstg.getItem(nombre);
          console.log(nombre+" "+valor);
          outerHTML += '\n\
          <tr>\n\
              <td>' + valor + '</td>\n\
          </tr>';
          

    }
    document.querySelector("#elementsList").innerHTML = outerHTML;
}




$('.message a').click(function(){
    $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
 });



