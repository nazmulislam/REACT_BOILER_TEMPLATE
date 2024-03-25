const fs = require("fs");
const path = require("path");
const { pascalCase } = require("pascal-case");
const { camelCase } = require("camel-case");
const { snakeCase } = require("snake-case");
const { paramCase } = require("param-case");
const { EOL } = require("os");
const fsx = require("fs-extra");
var runner = require("child_process");
require("dotenv").config();
//const Console = path.resolve(__dirname + "/../../../web-app-api/Console.php");

const PHP = process.env.PHP_INTERPRETER_PATH;

// const insertLine = require('insert-line')

function createFiles(moduleName, srcPath, destinationPath,prefix="") {
  //joining path of directory
  const componentsDirectoryPath = path.join(__dirname, srcPath);
  const componentsDestinationPath = path.join(__dirname, destinationPath);
  fsx.ensureDir(componentsDestinationPath);
  //passsing directoryPath and callback function
  fs.readdir(componentsDirectoryPath, function (err, files) {
    //handling error
    if (err) {
      return console.log("Unable to scan directory: " + err);
    }
    //listing all files using forEach
    files.forEach(function (file) {
      let oldFileName = file;

      let newFileName = oldFileName.replace("Sample", pascalCase(moduleName));

      /**
       * Logic for updating each file
       */
      fs.copyFile(
        componentsDirectoryPath + "/" + file,
        componentsDestinationPath + "/" + newFileName,
        fs.constants.COPYFILE_EXCL,
        (err, data) => {
          if (err) {
            return console.log(err);
          }

          /**
           * TODO make into a function
           */
          fs.readFile(
            componentsDestinationPath + "/" + newFileName,
            "utf8",
            function (err, data) {
              if (err) {
                return console.log(err);
              }

              /**
               * TODO make into a function
               */
              var pascalText = pascalCase(moduleName);
              var uppercaseSnake = snakeCase(pascalText);
              var replace0 = data.replace(/sample/g, camelCase(pascalText));
              var replace1 = replace0.replace(/Sample/g, pascalText);
              var replace2 = replace1.replace(
                /TABLE_NAME/g,
                snakeCase(moduleName).toLowerCase()
              );
              var replace3 = replace2.replace(
                /table_primary_key_id/g,
                snakeCase(moduleName).toLowerCase() + "_id"
              );

              var replace4 = replace3.replace(/ROUTE/g, paramCase(moduleName));

              /**
               * Logic to
               */

              var toolBarText = upperCaseFirstWord(snakeCase(pascalText));

              var replace5 = replace4.replace(/HeadingText/g, toolBarText);

              var replace6 = replace5.replace(
                /title_field/g,
                snakeCase(moduleName).toLowerCase() + "_title"
              );

              var replace7 = replace6.replace(
                /title_label/g,
                upperCaseFirstWord(snakeCase(pascalText)) + " Title"
              );

              var identifier = snakeCase(moduleName).toLowerCase()
              if(prefix !== "") {
                prefix = prefix.toLowerCase()
                identifier = prefix + "." + identifier
              }
              
              var replace8 = replace7.replace(
                /module_scope/g,
                identifier
              );

              var result = replace8.replace(
                /SAMPLE/g,
                uppercaseSnake.toUpperCase()
              );

              /**
               * TODO make into a function
               */
              fs.writeFile(
                componentsDestinationPath + "/" + newFileName,
                result,
                "utf8",
                function (err) {
                  if (err) return console.log(err);
                }
              );
            }
          );
        }
      );
    });
  });
}

function upperCaseFirstWord(str) {
  const arr = str.split("_");
  for (var i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
  }
  return arr.join(" ");
}
function appendToFile(srcFile, filename) {
  var lines = fs.readFileSync(path.join(__dirname, srcFile)).toString();
  // .split("\n");

  if (!lines.includes(filename)) {
    let newLineBreak = `\n`;
    fs.appendFile(path.join(__dirname, srcFile), newLineBreak, (err) => {});

    fs.appendFile(path.join(__dirname, srcFile), filename, (err) => {
      console.log(err);
    });
  }
}

