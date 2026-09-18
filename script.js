/* =========================================================
   PORTAFOLIO PERSONAL - JANER
   SCRIPT.JS

   Funciones:
   - Menú hamburguesa
   - Validación en tiempo real
   - Barras de habilidades
   - Animaciones al hacer scroll
   - Interacción con proyectos
   - Guardado de mensajes en localStorage
   - Contador de mensajes
   - Eliminación de mensajes
   - Botón volver arriba
   ========================================================= */


/* =========================================================
   1. INICIO
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    console.log("🚀 Portafolio cargado correctamente");

    inicializarMenu();

    inicializarBarras();

    inicializarFormulario();

    inicializarProyectos();

    inicializarScroll();

    actualizarContadorMensajes();

});


/* =========================================================
   2. MENÚ HAMBURGUESA
   ========================================================= */

function inicializarMenu() {

    const menuToggle =
        document.getElementById("menuToggle");

    const navMenu =
        document.getElementById("navMenu");


    // Comprobar que existan los elementos

    if (!menuToggle || !navMenu) {

        console.warn(
            "No se encontró el menú de navegación."
        );

        return;
    }


    /* -----------------------------------------
       Abrir / cerrar menú
       ----------------------------------------- */

    menuToggle.addEventListener("click", () => {

        const menuAbierto =
            navMenu.classList.toggle("active");


        menuToggle.classList.toggle(
            "active",
            menuAbierto
        );


        menuToggle.setAttribute(
            "aria-expanded",
            menuAbierto
        );

    });


    /* -----------------------------------------
       Cerrar menú al seleccionar una opción
       ----------------------------------------- */

    const enlaces =
        navMenu.querySelectorAll("a");


    enlaces.forEach(enlace => {

        enlace.addEventListener("click", () => {

            navMenu.classList.remove("active");

            menuToggle.classList.remove("active");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

        });

    });


    /* -----------------------------------------
       Cerrar con ESC
       ----------------------------------------- */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                navMenu.classList.contains("active")
            ) {

                navMenu.classList.remove("active");

                menuToggle.classList.remove("active");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        }
    );

}


/* =========================================================
   3. BARRAS DE HABILIDADES
   ========================================================= */

function inicializarBarras() {

    const barras =
        document.querySelectorAll(
            ".progress-bar"
        );


    if (barras.length === 0) {

        console.warn(
            "No se encontraron barras de habilidades."
        );

        return;
    }


    /*
       IntersectionObserver detecta cuándo
       una barra entra en la pantalla.
    */

    const observer =
        new IntersectionObserver(
            (entradas, observer) => {

                entradas.forEach(entrada => {

                    if (
                        !entrada.isIntersecting
                    ) {

                        return;
                    }


                    const barra =
                        entrada.target;


                    const porcentaje =
                        barra.dataset.progress;


                    /*
                       Aplicar porcentaje
                    */

                    barra.style.width =
                        `${porcentaje}%`;


                    /*
                       Dejar de observar
                    */

                    observer.unobserve(barra);

                });

            },
            {
                threshold: 0.4
            }
        );


    barras.forEach(barra => {

        observer.observe(barra);

    });

}


/* =========================================================
   4. FORMULARIO
   ========================================================= */

