let timeLeft = 25 * 60; // 25 minutes in seconds
let timerId = null;
let isWorkTime = true;

const timerDisplay = document.getElementById('timer');
const startPauseButton = document.getElementById('startPause');
const resetButton = document.getElementById('reset');
const modeToggleButton = document.getElementById('modeToggle');
const statusText = document.getElementById('status');

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function toggleMode() {
    // Clear any running timer
    clearInterval(timerId);
    timerId = null;
    
    // Toggle the mode
    isWorkTime = !isWorkTime;
    timeLeft = isWorkTime ? 25 * 60 : 5 * 60;
    
    // Update UI elements
    modeToggleButton.textContent = isWorkTime ? 'Rest Mode' : 'Work Mode';
    statusText.textContent = isWorkTime ? 'Work Time' : 'Break Time';
    startPauseButton.textContent = 'Start';
    
    updateDisplay();
}

function toggleTimer() {
    if (timerId === null) {
        // Start timer
        startPauseButton.textContent = 'Pause';
        timerId = setInterval(() => {
            timeLeft--;
            updateDisplay();
            
            if (timeLeft === 0) {
                clearInterval(timerId);
                timerId = null;
                isWorkTime = !isWorkTime;
                timeLeft = isWorkTime ? 25 * 60 : 5 * 60;
                statusText.textContent = isWorkTime ? 'Work Time' : 'Break Time';
                modeToggleButton.textContent = isWorkTime ? 'Rest Mode' : 'Work Mode';
                updateDisplay();
                startPauseButton.textContent = 'Start';
            }
        }, 1000);
    } else {
        // Pause timer
        clearInterval(timerId);
        timerId = null;
        startPauseButton.textContent = 'Start';
    }
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    isWorkTime = true;
    timeLeft = 25 * 60;
    statusText.textContent = 'Work Time';
    startPauseButton.textContent = 'Start';
    modeToggleButton.textContent = 'Rest Mode';
    updateDisplay();
}

startPauseButton.addEventListener('click', toggleTimer);
resetButton.addEventListener('click', resetTimer);
modeToggleButton.addEventListener('click', toggleMode);

updateDisplay(); 