function insertIntoFileBySearchText(srcFile, data) {
  // returns true if OS in windows
  let lineFormat = /^win/i.test(process.platform) ? "\r\n" : "\n";
  var lines = fs
    .readFileSync(path.join(__dirname, srcFile))
    .toString()
    .split(lineFormat);

  data.map((string) => {
    let position = lines.findIndex((element) => element === string.searchText);

    lines.splice(
      string.insert === "after" ? position + 1 : position,
      0,
      string.new_text
    );
  });

  const writeStream = fs.createWriteStream(path.join(__dirname, srcFile));

  // write each value of the array on the file breaking line
  lines.forEach((value) => writeStream.write(`${value}\n`));

  // the finish event is emitted when all data has been flushed from the stream
  writeStream.on("finish", () => {
    console.log(`wrote all the array data to file $`);
  });

  // handle the errors on the write process
  writeStream.on("error", (err) => {
    console.error(`There is an error writing the file $ => $`);
  });

  // close the stream
  writeStream.end();

  // fs.readFile(path.join(__dirname, srcFile), function read(err, data) {
  //     if (err) {
  //         throw err;
  //     }
  //     var file_content = data.toString();
  //     file_content = file_content.substring(position);
  //     var file = fs.openSync(path.join(__dirname, srcFile),'r+');
  //     var bufferedText = Buffer.from(new_text+file_content)
  //     fs.writeSync(file, bufferedText, 0, bufferedText.length, position);
  //     fs.close(file);
  // });
}

function generatePhinxFile(moduleName) {
  runner.exec(
    PHP + " " + Console + " create:phinx-file " + pascalCase(moduleName),
    function (err, phpResponse, stderr) {
      if (err) console.log(err); /* log error */
      console.log("Phinx File has been created", phpResponse);
    }
  );
}

function generateSeedFile(moduleName) {
  runner.exec(
    PHP + " " + Console + " create:seed-file " + pascalCase(moduleName),
    function (err, phpResponse, stderr) {
      if (err) console.log(err); /* log error */
      console.log("Seed File has been created", phpResponse);
    }
  );
}

function generateBackendFiles(moduleName) {
  runner.exec(
    PHP + " " + Console + " create:dmr-files " + pascalCase(moduleName),
    function (err, phpResponse, stderr) {
      if (err) console.log(err); /* log error */
    }
  );
  runner.exec(
    PHP + " " + Console + " create:unit-test-class " + pascalCase(moduleName),
    function (err, phpResponse, stderr) {
      if (err) console.log(err); /* log error */
    }
  );
}

function generateRbacFiles(moduleName) {
  runner.exec(
    PHP + " " + Console + " create:rbac-file " + pascalCase(moduleName),
    function (err, phpResponse, stderr) {
      if (err) console.log(err); /* log error */
    }
  );
}

function createReactComponent(moduleName,prefix) {

 /**
   * Create Page
   */
 createFiles(
  moduleName,
  "../Templates/Page",
  "../../src/Pages"
);
appendToFile(
  "../../src/Pages/index.ts",
  `export * from "./${pascalCase(
    moduleName
  )}Module"`
);





  /**
   * Create Module
   */
  if(!prefix) {
    prefix = ""
  } 

  createFiles(
    moduleName,
    "../Templates/Module",
    "../../src/Modules/" + pascalCase(moduleName),prefix
  );
  appendToFile(
    "../../src/Modules/index.ts",
    `export * from "./${pascalCase(moduleName)}/${pascalCase(
      moduleName
    )}Module"`
  );

  /**
   * Insert the export of the reducer into src/store/Reducers/index.ts
   */
  appendToFile(
    "../../src/store/Reducers/index.ts",
    `${EOL}export * from "src/Modules/${pascalCase(moduleName)}/${pascalCase(
      moduleName
    )}Reducer"${EOL}`
  );

  // /**
  //  * Create Components
  //  */
  // createFiles(
  //   moduleName,
  //   "../Templates/Components",
  //   "../../src/Modules/" + pascalCase(moduleName)
  // );

  /**
   * Insert into state
   */
  let initalStateData = [
    {
      new_text: `import { ${pascalCase(
        moduleName
      )}InitalState } from "src/Modules/${pascalCase(moduleName)}/${pascalCase(
        moduleName
      )}InitalState";`,
      searchText: "const initialState = {",
      insert: "before",
    },
    {
      new_text: `...${pascalCase(moduleName)}InitalState,`,
      searchText: "const initialState = {",
      insert: "after",
    },
  ];
  insertIntoFileBySearchText(
    "../../src/store/initialState.ts",
    initalStateData
  );
}


