//Menu desplegable
// Abrir/cerrar menú al hacer clic en el botón de menú
document.querySelector('.menu-toggle').addEventListener('click', function () {
    const menuItems = document.querySelector('.menu-items');
    menuItems.style.display = menuItems.style.display === 'block' ? 'none' : 'block';
});

// Cerrar menú al hacer clic en cualquier parte de la aplicación
document.addEventListener('click', function (event) {
    const menuItems = document.querySelector('.menu-items');
    const menuToggle = document.querySelector('.menu-toggle');

    // Verificar si el clic fue fuera del menú y del botón de menú
    if (!menuItems.contains(event.target) && !menuToggle.contains(event.target)) {
        menuItems.style.display = 'none';
    }
});

// **Muestra el tiempo del icono de la App**
document.addEventListener('deviceready', function () {
    // Asegúrate de que el splash se oculta después de 3 segundos
    setTimeout(function () {
        navigator.splashscreen.hide();
    }, 3000);
}, false);


//**Funcion para los eventos de botonoes ingresos y gastos**

function showSection(sectionId) {
    document.querySelectorAll('.section-container').forEach(container => {
        container.classList.remove('active');
    });
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    document.getElementById(sectionId).classList.add('active');
    document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');
}

document.querySelectorAll('input[type="text"]').forEach(input => {
    input.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value) {
            value = formatNumber(parseInt(value));
            e.target.value = value;
        }
    });
});

// Almacenar registros en localStorage
let budgetHistory = JSON.parse(localStorage.getItem('budgetHistory')) || [];

// **Excepciones para Campos de Entrada**

function setupInputValidation(inputId, errorId, errorMessage) {
    document.getElementById(inputId).addEventListener('input', function (e) {
        const errorMessageElement = document.getElementById(errorId);
        this.value = this.value.replace(/[^0-9]/g, '');

        if (this.value === '') {
            errorMessageElement.textContent = errorMessage;
            errorMessageElement.style.display = 'block';
        } else {
            errorMessageElement.style.display = 'none';
        }
    });
}

// Configuración de validaciones para cada campo
setupInputValidation('salary', 'salaryError', 'En el campo de salario solo se permiten números.');
setupInputValidation('additional', 'additionalError', 'En el campo de ingresos adicionales solo se permiten números.');
setupInputValidation('savings', 'savingsError', 'En el campo de Ahorro solo se permiten números.');
setupInputValidation('emergency', 'emergencyError', 'En el campo de Fondo de Emergencia solo se permiten números.');
setupInputValidation('rent', 'rentError', 'En el campo de Arriendo solo se permiten números.');
setupInputValidation('food', 'foodError', 'En el campo de Alimentos solo se permiten números.');
setupInputValidation('utilities', 'utilitiesError', 'En el campo de Servicios Públicos solo se permiten números.');
setupInputValidation('transport', 'transportError', 'En el campo de Transporte solo se permiten números.');
setupInputValidation('insurance', 'insuranceError', 'En el campo de Seguros solo se permiten números.');
setupInputValidation('others', 'othersError', 'En el campo de Otros Gastos solo se permiten números.');

function parseFormattedNumber(value) {
    if (!value) return 0;
    return parseFloat(value.replace(/\./g, ''));
}

function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

