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

/*
 * recieves array of column values
 */
exports.save = function(data) {
    let fullQuery = insertRecieversTable_q + util.getValsToInsertAsStr(data);
    
    return sqlite_run(db, createRecieversTable_q)
        .then(() => { return sqlite_run(db, fullQuery) })
        .then(() => { return sqlite_all(db, util.getLastInsertId_q); })
        .then((result) => {             
            let rowId = result['0']['last_insert_rowid()'];
            console.log(rowId)            
            return cache.save({
                lastInsertedRecieversIds: rowId
            });
        });        
}

//exports.save(['reciever@yahoo.ru', ['cc2@ya.ru', 'hu@yandex.ru']]);