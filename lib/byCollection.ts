// byCollection via the engine 

const fs = require('fs');
const crypto = require('crypto');
const uuid = crypto.randomUUID();
const { request } = require('http');
const fetch = require("node-fetch");

function makeSynchronousRequest(url, method) {
  const xhr = new XMLHttpRequest();
  xhr.open(method, url, false); // The 'false' makes the request synchronous
  xhr.send();

  if (xhr.status === 200) {
    return xhr.responseText;
  } else {
    console.error("Synchronous request failed:", xhr.status, xhr.statusText);
    return null;
  }
}

async function fetchDataSynchronously(url, method) {
  try {
    const response = await fetch(url); // Await the fetch call
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json(); // Await the JSON parsing
    console.log("Data fetched:", data);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Re-throw the error for further handling
  }
}

async function byCollection()
{
    // load a JSON file

    // pre-execute the script
    // running URL request each 
    // post-execute the script

    try {
            const data = fs.readFileSync('./toCollection.json', 'utf8');
            const jsonData = JSON.parse(data);
            //console.log('Parsed JSON data:', jsonData.log.entries);
            // Now you can work with jsonData as a JavaScript object
    
            // straight forward in conversion
            for (i = 0; i < jsonData.item.length; ++i)
            {
                entry = jsonData.item[i];
                var request = entry.request;
    
                console.log(request.url);
                console.log(request.method);
                //console.log(request.httpVersion);
                //console.log(request.cookies);
                console.log(request.headers);
                //console.log(request.queryString);
    
                console.log(request.body);

                var httpdata = await fetchDataSynchronously(request.url, request.method);
            }
    
    
        } catch (err) {
            console.error('Error reading or parsing file:', err);
        }

}

runCollection();
