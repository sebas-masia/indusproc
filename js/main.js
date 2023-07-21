let stopwatches = [];

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
  
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Event listener for the Process dropdown to update the Unit Process dropdown options
const processDropdown = document.getElementById('Process');
const unitProcessDropdown = document.getElementById('unitProcess');
processDropdown.addEventListener('change', updateUnitProcessOptions);

function updateUnitProcessOptions() {
  const selectedProcess = processDropdown.value;
  let unitProcessOptions = '';

  switch (selectedProcess) {
    case 'siembra':
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
    case 'trasplante1':
    case 'trasplante2':
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
    case 'cosecha':
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
  const unitProcess = document.getElementById('unitProcess').value;
  const personInCharge = document.getElementById('personInCharge').value;

  // Create a new stopwatch instance and add it to the stopwatches array
  const stopwatch = {
    unitProcess: unitProcess,
    personInCharge: personInCharge,
    startTime: Date.now(),
    interval: null,
    isRunning: true
  };

  stopwatch.interval = setInterval(() => updateStopwatch(stopwatch), 1000);

  stopwatches.push(stopwatch);

  // Add the unit operation to the table
  addRecordToTable(stopwatch);

  // Start the stopwatch interval
  if (stopwatches.length === 1) {
    startUpdatingStopwatch();
  }

  // Clear the input fields for the next unit operation
  document.getElementById('unitProcess').value = '';
  document.getElementById('personInCharge').value = '';
}

/* function startUpdatingStopwatch() {
  // Only start the interval if there is at least one running stopwatch
  setInterval(updateAllStopwatches, 1000);
}
 */

function updateStopwatch() {
    stopwatches.forEach(stopwatch => {
      if (stopwatch.isRunning) {
        const currentTime = Date.now();
        stopwatch.duration = Math.floor((currentTime - stopwatch.startTime) / 1000);
        const timerSpan = document.getElementById(stopwatch.unitProcess);
        timerSpan.textContent = formatTime(stopwatch.duration);
      }
    });
}

function addRecordToTable(stopwatch) {
  const table = document.getElementById('records');
  const newRow = table.insertRow();

  const cell1 = newRow.insertCell(0);
  cell1.textContent = stopwatch.unitProcess;

  const cell2 = newRow.insertCell(1);
  cell2.textContent = stopwatch.personInCharge;

  const cell3 = newRow.insertCell(2);
  cell3.textContent = formatTime(0);

  const cell4 = newRow.insertCell(3);
  const stopButton = document.createElement('button');
  stopButton.textContent = 'Stop Stopwatch';
  stopButton.onclick = function () {
    stopStopwatch(stopwatch);
  };
  cell4.appendChild(stopButton);

  // Set a unique ID for the timer span to update it later
  const timerSpan = document.createElement('span');
  timerSpan.id = stopwatch.unitProcess;
  cell3.appendChild(timerSpan);
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
    row.cells[2].textContent = durationFormatted;
  }
}
