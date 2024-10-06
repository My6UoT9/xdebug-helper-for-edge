document.addEventListener('DOMContentLoaded', function () {
    let ideKey = "XDEBUG_ECLIPSE";
    let traceTrigger = ideKey;
    let profileTrigger = ideKey;

    // Check if localStorage is available and get the ideKey out of it if any
    if (localStorage) {
        if (localStorage["xdebugIdeKey"]) {
            ideKey = localStorage["xdebugIdeKey"];
        }

        if (localStorage["xdebugTraceTrigger"]) {
            traceTrigger = localStorage["xdebugTraceTrigger"];
        }

        if (localStorage["xdebugProfileTrigger"]) {
            profileTrigger = localStorage["xdebugProfileTrigger"];
        }
    }

    // Request the current state from the active tab
    chrome.tabs.query({active: true, windowId: chrome.windows.WINDOW_ID_CURRENT}, function (tabs) {
        chrome.tabs.sendMessage(
            tabs[0].id,
            {
                cmd: "getStatus",
                idekey: ideKey,
                traceTrigger: traceTrigger,
                profileTrigger: profileTrigger
            },
            function (response) {
                // Highlight the correct option
                document.querySelector('a[data-status="' + response.status + '"]').classList.add("active");
            }
        );
    });

    // Attach handler when user clicks on
    document.querySelectorAll("a").forEach(function (anchor) {
        anchor.addEventListener("click", function (eventObject) {
            const newStatus = this.getAttribute("data-status");

            // Set the new state on the active tab
            chrome.tabs.query({active: true, windowId: chrome.windows.WINDOW_ID_CURRENT}, function (tabs) {
                chrome.tabs.sendMessage(
                    tabs[0].id,
                    {
                        cmd: "setStatus",
                        status: newStatus,
                        idekey: ideKey,
                        traceTrigger: traceTrigger,
                        profileTrigger: profileTrigger
                    },
                    function (response) {
                        // Make the backgroundpage update the icon and close the popup
                        chrome.runtime.getBackgroundPage(function (backgroundPage) {
                            backgroundPage.updateIcon(response.status, tabs[0].id);
                            window.close();
                        });
                    }
                );
            });
        });
    });

    // Shortcuts
    document.addEventListener('keydown', function (event) {
		let current;
        switch (event.key) {
            case 'd':
                document.getElementById("action-debug").click();
                break;
            case 'p':
                document.getElementById("action-profile").click();
                break;
            case 't':
                document.getElementById("action-trace").click();
                break;
            case 's':
                document.getElementById("action-disable").click();
                break;
            case ' ':
            case 'Enter':
                document.querySelector("a:focus").click();
                break;
            case 'ArrowDown':
            case 'ArrowRight':
				current = document.querySelector(".action:focus");
				if (!current) {
                    document.querySelector(".action:first-of-type").focus();
                } else {
                    const next = current.parentElement.nextElementSibling;
                    if (next) {
                        next.querySelector("a").focus();
                    }
                }
                break;
            case 'ArrowUp':
            case 'ArrowLeft':
				current = document.querySelector(".action:focus");
				if (!current) {
                    document.querySelector(".action:last-of-type").focus();
                } else {
					const prev = current.parentElement.previousElementSibling;
					if (prev) {
                        prev.querySelector("a").focus();
                    }
                }
                break;
        }
    });

    // A Bit of a hack to prevent Chrome from focusing the first option automatically
    document.querySelectorAll("a").forEach(function (anchor) {
        anchor.addEventListener("focus", function () {
            this.blur();
            document.querySelectorAll("a").forEach(function (a) {
                a.removeEventListener("focus", arguments.callee);
            });
        });
    });
});