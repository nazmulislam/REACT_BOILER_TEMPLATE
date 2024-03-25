#!/usr/bin/env node

const { program } = require('commander')
const figlet = require("figlet");

console.log(figlet.textSync("Module Creator"));
const create = require('../lib/create-app.cjs')
program
    .command('create <componentName>')
    .description('Create react component')
    .action(create)
    .option('-c, --component', 'create the react component')
    .option('-m, --menu', 'create the menu file in react')
    .option('-r, --react_route', 'create the route file in react')
    .option('-p, --phinx', 'create the phinx')
    .option('-b, --backend', 'create the backend api files')
    .option('-a, --all', 'create component with the api and react component')
    .option('-em, --exclude_menu', 'Do not create menu')
    .option('-er, --exclude_rbac', 'Do not create RBAC Module')
    .option('-pre, --prefix <value>', 'set the identifiers prefix for the component')


    program.parse(process.argv);
    
   





