'use strict';

const emailRE = /^[0-9a-z\.]+\@[0-9a-z-]{2,}\.[a-z]{2,}$/i;

/* returns error code
 * if missing operands - code 1
 * invalid options - code 2
 */
exports.validateFlags = function(args, cliFlags) {
	console.log(cliFlags)
	let arr = args.slice(2);

	if (arr.length > 0) {
		
		let isValid = 2;

		arr.forEach((element, index) => {
			console.log('element: ' + element);
			if (element.startsWith('-') && index != arr.length - 1) {
				console.log('starts with: ' + element)
				for (let key in cliFlags) {
					if (cliFlags[key].flag == element) {
						isValid = 0;
					} 
				}
			}
		});
		return isValid;
	}

	return 1;
}

exports.validateEmails = function(emails) {
	if (emails instanceof Array) {
		return emails.map((email) => {
			if (!checkEmail(email)) {
				return { code: 3, email: email};
			}
		}, []);
	} else if (emails instanceof String) {
		if (!checkEmail(emails)) {
			//console.log(email + ' invalid')
			return { code: 3, email: email};
		}
	} else {
		return 0;
	}
}

function checkEmail(email) {
	let isValid = email.match(emailRE);
	return isValid;
}