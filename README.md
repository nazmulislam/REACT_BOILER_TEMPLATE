**For React Front End**

Create Component Files:

`export PHP_INTERPRETER_PATH='/usr/local/bin/php' && node node_modules/goenterprise-cli/bin/index.js create {ComponentName} --all`

This will create a folder in the src/Pages/{TheComponentName} and the src/components/{TheComponentName} [--component]
please note at least one component is required

The option `--component` or `-c `will generate the component

The option `--menu` or `-m` will generate the menu files

The option `--route` or `-r` will generate the route files

The option `--all` or `-a` will generate the e react components and the backend API files (Domain, Model, Route, Phinx)

The option `--backend` or `-b` will generate the backend API files (Domain, Model, Route)

The option `--phinx` or `-p` will generate the phinx file

The option `--exlude_menu` or `-em` will exclude the react menu

The option ` --exclude_rbac` or `-er` will exclude the moduleValues creation for PHP routes


**IMPORTANT**

you will need to add a route in the src/Routes/private-routes.ts and in the appMenuItems,ts for it to appear on the menu**

**IMPORTANT**

export PHP_INTERPRETER_PATH='/usr/local/bin/php' && node node_modules/goenterprise-cli/bin/index.js create {ComponentName} -a
