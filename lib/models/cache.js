'use strict';

const db = require('../db').db;
const util = require('../db/util.js');

const createCacheTable_q = 'create table if not exists '
	+ 'cache (lastUsedSender char(30), lastUsedPassword char(30), ' 
	+ 'lastInsertedSenderId integer, lastInsertedRecieversIds text, '
	+ 'lastInsertedMessageId integer)';
const insertCacheTable_q = 'insert into cache ' 
	+ '(lastUsedSender, lastUsedPassword, lastInsertedSenderId, '
	+ 'lastInsertedRecieversIds, lastInsertedMessageId) values ';
const selectAllCache_q = 'select * from cache';
const selectLastInsertedIds_q = 'select lastInsertedSenderId, lastInsertedRecieversIds, '
	+ 'lastInsertedMessageId from cache';
const selectLastUsedSender_q = 'select lastUsedSender, lastUsedPassword from cache';
const updateTable_q = 'update cache set ';

exports.save = function(data) {
	db.serialize(() => {
		db.run(createCacheTable_q);

		let cache;
		db.all(selectAllCache_q, (err, result) => {
			if (err) console.log(err)
			cache = result;			

			if (cache.length < 1) {				
				let insertEmptyRow_q = insertCacheTable_q 
					+ util.getValsToInsertAsStr(
						[null, null, null, null, null])
				util.sqlite_run(db, insertEmptyRow_q)
					.then(() => { util.sqlite_run(db, updateTable_q 
						+ util.getValsToUpdateAsStr(data))})
			} else {
				let updQuery = updateTable_q + util.getValsToUpdateAsStr(data);
				console.log('if l >= 1: ' + updQuery);
				db.run(updQuery);
			}			
		});
	});
}

exports.getLastInsertedIds = function() {
	return util.sqlite_all(db, selectLastInsertedIds_q);
}

exports.getLastUsedSender = function() {
	return util.sqlite_all(db, selectLastUsedSender_q);
}

//exports.save({lastUsedPassword: 'sashok-pirojok'});
//db.all(selectAllCache_q, (err, row) => { console.log(row); })