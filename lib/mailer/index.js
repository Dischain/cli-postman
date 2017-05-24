'use strict';

const nodemailer = require('nodemailer');

let util = require('./util.js');

/*
 * Sends email according to specified parameters 
 *
 * Exmple:
 *
 * exports.sendMail({
 *		senderEmail: 'sano199127@gmail.com',
 *		password: 'some_super_pass',
 *		reciever: 'rdischain@yandex.ru',
 *		cc: 'sano911@i.ua',
 *		subject: 'hello',
 *		text: 'it is test'
 *	}).then(() => { console.log('Email sent!'); });
 *
 * @param {Object} data: 
 * 		- sender`s email;
 *		- sender`s password;
 * 		- reciever`s email;
 * 		- copies;
 *		- email subject;
 * 		- email text;
 * @return {Promise} to send email
 */
exports.sendMail = function(data) {
	return new Promise((resolve, reject) => {
		let transport = util.checkEmail(data.senderEmail);
		if (!transport) {
			reject(transport);
		}

		let smtpConfig = {
			service: transport.service,
			host: transport.host,
			port: 465,
			auth: {
				user: data.senderEmail,
				pass: data.password
			}
		};

		let mailOpts = {
			to: data.reciever,
			cc: data.cc,
			subject: data.subject,
			text: data.text
		};

		let smtpTransport = nodemailer.createTransport(smtpConfig);
		smtpTransport.sendMail(mailOpts, (err) => {
			if (err) {
				reject(err.message);
			} else {
				resolve();
			}
		})
	});
}