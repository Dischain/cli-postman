'use strict';

const db = require('../db').db;
const util = require('../db/util.js');
const sqlite_run = require('../db/util.js').sqlite_run;
const sqlite_all = require('../db/util.js').sqlite_all;

const createCacheTable_q = 'create table if not exists '
	+ 'cache (lastUsedSender char(30), lastUsedPassword char(30), ' 
	+ 'lastInsertedSenderId integer, lastInsertedRecieversIds integer, '
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
	let cache;

	return sqlite_run(db, createCacheTable_q)
		.then(() => { return sqlite_all(db, selectAllCache_q); })
		.then((result) => { 
			cache = result;			
			if (cache.length < 1) {
				let insertEmptyRow_q = insertCacheTable_q 
					+ util.getValsToInsertAsStr(
						[null, null, null, null, null])
				return sqlite_run(db, insertEmptyRow_q)
					.then(() => { 
						let updQuery = updateTable_q + util.getValsToUpdateAsStr(data)
						return sqlite_run(db, updQuery)
					});
			} else {
				let updQuery = updateTable_q + util.getValsToUpdateAsStr(data);
				return sqlite_run(db, updQuery);
			}
		})
}

exports.getLastInsertedIds = function() {
	return sqlite_all(db, selectLastInsertedIds_q);
}

exports.getLastUsedSender = function() {
	return sqlite_all(db, selectLastUsedSender_q);
}