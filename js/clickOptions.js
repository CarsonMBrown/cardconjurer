(function () {
    // ---------- Clean up any previous copy of these listeners ----------
    // Lets this file be reloaded or re-run (htmx, edits, console paste)
    // without double-firing and without being blocked by an old copy.
    if (window.__customControlsCleanup) {
        try { window.__customControlsCleanup(); } catch (e) { /* ignore */ }
    }
    const registered = [];
    function on(type, handler, options) {
        document.addEventListener(type, handler, options);
        registered.push([type, handler, options]);
    }
    window.__customControlsCleanup = function () {
        registered.forEach(([type, handler, options]) =>
            document.removeEventListener(type, handler, options));
        registered.length = 0;
    };

    // ---------- Disable the right-click context menu ----------
    on('contextmenu', e => e.preventDefault());

    // ---------- Art size cycling ----------
    // autofit -> 20% bigger -> 40% bigger -> autofit
    const ART_STATES = [
        { multiplier: 1.0, label: 'Auto Fit' },
        { multiplier: 1.2, label: '20% Bigger' },
        { multiplier: 1.4, label: '40% Bigger' }
    ];
    let artStateIndex = 0;

    // direction: +1 = next size, -1 = previous size
    function cycleArtSize(direction = 1) {
        const zoomInput = document.querySelector('#art-zoom');
        if (!zoomInput) return;

        artStateIndex = (artStateIndex + direction + ART_STATES.length) % ART_STATES.length;
        const state = ART_STATES[artStateIndex];

        autoFitArt(); // fresh baseline every time

        if (state.multiplier !== 1.0) {
            const newZoom = (parseFloat(zoomInput.value) * state.multiplier).toFixed(1);
            zoomInput.value = newZoom;
            artEdited();
            console.log('Art: ' + state.label + ' (' + newZoom + '%)');
        } else {
            console.log('Art: ' + state.label);
        }
    }

    // ---------- Previous / next card ----------
    async function stepCard(direction) {
        const select = document.querySelector('#load-card-options');
        if (!select) return;

        const options = Array.from(select.options).filter(o => !o.disabled);
        if (options.length === 0) return;

        let index = options.findIndex(o => o.value === select.value);
        index = index === -1
            ? (direction > 0 ? 0 : options.length - 1)
            : (index + direction + options.length) % options.length;

        select.value = options[index].value;
        await loadCard(options[index].value);
    }

    // ---------- Mouse controls (always on) ----------
    // pointerup fires for every button in Firefox, Chrome and Edge.
    // Middle click (button 1) is handled by creator-23.js, so it's not handled here.
    on('pointerup', async function (event) {
        switch (event.button) {
            case 2: // right click: next art size
                event.preventDefault();
                cycleArtSize(1);
                break;
            case 3: // side/back button: previous card
                event.preventDefault();
                await stepCard(-1);
                break;
            case 4: // side/forward button: next card
                event.preventDefault();
                await stepCard(1);
                break;
        }
    }, true);

    // Block the browser's own back/forward navigation for the side buttons.
    // Firefox may still need mousebutton.4th/5th.enabled = false in about:config.
    ['mousedown', 'mouseup', 'auxclick'].forEach(type => {
        on(type, function (event) {
            if (event.button === 3 || event.button === 4) {
                event.preventDefault();
                event.stopImmediatePropagation();
            }
        }, true);
    });

    on('auxclick', function (event) {
        if (event.button === 2) event.preventDefault();
    }, true);

    // ---------- Keyboard controls (always on) ----------
    //   Up / Down      next / previous art size
    //   Left / Right   previous / next card
    //   Space          download current card

    // Only real text-entry fields block the shortcuts.
    function isTypingTarget(el) {
        if (!el) return false;
        if (el.isContentEditable) return true;
        const tag = el.tagName;
        if (tag === 'TEXTAREA') return true;
        if (tag === 'INPUT') {
            const nonText = ['range', 'checkbox', 'radio', 'button', 'submit', 'reset', 'color', 'file', 'image'];
            return !nonText.includes((el.type || '').toLowerCase());
        }
        return false;
    }

    on('keydown', async function (event) {
        if (isTypingTarget(event.target)) return;
        if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;

        const handled = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Spacebar'];
        if (!handled.includes(event.key)) return;

        const tag = event.target.tagName;

        // Let space still activate a focused button or link
        if ((event.key === ' ' || event.key === 'Spacebar') && (tag === 'BUTTON' || tag === 'A')) return;

        // Take over from a focused dropdown/slider so Firefox doesn't also change its value
        event.preventDefault();
        event.stopImmediatePropagation();
        if (tag === 'SELECT' || tag === 'INPUT') event.target.blur();

        switch (event.key) {
            case 'w':    cycleArtSize(1);   break;
            case 'ArrowUp':    cycleArtSize(1);   break;
            case 'x':  cycleArtSize(-1);  break;
            case 'ArrowDown':  cycleArtSize(-1);  break;
            case 'a':  await stepCard(-1); break;
            case 'd':  await stepCard(-1); break;
            case 'f': await stepCard(1);  break;
            case 'ArrowRight': await stepCard(1);  break;
            case ' ':
            case 'Spacebar':
                if (!event.repeat) downloadCard();
                break;
        }
    }, true);

    console.log('Custom mouse + keyboard controls active');
})();