'use strict';
const fs = require("fs");

exports = module.exports = function mochaTscReporter (runner) {
  let passes = 0;
  let pending = 0;
  let failures = 0;
  let fileCache = {};

  runner.on('start', function () {
    console.info("mocha start");
  });

  runner.on('pass', function (test) {
    ++passes;
    //console.info(formatTest(test, "info", "Mocha test pass:"));
  });

  runner.on('pending', function (test) {
    ++pending;
    console.warn(formatTest(test, "warning", "Test pending:"));
  });

  runner.on('fail', function (test, err) {
    failures++;
    test.err = err;
    console.warn(formatTest(test, "error", "Test failed:"));
  });

  runner.on('end', function () {
    fileCache = {};
    console.info(`mocha end { pass: ${passes}, fail: ${failures}, run: ${passes + failures} }`);
  });

  function getFileContents(filename) {
    return fileCache[filename] ||
      (fileCache[filename] = fs.readFileSync(filename, "utf8").replace(/\r\n|\r/g, "\n"));
  }

  function formatTest(test, severity, prefix) {
    const location = findLocation(test);

    const message = [];
    if (prefix) {
      message.push(prefix);
    }
    if (test.err) {
      message.push(`${test.err.message || test.err.toString()} in`);
    }
    const name = [test.title];
    let parent = test.parent;
    while (parent) {
      name.push(parent.title);
      parent = parent.parent;
    }
    name.reverse();
    message.push(... name);

    return `${test.file}(${location}):${severity}:${message.join(" ")}`;
  }

  function findLocation(test) {
    let location = null;
    const stack = test.err && (test.err.stack || test.err.message);
    if (stack != null) {
      const match = /(\d+)[,;:](\d+)/.exec(stack);
      if (match.length > 0) {
        location = `${match[1]},${match[2]}`;
      }
    }
    if (location == null && test.body) {
      const file = getFileContents(test.file);
      const testBody = test.body.replace(/\r\n|\r/g, "\n");
      const i = file.indexOf(testBody);
      location = getLocationInFile(file, i);
    }
    if (location == null && test.title) {
      const file = getFileContents(test.file);
      const i = file.indexOf(test.title);
      location = getLocationInFile(file, i);
    }
    return location || "0,0";

    function getLocationInFile(fileContents, position) {
      if (fileContents && position >= 0) {
        const matches = fileContents.substr(0, position).match(/\n/g);
        const col = matches.length + 1; //Col is 1 based.
        return `${col},0`;
      }
    }
  }
}