function inicializarFormulario() {

    const formulario =
        document.getElementById(
            "contactForm"
        );


    if (!formulario) {

        console.warn(
            "No se encontró el formulario."
        );

        return;
    }


    /* -----------------------------------------
       Obtener elementos
       ----------------------------------------- */

    const nombre =
        document.getElementById("nombre");

    const email =
        document.getElementById("email");

    const mensaje =
        document.getElementById("mensaje");

    const estado =
        document.getElementById(
            "formStatus"
        );


    /* -----------------------------------------
       Validación en tiempo real
       ----------------------------------------- */

    nombre.addEventListener(
        "input",
        () => {

            validarNombre(nombre);

        }
    );


    email.addEventListener(
        "input",
        () => {

            validarEmail(email);

        }
    );


    mensaje.addEventListener(
        "input",
        () => {

            validarMensaje(mensaje);

        }
    );


    /* -----------------------------------------
       Enviar formulario
       ----------------------------------------- */

    formulario.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            /* Validar todos los campos */

            const nombreValido =
                validarNombre(nombre);

            const emailValido =
                validarEmail(email);

            const mensajeValido =
                validarMensaje(mensaje);


            /* ---------------------------------
               Comprobar errores
               --------------------------------- */

            if (
                !nombreValido ||
                !emailValido ||
                !mensajeValido
            ) {

                estado.textContent =
                    "⚠️ Revisa los campos del formulario.";

                estado.className =
                    "form-status error";

                return;
            }


            /* ---------------------------------
               Crear mensaje
               --------------------------------- */

            const nuevoMensaje = {

                id: Date.now(),

                nombre:
                    nombre.value.trim(),

                email:
                    email.value.trim(),

                mensaje:
                    mensaje.value.trim(),

                fecha:
                    new Date().toLocaleString(
                        "es-CO"
                    )

            };


            /* ---------------------------------
               Obtener mensajes existentes
               --------------------------------- */

            let mensajesGuardados =
                obtenerMensajes();


            /* ---------------------------------
               Agregar nuevo mensaje
               --------------------------------- */

            mensajesGuardados.push(
                nuevoMensaje
            );


            /* ---------------------------------
               Guardar
               --------------------------------- */

            guardarMensajes(
                mensajesGuardados
            );


            /* ---------------------------------
               Actualizar contador
               --------------------------------- */

            actualizarContadorMensajes();


            /* ---------------------------------
               Mostrar mensaje
               --------------------------------- */

            estado.textContent =
                "✓ ¡Mensaje guardado correctamente!";

            estado.className =
                "form-status success";


            /* ---------------------------------
               Limpiar formulario
               --------------------------------- */

            formulario.reset();


            /* ---------------------------------
               Quitar estados visuales
               --------------------------------- */

            const campos =
                formulario.querySelectorAll(
                    "input, textarea"
                );


            campos.forEach(campo => {

                campo.classList.remove(
                    "valid",
                    "invalid"
                );

            });


            /* ---------------------------------
               Limpiar mensajes de error
               --------------------------------- */

            const errores =
                formulario.querySelectorAll(
                    ".error-message"
                );


            errores.forEach(error => {

                error.textContent = "";

            });


            /* ---------------------------------
               Ocultar confirmación
               --------------------------------- */

            setTimeout(() => {

                estado.textContent = "";

                estado.className =
                    "form-status";

            }, 5000);

        }
    );

}


/* =========================================================
   5. VALIDAR NOMBRE
   ========================================================= */

function validarNombre(campo) {

    const valor =
        campo.value.trim();


    const mensaje =
        campo.parentElement.querySelector(
            ".error-message"
        );


    /* Campo vacío */

    if (valor.length === 0) {

        mostrarError(
            campo,
            mensaje,
            "El nombre es obligatorio."
        );

        return false;
    }


    /* Muy corto */

    if (valor.length < 3) {

        mostrarError(
            campo,
            mensaje,
            "El nombre debe tener al menos 3 caracteres."
        );

        return false;
    }


    /* Solo letras */

    const patronNombre =
        /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/;


    if (!patronNombre.test(valor)) {

        mostrarError(
            campo,
            mensaje,
            "El nombre solo debe contener letras."
        );

        return false;
    }


    mostrarExito(
        campo,
        mensaje
    );


    return true;

}


/* =========================================================
   6. VALIDAR EMAIL
   ========================================================= */

function validarEmail(campo) {

    const valor =
        campo.value.trim();


    const mensaje =
        campo.parentElement.querySelector(
            ".error-message"
        );


    /* Vacío */

    if (valor.length === 0) {

        mostrarError(
            campo,
            mensaje,
            "El correo es obligatorio."
        );

        return false;
    }


    /* Formato */

    const patronEmail =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!patronEmail.test(valor)) {

        mostrarError(
            campo,
            mensaje,
            "Introduce un correo electrónico válido."
        );

        return false;
    }


    mostrarExito(
        campo,
        mensaje
    );


    return true;

}


/* =========================================================
   7. VALIDAR MENSAJE
   ========================================================= */

function validarMensaje(campo) {

    const valor =
        campo.value.trim();


    const mensaje =
        campo.parentElement.querySelector(
            ".error-message"
        );


    /* Vacío */

    if (valor.length === 0) {

        mostrarError(
            campo,
            mensaje,
            "El mensaje es obligatorio."
        );

        return false;
    }


    /* Muy corto */

    if (valor.length < 10) {

        mostrarError(
            campo,
            mensaje,
            "El mensaje debe tener al menos 10 caracteres."
        );

        return false;
    }


    mostrarExito(
        campo,
        mensaje
    );


    return true;

}


/* =========================================================
   8. MOSTRAR ERROR
   ========================================================= */

function mostrarError(
    campo,
    mensaje,
    texto
) {

    campo.classList.remove(
        "valid"
    );

    campo.classList.add(
        "invalid"
    );


    mensaje.textContent =
        texto;

}


/* =========================================================
   9. MOSTRAR ÉXITO
   ========================================================= */

