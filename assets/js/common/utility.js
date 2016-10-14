const Utility = {};

Utility.splitCamelcase = (text, delimiter) => {
	delimiter = typeof delimiter === 'string' ? delimiter : ' ';
	return text.replace(/([a-z](?=[A-Z]))/g, '$1' + delimiter).toLowerCase();
};

Utility.capitalize = (text) => {
	return text.replace(/(?:^|\s)\S/g, function(a) {
		return a.toUpperCase();
	});
};

Utility.arrayToCSV = (array) => {
	if (!(array instanceof Array) || array.length === 0) {
		return '';
	}
	return array.reduce((previousValue, currentValue, index, array) => {
		return previousValue + ', ' + currentValue;
	});
};

// Emulating negative lookbehind, prepend 'http://' to the urls that do not already contain it
Utility.correctUrls = (text) => {
	var pattern = /(https?:\/\/)?(www\.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
	var regex = new RegExp(pattern);
	var output = text.replace(regex, ($0, $1) => {
		return $1 ? $0 : 'http://' + $0;
	});
	return output;
};

// Make urls inside given text clickable
Utility.makeUrlsClickable = (text) => {
	var correctedText = Utility.correctUrls(text);
	var pattern = /(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+\s.~#?&//=]*))/g;
	var regex = new RegExp(pattern);
	return correctedText.replace(regex, '<a href=\'$1\' target=\'_blank\'>$1</a>');
};

Utility.capitaliseFirstLetter = (string) => {
	return string.charAt(0).toUpperCase() + string.slice(1);
};

Utility.toTitleCase = (string) => {
	return string.replace(/\w\S*/g, (txt) => {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
};

Utility.toCamelCase = (string) => {
	return string.toLowerCase().replace(/[\s-](.)/g, (match, group1) => {
		return group1.toUpperCase();
	});
};

Utility.getDistinctPropValuesFromBBCollection = (collection, propName) => {
	var array = collection.models;
	var flags = [], output = [], l = array.length, i;
	for( i=0; i<l; i++) {
		if(flags[array[i].get(propName)]) {
			continue;
		}
		flags[array[i].get(propName)] = true;
		output.push(array[i].get(propName));
	}
	return output;
};

Utility.cutString = (str, maxLen, abrupt) => {
	if (!maxLen) {
		return str;
	}
	if (abrupt) {
		return str.length > maxLen ? str.substr(0, maxLen) + '...' : str;
	} else {
		var len = str.length;
		for (var i = 0; i < len; i++) {
			if (str[i] === '.' && str[i+1] === ' ' && i >= maxLen - 1) {
				break;
			}
		}
		return str.substr(0, i+1);
	}
};

Utility.stripHtml = (str) => {
	return str.replace(/<(?:.|\n)*?>/gm, '');
};

Utility.stripTags = (str, allowed) => {
	allowed = (((allowed || '') + '').toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
	var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
		commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
	return str.replace(commentsAndPhpTags, '').replace(tags, ($0, $1) => {
		return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
	});
};

Utility.isUpperCase = (str) => {
	return str === str.toUpperCase();
};

Utility.sanitizeSectionName = (name) => {
	return name.replace(/[\&\-\s\'\"]/gm, '');
};

Utility.findPropertyNameByRegex = (o, r) => {
	var key;
	for (key in o) {
		if (o.hasOwnProperty(key) && key.match(r)) {
			return key;
		}
	}
	return undefined;
};

Utility.deepMerge = (target, source) => {
	for (var key in source) {
		var original = target[key];
		var next = source[key];
		if (original && next && typeof next === 'object') {
			Utility.deepMerge(original, next);
		} else {
			target[key] = next;
		}
	}
	return target;
};

Utility.removeAccents = (text) => {
	return typeof text !== 'string' ?
		// handle cases that text is not a string
		text :
		// global replace of uppercase accented characters
		text.
			replace( /\u0386/g, '\u0391' ). // 'Ά':'Α'
			replace( /\u0388/g, '\u0395' ). // 'Έ':'Ε'
			replace( /\u0389/g, '\u0397' ). // 'Ή':'Η'
			replace( /\u038A/g, '\u0399' ). // 'Ί':'Ι'
			replace( /\u038C/g, '\u039F' ). // 'Ό':'Ο'
			replace( /\u038E/g, '\u03A5' ). // 'Ύ':'Υ'
			replace( /\u038F/g, '\u03A9' ). // 'Ώ':'Ω'
			replace( /\u0390/g, '\u03B9' ). // 'ΐ':'ι'
			replace( /\u03AA/g, '\u0399' ). // 'Ϊ':'Ι'
			replace( /\u03AB/g, '\u03A5' ). // 'Ϋ':'Υ'
			replace( /\u03AC/g, '\u03B1' ). // 'ά':'α'
			replace( /\u03AD/g, '\u03B5' ). // 'έ':'ε'
			replace( /\u03AE/g, '\u03B7' ). // 'ή':'η'
			replace( /\u03AF/g, '\u03B9' ). // 'ί':'ι'
			replace( /\u03B0/g, '\u03C5' ). // 'ΰ':'υ'
			replace( /\u03CA/g, '\u03B9' ). // 'ϊ':'ι'
			replace( /\u03CB/g, '\u03C5' ). // 'ϋ':'υ'
			replace( /\u03CC/g, '\u03BF' ). // 'ό':'ο'
			replace( /\u03CD/g, '\u03C5' ). // 'ύ':'υ'
			replace( /\u03CE/g, '\u03C9' ); // 'ώ':'ω'
};

// Encodes value (double utf-8)
Utility.encode = (value) => {
	return encodeURIComponent(encodeURIComponent(value));
};

// Decodes value (double utf-8)
Utility.decode = (value) => {
	return decodeURIComponent(decodeURIComponent(value));
};

export default Utility;
