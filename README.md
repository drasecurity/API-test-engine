# API-test-engine
API Test Engine - test API accuracy and efficiency

## Installation
scriptengine can be installed using NPM or directly from the git repository within your NodeJS projects. If installing from NPM, the following command installs the module and saves in your `package.json`

```console
$ npm install scriptengine --save
```

## Usage

To compile:

```javascript
npx tsc lib/runCollection.ts
```

To run:
```
npx tsx lib/runCollection.ts <collection json file> <output newman ctrf json>
```

To run compiled:
```
node lib/runCollection.js <collection json file> <output newman ctrf json>
```

Example run and response
```
test/example.dev.0.json
test/ctrf.output.0.json
```

