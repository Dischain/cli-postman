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
const selectIndexes_q = 'select sender_id, reciever_id, message_id '
	+ 'from mails where id = ';

let selectAllMails_q = 'select mails.timestamp, senders.s_email, recievers.r_email, '
	+ 'recievers.cc_emails, messages.subject, messages.message from mails '
	+ 'inner join messages on mails.message_id = messages.id '
	+ 'inner join senders on mails.sender_id = senders.id '
	+ 'inner join recievers on mails.reciever_id = recievers.id ';

let selectAllMailsById_q = 'select mails.timestamp, senders.s_email, recievers.r_email, '
	+ 'recievers.cc_emails, messages.subject, messages.message from mails '
	+ 'inner join messages on mails.message_id = messages.id '
	+ 'inner join senders on mails.sender_id = senders.id '
	+ 'inner join recievers on mails.reciever_id = recievers.id '
	+ 'where mails.id = ';

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
					return sqlite_all(db, selectAllMailsById_q + rowId); });
		});
}

/*
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

exports.save().then((data) => { console.log(data)})