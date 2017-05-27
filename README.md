# cli-postman

[cli-postman](https://github.com/Dischain/cli-postman) is a simple command line tool for sending emails via yandex and google transport on [Node.js](https://nodejs.org) based on awesome [nodemailer](https://github.com/nodemailer/nodemailer) module.

## Quick start

### Installing

I did not published it with `npm`, so if you want to try, just clone this repo to your computer, ```cd``` to project folder and print:

```
npm install -g
```

### Options

```-f [SENDER EMAIL]...``` - set the sender`s email and passord. Example:

```clp -f my_awesome_email@xxx.com```
This should save seder email and prompts to enter corresponding password


```-t [RECIEVER EMAIL, [CC_ENAILS]]...``` - set reciever`s email and all the copies. Example:

```clp -t my_dear_friend@xxx.com my_another_dear_friend@xxx.com```


```-m``` - prompts to enter mail subject and text


``-s``` - send email with last entered credentials and stores it in local ```mysql``` storage


```-r [SENDER EMAIL] [RECIEVER EMAIL] [LIMIT]``` - retrieves last sent emails. Example:

```clp -r my_awesome_email@xxx.com my_dear_friend@xxx.com 10```
This should outputs last emails, sent from first email to second email, limited by 10.

```clp -r my_awesome_email@xxx.com 10```
This should outputs last 10 emails sent from specified email.

```clp -r 10```
This should outputs last 10 emails.


```clp -r```
This should print all sent emails.


```--help``` - should print short help information.


## Dependencies

* [nodemailer](https://github.com/nodemailer/nodemailer) - sends emails
* [sqlite3](https://github.com/mapbox/node-sqlite3) - asynchronous sqlite bindings for Node.js.
* [cli-spinner](github.com/helloIAmPau/node-spinner) - simple and pretty cli spinner.
* [prompt-sync](github.com/0x00A/prompt-sync) -a sync prompt for Node.js.