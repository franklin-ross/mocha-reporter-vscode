# mocha-reporter-vscode

*A mocha reporter for displaying test results as build failures and warnings in VSCode*

Outputs results from mocha in a way that's easy to consume using VSCode's problem matchers. Includes searching into stack traces and source files to find line and column numbers where possible.

**Run mocha tests**

```
mocha --reporter mocha-reporter-vscode
```

**Sample VSCode task**
```
{
  // See https://go.microsoft.com/fwlink/?LinkId=733558
  // for the documentation about the tasks.json format
  "version": "0.1.0",
  "command": "npm",
  "args": ["run"],
  "isShellCommand": true,
  "tasks": [
    {
      "taskName": "test",
      "showOutput": "never",
      "problemMatcher": {
        "owner": "mocha",
        "fileLocation": [ "absolute" ],
        "pattern": {
            "regexp": "^\\s*([^\\(]+)\\((\\d+,\\d+)\\):\\s*(error|warning|info):\\s*(.*)$",
            "file": 1,
            "location": 2,
            "severity": 3,
            "message": 4
        }
      }
    }
  ]
}
```