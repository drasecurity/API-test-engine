// runCollection via the engine 

import * as fs from 'fs';
import * as process from 'process';
import * as child_process from 'child_process';

async function fetchDataSynchronously(url: string, method: string) {
  try {
    console.log('fetching URL: ', url);
    if (url != undefined)
    {
      const response = await fetch(url); // Await the fetch call
      if (!response.ok) {
        //throw new Error(`HTTP error! status: ${response.status}`);
        return null;
      }
      const data = await response.json(); // Await the JSON parsing
      console.log("Response fetched: ", response);
      console.log("Data fetched:", data);
      return [response, data]
    }
    return null;
  } catch (error) {
    console.error("Error fetching data:", error);
    //throw error; // Re-throw the error for further handling
    return null;
  }
}

// CTRF report
interface Summary {
  tested: number;
  passed: number;
  failed: number;
  pending: number;
  skipped: number;
  other: number;
  start: number;
  stop: number;
}

interface Test {
  name: string;
  status: string;
  duration: number;
  message: string;
  trace: string[];
  data: string;
}

interface Result {
  summary: Summary;
  tests: Test[];
}


// Newman Summary
interface Cursor {
  position: number;
  iteration: number;
  length: number;
  cycles: number;
  empty: boolean;
  eof: boolean;
  bof: boolean;
  cr: boolean;
  ref: string;
  httpRequestId: string;
}

interface URL {
  protocol: string;
  path: string[];
  host: string[];
  query: string[];
  variable: string[];
}

interface RequestHeader {
  key: string;
  value: string;
  system: boolean;
}

interface Request {
  url: URL;
  header: RequestHeader[];
  method: string;
  body: string;
}

interface ResponseHeader {
  key: string;
  value: string;
}

interface Stream {
  type: string;
  data: string;
}

interface Response {
  id: string;
  status: string;
  code: number;
  header: ResponseHeader[];
  stream: Stream;
  cookie: string[];
  responseTime: number;
  responseSize: number;
}

interface Assertion {
  assertion: string;
  skipped: boolean;
}

interface Execution {
  cursor: Cursor;
  item: string[];
  request: Request;
  response: Response;
  id: string;
  assertions: Assertion[];
}

// Stats & Run
interface StatsItem {
  total: number;
  pending: number;
  failed: number;
}

interface Stats {
  iterations: StatsItem;
  items: StatsItem;
  scripts: StatsItem;
  prerequests: StatsItem;
  requests: StatsItem;
  tests: StatsItem;
  assertions: StatsItem;
  testsScripts: StatsItem;
  prerequestScripts: StatsItem;
}

interface Timings {
  responseAverage: number;
  responseMin: number;
  responseMax: number;
  responseSd: number;
  dnsAverage: number;
  dnsMin: number;
  dnsMax: number;
  dnsSd: number;
  firstByteAverage: number;
  firstByteMin: number;
  firstByteMax: number;
  firstByteSd: number;
  started: number;
}

interface Run {
  stats: Stats;
  timings: Timings;
  executions: Execution[];
  transfers: { responseTotal: number; };
  failures: string[];
  error: string[];
}

// Summary
interface Summary {
  collection: {};
  environment: { id: string; values: string[]; };
  globals: { id: string; values: string[]; };
  run: Run;

}

// Full
interface Main {
  cursor: Cursor;
  summary: Summary;
}



// Main code in collection processing & request & response running
async function runCollection(inputfile: string, outputfile: string)
{
    let summary: Summary = {
      tested: 0,
      passed: 0,
      failed: 0,
      pending: 0,
      skipped: 0,
      other: 0,
      start: 0,
      stop: 0,
    };

    let tests: Test[] = [

    ];

    let start = Date.now();
    // load a JSON file
    try {
            const data = fs.readFileSync(inputfile, 'utf8');
            const jsonData = JSON.parse(data);
            //console.log('Parsed JSON data:', jsonData.log.entries);
            // Now you can work with jsonData as a JavaScript object
    
            // straight forward in conversion
            for (let i = 0; i < jsonData.item.length; ++i)
            {
                let item = jsonData.item[i];
                var request = item.request;
    
                console.log(request.url);
                console.log(request.method);
         
                let test: Test = {
                  name: request.url,
                  status: "",
                  duration: 0,
                  message: "",
                  trace: [],
                  data: "",
                }

                // examine the item.event
                let event = item.event;
                if (item.event != null)
                {
                  console.log(item.event);
                  for (let j = 0; j < item.event.length; ++j)
                  {
                    let event = item.event[j];
                    
                    if (event != null && event.listen != null && event.listen == "prerequest" && event.script != null && event.script.exec != null)
                    {
                      let script = event.script.exec;
                      const child = child_process.fork('-e', [script]);

                      let output = '';
                      let errorOutput = '';

                      child.stdout.on('data', (data: string) => {
                          // Convert the Buffer to a string and append it
                          output += data.toString();
                      });

                      child.stderr.on('data', (data: string) => {
                          errorOutput += data.toString();
                      });
                      
                      test.trace.push(output);

                    }
                  }
                }

                let httpstart = Date.now();
                let ret = await fetchDataSynchronously(request.url.raw, request.method);
                if (ret != null)
                {
                  let response = ret[0];
                  let data = ret[1];
                  let httpend = Date.now();

                  summary.tested += 1;
                  test.duration = httpend - httpstart;
                  if (response != null)
                  {
                    test.status = response.statusText;

                    console.log(response);
                    test.data = JSON.stringify(data);
                    console.log(JSON.stringify(data));

                  }

                  // pass the data as new request
                  if (response != null)
                  {
                    summary.passed += 1;
                    // post-event handling
                    event = item.event;
                    if (item.event != null)
                    {
                      console.log(item.event);
                      for (let j = 0; j < item.event.length; ++j)
                      {
                        let event = item.event[j];
                        
                        if (event != null && event.listen != null && event.listen == "postresponse" && event.script != null && event.script.exec != null)
                        {
                          let script = event.script.exec;
                          const child = child_process.fork('-e', [script]);
                          
                          let output = '';
                          let errorOutput = '';

                          child.stdout.on('data', (data: string) => {
                              // Convert the Buffer to a string and append it
                              output += data.toString();
                          });

                          child.stderr.on('data', (data: string) => {
                              errorOutput += data.toString();
                          });
                          
                          test.trace.push(output);
                        }
                      }
                    }
                  }
                  else 
                  {
                    summary.failed += 1;
                  }
                }

                tests.push(test);               
            }
    
    
        } catch (err) {
            console.error('Error reading or parsing file:', err);
        }

  let end = Date.now();
  summary.start = start;
  summary.stop = end;

  let result: Result = {
      summary : summary,
      tests: tests,
    };

  const jsonString = JSON.stringify(result, null, 2);

  try {
    // Use a synchronous method for simplicity, or an asynchronous one with a callback
    fs.writeFileSync(outputfile, jsonString, 'utf8');
    console.log('Data successfully saved to output.json');
  } catch (error) {
    console.error('An error occurred:', error);
}

}


const args: string[] = process.argv.slice(2);
console.log(args);

if (args.length >= 2)
{
  runCollection(args[0] as string, args[1] as string);
}

