document.addEventListener('contextmenu', function(event) {
    event.preventDefault();
});

// Track the current art scaling state
let artScaleState = 'autofit';
let autofitZoom = null; // Store the original autofit zoom value

document.addEventListener('auxclick', async function(event) {
    event.stopImmediatePropagation();
    event.preventDefault();

    // Middle mouse button = download current card
    if (event.button === 1) {
        downloadCard();
        return;
    }

    // Right mouse button = cycle through art sizing
   if (event.button === 2) {

    if (artScaleState === 'autofit') {
        // Get baseline autofit zoom and go to bigger
        autoFitArt();
        autofitZoom = parseFloat(document.querySelector('#art-zoom').value);
        const biggerZoom = (autofitZoom * 1.2).toFixed(1);
        document.querySelector('#art-zoom').value = biggerZoom;
        artEdited();
        artScaleState = 'bigger';
        console.log('Art: 20% Bigger (' + biggerZoom + '%)');
    } else if (artScaleState === 'bigger') {
        // Go to biggest
        const biggestZoom = (autofitZoom * 1.4).toFixed(1);
        document.querySelector('#art-zoom').value = biggestZoom;
        artEdited();
        artScaleState = 'biggest';
        console.log('Art: 40% Bigger (' + biggestZoom + '%)');
    } else if (artScaleState === 'biggest') {
        // Back to autofit
        autoFitArt();
        autofitZoom = parseFloat(document.querySelector('#art-zoom').value);
        artScaleState = 'autofit';
        console.log('Art: Auto Fit');
    }
    return;
    }


    // load the PREVIOUS card
    if (event.button === 4) {
        // Get the card selection dropdown
        const select = document.querySelector('#load-card-options');

        if (!select) return;

        // Get all actual card options, ignoring "None selected"
        const options = Array.from(select.options).filter(
            option => !option.disabled
        );

        if (options.length === 0) return;

        // Find the currently selected card
        let currentIndex = options.findIndex(
            option => option.value === select.value
        );

        // If no card is selected, start at the last card
        if (currentIndex === -1) {
            currentIndex = options.length - 1;
        } else {
            // Move to the previous card.
            // Adding options.length prevents a negative number.
            // % options.length makes it wrap from the first card to the last.
            currentIndex =
                (currentIndex - 1 + options.length) % options.length;
        }

        // Get the previous card
        const option = options[currentIndex];

        // Update the dropdown selection
        select.value = option.value;

        // Load the selected card
        await loadCard(option.value);
        return;
    }

    // load the NEXT card
    if (event.button === 3) {
        // Get the card selection dropdown
        const select = document.querySelector('#load-card-options');

        if (!select) return;

        // Get all actual card options, ignoring "None selected"
        const options = Array.from(select.options).filter(
            option => !option.disabled
        );

        if (options.length === 0) return;

        // Find the currently selected card
        let currentIndex = options.findIndex(
            option => option.value === select.value
        );

        // Move to the next card.
        // % options.length makes it wrap from the last card to the first.
        currentIndex = (currentIndex + 1) % options.length;

        // Get the next card
        const option = options[currentIndex];

        // Update the dropdown selection
        select.value = option.value;

        // Load the selected card
        await loadCard(option.value);

        return;
    }
});
