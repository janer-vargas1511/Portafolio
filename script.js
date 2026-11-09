document.addEventListener("DOMContentLoaded", () => {

    // =========================================================
    // 1. MENÚ HAMBURGUESA
    // =========================================================

    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");

    if (menuToggle && navMenu) {

        menuToggle.addEventListener("click", () => {
            navMenu.classList.toggle("active");

            const abierto = navMenu.classList.contains("active");

            menuToggle.setAttribute("aria-expanded", abierto);
        });

        // Cerrar menú al hacer clic en un enlace
        const navLinks = navMenu.querySelectorAll("a");

        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                navMenu.classList.remove("active");
                menuToggle.setAttribute("aria-expanded", "false");
            });
        });

        // Cerrar menú con Escape
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                navMenu.classList.remove("active");
                menuToggle.setAttribute("aria-expanded", "false");
            }
        });
    }


    // =========================================================
    // 2. BARRAS DE HABILIDADES
    // =========================================================

    const progressBars = document.querySelectorAll(".progress-bar");

    if (progressBars.length > 0) {

        const observerSkills = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        const bar = entry.target;
                        const progreso = bar.dataset.progress;

                        if (progreso) {
                            bar.style.width = `${progreso}%`;
                        }

                        observer.unobserve(bar);
                    }

                });

            },
            {
                threshold: 0.4
            }
        );

        progressBars.forEach(bar => {
            // Comenzar desde 0 para poder animarlas
            bar.style.width = "0%";
            observerSkills.observe(bar);
        });
    }


    // =========================================================
    // 3. FORMULARIO DE CONTACTO
    // =========================================================

    const contactForm = document.getElementById("contactForm");

    const nombre = document.getElementById("nombre");
    const email = document.getElementById("email");
    const mensaje = document.getElementById("mensaje");
    const formStatus = document.getElementById("formStatus");


    // ---------------------------------------------------------
    // Obtener mensajes guardados
    // ---------------------------------------------------------

    function obtenerMensajes() {

        try {

            const mensajesGuardados =
                localStorage.getItem("mensajes");

            if (!mensajesGuardados) {
                return [];
            }

            return JSON.parse(mensajesGuardados);

        } catch (error) {

            console.error(
                "No se pudieron recuperar los mensajes:",
                error
            );

            return [];
        }
    }


    // ---------------------------------------------------------
    // Guardar mensajes
    // ---------------------------------------------------------

    function guardarMensajes(mensajes) {

        try {

            localStorage.setItem(
                "mensajes",
                JSON.stringify(mensajes)
            );

            return true;

        } catch (error) {

            console.error(
                "No se pudieron guardar los mensajes:",
                error
            );

            return false;
        }
    }


    // ---------------------------------------------------------
    // Validar nombre
    // ---------------------------------------------------------

    function validarNombre(valor) {

        const valorLimpio = valor.trim();

        if (valorLimpio === "") {
            return "El nombre es obligatorio.";
        }

        if (valorLimpio.length < 3) {
            return "El nombre debe tener al menos 3 caracteres.";
        }

        return "";
    }


    // ---------------------------------------------------------
    // Validar email
    // ---------------------------------------------------------

    function validarEmail(valor) {

        const valorLimpio = valor.trim();

        if (valorLimpio === "") {
            return "El correo electrónico es obligatorio.";
        }

        const expresionEmail =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!expresionEmail.test(valorLimpio)) {
            return "Ingresa un correo electrónico válido.";
        }

        return "";
    }


    // ---------------------------------------------------------
    // Validar mensaje
    // ---------------------------------------------------------

    function validarMensaje(valor) {

        const valorLimpio = valor.trim();

        if (valorLimpio === "") {
            return "El mensaje es obligatorio.";
        }

        if (valorLimpio.length < 10) {
            return "El mensaje debe tener al menos 10 caracteres.";
        }

        return "";
    }


    // ---------------------------------------------------------
    // Mostrar error
    // ---------------------------------------------------------

    function mostrarError(input, mensajeError) {

        if (!input) return;

        input.classList.remove("input-success");

        if (mensajeError) {

            input.classList.add("input-error");

            let errorElement =
                input.parentElement.querySelector(".error-message");

            if (!errorElement) {

                errorElement =
                    document.createElement("small");

                errorElement.className = "error-message";

                input.parentElement.appendChild(errorElement);
            }

            errorElement.textContent = mensajeError;

        } else {

            input.classList.remove("input-error");

            const errorElement =
                input.parentElement.querySelector(".error-message");

            if (errorElement) {
                errorElement.remove();
            }

            if (input.value.trim() !== "") {
                input.classList.add("input-success");
            }
        }
    }


    // ---------------------------------------------------------
    // Validación en tiempo real
    // ---------------------------------------------------------

    if (nombre) {

        nombre.addEventListener("input", () => {

            const error = validarNombre(nombre.value);

            mostrarError(nombre, error);
        });
    }


    if (email) {

        email.addEventListener("input", () => {

            const error = validarEmail(email.value);

            mostrarError(email, error);
        });
    }


    if (mensaje) {

        mensaje.addEventListener("input", () => {

            const error = validarMensaje(mensaje.value);

            mostrarError(mensaje, error);

            actualizarContadorCaracteres();
        });
    }


    // =========================================================
    // 4. CONTADOR DE CARACTERES
    // =========================================================

    function actualizarContadorCaracteres() {

        if (!mensaje) return;

        let contador =
            document.querySelector(".message-counter");

        if (!contador) {

            contador =
                document.createElement("small");

            contador.className = "message-counter";

            mensaje.parentElement.appendChild(contador);
        }

        contador.textContent =
            `${mensaje.value.length} caracteres`;
    }


    if (mensaje) {
        actualizarContadorCaracteres();
    }


    // =========================================================
    // 5. ENVIAR FORMULARIO
    // =========================================================

    if (contactForm) {

        contactForm.addEventListener("submit", (event) => {

            event.preventDefault();

            const errorNombre =
                validarNombre(nombre ? nombre.value : "");

            const errorEmail =
                validarEmail(email ? email.value : "");

            const errorMensaje =
                validarMensaje(mensaje ? mensaje.value : "");


            if (nombre) {
                mostrarError(nombre, errorNombre);
            }

            if (email) {
                mostrarError(email, errorEmail);
            }

            if (mensaje) {
                mostrarError(mensaje, errorMensaje);
            }


            // Si hay errores, no guardar
            if (
                errorNombre ||
                errorEmail ||
                errorMensaje
            ) {

                if (formStatus) {

                    formStatus.textContent =
                        "Por favor, corrige los errores del formulario.";

                    formStatus.className =
                        "form-status error";
                }

                return;
            }


            // -------------------------------------------------
            // Crear nuevo mensaje
            // -------------------------------------------------

            const nuevoMensaje = {

                id: Date.now(),

                nombre:
                    nombre.value.trim(),

                email:
                    email.value.trim(),

                mensaje:
                    mensaje.value.trim(),

                fecha:
                    new Date().toLocaleString("es-CO")
            };


            // -------------------------------------------------
            // Guardar en localStorage
            // -------------------------------------------------

            const mensajes = obtenerMensajes();

            mensajes.push(nuevoMensaje);

            const guardado =
                guardarMensajes(mensajes);


            if (!guardado) {

                if (formStatus) {

                    formStatus.textContent =
                        "No se pudo guardar el mensaje.";

                    formStatus.className =
                        "form-status error";
                }

                return;
            }


            // -------------------------------------------------
            // Mensaje de éxito
            // -------------------------------------------------

            if (formStatus) {

                formStatus.textContent =
                    "¡Mensaje enviado correctamente!";

                formStatus.className =
                    "form-status success";
            }


            // Limpiar formulario
            contactForm.reset();

            mostrarError(nombre, "");
            mostrarError(email, "");
            mostrarError(mensaje, "");

            actualizarContadorCaracteres();

            // Actualizar panel secreto si está abierto
            actualizarPanelMensajes();

            actualizarContadorMensajes();
        });
    }


    // =========================================================
    // 6. PROYECTOS INTERACTIVOS
    // =========================================================

    const projectCards =
        document.querySelectorAll(".project-card");


    projectCards.forEach(card => {

        card.addEventListener("mouseenter", () => {
            card.classList.add("project-hover");
        });


        card.addEventListener("mouseleave", () => {
            card.classList.remove("project-hover");
        });


        card.addEventListener("click", () => {

            // Quitar selección de las demás tarjetas
            projectCards.forEach(otherCard => {

                if (otherCard !== card) {
                    otherCard.classList.remove(
                        "project-selected"
                    );
                }

            });

            card.classList.toggle("project-selected");
        });

    });


    // =========================================================
    // 7. ANIMACIONES AL HACER SCROLL
    // =========================================================

    const elementosReveal =
        document.querySelectorAll(
            ".skill-card, .project-card, .contact-item"
        );


    if (elementosReveal.length > 0) {

        const observerReveal =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach(entry => {

                        if (entry.isIntersecting) {

                            entry.target.classList.add(
                                "reveal-visible"
                            );

                            observer.unobserve(
                                entry.target
                            );
                        }

                    });

                },
                {
                    threshold: 0.15
                }
            );


        elementosReveal.forEach(elemento => {

            elemento.classList.add(
                "reveal-element"
            );

            observerReveal.observe(elemento);
        });
    }


    // =========================================================
    // 8. BOTÓN "VOLVER ARRIBA"
    // =========================================================

    crearBotonArriba();


    // =========================================================
    // 9. PANEL SECRETO DE MENSAJES
    // =========================================================

    crearPanelMensajes();

    actualizarContadorMensajes();


    // =========================================================
    // 10. ATAJOS DE TECLADO
    // =========================================================

    document.addEventListener("keydown", (event) => {

        // Ctrl + Shift + M
        if (
            (event.ctrlKey || event.metaKey) &&
            event.shiftKey &&
            event.key.toLowerCase() === "m"
        ) {

            event.preventDefault();

            abrirPanelMensajes();
        }


        // Escape
        if (event.key === "Escape") {

            cerrarPanelMensajes();
        }
    });


    // =========================================================
    // 11. ACTUALIZAR ENTRE PESTAÑAS
    // =========================================================

    window.addEventListener("storage", (event) => {

        if (event.key === "mensajes") {

            actualizarContadorMensajes();
            actualizarPanelMensajes();
        }
    });


    // =========================================================
    // ESTILOS DINÁMICOS
    // =========================================================

    agregarEstilosDinamicos();
});


