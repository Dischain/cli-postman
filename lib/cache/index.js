'use strict';

let tempFromEmail,
	tempToEmails,
	tempPassword,
	tempMessage;

let lastUsedEmail;

exports.storeFromEmail = function(email) {
	lastUsedEmail = tempFromEmail = email;
}

exports.storeToEmails = function(emails) {
	tempToEmails = emails;
}

exports.storePassword = function(pas) {
	tempPassword = pas;
}

exports.storeMesage = function(msg) {
	tempMessage = msg;
}

exports.clearTempData = function(msg) {
	tempFromEmail = tempToEmails = tempPassword = tempMessage = null;
}

exports.getFromEmail = function() {
	return tempFromEmail;
}

exports.getToEmails = function() {
	return tempToEmails;
}

exports.getPassword = function() {
	return tempPassword;
}

exports.getMessage = function() {
	return tempMessage;
}

exports.getLastUsedEmail = function() {
	return lastUsedEmail;
}