//Para calcular el presupuesto
function calculateBudget() {
    // Obtener el mes seleccionado
    const month = document.getElementById('month').value;

    // Verificar si el mes ya existe en el historial
    const monthExists = budgetHistory.some(record => record.month === month);
    if (monthExists) {
        Swal.fire({
            color: '#000',
            confirmButtonColor: '#3085d6',
            title: 'Mes ya registrado',
            text: `El mes de ${month} ya ha sido registrado. Por favor, elige otro mes.`,
            confirmButtonText: 'Aceptar'
        });
        return; // Salir de la función si el mes ya existe
    }

    // Obtener valores de ingresos
    const salary = parseFormattedNumber(document.getElementById('salary').value);
    const additional = parseFormattedNumber(document.getElementById('additional').value);

    // Obtener valores de gastos
    const savings = parseFormattedNumber(document.getElementById('savings').value);
    const emergency = parseFormattedNumber(document.getElementById('emergency').value);
    const rent = parseFormattedNumber(document.getElementById('rent').value);
    const food = parseFormattedNumber(document.getElementById('food').value);
    const utilities = parseFormattedNumber(document.getElementById('utilities').value);
    const transport = parseFormattedNumber(document.getElementById('transport').value);
    const insurance = parseFormattedNumber(document.getElementById('insurance').value);
    const others = parseFormattedNumber(document.getElementById('others').value);

    // Calcular totales
    const totalIncome = salary + additional;
    const totalExpenses = savings + emergency + rent + food + utilities + transport + insurance + others;
    const balance = totalIncome - totalExpenses;

    // Guardar registro en el historial
    budgetHistory.push({
        month,
        name: document.getElementById('name').value, // Nuevo campo de nombre
        totalIncome,
        totalIncome,
        totalExpenses,
        totalSavings: savings, // Guardar ahorros por separado
        balance
    });

    // Guardar en localStorage
    localStorage.setItem('budgetHistory', JSON.stringify(budgetHistory));

    // Actualizar tabla de historial
    updateHistoryTable();

    // Mostrar el mes
    const monthHTML = `
        <h3>Presupuesto para el mes de ${month}</h3>
    `;

    // Mostrar resultados de ingresos
    const summaryHTML = `
        <p><strong>Salario:</strong> $${formatNumber(salary)}</p>
        <p><strong>Ingresos Adicionales:</strong> $${formatNumber(additional)}</p>
    `;

    const totalHTML = `
        <strong>Total de Ingresos:</strong> $${formatNumber(totalIncome)}
    `;

    // Mostrar resultados de gastos
    const expensesSummaryHTML = `
        <h3>Desglose de Gastos:</h3>
        <p><strong>Ahorro:</strong> $${formatNumber(savings)}</p>
        <p><strong>Fondo de Emergencia:</strong> $${formatNumber(emergency)}</p>
        <p><strong>Arriendo:</strong> $${formatNumber(rent)}</p>
        <p><strong>Alimentos:</strong> $${formatNumber(food)}</p>
        <p><strong>Servicios Públicos:</strong> $${formatNumber(utilities)}</p>
        <p><strong>Transporte:</strong> $${formatNumber(transport)}</p>
        <p><strong>Seguros:</strong> $${formatNumber(insurance)}</p>
        <p><strong>Otros Gastos:</strong> $${formatNumber(others)}</p>
    `;

    const expensesTotalHTML = `
        <strong>Total de Gastos:</strong> $${formatNumber(totalExpenses)}
    `;

    const balanceHTML = `
        <strong>Balance Final:</strong> $${formatNumber(balance)}
    `;

    // Actualizar el DOM
    document.getElementById('monthResult').innerHTML = monthHTML;
    document.getElementById('summary').innerHTML = summaryHTML;
    document.getElementById('total').innerHTML = totalHTML;
    document.getElementById('expensesSummary').innerHTML = expensesSummaryHTML;
    document.getElementById('expensesTotal').innerHTML = expensesTotalHTML;
    document.getElementById('balance').innerHTML = balanceHTML;

    // Añadir animación
    document.getElementById('results').classList.remove('fade-in');
    void document.getElementById('results').offsetWidth; // Trigger reflow
    document.getElementById('results').classList.add('fade-in');

}