// =============================================================
// FUNCIONES DEL BOTÓN "VOLVER ARRIBA"
// =============================================================

function crearBotonArriba() {

    const boton =
        document.createElement("button");

    boton.id = "backToTop";

    boton.innerHTML = "↑";

    boton.setAttribute(
        "aria-label",
        "Volver arriba"
    );

    document.body.appendChild(boton);


    window.addEventListener("scroll", () => {

        if (window.scrollY > 400) {

            boton.classList.add("visible");

        } else {

            boton.classList.remove("visible");
        }
    });


    boton.addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });
}


// =============================================================
// PANEL SECRETO DE MENSAJES
// =============================================================

function crearPanelMensajes() {

    // Evitar duplicarlo
    if (document.getElementById("messagesOverlay")) {
        return;
    }


    const overlay =
        document.createElement("div");

    overlay.id = "messagesOverlay";

    overlay.className =
        "messages-overlay";

    overlay.hidden = true;


    overlay.innerHTML = `

        <div
            class="messages-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="messagesTitle"
        >

            <div class="messages-header">

                <div>

                    <span class="messages-security">
                        🔐 ÁREA PRIVADA
                    </span>

                    <h2 id="messagesTitle">
                        Bandeja de mensajes
                    </h2>

                    <p>
                        Mensajes recibidos desde el formulario
                        de contacto.
                    </p>

                </div>


                <button
                    type="button"
                    id="closeMessagesPanel"
                    class="close-messages"
                    aria-label="Cerrar panel"
                >
                    ×
                </button>

            </div>


            <div class="messages-toolbar">

                <div class="messages-total">

                    <span>Mensajes:</span>

                    <strong id="messagesCount">
                        0
                    </strong>

                </div>


                <button
                    type="button"
                    id="clearMessages"
                    class="clear-messages"
                >
                    🗑️ Eliminar todos
                </button>

            </div>


            <div
                id="messagesList"
                class="messages-list"
            ></div>


            <div class="messages-footer">

                <span>
                    Acceso: Ctrl + Shift + M
                </span>

                <span>
                    Datos almacenados localmente
                </span>

            </div>

        </div>
    `;


    document.body.appendChild(overlay);


    // ---------------------------------------------------------
    // Cerrar
    // ---------------------------------------------------------

    const closeButton =
        document.getElementById(
            "closeMessagesPanel"
        );


    closeButton.addEventListener(
        "click",
        cerrarPanelMensajes
    );


    // Cerrar haciendo clic fuera del panel
    overlay.addEventListener("click", (event) => {

        if (event.target === overlay) {
            cerrarPanelMensajes();
        }

    });


    // ---------------------------------------------------------
    // Eliminar todos
    // ---------------------------------------------------------

    const clearButton =
        document.getElementById(
            "clearMessages"
        );


    clearButton.addEventListener(
        "click",
        eliminarTodosLosMensajes
    );


    // ---------------------------------------------------------
    // Botones individuales
    // ---------------------------------------------------------

    const messagesList =
        document.getElementById(
            "messagesList"
        );


    messagesList.addEventListener(
        "click",
        (event) => {

            const deleteButton =
                event.target.closest(
                    ".delete-message"
                );


            if (deleteButton) {

                const id =
                    Number(
                        deleteButton.dataset.id
                    );

                eliminarMensaje(id);

                return;
            }


            const copyButton =
                event.target.closest(
                    ".copy-email"
                );


            if (copyButton) {

                const email =
                    copyButton.dataset.email;

                copiarEmail(email);
            }

        }
    );


    actualizarPanelMensajes();
}


