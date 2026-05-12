// Conversion from HAR to Postman Input

const fs = require('fs');
const crypto = require('crypto');
const uuid = crypto.randomUUID();
const teleportJS = require('teleport-javascript');


function conversion()
{
    var collection = {};
    collection.item = [];

    try {
        const data = fs.readFileSync('./temp.har', 'utf8');
        const jsonData = JSON.parse(data);
        //console.log('Parsed JSON data:', jsonData.log.entries);
        // Now you can work with jsonData as a JavaScript object

        // straight forward in conversion
        for (i = 0; i < jsonData.log.entries.length; ++i)
        {
            entry = jsonData.log.entries[i];
            request = entry.request;

            console.log(request.url);
            console.log(request.method);
            console.log(request.httpVersion);
            console.log(request.cookies);
            console.log(request.headers);
            console.log(request.queryString);

            if (request.postData)
            {
                console.log(request.postData.mimeType);
                console.log(request.postData.text);
            }

            //console.log(entry.response);
            //console.log(request.headers);
            newrequest = {};
            newrequest.method = request.method;
            newrequest.headers = request.headers;
            newrequest.url = {};
            newrequest.url.raw = request.url;
            newrequest.url.protocol = "";
            newrequest.url.host = [];
            newrequest.url.path = [];
            newrequest.description = "";
            if (request.postData)
            {
                newrequest.body = {};
                newrequest.body.mode = "raw";
                newrequest.body.raw = request.postData.text;
                newrequest.body.options = { "raw" : { "language" : "json" } };
            }

            newitem = {};
            newitem.name = "";
            newitem.request = newrequest;
            newitem.response = [];
            newitem.event = [ { "listen" : "prerequest", "script" : { "type" : "text/javascript", "exec" : ""} } ];
            collection.item.push(newitem);

            const jsonString = JSON.stringify(collection, null, 2);

            const filePath = 'output.json';
            try {
                fs.writeFileSync("./toCollection.json", jsonString);
                console.log(`JSON data successfully written to ${filePath}`);
            } catch (err) {
                console.error('Error writing JSON data to file:', err);
            }

        }


    } catch (err) {
        console.error('Error reading or parsing file:', err);
    }
}

conversion();

/*
const script = `
  process.on('message', (message) => {
    if (message === 'ping') process.send('pong');
    if (message === 'exit') process.exit(0);
  });
`;
const child = child_process.fork('-e', [script]);

child.on('exit', (exitCode) => {
  console.log(`Child process exited with ${exitCode}`)
});

child.on('message', (message) => {
  if (message === 'pong') child.send('exit');
});

child.send('ping');
*/

/*
const child = child_process.fork("./lib/script.js");


child.on('message', (message) => {
    console.log('Message from child:', message);
});

child.send({ greeting: 'Hello child, I am your parent.' });
*/