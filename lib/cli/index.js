'use strict';

const fs = require('fs'),
      //co = require('co'),
      prompt = require('prompt-sync')();


const validate = require('./validate.js');
const cache = require('../cache/index.js');

const flagsPath = __dirname + '/flags.json';
const errorsPath = __dirname + '/cli-errors.json';

let flags = [], errors = [];

const SUCCESS = 0,
      MISSING_OPTS = 1,
      INVALID_OPTS = 2,
      INVALID_EMAIL = 3,
      UNSPEC_EMAIL = 4,
      UNKNOWN_SEQ = 5;

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
function processInput(cliArgs) {
    let args = cliArgs.slice(2);

    if (args.length <= 1) {     
        return errors[MISSING_OPTS];
    }

    let cliFlags = getFlags(cliArgs);

    if (!validate.checkInputSemantics(cliFlags)) {
        return errors[UNKNOWN_SEQ];
    }

    let invalidFlags = validate.validateFlags(cliFlags, flags);
    if (invalidFlags.length > 0) {
        let errorMsg = errors[INVALID_OPTS];
        errorMsg.invalidFlags = invalidFlags;
        return errorMsg;
    }

    if (cliFlags[0].flag == '-t' || cliFlags[0].flag == '-f') {
        let emails = args.slice(1);
        let invalideEmails = validate.validateEmails(emails);

        if (invalideEmails.length > 0) {
            let errorMsg = errors[INVALID_EMAIL];
            errorMsg.invalideEmails = invalideEmails;
            return errorMsg;
        } 
        else if (cliFlags[0].flag == '-t') {
            cache.storeToEmails(emails);
        } 
        else if (cliFlags[0].flag == '-f') {
            let password = null;
            password = prompt('enter password:', {echo: '*'});
            console.log(password)
            cache.storePassword(password);
        }
    }
    /*let emails = args.slice(1);
    if (cliFlags[0].flag == '-t') {
        cache.storeToEmails(emails);
    } else if (cliFlags[0].flag == '-f') {
        cache.storeFromEmail(emails);
    }
    console.log(emails);*/
    return errors[SUCCESS];
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

/*add invlid emails processing*/
/*console.log(validate.validateEmails('sano@yand.ru'));
console.log(validate.validateEmails(['sano@yand.ru', 'vasya@huyandex.ru', 'dsad']));
console.log(validate.validateEmails('dasdad'));*/

//console.log(processInput(['nodejs', 'clip', '-f', 'dasdasd']));
/*console.log(*/processInput(['nodejs', 'clip'])//);
/*console.log(*/processInput(['nodejs', 'clip', '-o', '-f', '-r'])//);
/*console.log(*/processInput(['nodejs', 'clip', '-t', '-f', '-r'])//);
/*console.log(*/processInput(['nodejs', 'clip', '-o', 'dadad'])//);
//console.log(processInput(['nodejs', 'clip', '-t', 'dadad', 'vasya@huyandex.ru']));
console.log(processInput(['nodejs', 'clip', '-f', 'vasya@huyandex.ru']));

//console.log('to emails: ' + cache.getToEmails())
//console.log('from emails: ' + cache.getFromEmail())
console.log('pas: ' + cache.getPassword())