'use strict';

const sqlite3 = require('sqlite3').verbose();

const database = new sqlite3.Database('clp.db');

//export to separate file, use salt for password
const createSendersTable_q = 'create table if not exists '
	+ 'senders (id integer primary key autoincrement not null, ' 
	+ 'email char(30) not null, password char(30) not null)';
const insertSendersTable_q = 'insert into senders (emai, password) values '	;
const selectAllSenders_q = 'select * from senders';

const createRecieversTable_q = 'create table if not exists '
	+ 'recievers (id integer primary key autoincrement not null, '
	+ 'email char(30) not null)';
const insertRecieversTable_q = 'insert into recievers (emai) values ';
const selectAllRecievers_q = 'select * from recievers';

const createMailsTable_q = 'create table if not exists '
	+ 'mails (id integer primary key autoincrement not null, '
	+ 'sender_id integer not null, reciever_id integer not null, '
	+ 'message text, '
	+ 'timestamp datetime default current_timestamp not null, '
	+ 'foreign key(sender_id) references senders(id), '
	+ 'foreign key(reciever_id) references recievers(id))';
const insertMails_q = 'insert into mails (sender_id, reciever_id, message) values ';
const selectAllMils_q = 'select * from mails';

const lastInsertId_q = 'select last_insert_rowid()';

function runQuery(sql, data) {
	let fullQuery = '', dataToArray;
	if (data) {
		if (data.join && data.length >= 1) { //if it is an array
			fullQuery += sql + '("' +data.join('", "') + '");';
			console.log('if array with more than one item:\n' + fullQuery); //debug_mode
		} else {
			dataToArray = [].concat('"' + data + '"');
			fullQuery += sql + ' (' +dataToArray + ');';
			console.log('if array with one item:\n' + fullQuery); //debug_mode
		}
	} else {		
		fullQuery = sql + ';';
		console.log('if not an array:\n' + fullQuery); //debug_mode
	}
	return new Promise((resolve, reject) => {
		console.log('running query...')
		database.run(fullQuery, (err) => {
			if (err) {
				console.log('rejecting query');
				return reject(err);
			} else {
				console.log('resoving query...')
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
				console.log(/*'rows at "allQuery": ' + */result)
				resolve(result);
			}
		})
	})
}

runQuery(createSendersTable_q)
	.then(() => { runQuery(insertSendersTable_q, ['sano911@ya.ru', 'sanoman11']); })
	//.then(() => { allQuery(selectAllSenders_q); })
	.then(() => { allQuery(lastInsertId_q) })