// Historial
function updateHistoryTable() {
    const tableBody = document.getElementById('historyTableBody');
    tableBody.innerHTML = '';

    budgetHistory.forEach((record, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.month}</td>
            <td>${record.name}</td> 
            <td>$${formatNumber(record.totalIncome)}</td>
            <td>$${formatNumber(record.totalExpenses)}</td>
            <td>$${formatNumber(record.totalSavings || 0)}</td>
            <td>$${formatNumber(record.balance)}</td>
            <td>
              <button class="mod" data-bs-toggle="modal" data-bs-target="#modalEdit" onclick="modifyRecord(${index});">
               <i class="fas fa-edit"></i>
              </button>
              <button class="remove" onclick="deleteRecord(${index});">
               <i class="fas fa-trash"></i>
              </button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // Añadir fila de totales si hay registros
    if (budgetHistory.length > 0) {
        const totals = calculateTotals();
        const totalsRow = document.createElement('tr');
        totalsRow.style.fontWeight = 'bold';
        totalsRow.style.backgroundColor = '#f0f0f0';
        totalsRow.innerHTML = `
            <td>TOTALES</td>
            <td>-</td>
            <td>$${formatNumber(totals.totalIncomeSum)}</td>
            <td>$${formatNumber(totals.totalExpensesSum)}</td>
            <td>$${formatNumber(totals.totalSavingsSum)}</td>
            <td>$${formatNumber(totals.totalBalanceSum)}</td>
        `;
        tableBody.appendChild(totalsRow);
    }
}

// Función para abrir el modal
function openModal() {
    var myModal = new bootstrap.Modal(document.getElementById('modalEdit'));
    myModal.show();
}

// Funcion eliminar un registro
function deleteRecord(index) {
    // Verificar si el índice es válido
    if (index < 0 || index >= budgetHistory.length) {
        console.error('Índice no válido para eliminar el registro.');
        return;
    }

    // Mostrar alerta de confirmación
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No podrás revertir esto!",
        color: '#000',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminarlo!',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Eliminar el registro del array
            budgetHistory.splice(index, 1);

            // Guardar los cambios en localStorage
            localStorage.setItem('budgetHistory', JSON.stringify(budgetHistory));

            // Actualizar la tabla de historial
            updateHistoryTable();

            // Mostrar mensaje de éxito
            Swal.fire({
                title: 'Registro eliminado!',
                text: 'El registro ha sido eliminado exitosamente.',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Aceptar'
            });
        }
    });
}

// Función para modificar el registro
function modifyRecord(index) {
    const record = budgetHistory[index];

    // Llenar el formulario con los datos del registro
    document.getElementById('monthToModify').value = record.month;
    document.getElementById('newSalary').value = formatNumber(record.totalIncome);
    document.getElementById('recordName').value = record.name; // Nuevo campo de nombre
    document.getElementById('newAdditional').value = formatNumber(record.additional || 0);
    document.getElementById('newSavings').value = formatNumber(record.totalSavings || 0);
    document.getElementById('newEmergency').value = formatNumber(record.emergency || 0);
    document.getElementById('newRent').value = formatNumber(record.rent || 0);
    document.getElementById('newFood').value = formatNumber(record.food || 0);
    document.getElementById('newUtilities').value = formatNumber(record.utilities || 0);
    document.getElementById('newTransport').value = formatNumber(record.transport || 0);
    document.getElementById('newInsurance').value = formatNumber(record.insurance || 0);
    document.getElementById('newOthers').value = formatNumber(record.others || 0);

    // Mostrar el formulario
    document.getElementById('editForm').style.display = 'block';
}

//se Implementa la función saveModifiedRecord para guardar los cambios realizados en el registro
function saveModifiedRecord() {
    const monthToModify = document.getElementById('monthToModify').value;
    const recordIndex = budgetHistory.findIndex(record => record.month === monthToModify);
    const recordName = document.getElementById('recordName').value;

    // Función para obtener el valor o 0 si está vacío
    const getValueOrZero = (elementId) => {
        const value = parseFormattedNumber(document.getElementById(elementId).value);
        return isNaN(value) ? 0 : value; // Retorna 0 si el valor no es un número
    };

    // Obtener nuevos valores de ingresos y gastos
    const salary = getValueOrZero('newSalary');
    const additional = getValueOrZero('newAdditional');
    const savings = getValueOrZero('newSavings');
    const emergency = getValueOrZero('newEmergency');
    const rent = getValueOrZero('newRent');
    const food = getValueOrZero('newFood');
    const utilities = getValueOrZero('newUtilities');
    const transport = getValueOrZero('newTransport');
    const insurance = getValueOrZero('newInsurance');
    const others = getValueOrZero('newOthers');

    // Calcular totales
    const totalIncome = salary + additional;
    const totalExpenses = savings + emergency + rent + food + utilities + transport + insurance + others;
    const balance = totalIncome - totalExpenses;

    // Actualizar el registro en budgetHistory
    if (recordIndex !== -1) {
        budgetHistory[recordIndex] = {
            month: monthToModify,
            totalIncome,
            name: recordName,
            totalExpenses,
            totalSavings: savings,
            balance,
            emergency,
            rent,
            food,
            utilities,
            transport,
            insurance,
            others
        };

        // Guardar en localStorage
        localStorage.setItem('budgetHistory', JSON.stringify(budgetHistory));

        // Actualizar la tabla de historial
        updateHistoryTable();

        // Cerrar el formulario
        closeEditForm();
    }
}