// =============================================================
// ABRIR PANEL
// =============================================================

function abrirPanelMensajes() {

    const overlay =
        document.getElementById(
            "messagesOverlay"
        );


    if (!overlay) {
        return;
    }


    overlay.hidden = false;

    document.body.classList.add(
        "messages-open"
    );


    actualizarPanelMensajes();


    // Evitar que el fondo se desplace
    document.body.style.overflow = "hidden";
}


// =============================================================
// CERRAR PANEL
// =============================================================

function cerrarPanelMensajes() {

    const overlay =
        document.getElementById(
            "messagesOverlay"
        );


    if (!overlay) {
        return;
    }


    overlay.hidden = true;

    document.body.classList.remove(
        "messages-open"
    );


    document.body.style.overflow = "";
}


// =============================================================
// ACTUALIZAR PANEL
// =============================================================

function actualizarPanelMensajes() {

    const messagesList =
        document.getElementById(
            "messagesList"
        );

    const messagesCount =
        document.getElementById(
            "messagesCount"
        );


    if (!messagesList) {
        return;
    }


    const mensajes =
        obtenerMensajesGlobal();


    // Más recientes primero
    mensajes.sort(
        (a, b) => b.id - a.id
    );


    if (messagesCount) {

        messagesCount.textContent =
            mensajes.length;
    }


    // Sin mensajes
    if (mensajes.length === 0) {

        messagesList.innerHTML = `

            <div class="empty-messages">

                <div class="empty-icon">
                    📭
                </div>

                <h3>
                    No hay mensajes todavía
                </h3>

                <p>
                    Los mensajes enviados mediante
                    el formulario aparecerán aquí.
                </p>

            </div>
        `;

        return;
    }


    messagesList.innerHTML =
        mensajes.map(mensaje => `

            <article
                class="message-card"
                data-message-id="${mensaje.id}"
            >

                <div class="message-card-header">

                    <div class="message-user">

                        <div class="message-avatar">
                            ${obtenerInicial(
                                mensaje.nombre
                            )}
                        </div>

                        <div>

                            <h3>
                                ${escaparHTML(
                                    mensaje.nombre
                                )}
                            </h3>

                            <span>
                                ${escaparHTML(
                                    mensaje.fecha
                                )}
                            </span>

                        </div>

                    </div>


                    <button
                        type="button"
                        class="delete-message"
                        data-id="${mensaje.id}"
                        title="Eliminar mensaje"
                    >
                        🗑️
                    </button>

                </div>


                <div class="message-email">

                    <span>✉️</span>

                    <span>
                        ${escaparHTML(
                            mensaje.email
                        )}
                    </span>

                    <button
                        type="button"
                        class="copy-email"
                        data-email="${escaparAtributo(
                            mensaje.email
                        )}"
                        title="Copiar correo"
                    >
                        📋
                    </button>

                </div>


                <div class="message-content">

                    <span class="message-label">
                        MENSAJE
                    </span>

                    <p>
                        ${escaparHTML(
                            mensaje.mensaje
                        )}
                    </p>

                </div>

            </article>

        `).join("");
}


