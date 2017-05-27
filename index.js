#!/usr/bin/env node

'use strict';

const cli = require('./lib/cli');

cli.processInput(process.argv, console.log);