'use strict';

const db = require('../db').db;
const util = require('../db/util.js');
const sqlite_run = require('../db/util.js').sqlite_run;
const sqlite_all = require('../db/util.js').sqlite_all;
const cache = require('./cache.js');

const createSendersTable_q = 'create table if not exists '
    + 'senders (id integer primary key autoincrement not null, ' 
    + 's_email char(30) not null, password char(30) not null)';
const insertSendersTable_q = 'insert into senders (s_email, password) values ';
const selectAllSenders_q = 'select * from senders';

/*
 * Save sender email and password into databases, caches it as last
 * used and stores last inserted row id
 *
 * Example:
 *
 * senders.save(['your@email.com', 'secret!'])
 *     .then(() => { return cache.getLastUsedSender(); })
 *     .then((data) => { console.log(data); })
 *     .then(() => { return cache.getLastInsertedIds(); })
 *     .then((data) => { console.log(data); })
 *
 * @param {Object} array of two strings - first is a sender`s email,
 * second is a sender`s password
 * @return {Promise}
 * @public
 */
exports.save = function(data) {
    let fullQuery = insertSendersTable_q + util.getValsToInsertAsStr(data);
    
    return sqlite_run(db, createSendersTable_q)
        .then(() => { return sqlite_run(db, fullQuery) })
        .then(() => { return sqlite_all(db, util.getLastInsertId_q); })
        .then((result) => {             
            let rowId = result[0]['last_insert_rowid()'];
            return cache.save({
                lastUsedSender: data[0],
                lastUsedPassword: data[1],
                lastInsertedSenderId: rowId
            });
        });        
}