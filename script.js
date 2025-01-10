document.addEventListener('DOMContentLoaded', function() {
    let timeLeft = 25 * 60; // 25 minutes in seconds
    let timerId = null;
    let isWorkTime = true;// Add this with other state variables at the top
    let currentFocus = '';

    const timerDisplay = document.getElementById('timer');
    const startPauseButton = document.getElementById('startPause');
    const resetButton = document.getElementById('reset');
    const modeToggleButton = document.getElementById('modeToggle');
    const statusText = document.getElementById('status');
    const addTimeButton = document.getElementById('addTime');
    const focusDisplay = document.getElementById('focusDisplay');
    const focusModal = document.getElementById('focusModal');
    const focusInput = document.getElementById('focusInput');
    const focusSubmit = document.getElementById('focusSubmit');

    console.log('Add Time Button:', addTimeButton);

    function updateDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Update timer display
        timerDisplay.textContent = timeString;
        
        // Update page title
        document.title = `${timeString} - ${isWorkTime ? 'Work' : 'Break'} | Pomodoro`;
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
        
        // Clear focus when switching modes
        currentFocus = '';
        focusDisplay.textContent = '';
        
        updateDisplay();
    }

    function showFocusModal() {
        return new Promise((resolve) => {
            focusModal.style.display = 'flex';
            focusInput.value = '';
            focusInput.focus();

            function handleSubmit() {
                const value = focusInput.value.trim();
                if (value) {
                    focusModal.style.display = 'none';
                    resolve(value);
                }
            }

            focusSubmit.onclick = handleSubmit;
            focusInput.onkeypress = (e) => {
                if (e.key === 'Enter') handleSubmit();
            };
        });
    }

    function toggleTimer() {
        if (timerId === null) {
            // Only show modal if starting work mode
            if (isWorkTime && !currentFocus) {
                showFocusModal().then(focus => {
                    currentFocus = focus;
                    focusDisplay.textContent = `Focus: ${currentFocus}`;
                    // Start the timer after setting focus
                    startTimer();
                });
            } else {
                startTimer();
            }
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
        // Clear focus on reset
        currentFocus = '';
        focusDisplay.textContent = '';
        updateDisplay();
    }

    function addTime() {
        if (timerId !== null || timeLeft > 0) {  // Only allow adding time when timer is running or has time left
            timeLeft += 5 * 60;  // Add 5 minutes (300 seconds)
            updateDisplay();
        }
    }

    function startTimer() {
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
                if (!isWorkTime) {
                    currentFocus = '';
                    focusDisplay.textContent = '';
                }
                updateDisplay();
                startPauseButton.textContent = 'Start';
            }
        }, 1000);
    }

    startPauseButton.addEventListener('click', toggleTimer);
    resetButton.addEventListener('click', resetTimer);
    modeToggleButton.addEventListener('click', toggleMode);
    addTimeButton.addEventListener('click', addTime);

    updateDisplay(); 
}); 