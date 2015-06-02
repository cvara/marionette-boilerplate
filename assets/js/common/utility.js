var Utility = {};

Utility.splitCamelcase = function(text, delimiter) {
	delimiter = typeof delimiter === 'string' ? delimiter : ' ';
	return text.replace(/([a-z](?=[A-Z]))/g, '$1' + delimiter).toLowerCase();
};

Utility.capitalize = function(text) {
	return text.replace(/(?:^|\s)\S/g, function(a) {
		return a.toUpperCase();
	});
};

Utility.arrayToCSV = function(array) {
	if (!(array instanceof Array) || array.length === 0) {
		return '';
	}
	return array.reduce(function(previousValue, currentValue, index, array) {
		return previousValue + ', ' + currentValue;
	});
};

// Emulating negative lookbehind, prepend 'http://' to the urls that do not already contain it
Utility.correctUrls = function(text) {
	var pattern = /(https?:\/\/)?(www\.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
	var regex = new RegExp(pattern);
	var output = text.replace(regex, function($0, $1) {
		return $1 ? $0 : 'http://' + $0;
	});
	return output;
};

// Make urls inside given text clickable
Utility.makeUrlsClickable = function(text) {
	var correctedText = Utility.correctUrls(text);
	var pattern = /(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+\s.~#?&//=]*))/g;
	var regex = new RegExp(pattern);
	return correctedText.replace(regex, '<a href=\'$1\' target=\'_blank\'>$1</a>');
};

Utility.capitaliseFirstLetter = function(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
};

Utility.toTitleCase = function(string) {
	return string.replace(/\w\S*/g, function(txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
};

Utility.toCamelCase = function(string) {
	return string.toLowerCase().replace(/[\s-](.)/g, function(match, group1) {
		return group1.toUpperCase();
	});
};

module.exports = Utility;