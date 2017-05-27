'use strict';

const nodemailer = require('nodemailer');
const cache = require('../models/cache.js');

let util = require('./util.js');

/*
 * Sends email according to specified parameters 
 *
 * Exmple:
 *
 * exports.sendMail({
 *		s_email: 'sano199127@gmail.com',
 *		password: 'some_super_pass',
 *		r_email: 'rdischain@yandex.ru',
 *		cc_emails: 'sano911@i.ua',
 *		subject: 'hello',
 *		message: 'it is test'
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
		let transport = util.checkEmail(data.s_email);
		if (!transport) {
			reject(transport);
		}

		let smtpConfig = {
			service: transport.service,
			host: transport.host,
			port: 465,
			auth: {
				user: data.s_email,
				pass: data.password
			}
		};

		let mailOpts = {
			to: data.r_email,
			cc: data.cc_emails,
			subject: data.subject,
			text: data.message
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