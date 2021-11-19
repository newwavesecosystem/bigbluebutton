
// The wake lock sentinel.
let wakeLock = null;

// Attempts to request a screen wake lock.
try {
    console.log('Requesting for Screen Wake Lock');
    wakeLock = await navigator.wakeLock.request('screen')
    wakeLock.addEventListener('release', () => {
        console.log('Screen Wake Lock released:', wakeLock.released);
    });
    console.log('Screen Wake Lock released:', wakeLock.released);
} catch (err) {
    console.error(`${err.name}, ${err.message}`);
}

// test support
let isSupported = false;

if ('wakeLock' in navigator) {
    isSupported = true;
    console.info('Screen Wake Lock API supported 🎉');
} else {
    console.info('Wake lock is not supported by this browser.');
}