// =============================================================
// OBTENER MENSAJES GLOBALMENTE
// =============================================================

function obtenerMensajesGlobal() {

    try {

        const datos =
            localStorage.getItem("mensajes");


        if (!datos) {
            return [];
        }


        const mensajes =
            JSON.parse(datos);


        return Array.isArray(mensajes)
            ? mensajes
            : [];


    } catch (error) {

        console.error(
            "Error leyendo mensajes:",
            error
        );

        return [];
    }
}


// =============================================================
// ACTUALIZAR CONTADOR
// =============================================================

function actualizarContadorMensajes() {

    const mensajes =
        obtenerMensajesGlobal();


    const contador =
        document.querySelector(
            ".message-counter-total"
        );


    if (contador) {

        contador.textContent =
            mensajes.length;
    }


    const panelCount =
        document.getElementById(
            "messagesCount"
        );


    if (panelCount) {

        panelCount.textContent =
            mensajes.length;
    }
}


// =============================================================
// ELIMINAR UN MENSAJE
// =============================================================

function eliminarMensaje(id) {

    const mensajes =
        obtenerMensajesGlobal();


    const mensajeExiste =
        mensajes.some(
            mensaje => mensaje.id === id
        );


    if (!mensajeExiste) {
        return;
    }


    const confirmar =
        confirm(
            "¿Seguro que quieres eliminar este mensaje?"
        );


    if (!confirmar) {
        return;
    }


    const nuevosMensajes =
        mensajes.filter(
            mensaje => mensaje.id !== id
        );


    localStorage.setItem(
        "mensajes",
        JSON.stringify(nuevosMensajes)
    );


    actualizarPanelMensajes();
    actualizarContadorMensajes();
}


