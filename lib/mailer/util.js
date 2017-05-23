'use strict'

const transports = require('./transports.js')

/*
 * Checks whether nodemailer transports supports specified email domain
 * @param {String} email to check
 * @return {Boolean}
 */
exports.checkEmail = function(email) {
    let domain = email.split('@')[1];
    let services = Object.keys(transports);    

    let availableTransports = services.reduce((init, transport) => {
        return init.concat(transports[transport].domains);
    }, []);
    return availableTransports.indexOf(domain) != -1;
}