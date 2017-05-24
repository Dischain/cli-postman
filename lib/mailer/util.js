'use strict'

const transports = require('./transports.js')

/*
 * Checks whether nodemailer transports supports specified email domain
 * @param {String} email to check
 * @return {Object} service
 */
exports.checkEmail = function(email) {
    let domain = email.split('@')[1];
    let services = Object.keys(transports);    

    let validTransport = services.filter((service) => {
    	let domains = transports[service].domains;
    	return domains.indexOf(domain) != -1;
    })

    return transports[validTransport] || 'clp: unavailable email domain';	
}