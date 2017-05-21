'use strict';

const db = require('../db').db;
const util = require('../db/util.js');
const sqlite_run = require('../db/util.js').sqlite_run;
const sqlite_all = require('../db/util.js').sqlite_all;
const cache = require('./cache.js');

const createMessagesTable_q = 'create table if not exists '
    + 'messages (id integer primary key autoincrement not null, '
    + 'subject text, message text)';
const insertMessagesTable_q = 'insert into messages (subject, message) values ';
const selectAllMessages_q = 'select * from messages';

/*
 * Save message subject and text into database and stores
 * it row id into cache.
 *
 * Example:
 *
 * messages.save(['hello, world', 'some long message text ...'])
 *     .then(() => { console.log('message saved'); })
 *
 * @param {Object} array of two strings -
 * first item is a message subject, and second - message text
 * @return {Promise}
 * @public
 */
exports.save = function(data) {
    let fullQuery = insertMessagesTable_q + util.getValsToInsertAsStr(data);
    
    return sqlite_run(db, createMessagesTable_q)
        .then(() => { return sqlite_run(db, fullQuery) })
        .then(() => { return sqlite_all(db, util.getLastInsertId_q); })
        .then((result) => {             
            let rowId = result[0]['last_insert_rowid()'];
            return cache.save({
                lastInsertedMessageId: rowId
            });
        });        
}