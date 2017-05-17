'use strict';

const sqlite3 = require('sqlite3').verbose();

const database = new sqlite3.Database('clp.db');

//export to separate file, use salt for password
const createSendersTable_q = 'create table if not exists '
	+ 'senders (id integer primary key autoincrement not null, ' 
	+ 's_email char(30) not null, password char(30) not null)';
const insertSendersTable_q = 'insert into senders (s_email, password) values ';
const selectAllSenders_q = 'select * from senders';

const createRecieversTable_q = 'create table if not exists '
	+ 'recievers (id integer primary key autoincrement not null, '
	+ 'r_email char(30) not null)';
const insertRecieversTable_q = 'insert into recievers (r_email) values ';
const selectAllRecievers_q = 'select * from recievers';

const createMessagesTable_q = 'create table if not exists '
	+ 'messages (id integer primary key autoincrement not null, '
	+ 'message text)';
const insertMessagesTable_q = 'insert into messages (message) values ';
const selectAllMessages_q = 'select * from messages';

const createMailsTable_q = 'create table if not exists '
	+ 'mails (id integer primary key autoincrement not null, '
	+ 'sender_id integer not null, reciever_id integer not null, '
	+ 'message_id integer not null, '
	+ 'timestamp datetime default current_timestamp not null, '
	+ 'foreign key(sender_id) references senders(id), '
	+ 'foreign key(reciever_id) references recievers(id), '
	+ 'foreign key(message_id) references messages(id))';
const insertMails_q = 'insert into mails (sender_id, reciever_id, message_id) values ';
const selectAllMails_q = 'select * from mails';

const lastInsertId_q = 'select last_insert_rowid()';

function runQuery(sql, data) {
	console.log(sql)
	console.log(data)
	let fullQuery = sql;

	if (data) {
		fullQuery += '(';
		let fields = Object.keys(data);
		for (let i = 0; i < fields.length; i++) {
			let field = fields[i];
			if (typeof data[field] === 'string') {		
				fullQuery += '"';
				fullQuery += data[field];
				fullQuery += '"';
			} else {
				fullQuery += data[field];
			}		

			if (i < fields.length - 1) {
				fullQuery += ', '
			}
		}
		fullQuery += ');';
		console.log(fullQuery);
	}
	return new Promise((resolve, reject) => {
		database.run(fullQuery, (err) => {
			if (err) {
				console.log(err) //<- debug
				return reject(err);
			} else {
				resolve();
			}
		});
	});
}

function allQuery(sql) {
	return new Promise((resolve, reject) => {
		database.all(sql, (err, result) => {
			if (err) {
				console.log(err)
				return reject(err);
			} else {
				resolve(result);
			}
		})
	})
}

/*runQuery(createSendersTable_q)
	.then(() => { runQuery(insertSendersTable_q, { s_email: 'sano911@gmail.com', password: 'sanoman11' }); })
	.catch((err) => { console.log(err); })*/
/*allQuery(selectAllSenders_q)
	.then((rows) => { console.log(rows); })*/

/*runQuery(createRecieversTable_q)
	.then(() => { runQuery(insertRecieversTable_q, { email: 'pisunov@ya.ru' }); })
	.catch((err) => { console.log(err); })*/
/*allQuery(selectAllRecievers_q)
	.then((rows) => { console.log(rows); });*/

/*runQuery(createMessagesTable_q)
	.then(() => { runQuery(insertMessagesTable_q, { message: 'hello, pupok!' }); })
	.catch((err) => { console.log(err); })*/
/*allQuery(selectAllMessages_q)
	.then((rows) => { console.log(rows); });*/

/*runQuery(createMailsTable_q)
	.then(() => { runQuery(insertMails_q, {
		sender_id: 2,
		reciever_id: 1,
		message_id: 2,
	}); })
	.catch((err) => { console.log(err); })*/
/*allQuery(selectAllMails_q)
	.then((rows) => { console.log(rows); });*/

let selectSomeMails_q = 'select email, password, message_id, reciever_id, timestamp '
	+ 'from senders inner join mails on senders.id = mails.sender_id';
let selectAllMailsTest_q = 'select * from mails '
	//+ 'inner join senders on mails.sender_id = senders.id '
	//+ 'inner join recievers on mails.reciever_id = recievers.id '
	+ 'inner join messages on mails.message_id = messages.id '
	+ 'inner join senders on mails.sender_id = senders.id '
	+ 'inner join recievers on mails.reciever_id = recievers.id '
	+ 'where senders.s_email = "sano911@ya.ru" order by timestamp desc limit 1;'
allQuery(selectAllMailsTest_q)
	.then((rows) => { console.log(rows) })
	/*.then(() => { runQuery('drop table senders') })
	.then(() => { runQuery('drop table recievers') })*/