// Función para cerrar el formulario de edición
function closeEditForm() {
    document.getElementById('editForm').style.display = 'none';
}

//para eliminar los todos los registros de la base de datos
function resetRecords() {
    // Mostrar confirmación antes de borrar usando SweetAlert2
    Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer. ¿Deseas continuar?',
        color: '#000',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, borrar registros',
        cancelButtonText: 'Cancelar',
    }).then((result) => {
        if (result.isConfirmed) {
            // Limpiar el array de registros
            budgetHistory = [];

            // Limpiar localStorage
            localStorage.removeItem('budgetHistory');

            // Actualizar la tabla
            updateHistoryTable();

            // Limpiar los resultados
            document.getElementById('monthResult').innerHTML = '';
            document.getElementById('summary').innerHTML = '';
            document.getElementById('total').innerHTML = '';
            document.getElementById('expensesSummary').innerHTML = '';
            document.getElementById('expensesTotal').innerHTML = '';
            document.getElementById('balance').innerHTML = '';

            // Limpiar todos los campos de entrada
            document.querySelectorAll('input[type="text"]').forEach(input => {
                input.value = '';
            });

            // Restablecer el selector de mes a la primera opción
            document.getElementById('month').selectedIndex = 0;

            // Mostrar mensaje de éxito
            Swal.fire({
                title: 'Eliminado!',
                text: 'Los registros han sido eliminados exitosamente.',
                color: '#000', // Color del texto
                confirmButtonColor: '#3085d6', // Color del botón de confirmación
                cancelButtonColor: '#d33' // Color del botón de cancelación (si lo usas)
            });
        }
    });
}


// Formatear input mientras el usuario escribe
document.querySelectorAll('input[type="text"]').forEach(input => {
    input.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value) {
            value = formatNumber(parseInt(value));
            e.target.value = value;
        }
    });
});

// Permitir usar Enter para calcular
document.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        calculateBudget();
    }
});

// Cargar historial al iniciar
updateHistoryTable();