function mostrarExito(
    campo,
    mensaje
) {

    campo.classList.remove(
        "invalid"
    );

    campo.classList.add(
        "valid"
    );


    mensaje.textContent =
        "";

}


/* =========================================================
   10. OBTENER MENSAJES
   ========================================================= */

function obtenerMensajes() {

    const mensajes =
        localStorage.getItem(
            "mensajes"
        );


    if (!mensajes) {

        return [];

    }


    try {

        const datos =
            JSON.parse(mensajes);


        /*
           Comprobar que realmente sea
           un array.
        */

        if (!Array.isArray(datos)) {

            return [];

        }


        return datos;

    } catch (error) {

        console.error(
            "Error al leer los mensajes:",
            error
        );


        return [];

    }

}


/* =========================================================
   11. GUARDAR MENSAJES
   ========================================================= */

function guardarMensajes(
    mensajes
) {

    try {

        localStorage.setItem(
            "mensajes",
            JSON.stringify(mensajes)
        );


        console.log(
            "💾 Mensajes guardados correctamente."
        );


        return true;

    } catch (error) {

        console.error(
            "Error al guardar los mensajes:",
            error
        );


        return false;

    }

}


/* =========================================================
   12. CONTADOR DE MENSAJES
   ========================================================= */

function actualizarContadorMensajes() {

    const mensajes =
        obtenerMensajes();


    const cantidad =
        mensajes.length;


    /*
       Buscar elementos que tengan
       la clase .message-counter
    */

    const contadores =
        document.querySelectorAll(
            ".message-counter"
        );


    contadores.forEach(contador => {

        contador.textContent =
            cantidad;

    });


    /*
       También mostramos información
       en consola para comprobar.
    */

    console.log(
        `📩 Mensajes almacenados: ${cantidad}`
    );

}


/* =========================================================
   13. ELIMINAR UN MENSAJE
   ========================================================= */

function eliminarMensaje(id) {

    const mensajes =
        obtenerMensajes();


    const mensajesActualizados =
        mensajes.filter(
            mensaje => mensaje.id !== id
        );


    guardarMensajes(
        mensajesActualizados
    );


    actualizarContadorMensajes();


    console.log(
        `🗑️ Mensaje ${id} eliminado.`
    );

}


/* =========================================================
   14. ELIMINAR TODOS LOS MENSAJES
   ========================================================= */

function eliminarTodosLosMensajes() {

    const cantidad =
        obtenerMensajes().length;


    if (cantidad === 0) {

        console.log(
            "No hay mensajes para eliminar."
        );

        return;

    }


    const confirmar =
        confirm(
            "¿Seguro que quieres eliminar todos los mensajes?"
        );


    if (!confirmar) {

        return;

    }


    localStorage.removeItem(
        "mensajes"
    );


    actualizarContadorMensajes();


    console.log(
        "🗑️ Todos los mensajes fueron eliminados."
    );

}


/* =========================================================
   15. INTERACCIÓN CON PROYECTOS
   ========================================================= */

function inicializarProyectos() {

    const proyectos =
        document.querySelectorAll(
            ".project-card"
        );


    if (proyectos.length === 0) {

        return;

    }


    proyectos.forEach(proyecto => {


        /* ---------------------------------
           Mouse entra
           --------------------------------- */

        proyecto.addEventListener(
            "mouseenter",
            () => {

                proyecto.style.setProperty(
                    "--mouse-active",
                    "1"
                );

            }
        );


        /* ---------------------------------
           Mouse sale
           --------------------------------- */

        proyecto.addEventListener(
            "mouseleave",
            () => {

                proyecto.style.setProperty(
                    "--mouse-active",
                    "0"
                );

            }
        );


        /* ---------------------------------
           Click
           --------------------------------- */

        proyecto.addEventListener(
            "click",
            event => {


                /*
                   Si el clic fue sobre un enlace,
                   no hacemos nada.
                */

                if (
                    event.target.closest("a")
                ) {

                    return;

                }


                proyecto.classList.add(
                    "project-selected"
                );


                setTimeout(() => {

                    proyecto.classList.remove(
                        "project-selected"
                    );

                }, 500);

            }
        );

    });

}


/* =========================================================
   16. ANIMACIONES AL HACER SCROLL
   ========================================================= */