function createAppMenu(moduleName) {
  /**
   * Insert the export of the reducer into src/store/Reducers/index.ts
   */
  appendToFile(
    "../../src/Menus/index.ts",
    `${EOL}export * from "src/Modules/${pascalCase(moduleName)}/${pascalCase(
      moduleName
    )}Menu"${EOL}`
  );

  // /**
  //  * Create menu file
  //  */
  // createFiles(
  //   moduleName,
  //   "../Templates/Menu",
  //   "../../src/Menus/"
  // );

  /**
   * Insert into ,appMenuItems
   */
  let appMenuItems = [
    {
      new_text: `${EOL}${pascalCase(moduleName)}Menu,`,
      searchText: "import { ",
      insert: "after",
    },

    {
      new_text: `${EOL} const ${pascalCase(
        moduleName
      )}MenuItems  = ${pascalCase(moduleName)}Menu(navigate,t);`,
      searchText: "export const appMenuItems = (navigate?: any, userDetail?: any, t?: any) => {",
      insert: "after",
    },
    {
      new_text: `...${pascalCase(moduleName)}MenuItems,`,
      searchText: "  return [",
      insert: "after",
    },
  ];
  insertIntoFileBySearchText("../../src/Routes/appMenuItems.ts", appMenuItems);
}

function createComponentRoute(moduleName,prefix="") {
  /**
   * Create Route
   */

  if(!prefix) {
    prefix = ""
  } 

  createFiles(
    moduleName,
    "../Templates/Route",
    "../../src/Routes/privateRoutes/",prefix
  );

  /**
   * Insert the export of the reducer into src/store/Reducers/index.ts
   */
  appendToFile(
    "../../src/Routes/privateRoutes/index.ts",
    `${EOL}export * from "src/Modules/${pascalCase(moduleName)}/${pascalCase(
      moduleName
    )}Routes"${EOL}`
  );

  /**
   * Insert into private routes
   */
  let privateRoutes = [
    {
      new_text: `${EOL}${pascalCase(moduleName)}Routes,`,
      searchText: "import { ",
      insert: "after",
    },
    {
      new_text: `...${pascalCase(moduleName)}Routes,`,
      searchText: "export const privateRoutes = [",
      insert: "after",
    },
  ];
  insertIntoFileBySearchText(
    "../../src/Routes/private-routes.ts",
    privateRoutes
  );
}

/**
 * This is the main function which is triggered
 * @param {} moduleName
 */
async function add(moduleName, options) {
  const {
    component,
    menu,
    react_route,
    phinx,
    backend,
    all,
    exclude_menu,
    exclude_rbac,
    prefix
  } = options;

  if (component) {
    createReactComponent(moduleName,prefix);
  }

  if (menu) {
    createAppMenu(moduleName);
  }
  if (react_route) {
    createComponentRoute(moduleName,prefix);
  }

  if (phinx) {
    generatePhinxFile(moduleName);
  }

  if (backend) {
    generateBackendFiles(moduleName);
  }

  if (all) {
    /**
     * React Front end
     */
    createReactComponent(moduleName);
    if (!exclude_menu) {
      createAppMenu(moduleName);
    }

    createComponentRoute(moduleName);

    /**
     * PHP Backend
     */
    generatePhinxFile(moduleName);
    generateBackendFiles(moduleName);

    generateSeedFile(moduleName);
    if (!exclude_rbac) {
      generateRbacFiles(moduleName);
    }
  }
}

module.exports = add;