// =============================================================
// ELIMINAR TODOS
// =============================================================

function eliminarTodosLosMensajes() {

    const mensajes =
        obtenerMensajesGlobal();


    if (mensajes.length === 0) {

        alert(
            "No hay mensajes para eliminar."
        );

        return;
    }


    const confirmar =
        confirm(
            `¿Seguro que quieres eliminar los ${mensajes.length} mensajes? Esta acción no se puede deshacer.`
        );


    if (!confirmar) {
        return;
    }


    localStorage.removeItem(
        "mensajes"
    );


    actualizarPanelMensajes();
    actualizarContadorMensajes();
}


// =============================================================
// COPIAR EMAIL
// =============================================================

async function copiarEmail(email) {

    try {

        await navigator.clipboard.writeText(
            email
        );


        alert(
            "Correo copiado al portapapeles."
        );


    } catch (error) {

        console.error(
            "No se pudo copiar el correo:",
            error
        );

        alert(
            "No se pudo copiar el correo."
        );
    }
}


// =============================================================
// OBTENER INICIAL
// =============================================================

function obtenerInicial(nombre) {

    if (!nombre) {
        return "?";
    }


    return nombre
        .trim()
        .charAt(0)
        .toUpperCase();
}


// =============================================================
// PROTECCIÓN CONTRA HTML INYECTADO
// =============================================================