function generateExcelReport() {
    // Verificar si hay registros
    if (budgetHistory.length === 0) {
        Swal.fire({
            title: 'No hay registros',
            text: 'No hay registros disponibles para generar un informe.',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    // Crear un nuevo libro de Excel
    const wb = XLSX.utils.book_new();

    // Definir los encabezados
    const headers = [
        'Nombre', 'Mes', 'Ingresos Totales', 'Gastos Totales', 'Ahorros Totales', 'Balance',
        'Fondo de Emergencia', 'Arriendo', 'Alimentos', 'Servicios Públicos', 'Transporte',
        'Seguros', 'Otros Gastos'
    ];

    // Mapear los datos de los registros
    const data = budgetHistory.map(record => [
        record.name,
        record.month,
        formatNumber(record.totalIncome),
        formatNumber(record.totalExpenses),
        formatNumber(record.totalSavings || 0),
        formatNumber(record.balance),
        formatNumber(record.emergency || 0),
        formatNumber(record.rent || 0),
        formatNumber(record.food || 0),
        formatNumber(record.utilities || 0),
        formatNumber(record.transport || 0),
        formatNumber(record.insurance || 0),
        formatNumber(record.others || 0)
    ]);

    // Calcular los totales
    const totals = calculateTotals();
    const totalsRow = [
        'TOTALES', '', formatNumber(totals.totalIncomeSum), formatNumber(totals.totalExpensesSum),
        formatNumber(totals.totalSavingsSum), formatNumber(totals.totalBalanceSum), '', '', '', '', '', '', ''
    ];

    // Crear la hoja de trabajo con los datos
    const ws = XLSX.utils.aoa_to_sheet([headers, ...data, totalsRow]);

    // Aplicar estilos al encabezado
    const headerStyle = {
        fill: { fgColor: { rgb: "FFFF00" } },
        font: { bold: true, color: { rgb: "000000" }, sz: 12 },
        alignment: { horizontal: "center" }
    };

    for (let col = 0; col < headers.length; col++) {
        const cellAddress = XLSX.utils.encode_cell({ c: col, r: 0 });
        if (!ws[cellAddress]) ws[cellAddress] = {};
        ws[cellAddress].s = headerStyle;
    }

    // Añadir la hoja de trabajo al libro
    XLSX.utils.book_append_sheet(wb, ws, 'Informe de Registros');

    // Generar y descargar el archivo Excel
    const fileName = 'informe_registros.xlsx';
    XLSX.writeFile(wb, fileName);

    // Mostrar mensaje de éxito
    Swal.fire({
        title: 'Informe generado',
        text: 'El informe ha sido generado y descargado exitosamente como archivo Excel.',
        confirmButtonText: 'Aceptar'
    });
}

// Función para calcular los totales
function calculateTotals() {
    return budgetHistory.reduce((acc, record) => {
        return {
            totalIncomeSum: acc.totalIncomeSum + record.totalIncome,
            totalExpensesSum: acc.totalExpensesSum + record.totalExpenses,
            totalSavingsSum: acc.totalSavingsSum + (record.totalSavings || 0),
            totalBalanceSum: acc.totalBalanceSum + record.balance
        };
    }, { totalIncomeSum: 0, totalExpensesSum: 0, totalSavingsSum: 0, totalBalanceSum: 0 });
}

// Función para formatear números con separadores de miles
function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}


//** Funcion para expórtar en pdf */
function generatePDFReport() {
    // Verificar si hay registros
    if (budgetHistory.length === 0) {
        Swal.fire({
            title: 'No hay registros',
            text: 'No hay registros disponibles para generar un informe.',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    // Definir los encabezados de la tabla
    const headers = [
        { text: 'Nombre', style: 'tableHeader' },
        { text: 'Mes', style: 'tableHeader' },
        { text: 'Ingresos Totales', style: 'tableHeader' },
        { text: 'Gastos Totales', style: 'tableHeader' },
        { text: 'Ahorros Totales', style: 'tableHeader' },
        { text: 'Balance', style: 'tableHeader' }
    ];

    // Mapear los datos de los registros
    const data = budgetHistory.map(record => [
        record.name,
        record.month,
        `$${formatNumber(record.totalIncome)}`,
        `$${formatNumber(record.totalExpenses)}`,
        `$${formatNumber(record.totalSavings || 0)}`,
        `$${formatNumber(record.balance)}`
    ]);

    // Calcular los totales
    const totals = calculateTotals();
    const totalsRow = [
        { text: 'TOTALES', style: 'tableHeader' },
        '',
        `$${formatNumber(totals.totalIncomeSum)}`,
        `$${formatNumber(totals.totalExpensesSum)}`,
        `$${formatNumber(totals.totalSavingsSum)}`,
        `$${formatNumber(totals.totalBalanceSum)}`
    ];

    // Definir el contenido del PDF
    const docDefinition = {
        content: [
            { text: 'Informe de Presupuesto', style: 'header' },
            { text: '\n' }, // Espacio en blanco
            {
                table: {
                    headerRows: 1,
                    widths: ['*', '*', '*', '*', '*', '*'], // Anchos de las columnas
                    body: [headers, ...data, totalsRow] // Datos de la tabla
                }
            }
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                alignment: 'center',
                margin: [0, 0, 0, 10] // Margen inferior
            },
            tableHeader: {
                bold: true,
                fontSize: 12,
                color: 'black',
                alignment: 'center'
            }
        }
    };

    // Generar y descargar el PDF
    pdfMake.createPdf(docDefinition).download('informe_presupuesto.pdf');

    // Mostrar mensaje de éxito
    Swal.fire({
        title: 'Informe generado',
        text: 'El informe ha sido generado y descargado exitosamente como archivo PDF.',
        confirmButtonText: 'Aceptar'
    });
}