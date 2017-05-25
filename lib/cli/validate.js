'use strict';

const emailRE = /^[0-9a-z\.]+\@[0-9a-z-]{2,}\.[a-z]{2,}$/i;
const singleUsedFlags = ['-f', '-t', '-m', '-s', '--help'];

/* returns error code
 * if missing operands - code 1
 * invalid options - code 2
 */
exports.validateFlags = function(args, cliFlags) {  
    let invalidFlags = [];
    args.forEach((element, index) => {          
        if (cliFlags.indexOf(element.flag) == -1) {
            invalidFlags.push(element.flag) 
        }
    });
    return invalidFlags;
}

exports.checkInputSemantics = function(args) {
    let singleUsedFlag = '';
    for (let arg of args) {
        for (let flag of singleUsedFlags) {
            if (flag == arg.flag)
                singleUsedFlag = flag;
                break;
        }
    }
    if (singleUsedFlag != '' && args.length > 1) {
        return false;
    }

    return true;
}

exports.validateEmails = function(emails) {
    let invalidEmails = [];

    if (emails instanceof Array) {
        invalidEmails = emails.filter((email) => {
            return !checkEmail(email)                           
        });
    } else {
        if (!checkEmail(emails)) {
            invalidEmails.push(emails);
        }
    } 
    
    return invalidEmails;
}

function checkEmail(email) {
    let isValid = email.match(emailRE);
    return isValid;
}