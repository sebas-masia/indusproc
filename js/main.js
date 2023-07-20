let stopwatches = [];

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
  
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
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

function startUpdatingStopwatch() {
  // Only start the interval if there is at least one running stopwatch
  setInterval(updateAllStopwatches, 1000);
}

function updateAllStopwatches() {
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
