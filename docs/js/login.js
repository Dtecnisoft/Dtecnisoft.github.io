// **IInicializar base de datos al cargar la página**
function init() {
    document.addEventListener('deviceready', function () {
        inicializarBaseDeDatos(); // Inicializar la base de datos
        obtenerUsuarioActual();   // Obtener y mostrar el usuario actual
    }, false);
}

// Llamar a la función de inicialización al cargar la página
window.onload = init;


function inicializarBaseDeDatos() {
    if (window.sqlitePlugin) {
        const db = window.sqlitePlugin.openDatabase({ name: 'usuarios.db', location: 'default' });

        db.transaction(function (tx) {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS usuarios (username TEXT PRIMARY KEY, password TEXT, email TEXT)',
                [],
                function () {
                    console.log('Tabla de usuarios creada o ya existente.');
                },
                function (error) {
                    console.error('Error al crear la tabla:', error);
                }
            );
        });
    } else {
        console.warn('SQLite no está disponible. Usando localStorage como respaldo.');
        // Implementación de respaldo con localStorage
        if (!localStorage.getItem('usuarios')) {
            localStorage.setItem('usuarios', JSON.stringify([]));
        }
    }
}

// Definir las funciones de validación primero
function validarCampos(username, password, email) {
    if (!username || !password || !email) {
        mostrarError('Todos los campos son obligatorios.');
        return false;
    }
    return true;
}

function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
        mostrarError('El correo electrónico no es válido.');
        return false;
    }
    return true;
}

/**Función registrar Usuario */
function registrarUsuario(event) {
    event.preventDefault();

    const username = document.getElementById('newUsername').value;
    const password = document.getElementById('newPassword').value;
    const email = document.getElementById('newEmail').value;

    if (!validarCampos(username, password, email) || !validarEmail(email)) {
        return false;
    }

    const handleSuccess = () => {
        mostrarMensajeExito().then(() => {
            $('#createUser-Modal').modal('hide');
            location.reload();
        });
    };

    const handleError = (error) => {
        console.error('Error:', error);
    };

    if (window.sqlitePlugin) {
        const db = window.sqlitePlugin.openDatabase({ name: 'usuarios.db', location: 'default' });

        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM usuarios WHERE username = ?',
                [username],
                (tx, result) => {
                    if (result.rows.length > 0) {
                        mostrarError('El nombre de usuario ya está en uso. Por favor, elige otro.');
                    } else {
                        tx.executeSql(
                            'INSERT INTO usuarios (username, password, email) VALUES (?, ?, ?)',
                            [username, password, email],
                            handleSuccess,
                            handleError
                        );
                    }
                },
                handleError
            );
        });
    } else {
        console.warn('SQLite no está disponible. Usando localStorage como respaldo.');

        let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

        if (usuarios.some(u => u.username === username)) {
            mostrarError('El nombre de usuario ya está en uso. Por favor, elige otro.');
            return;
        }

        usuarios.push({ username, password, email });
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        handleSuccess();
    }
}

/**Funcion Iniciar Sesion */
function iniciarSesion(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const handleLoginSuccess = (username) => {
        localStorage.setItem('usuarioIniciado', username);
        window.location.href = 'principal.html';
    };

    const handleLoginError = (errorMessage) => {
        mostrarError(errorMessage);
    };

    const loginWithSQLite = () => {
        return new Promise((resolve, reject) => {
            const db = window.sqlitePlugin.openDatabase({ name: 'usuarios.db', location: 'default' });

            db.transaction((tx) => {
                tx.executeSql(
                    'SELECT * FROM usuarios WHERE username = ? AND password = ?',
                    [username, password],
                    (tx, result) => {
                        if (result.rows.length > 0) {
                            resolve(username);
                        } else {
                            reject('Nombre de usuario o contraseña incorrectos.');
                        }
                    },
                    (error) => {
                        reject('Error al iniciar sesión: ' + error.message);
                    }
                );
            });
        });
    };

    const loginWithLocalStorage = () => {
        return new Promise((resolve, reject) => {
            const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
            const usuario = usuarios.find(u => u.username === username && u.password === password);
            if (usuario) {
                resolve(username);
            } else {
                reject('Nombre de usuario o contraseña incorrectos.');
            }
        });
    };

    if (window.sqlitePlugin) {
        loginWithSQLite()
            .then(handleLoginSuccess)
            .catch(handleLoginError);
    } else {
        console.warn('SQLite no está disponible. Usando localStorage como respaldo.');
        loginWithLocalStorage()
            .then(handleLoginSuccess)
            .catch(handleLoginError);
    }
}



// **Funciones de Manejo de Sesión**
function cerrarSesion() {
    // Eliminar el usuario de localStorage (si lo usas temporalmente)
    localStorage.removeItem('usuarioIniciado');
    // Redirigir a la página de inicio de sesión
    window.location.href = 'index.html';
}


// **Recuperar el Usuario desde el LocalStorage**
const usuario = localStorage.getItem('usuarioIniciado');

if (usuario) {
    // **Actualizar el Header**
    const headerUsuario = document.getElementById('usuarioHeader');
    if (headerUsuario) {
        headerUsuario.innerText = usuario;
    }

    // **Actualizar el Menú**
    const menuUsuario = document.getElementById('usuario');
    if (menuUsuario) {
        menuUsuario.innerText = usuario;
    }
}


// **Funciones de Visualización de Contraseña**
function togglePasswordVisibility() {
    // Obtener el campo de entrada de la contraseña
    var passwordField = document.getElementById("newPassword");
    // Obtener el icono que se usará para alternar la visibilidad
    var toggleIcon = document.getElementById("toggleIcon");

    // Comprobar el tipo actual del campo de entrada
    if (passwordField.type === "password") {
        // Cambiar el tipo a texto para mostrar la contraseña
        passwordField.type = "text";
        // Cambiar el icono a "ojo cerrado"
        toggleIcon.classList.remove("fa-eye");
        toggleIcon.classList.add("fa-eye-slash");
    } else {
        // Cambiar el tipo a contraseña para ocultar la contraseña
        passwordField.type = "password";
        // Cambiar el icono a "ojo abierto"
        toggleIcon.classList.remove("fa-eye-slash");
        toggleIcon.classList.add("fa-eye");
    }
}

// **Eventos de Formulario**
document.getElementById('registrationForm').addEventListener('submit', registrarUsuario);
document.getElementById('loginForm').addEventListener('submit', iniciarSesion);
document.getElementById('togglePassword').addEventListener('click', togglePasswordVisibility);


function mostrarMensajeExito() {
    return Swal.fire({
        color: '#000',
        confirmButtonColor: '#3085d6',
        title: 'Éxito',
        text: 'Usuario registrado correctamente.',
    });
}

// **Funciones de Visualización de Errores**
function mostrarError(mensaje) {
    Swal.fire({
        color: '#000',
        confirmButtonColor: '#3085d6',
        title: 'Error',
        text: mensaje,
    });
}
