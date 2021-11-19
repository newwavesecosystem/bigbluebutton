document.addEventListener('gesturestart', function (e) {
    e.preventDefault();
});

window.onload = function () {
    if (typeof history.pushState === "function") {
        history.pushState("jibberish", null, null);
        window.onpopstate = function () {
            history.pushState('newjibberish', null, null);
            // Handle the back (or forward) buttons here
            // Will NOT handle refresh, use onbeforeunload for this.
            var r = confirm("You pressed a Back button! Are you sure you want to leave the meeting room?");

            if (r === true) {
                var base_url = window.location.origin;
                // Call Back button programmatically as per user confirmation.
                window.location.replace(base_url);
                // Uncomment below line to redirect to the previous page instead.
                // window.location = document.referrer // Note: IE11 is not supporting this.
            } else {
                // Stay on the current page.
            }
        };
    } else {
        var ignoreHashChange = true;
        window.onhashchange = function () {
            if (!ignoreHashChange) {
                ignoreHashChange = true;
                window.location.hash = Math.random();
                // Detect and redirect change here
                // Works in older FF and IE9
                // * it does mess with your hash symbol (anchor?) pound sign
                // delimiter on the end of the URL
            } else {
                ignoreHashChange = false;
            }
        };
    }
}