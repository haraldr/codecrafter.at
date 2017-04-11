function init()
{
	$(document).keydown(function(e) { if (e.keyCode == 27) handleEscKey(); });
}


// -----------------------------------------------------------------------------
// Local storage for settings. Supports string, number and boolean vars.
// -----------------------------------------------------------------------------
function deleteSetting(name)
{
	localStorage.removeItem(name);
}

function getSetting(name, defaultValue)
{
	var value = localStorage.getItem(name);
	if (!value) return defaultValue;
	var type = value[0];
	value = value.substring(1);
	switch (type)
	{
		case 'b': return value == 'true';
		case 'n': return Number(value);
		default: return value;
	}
}

function setSetting(name, value)
{
	value = (typeof value)[0] + value;
	localStorage.setItem(name, value);
}


// -----------------------------------------------------------------------------
// Handle ESC key. Not stackable.
// -----------------------------------------------------------------------------
var funcEscKey = null;

function setEscKeyHandler(func)
{
	while (funcEscKey != null) handleEscKey();
	funcEscKey = func;
}

function deleteEscKeyHandler()
{
	funcEscKey = null;
}

function handleEscKey()
{
	if (funcEscKey == null) return;
	var func = funcEscKey;
	funcEscKey = null;
	func();
}


// -----------------------------------------------------------------------------
// Popups. A single element which overlays the page content. Stackable.
// -----------------------------------------------------------------------------
var popupElementsStack = new Array();

function showPopup(elementId)
{
	var $element = $('#' + elementId);
	showAsPopup($element, false);
}

function showAsPopup($element, removeOnClose)
{
	if (popupElementsStack.length > 0)
	{
		var current = popupElementsStack[popupElementsStack.length - 1];
		current.$element.hide();
		if (current.removeOnClose) current.$element.remove();
	}

	popupElementsStack.push({$element:$element, removeOnClose:removeOnClose });

	$('#overlay').show();
	$element.show();

	if (funcEscKey != closePopup) setEscKeyHandler(closePopup);
}

function closePopup()
{
	var current = popupElementsStack.pop();
	if (current != null)
	{
		current.$element.hide();
		if (current.removeOnClose) current.$element.remove();
	}

	if (popupElementsStack.length > 0)
	{
		var previous = popupElementsStack[popupElementsStack.length - 1];
		previous.$element.show();
	}

	if (popupElementsStack.length == 0)
	{
		$('#overlay').hide();
		deleteEscKeyHandler();
	}
	else
	{
		if (funcEscKey != closePopup) setEscKeyHandler(closePopup);
	}
}