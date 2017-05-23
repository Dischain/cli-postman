'use strict';

const db = require('../db').db;
const util = require('../db/util.js');
const sqlite_run = require('../db/util.js').sqlite_run;
const sqlite_all = require('../db/util.js').sqlite_all;
const cache = require('./cache.js');

const createRecieversTable_q = 'create table if not exists '
    + 'recievers (id integer primary key autoincrement not null, '
    + 'r_email char(30) not null, cc_emails text)';
const insertRecieversTable_q = 'insert into recievers (r_email, cc_emails) values ';
const selectAllRecievers_q = 'select * from recievers';
const selectById_q = 'select r_email, cc_emails from recievers '
    + 'where id = '

/*
 * Save reciever`s email and copy emails into databases
 * and stores last inserted row id
 *
 * Example:
 *
 * recievers.save(['your@email.com', ['1copy@mail.ecom', '2copy@email.com']])
 *     .then(() => { console.log('recievers saved'); })
 *
 * @param {Object} array of two strings - first is a reciever`s email,
 * second is an array of all copies
 * @return {Promise}
 * @public
 */
exports.save = function(data) {
    if (data.length == 1)
        data.push('');
    let fullQuery = insertRecieversTable_q + util.getValsToInsertAsStr(data);
    
    return sqlite_run(db, createRecieversTable_q)
        .then(() => { return sqlite_run(db, fullQuery) })
        .then(() => { return sqlite_all(db, util.getLastInsertId_q); })
        .then((result) => {             
            let rowId = result['0']['last_insert_rowid()'];
            return cache.save({
                lastInsertedRecieversIds: rowId
            });
        });        
}

/*
 * Returns promise to retrieve reciever`s emails and copy emails.
 *
 * @param {Number} row id
 * @return {Promise}
 * @public
 */
exports.getById = function(id) {
    let fullQuery = selectById_q + id;

    return sqlite_all(db, fullQuery);
}