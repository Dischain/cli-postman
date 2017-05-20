'use strict';

const db = require('../db').db;
const util = require('../db/util.js');
const cache = require('./cache.js');

const createSendersTable_q = 'create table if not exists '
    + 'senders (id integer primary key autoincrement not null, ' 
    + 's_email char(30) not null, password char(30) not null)';
const insertSendersTable_q = 'insert into senders (s_email, password) values ';
const selectAllSenders_q = 'select * from senders';

/*
 * recieves array of column values
 */
exports.save = function(data) {
    let fullQuery = insertSendersTable_q + util.getValsToInsertAsStr(data);
    
    util.sqlite_run(db, createSendersTable_q)
        .then(() => { return util.sqlite_run(db, fullQuery) })
        .then(() => { return util.sqlite_all(db, util.getLastInsertId_q); })
        .then((data) => {             
            let rowId = data['0']['last_insert_rowid()'];            
            cache.save({ lastInsertedSenderId: rowId }) ;
        })        
}