function inicializarScroll() {

    const elementos =
        document.querySelectorAll(
            ".skill-card, .project-card, .contact-item"
        );


    if (elementos.length === 0) {

        return;

    }


    /* Preparar elementos */

    elementos.forEach(elemento => {

        elemento.style.opacity =
            "0";

        elemento.style.transform =
            "translateY(30px)";

        elemento.style.transition =
            "opacity 0.6s ease, transform 0.6s ease";

    });


    /* Observer */

    const observer =
        new IntersectionObserver(
            (entradas, observer) => {

                entradas.forEach(entrada => {

                    if (
                        !entrada.isIntersecting
                    ) {

                        return;

                    }


                    entrada.target.style.opacity =
                        "1";


                    entrada.target.style.transform =
                        "translateY(0)";


                    observer.unobserve(
                        entrada.target
                    );

                });

            },
            {
                threshold: 0.15
            }
        );


    elementos.forEach(elemento => {

        observer.observe(elemento);

    });

}


/* =========================================================
   17. BOTÓN VOLVER ARRIBA
   ========================================================= */

function crearBotonArriba() {

    const boton =
        document.createElement(
            "button"
        );


    boton.innerHTML = "↑";


    boton.setAttribute(
        "aria-label",
        "Volver al inicio"
    );


    boton.classList.add(
        "back-to-top"
    );


    document.body.appendChild(
        boton
    );


    /* ---------------------------------
       Mostrar / ocultar
       --------------------------------- */

    window.addEventListener(
        "scroll",
        () => {

            if (
                window.scrollY > 500
            ) {

                boton.classList.add(
                    "show"
                );

            } else {

                boton.classList.remove(
                    "show"
                );

            }

        }
    );


    /* ---------------------------------
       Volver arriba
       --------------------------------- */

    boton.addEventListener(
        "click",
        () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );

}


/* Crear botón */

crearBotonArriba();


/* =========================================================
   18. ESTILOS DINÁMICOS
   ========================================================= */

function agregarEstilosDinamicos() {

    const estilo =
        document.createElement(
            "style"
        );


    estilo.textContent = `

        /* =================================
           BOTÓN VOLVER ARRIBA
           ================================= */

        .back-to-top {

            position: fixed;

            right: 25px;

            bottom: 25px;

            width: 45px;

            height: 45px;

            border:
                1px solid
                rgba(0, 198, 255, 0.35);

            border-radius: 50%;

            background:
                rgba(7, 17, 31, 0.9);

            color:
                #00c6ff;

            font-size:
                1.3rem;

            cursor:
                pointer;

            opacity:
                0;

            visibility:
                hidden;

            transform:
                translateY(20px);

            transition:
                all 0.3s ease;

            z-index:
                900;

            backdrop-filter:
                blur(10px);

        }


        .back-to-top:hover {

            background:
                rgba(0, 198, 255, 0.12);

            box-shadow:
                0 0 20px
                rgba(0, 198, 255, 0.3);

            transform:
                translateY(-3px);

        }


        .back-to-top.show {

            opacity:
                1;

            visibility:
                visible;

            transform:
                translateY(0);

        }


        /* =================================
           PROYECTO SELECCIONADO
           ================================= */

        .project-selected {

            transform:
                translateY(-10px)
                scale(1.02) !important;

            box-shadow:
                0 0 35px
                rgba(0, 198, 255, 0.35)
                !important;

        }


        /* =================================
           CONTADOR DE MENSAJES
           ================================= */

        .message-counter {

            display:
                inline-flex;

            align-items:
                center;

            justify-content:
                center;

            min-width:
                22px;

            height:
                22px;

            padding:
                0 6px;

            border-radius:
                20px;

            background:
                rgba(0, 198, 255, 0.15);

            border:
                1px solid
                rgba(0, 198, 255, 0.25);

            color:
                #00c6ff;

            font-size:
                0.7rem;

            font-weight:
                700;

        }

    `;


    document.head.appendChild(
        estilo
    );

}


/* Agregar estilos */

agregarEstilosDinamicos();


/* =========================================================
   19. DETECTAR CAMBIOS EN OTRAS PESTAÑAS
   ========================================================= */

window.addEventListener(
    "storage",
    event => {

        if (
            event.key === "mensajes"
        ) {

            actualizarContadorMensajes();

            console.log(
                "🔄 Los mensajes fueron actualizados."
            );

        }

    }
);


/* =========================================================
   20. FUNCIONES GLOBALES
   ========================================================= */

/*
   Las hacemos globales para poder utilizarlas
   desde una futura página de administración.

   Ejemplo:

   eliminarMensaje(123456789);

   eliminarTodosLosMensajes();
*/

window.obtenerMensajes =
    obtenerMensajes;

window.guardarMensajes =
    guardarMensajes;

window.eliminarMensaje =
    eliminarMensaje;

window.eliminarTodosLosMensajes =
    eliminarTodosLosMensajes;

window.actualizarContadorMensajes =
    actualizarContadorMensajes;


/* =========================================================
   FIN DEL SCRIPT
   ========================================================= */