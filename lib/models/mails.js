'use strict';

const db = require('../db').db;
const util = require('../db/util.js');
const sqlite_run = require('../db/util.js').sqlite_run;
const sqlite_all = require('../db/util.js').sqlite_all;
const cache = require('./cache.js');

const createMailsTable_q = 'create table if not exists '
	+ 'mails (id integer primary key autoincrement not null, '
	+ 'sender_id integer not null, reciever_id integer not null, '
	+ 'message_id integer not null, '
	+ 'timestamp datetime default current_timestamp not null, '
	+ 'foreign key(sender_id) references senders(id), '
	+ 'foreign key(reciever_id) references recievers(id), '
	+ 'foreign key(message_id) references messages(id))';
const insertMails_q = 'insert into mails (sender_id, reciever_id, message_id) values ';

/*SELECT Queries*/
//Select all indexes which are represtents email
const selectIndexes_q = 'select sender_id, reciever_id, message_id '
	+ 'from mails where id = ';
//Select default all mails ordered by data
const selectAllMails_q = 'select mails.timestamp, senders.s_email, recievers.r_email, '
	+ 'recievers.cc_emails, messages.subject, messages.message from mails '
	+ 'inner join messages on mails.message_id = messages.id '
	+ 'inner join senders on mails.sender_id = senders.id '
	+ 'inner join recievers on mails.reciever_id = recievers.id ';
//Select single mail by it id
const selectMailById_q = 'select mails.timestamp, senders.s_email, recievers.r_email, '
	+ 'recievers.cc_emails, messages.subject, messages.message from mails '
	+ 'inner join messages on mails.message_id = messages.id '
	+ 'inner join senders on mails.sender_id = senders.id '
	+ 'inner join recievers on mails.reciever_id = recievers.id '
	+ 'where mails.id = ';

/*
 * Save full mail data into database: 
 * 		- sender`s id foreign key;
 *		- reciever`s id foreign key;
 *		- message`s id foreign key;
 *		- sets current timestamp as default.
 *
 * This methode does not takes any parameters as function args, it`s only
 * retrieves all nesessary ids from db` cache.
 * It returns object which contains all relevant to this mail data, recieved
 * from db as inner join on sender, reciever and message
 * 
 * Example usage:
 *
 * senders.save(['some_user@gmail.com', 'super-duper-seret'])
 *		.then(() => { return recievers.save(['firstfriend@yahoo.com', 
 * 											['scnd@ya.ru', 'thrd@huyandex.com']]); })
 * 		.then(() => { return messages.save(['super important subj', 'mail text goes here...']); })
 * 		.then(() => { return mails.save(); })
 * 		.then((data) => { console.log(data); }); 
 *
 * This should outputs:
 * > [ { timestamp: '2017-05-23 19:04:39',
 *       s_email: 'some_user@gmail.com',
 *  	 r_email: 'firstfriend@yahoo.com',
 *  	 cc_emails: 'scnd@ya.ru,thrd@huyandex.com',
 *  	 subject: 'super important subj',
 *  	 message: 'mail text goes here...' } ]
 *
 * @return {Promise}
 * @public
 */
exports.save = function() {

	return sqlite_run(db, createMailsTable_q)
		.then(() => {
			return cache.getLastInsertedIds()
				.then((data) => {

					let fullQuery = insertMails_q + formQueryAppendix(data[0]);
					return sqlite_run(db, fullQuery);
				})
				.then(() => { return sqlite_all(db, util.getLastInsertId_q); })
				.then((id) => { 
					let rowId = id[0]['last_insert_rowid()'];
					return sqlite_all(db, selectMailById_q + rowId); });
		});
}
/*
 * Retrieves data acordig to specified options:
 * 
 *		- all: select all mails;
 *		- all from <email>: select all mails sent from <email>;
 *		- all to <email>: select all emails sent to <email>;
 *		- last <n> mails;
 *
 * @param {Object} with options
 * @return {Promise} to retrieve data from storage
 * @oublic
 */
exports.retrieve = function(opts) {	
	let fullQuery = selectAllMails_q + formQueryFromOpts(opts);
	return sqlite_all(db, fullQuery);
}

/*
 * Forms query appendix based on proper options
 *
 * Example:
 *
 * exports.retrieve({
 *	  from: 'some_user@gmail.com',
 * 	  last: 2
 * }).then((data) => { console.log(data); });
 *
 */
function formQueryFromOpts(data) {
	let result = '';
	
	if (data.from) {
		result += 'where senders.s_email = "' + data.from + '"';
	} else if (data.to) {
		result += 'where recievers.r_email = "' + data.from + '"';
	}

	result += ' order by timestamp ';;

	if (data.last) {
		result += ' limit ' + data.last;
	}

	return result;
}

/*
 * Forms last part of insert query string from object with data
 *
 * @return {Array}
 * @private
 */
function formQueryAppendix(data) {
	let keys = Object.keys(data);
	let result = new Array(3);

	keys.forEach((element) => {
		if (element == 'lastInsertedSenderId') {
			result[0] = data[element];
		} else if (element == 'lastInsertedRecieversIds') {
			result[1] = data[element];
		} else if (element == 'lastInsertedMessageId') {
			result[2] = data[element];
		}
	});

	return '(' + result.join(', ') + ')';
}