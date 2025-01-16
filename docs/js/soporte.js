
// Validación en JavaScript con SweetAlert2
document.getElementById('contactForm').addEventListener('submit', function (event) {
    let isValid = true;

    // Validación del Nombre
    const name = document.getElementById('name');
    const nameError = document.getElementById('nameError');
    if (name.value.trim() === '') {
        nameError.textContent = 'El nombre es obligatorio.';
        isValid = false;
    } else {
        nameError.textContent = '';
    }

    // Validación del Correo Electrónico
    const email = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
        emailError.textContent = 'Por favor, ingresa un correo válido.';
        isValid = false;
    } else {
        emailError.textContent = '';
    }

    // Validación del Asunto
    const subject = document.getElementById('subject');
    const subjectError = document.getElementById('subjectError');
    if (subject.value === '') {
        subjectError.textContent = 'Selecciona un asunto.';
        isValid = false;
    } else {
        subjectError.textContent = '';
    }

    // Validación del Mensaje
    const message = document.getElementById('message');
    const messageError = document.getElementById('messageError');
    if (message.value.trim() === '') {
        messageError.textContent = 'El mensaje no puede estar vacío.';
        isValid = false;
    } else {
        messageError.textContent = '';
    }

    // Prevenir el Envío del Formulario si es Inválido
if (!isValid) {
    event.preventDefault();
    Swal.fire({
        title: 'Error',
        text: 'Por favor, corrige los errores en el formulario.',
    });
} else {
    event.preventDefault();
    emailjs.send("service_1uejyyc", "template_ni9mlse", {
        name: name.value,
        email: email.value,
        subject: subject.value,
        message: message.value
    }).then(function () {
        Swal.fire({
            title: '¡Formulario enviado!',
            text: 'Tu mensaje ha sido enviado correctamente.',
        });
    }).catch(function (error) {
        Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al enviar el mensaje. Intenta nuevamente.',
        });
    });
}

});



