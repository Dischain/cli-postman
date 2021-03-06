'use strict';

exports.getLastInsertId_q = 'select last_insert_rowid()';

/*
 * returns string to append at the initial insert query
 * with insertable values
 */
exports.getValsToInsertAsStr = function(data) {
    let str = '(';

    for (let i = 0; i < data.length; i++) {
        let value = data[i];

        if (typeof value === 'string') {
            str += '"';
            str += value;
            str += '"';
        } else if (value instanceof Array)  {
            str += '"';
            str += /*JSON.stringify(value)*/value;
            str += '"';
        } else {
            str += value;
        }

        //append a comma if it is not last value
        if (i < data.length - 1) {
            str += ', ';
        }
    }
    str += ')';
    return str;
}

/*
 * returns string to append at the initial update query
 * with updatable values
 */
exports.getValsToUpdateAsStr = function(data) {
    let fields = Object.keys(data);
    let str = '';

    for (let i = 0; i < fields.length; i++) {
        let field = fields[i];
        let value = data[field];

        str += field + ' = ';

        if (typeof value === 'string') {
            str += '"';
            str += value;
            str += '"';
        } else {
            str += value;
        }

        //append a comma if it is not last value
        if (i < fields.length - 1) {
            str += ', ';
        }
    }

    return str;
}

exports.sqlite_run = function(db, sql, data) {
    let fullQuery = sql;

    if (data) {     
        fullQuery += util.getValsToInsertAsStr(data);
    }
    return new Promise((resolve, reject) => {
        db.run(fullQuery, (err) => {
            if (err) {
                console.log(err) //<- debug
                return reject(err);
            } else {
                resolve();
            }
        });
    });
}

exports.sqlite_all = function(db, sql) {
    return new Promise((resolve, reject) => {
        db.all(sql, (err, result) => {
            if (err) {
                console.log(err) //<= debug
                return reject(err);
            } else {
                resolve(result);
            }
        })
    })
}