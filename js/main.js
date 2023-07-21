let stopwatches = [];
let stopwatchIdCounter = 1;

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
  
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Event listener for the Process dropdown to update the Unit Process dropdown options
const processDropdown = document.getElementById('process');
const unitProcessDropdown = document.getElementById('unitProcess');
processDropdown.addEventListener('change', updateUnitProcessOptions);

function updateUnitProcessOptions() {
  const selectedProcess = processDropdown.value;
  let unitProcessOptions = '';

  switch (selectedProcess) {
    case 'Siembra':
      unitProcessOptions = `
        <option value="Limpieza de bandejas">Limpieza de bandejas</option>
        <option value="Pesaje semilla">Pesaje semilla</option>
        <option value="Preparacion solucion de crecimiento">Preparacion solucion de crecimiento</option>
        <option value="Preparacion sustrato">Preparacion sustrato</option>
        <option value="Insercion de semillas en sustrato">Insercion de semillas en sustrato</option>
        <option value="Preparacion solucion de cloro">Preparacion solucion de cloro</option>
        <option value="Rocio de siembra con cloro">Rocio de siembra con cloro</option>
        <option value="Picado de sustrato en bandeja">Picado de sustrato en bandeja</option>
        <option value="Transporte de bandejas al modulo">Transporte de bandejas al modulo</option>
      `;
      break;
    case 'Trasplante1':
    case 'Trasplante2':
      unitProcessOptions = `
        <option value="Limpieza de bandejas nuevas">Limpieza de bandejas nuevas</option>
        <option value="Descarga y pesado de bandejas">Descarga y pesado de bandejas</option>
        <option value="Retiro de especie de bandeja">Retiro de especie de bandeja</option>
        <option value="Insercion cubos en bandeja nueva">Insercion cubos en bandeja nueva</option>
        <option value="Pesaje bandejas trasplantadas">Pesaje bandejas trasplantadas</option>
        <option value="Carga de bandejas al modulo">Carga de bandejas al modulo</option>
        <option value="Toma de datos trasplante">Toma de datos trasplante</option>
      `;
      break;
    case 'Cosecha':
      unitProcessOptions = `
        <option value="Descarga bandeja del modulo">Descarga bandeja del modulo</option>
        <option value="Recorte de raices de lechuga">Recorte de raices de lechuga</option>
        <option value="Pesaje de bandejas cosechadas">Pesaje de bandejas cosechadas</option>
        <option value="Remocion de impurezas en la lechuga">Remocion de impurezas en la lechuga</option>
        <option value="Pesaje de lechugas para empaquetado">Pesaje de lechugas para empaquetado</option>
        <option value="Empaquetado de lechugas">Empaquetado de lechugas</option>
        <option value="Sellado de paquetes">Sellado de paquetes</option>
        <option value="Etiquetado de paquetes">Etiquetado de paquetes</option>
      `;
      break;
    default:
      unitProcessOptions = ''; // Empty options for unknown process
  }

  unitProcessDropdown.innerHTML = unitProcessOptions;
}

function addUnitOperation() {
  const process = document.getElementById('process').value;
  const unitProcess = document.getElementById('unitProcess').value;
  const personInCharge = document.getElementById('personInCharge').value;

  // Create a new stopwatch instance and add it to the stopwatches array
  const stopwatch = {
    id: stopwatchIdCounter,
    process: process,
    unitProcess: unitProcess,
    personInCharge: personInCharge,
    startTime: Date.now(),
    interval: null,
    isRunning: true
  };
  stopwatchIdCounter++;

  function startUpdatingStopwatch() {
    setInterval(() => updateStopwatch(stopwatch), 1000);
  }
 

  stopwatches.push(stopwatch);

  // Add the unit operation to the table
  addRecordToTable(stopwatch);

  // Start the stopwatch interval
  if (stopwatches.length === 1) {
    startUpdatingStopwatch();
  }

  // Clear the input fields for the next unit operation
  document.getElementById('process').value = '';
  document.getElementById('unitProcess').value = '';
  document.getElementById('personInCharge').value = '';
}

function updateStopwatch() {
    stopwatches.forEach(stopwatch => {
      if (stopwatch.isRunning) {
        const currentTime = Date.now();
        stopwatch.duration = Math.floor((currentTime - stopwatch.startTime) / 1000);
        const timerSpan = document.getElementById(`timer_${stopwatch.id}`);
        timerSpan.textContent = formatTime(stopwatch.duration);
      }
    });
}

function addRecordToTable(stopwatch) {
  const table = document.getElementById('records');
  const newRow = table.insertRow();

  const cell1 = newRow.insertCell(0);
  cell1.textContent = stopwatch.process;

  const cell2 = newRow.insertCell(1);
  cell2.textContent = stopwatch.unitProcess;

  const cell3 = newRow.insertCell(2);
  cell3.textContent = stopwatch.personInCharge;

  const cell4 = newRow.insertCell(3);
  cell4.textContent = formatTime(0);

  const cell5 = newRow.insertCell(4);
  const inputOutput = document.createElement('input');
  inputOutput.type = 'text';
  inputOutput.placeholder = 'Enter output';
  cell5.appendChild(inputOutput)

  const cell6 = newRow.insertCell(5);
  const stopButton = document.createElement('button');
  stopButton.textContent = 'Stop Stopwatch';
  stopButton.onclick = function () {
    stopStopwatch(stopwatch);
  };
  cell6.appendChild(stopButton);

  const timerSpan = document.createElement('span');
  timerSpan.id = `timer_${stopwatch.id}`;
  cell4.appendChild(timerSpan);
}

function stopStopwatch(stopwatch) {
  if (stopwatch.isRunning) {
    clearInterval(stopwatch.interval);
    stopwatch.isRunning = false;

    const duration = Math.floor((Date.now() - stopwatch.startTime) / 1000);
    const durationFormatted = formatTime(duration);

    // Update the duration in the table
    const table = document.getElementById('records');
    const rowIndex = stopwatches.indexOf(stopwatch);
    const row = table.rows[rowIndex];
    row.cells[3].textContent = durationFormatted;

    // Get the output value from the input box
    const inputOutput = row.cells[4].querySelector('input');
    const outputValue = inputOutput.value;
    stopwatch.output = outputValue;
  }
}

function exportToExcel() {
  // Create a new workbook and a new worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet([]);

  // Add the headers to the worksheet
  const headers = ['Operacion', 'Operacion Unitaria', 'Persona a Cargo', 'Duracion', 'Output'];
  XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: 'A1' });

  // Loop through each stopwatch and add the data to the worksheet
  stopwatches.forEach((stopwatch, index) => {
    const rowIndex = index + 1; // Add 1 to skip the table header row

    const rowData = [
      stopwatch.process,
      stopwatch.unitProcess,
      stopwatch.personInCharge,
      formatTime(stopwatch.duration),
      stopwatch.output || '', // Set the output value or an empty string if no output
    ];

    XLSX.utils.sheet_add_aoa(worksheet, [rowData], { origin: `A${rowIndex + 1}` });
  });

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  // Export the workbook to a file
  XLSX.writeFile(workbook, 'industrial_process_data.xlsx');
}


function exportToCSV() {
  const table = document.getElementById('records');
  const csv = Papa.unparse(table);
  const csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const csvURL = URL.createObjectURL(csvData);
  const tempLink = document.createElement('a');
  tempLink.href = csvURL;
  tempLink.setAttribute('download', 'unit_operations.csv');
  document.body.appendChild(tempLink);
  tempLink.click();
  document.body.removeChild(tempLink);
}

