(function () {

	// setTimeout() return value
	let disablePopupTimeout;

	function save_options()
	{
		localStorage["xdebugIdeKey"] = document.getElementById("idekey").value;
		localStorage["xdebugTraceTrigger"] = document.getElementById("tracetrigger").value;
		localStorage["xdebugProfileTrigger"] = document.getElementById("profiletrigger").value;
		localStorage.xdebugDisablePopup = document.getElementById('disable-popup').checked ? '1' : '0';
	}

	function restore_options()
	{
		// Restore IDE Key
		let idekey = localStorage["xdebugIdeKey"];

		if (!idekey)
		{
			idekey = "XDEBUG_ECLIPSE";
		}
		const elementIde = document.getElementById("ide");
		const elementIdekey = document.getElementById("idekey");
		if (idekey === "XDEBUG_ECLIPSE" || idekey === "netbeans-xdebug" || idekey === "macgdbp" || idekey === "PHPSTORM" || idekey === "xdebug-atom" )
		{
			elementIde.value = idekey;
			elementIdekey.disabled = true;
		}
		else
		{
			elementIde.value = "null";
			elementIdekey.disabled = false;
		}
		elementIdekey.value = idekey;

		// Restore Trace Triggers
		const elementTracetrigger = document.getElementById("tracetrigger");
		const traceTrigger = localStorage["xdebugTraceTrigger"];
		if (traceTrigger !== null)	{
			elementTracetrigger.value = traceTrigger;
		} else {
			elementTracetrigger.value = null;
		}

		// Restore Profile Triggers
		const elementProfiletrigger = document.getElementById("profiletrigger");
		const profileTrigger = localStorage["xdebugProfileTrigger"];
		if (profileTrigger !== null)	{
			elementProfiletrigger.value = profileTrigger;
		} else {
			elementProfiletrigger.value = null;
		}

		// Restore Disable Popup
		document.getElementById('disable-popup').checked = (localStorage.xdebugDisablePopup === '1');
	}

	document.addEventListener('DOMContentLoaded', function () {
		const elementIde = document.getElementById("ide");
		const elementIdekey = document.getElementById("idekey");
		const elementDisablePopup = document.getElementById("disable-popup");

		elementIde.addEventListener('change', function () {
			const ideValue = elementIde.value;
			if (ideValue !== "null") {
				elementIdekey.disabled = true;
				elementIdekey.value = ideValue;

				save_options();
			} else {
				elementIdekey.disabled = false;
			}
		});

		elementIde.addEventListener('change',save_options)

		// Persist Disable Popup on onChange event
		elementDisablePopup.addEventListener('change',disablePopupChanged)

		elementIde.addEventListener('change',save_options)
		const saveButtons = document.getElementsByClassName('save-button');
		for (let i = 0; i < saveButtons.length; i++) {
			saveButtons[i].addEventListener('click', save_options);
		}

		restore_options();
	});

	/**
	 * Disable Popup checkbox changed, persist it.
	 */
	function disablePopupChanged() {
		const elementsDisablePopupSaved = document.getElementsByClassName('disable-popup-saved');

		for (let i = 0; i < elementsDisablePopupSaved.length; i++) {
			elementsDisablePopupSaved[i].classList.remove('show');
		}

		// First clear interval
		clearInterval(disablePopupTimeout);
		// Hide after 2 seconds
		disablePopupTimeout = setTimeout(() =>{
			for (let i = 0; i < elementsDisablePopupSaved.length; i++) {
				elementsDisablePopupSaved[i].classList.remove('show');
			}
		}, 2000);

		// Persist
		save_options();

		// We need to reload the extension, because to hide the popup
        chrome.extension.getBackgroundPage().window.location.reload();
	}

})();