function escaparHTML(texto) {

    const div =
        document.createElement("div");

    div.textContent =
        String(texto ?? "");

    return div.innerHTML;
}


function escaparAtributo(texto) {

    return String(texto ?? "")
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}


// =============================================================
// ESTILOS DINÁMICOS
// =============================================================

function agregarEstilosDinamicos() {

    const style =
        document.createElement("style");


    style.textContent = `

        /* ==========================================
           BOTÓN VOLVER ARRIBA
           ========================================== */

        #backToTop {

            position: fixed;

            bottom: 25px;
            right: 25px;

            width: 50px;
            height: 50px;

            border: none;
            border-radius: 50%;

            font-size: 25px;

            cursor: pointer;

            opacity: 0;
            visibility: hidden;

            transform: translateY(20px);

            transition:
                opacity 0.3s ease,
                transform 0.3s ease,
                visibility 0.3s ease;

            z-index: 900;

            background:
                linear-gradient(
                    135deg,
                    #00c6ff,
                    #0072ff
                );

            color: white;

            box-shadow:
                0 0 20px
                rgba(0, 198, 255, 0.4);
        }


        #backToTop.visible {

            opacity: 1;
            visibility: visible;

            transform: translateY(0);
        }


        #backToTop:hover {

            transform:
                translateY(-5px)
                scale(1.05);
        }


        /* ==========================================
           VALIDACIÓN DEL FORMULARIO
           ========================================== */

        .input-error {

            border-color: #ff4d6d !important;

            box-shadow:
                0 0 8px
                rgba(255, 77, 109, 0.25);
        }


        .input-success {

            border-color: #00e676 !important;

            box-shadow:
                0 0 8px
                rgba(0, 230, 118, 0.2);
        }


        .error-message {

            display: block;

            margin-top: 5px;

            color: #ff4d6d;

            font-size: 0.8rem;
        }


        .message-counter {

            display: block;

            margin-top: 5px;

            opacity: 0.65;

            font-size: 0.8rem;
        }


        .form-status.success {

            color: #00e676;
        }


        .form-status.error {

            color: #ff4d6d;
        }


        /* ==========================================
           PROYECTOS
           ========================================== */

        .project-card {

            transition:
                transform 0.3s ease,
                box-shadow 0.3s ease;
        }


        .project-card.project-hover {

            transform:
                translateY(-8px);
        }


        .project-card.project-selected {

            transform:
                translateY(-10px)
                scale(1.02);

            box-shadow:
                0 0 30px
                rgba(0, 198, 255, 0.35);
        }


        /* ==========================================
           SCROLL REVEAL
           ========================================== */

        .reveal-element {

            opacity: 0;

            transform:
                translateY(35px);

            transition:
                opacity 0.7s ease,
                transform 0.7s ease;
        }


        .reveal-visible {

            opacity: 1;

            transform:
                translateY(0);
        }


        /* ==========================================
           PANEL DE MENSAJES
           ========================================== */

        .messages-overlay {

            position: fixed;

            inset: 0;

            z-index: 9999;

            display: flex;

            align-items: center;
            justify-content: center;

            padding: 20px;

            background:
                rgba(3, 7, 18, 0.82);

            backdrop-filter:
                blur(10px);

            -webkit-backdrop-filter:
                blur(10px);
        }


        .messages-overlay[hidden] {

            display: none;
        }


        .messages-panel {

            width: min(850px, 95vw);

            max-height: 88vh;

            display: flex;

            flex-direction: column;

            overflow: hidden;

            border:
                1px solid
                rgba(0, 198, 255, 0.35);

            border-radius: 18px;

            background:
                linear-gradient(
                    145deg,
                    rgba(10, 20, 40, 0.98),
                    rgba(4, 10, 25, 0.98)
                );

            color: #f1f5f9;

            box-shadow:
                0 0 50px
                rgba(0, 198, 255, 0.15),

                0 25px 80px
                rgba(0, 0, 0, 0.6);
        }


        /* Cabecera */

        .messages-header {

            display: flex;

            justify-content: space-between;
            align-items: flex-start;

            gap: 20px;

            padding: 25px;

            border-bottom:
                1px solid
                rgba(255, 255, 255, 0.08);
        }


        .messages-security {

            display: inline-block;

            margin-bottom: 7px;

            font-size: 0.7rem;

            letter-spacing: 2px;

            color: #00c6ff;

            font-weight: 700;
        }


        .messages-header h2 {

            margin: 0 0 5px;

            font-size: 1.7rem;
        }


        .messages-header p {

            margin: 0;

            opacity: 0.6;

            font-size: 0.9rem;
        }


        .close-messages {

            width: 38px;
            height: 38px;

            border: 1px solid
                rgba(255,255,255,0.1);

            border-radius: 50%;

            background:
                rgba(255,255,255,0.05);

            color: white;

            font-size: 25px;

            line-height: 1;

            cursor: pointer;

            transition: 0.2s ease;
        }


        .close-messages:hover {

            background:
                rgba(255,77,109,0.2);

            border-color:
                rgba(255,77,109,0.5);
        }


        /* Barra de herramientas */

        .messages-toolbar {

            display: flex;

            align-items: center;

            justify-content: space-between;

            gap: 15px;

            padding:
                12px 25px;

            border-bottom:
                1px solid
                rgba(255,255,255,0.06);
        }


        .messages-total {

            display: flex;

            align-items: center;

            gap: 8px;

            font-size: 0.9rem;

            opacity: 0.8;
        }


        .messages-total strong {

            display: flex;

            align-items: center;
            justify-content: center;

            min-width: 28px;
            height: 28px;

            padding: 0 8px;

            border-radius: 20px;

            background:
                rgba(0,198,255,0.15);

            color: #00c6ff;
        }


        .clear-messages {

            border: 1px solid
                rgba(255,77,109,0.3);

            border-radius: 8px;

            padding:
                8px 12px;

            background:
                rgba(255,77,109,0.08);

            color: #ff758f;

            cursor: pointer;

            transition: 0.2s ease;
        }


        .clear-messages:hover {

            background:
                rgba(255,77,109,0.18);

            border-color:
                rgba(255,77,109,0.6);
        }


        /* Lista */

        .messages-list {

            flex: 1;

            overflow-y: auto;

            padding: 20px 25px;
        }


        .messages-list::-webkit-scrollbar {

            width: 7px;
        }


        .messages-list::-webkit-scrollbar-track {

            background:
                rgba(255,255,255,0.03);
        }


        .messages-list::-webkit-scrollbar-thumb {

            border-radius: 10px;

            background:
                rgba(0,198,255,0.3);
        }


        /* Tarjeta */

        .message-card {

            margin-bottom: 15px;

            padding: 18px;

            border:
                1px solid
                rgba(255,255,255,0.08);

            border-radius: 14px;

            background:
                rgba(255,255,255,0.035);

            transition:
                border-color 0.2s ease,
                transform 0.2s ease;
        }


        .message-card:hover {

            transform:
                translateY(-2px);

            border-color:
                rgba(0,198,255,0.25);
        }


        .message-card-header {

            display: flex;

            align-items: center;

            justify-content: space-between;

            gap: 15px;
        }


        .message-user {

            display: flex;

            align-items: center;

            gap: 12px;
        }


        .message-avatar {

            width: 42px;
            height: 42px;

            flex-shrink: 0;

            display: flex;

            align-items: center;
            justify-content: center;

            border-radius: 50%;

            background:
                linear-gradient(
                    135deg,
                    #00c6ff,
                    #0072ff
                );

            color: white;

            font-weight: 700;

            box-shadow:
                0 0 15px
                rgba(0,198,255,0.2);
        }


        .message-user h3 {

            margin: 0 0 3px;

            font-size: 1rem;
        }


        .message-user span {

            opacity: 0.5;

            font-size: 0.75rem;
        }


        .delete-message {

            border: none;

            background: transparent;

            cursor: pointer;

            font-size: 17px;

            opacity: 0.55;

            transition: 0.2s ease;
        }


        .delete-message:hover {

            opacity: 1;

            transform: scale(1.1);
        }


        /* Email */

        .message-email {

            display: flex;

            align-items: center;

            gap: 8px;

            margin:
                15px 0 12px;

            padding: 9px 12px;

            border-radius: 8px;

            background:
                rgba(0,198,255,0.06);

            font-size: 0.85rem;
        }


        .copy-email {

            margin-left: auto;

            border: none;

            background: transparent;

            cursor: pointer;

            opacity: 0.6;

            transition: 0.2s;
        }


        .copy-email:hover {

            opacity: 1;

            transform: scale(1.1);
        }


        /* Contenido */

        .message-content {

            padding-top: 3px;
        }


        .message-label {

            display: block;

            margin-bottom: 6px;

            font-size: 0.65rem;

            letter-spacing: 1.5px;

            opacity: 0.4;
        }


        .message-content p {

            margin: 0;

            line-height: 1.6;

            font-size: 0.9rem;

            white-space: pre-wrap;

            word-break: break-word;

            opacity: 0.9;
        }


        /* Estado vacío */

        .empty-messages {

            min-height: 280px;

            display: flex;

            flex-direction: column;

            align-items: center;

            justify-content: center;

            text-align: center;

            opacity: 0.7;
        }


        .empty-icon {

            font-size: 45px;

            margin-bottom: 10px;
        }


        .empty-messages h3 {

            margin: 0 0 6px;
        }


        .empty-messages p {

            margin: 0;

            max-width: 400px;

            font-size: 0.85rem;

            opacity: 0.6;
        }


        /* Pie */

        .messages-footer {

            display: flex;

            justify-content: space-between;

            gap: 15px;

            padding:
                12px 25px;

            border-top:
                1px solid
                rgba(255,255,255,0.06);

            font-size: 0.7rem;

            opacity: 0.45;
        }


        /* ==========================================
           RESPONSIVE
           ========================================== */

        @media (max-width: 600px) {

            .messages-overlay {

                padding: 10px;
            }


            .messages-panel {

                max-height: 94vh;

                border-radius: 14px;
            }


            .messages-header {

                padding: 18px;
            }


            .messages-header h2 {

                font-size: 1.3rem;
            }


            .messages-toolbar {

                padding:
                    10px 18px;
            }


            .messages-list {

                padding:
                    15px 18px;
            }


            .message-card {

                padding: 14px;
            }


            .messages-footer {

                flex-direction: column;

                padding:
                    10px 18px;
            }


            .clear-messages {

                font-size: 0.75rem;
            }
        }

    `;


    document.head.appendChild(style);
}