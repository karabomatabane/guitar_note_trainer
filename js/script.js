$(document).ready(function() {
    // Training variables
    let selectedNote = '';
    let currentString = 0;
    let stringsToPractice = [];
    let startTime = 0;
    let timerInterval = null;
    let currentRound = 1;
    let completedCount = 0;
    const totalStrings = 12; // 6 strings × 2 rounds

    // Initialize the app
    function init() {
        // Set up note selection buttons
        $('.note-selector button').on('click', function() {
            selectedNote = $(this).data('note');
            startTraining();
        });

        // Set up restart button
        $('#restart-btn').on('click', resetApp);

        // Set up space bar listener
        $(document).on('keydown', function(e) {
            if (e.code === 'Space') {
                // Only prevent default if we're in training mode
                if (!$('#training-screen').hasClass('hidden')) {
                    e.preventDefault();
                    nextString();
                }
            }
        });
    }

    // Start the training session
    function startTraining() {
        // Generate random order for strings (1-6) twice
        stringsToPractice = [];
        for (let i = 0; i < 2; i++) {
            const round = shuffleArray([1, 2, 3, 4, 5, 6]);
            stringsToPractice.push(...round);
        }

        // Reset counters
        currentRound = 1;
        completedCount = 0;
        currentString = 0;

        // Update UI
        $('#setup-screen').addClass('hidden');
        $('#training-screen').removeClass('hidden');
        updateProgress();
        showCurrentString();

        // Start timer
        startTime = Date.now();
        timerInterval = setInterval(updateTimer, 100);
    }

    // Show the current string to play
    function showCurrentString() {
        $('#target-note').text(selectedNote);
        $('#target-string').text(stringsToPractice[currentString]);
    }

    // Move to the next string
    function nextString() {
        currentString++;
        completedCount = currentString % 6 || 6;
        currentRound = Math.ceil((currentString + 1) / 6);

        if (currentString < stringsToPractice.length) {
            showCurrentString();
            updateProgress();
        } else {
            finishTraining();
        }
    }

    // Update the progress bar and counters
    function updateProgress() {
        const progress = (currentString / totalStrings) * 100;
        $('#progress-fill').css('width', `${progress}%`);
        $('#current-round').text(currentRound);
        $('#completed-count').text(completedCount);
    }

    // Update the timer display
    function updateTimer() {
        const elapsed = Date.now() - startTime;
        const seconds = Math.floor(elapsed / 1000) % 60;
        const minutes = Math.floor(elapsed / 60000);

        $('#time-display').text(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }

    // Finish the training session
    function finishTraining() {
        clearInterval(timerInterval);
        const elapsed = Date.now() - startTime;
        const seconds = Math.floor(elapsed / 1000) % 60;
        const minutes = Math.floor(elapsed / 60000);

        $('#total-time').text(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        $('#training-screen').addClass('hidden');
        $('#results-screen').removeClass('hidden');
    }

    // Reset the app to initial state
    function resetApp() {
        selectedNote = '';
        currentString = 0;
        stringsToPractice = [];
        clearInterval(timerInterval);

        $('#results-screen').addClass('hidden');
        $('#setup-screen').removeClass('hidden');
    }

    // Helper function to shuffle an array (Fisher-Yates algorithm)
    function shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    // Initialize the app
    init();
});