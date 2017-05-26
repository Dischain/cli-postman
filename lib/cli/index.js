'use strict';

const fs = require('fs'),
      Spinner = require('cli-spinner').Spinner,
      prompt = require('prompt-sync')();


const validate = require('./validate.js');

const senders = require('../models/senders.js');
const recievers = require('../models/recievers.js');
const messages = require('../models/messages.js');
const mails = require('../models/mails.js');

const mailer = require('../mailer/index.js');

const spinner = new Spinner('sending mail.. %s');
spinner.setSpinnerString('|/-\\');

const flagsPath = __dirname + '/flags.json';
const errorsPath = __dirname + '/cli-errors.json';

let flags = [], errors = [];

const SUCCESS = 0,
      MISSING_OPTS = 1,
      INVALID_OPTS = 2,
      INVALID_EMAIL = 3,
      UNSPEC_EMAIL = 4,
      UNKNOWN_SEQ = 5,
      SUCCESS_SENT = 6;

function init() {
    const flagsString = fs.readFileSync(flagsPath).toString();
    const flagsObj = JSON.parse(flagsString);
    for (let item of Object.keys(flagsObj)) {
        flags.push(flagsObj[item].flag);
    }
    
    const errorsString = fs.readFileSync(errorsPath).toString();
    errors = JSON.parse(errorsString).errors;
}

init();

/*
 * returns error object if some error at input ocured
 */
exports.processInput = function(cliArgs, out) { //TODO: refactor it all!!!
    let args = cliArgs.slice(2);

    if (args.length <= 1 && args[0] != '-m' && args[0] != '-r' && args[0] != '-s') {     
        cb(errors[MISSING_OPTS]);
    }

    let cliFlags = getFlags(cliArgs);
    if (!validate.checkInputSemantics(cliFlags)) {
        cb(errors[UNKNOWN_SEQ]);
    }

    let invalidFlags = validate.validateFlags(cliFlags, flags);
    if (invalidFlags.length > 0) {
        let errorMsg = errors[INVALID_OPTS];
        errorMsg.invalidFlags = invalidFlags;
        cb(errorMsg);
    }

    if (cliFlags[0].flag == '-t' || cliFlags[0].flag == '-f') {
        let emails = args.slice(1);
        let invalidEmails = validate.validateEmails(emails);

        if (invalidEmails.length > 0) {
            let errorMsg = errors[INVALID_EMAIL];
            errorMsg.invalidEmails = invalidEmails;
            cb(errorMsg);
        } 
        else if (cliFlags[0].flag == '-t') {
            let to = emails[0], cc = emails.slice(1);
            recievers.save([to, cc]);
        } 
        else if (cliFlags[0].flag == '-f') {
            let password = null;
            password = prompt('enter password:', {echo: '*'});
            return senders.save([emails[0], password]).then(cb);
        }
    } else if (cliFlags[0].flag == '-m') {
        let subject, message = '';
        subject = prompt('enter email subject:');
        message = prompt('enter your message:')
        messages.save([subject, message])
            .then(cb)
    } else if (cliFlags[0].flag == '-s') {
        mails.save()
            .then((data) => {
                spinner.start();
                return mailer.sendMail(data[0])
            })
            .then(() => { 
                let result = {};
                result = errors[SUCCESS_SENT];                
                spinner.stop(' '); 
                cb(result);
            });
    } else if (cliFlags[0].flag == '-r') {
        let from, to;
        let opts = args.slice(1);

        let last = opts.filter((item) => {
            return /^\d+$/.test(item);
        });
        if (last[0]) {
            last = last[0];
            let lastId = opts.indexOf(last);            
            if (lastId == 2) {
                from = opts[0];
                to = opts[1]
            } else if (lastId == 1) {
                from = opts[0];
            }
        } else {
            last = undefined;
            if (opts.length == 2) {
                from = opts[0];
                to = opts[1]
            } else {
                from = opts[0];
            }
        }
        let conf = { from: from, to: to, last: last };
        mails.retrieve(conf).then((data) => {
            let result = {};
            result = errors[SUCCESS];
            result.data = data;
            cb(result);
        }).catch((err) => console.log(err))
    }
}

/*
 * returns error object if some error at input ocured
 */
function getFlags(args) {
    let flags = args.map((arg, index) => {
        if (arg.startsWith('-')) {
            return { flag: arg, index: index };
        } else {
            return null;
        }
    });
    return flags.filter((flag) => {     
        return flag != null;
    })
}

function cb(res) {
    if (res.code != SUCCESS) {
        if (res.code == INVALID_OPTS) {
            console.log(res.message + res.invalidFlags);
        } else if (res.code == INVALID_EMAIL) {
            console.log(res.message + res.invalidEmails);
        } else {
            console.log(res.message);
        }
        process.exit(1);
    } else {
        res.data.forEach((item) => {
            console.log('from: ' + item.s_email);
            console.log('to: ' + item.r_email);
            console.log('cc: ' + item.cc_emails);
            console.log('subject: ' + item.subject);
            console.log(item.message);
            console.log('date: ' + item.timestamp);
            console.log(new Array(80).join('-'))
        })
        //console.log(res.data);
        process.exit(0);
    }
}
//processInput(['nodejs', 'clp'], cb);
//processInput(['nodejs', 'clp', '-o', '-f', '-r'], cb);
//processInput(['nodejs', 'clp', '-t', '-f', '-r'], cb);
//processInput(['nodejs', 'clp', '-o', 'dadad'], cb);
//processInput(['nodejs', 'clip', '-t', 'dadad', 'vasya@huyandex.ru'], cb);
//processInput(['nodejs', 'clp', '-f', 'vasya@huyandex.ru'], cb);
//processInput(['nodejs', 'clp', '-m'], cb);
//processInput(['nodejs', 'clp', '-r', 's@mail.com', 'r@mail.com', '10'], cb);
/*processInput(['nodejs', 'clp', '-r', 's@mail.com', '10'], cb);
processInput(['nodejs', 'clp', '-r', 's@mail.com', 'r@mail.com'], cb);*/

//processInput(['nodejs', 'clp', '-f', 'sano199127@gmail.com'], cb);
//processInput(['nodejs', 'clp', '-t', 'rdischain@yandex.com', 'sano911@i.ua'], cb);
//processInput(['nodejs', 'clp', '-m'], cb);
//processInput(['nodejs', 'clp', '-s'], cb);
//processInput(['nodejs', 'clp', '-r'], cb);
//processInput(['nodejs', 'clp', '-r', 'sano199127@gmail.com', '3'], cb);