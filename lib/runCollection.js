"use strict";
// runCollection via the engine 
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var process = require("process");
var child_process = require("child_process");
function fetchDataSynchronously(url, method) {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    console.log('fetching URL: ', url);
                    if (!(url != undefined)) return [3 /*break*/, 3];
                    return [4 /*yield*/, fetch(url)];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        //throw new Error(`HTTP error! status: ${response.status}`);
                        return [2 /*return*/, null];
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    console.log("Response fetched: ", response);
                    console.log("Data fetched:", data);
                    return [2 /*return*/, [response, data]];
                case 3: return [2 /*return*/, null];
                case 4:
                    error_1 = _a.sent();
                    console.error("Error fetching data:", error_1);
                    //throw error; // Re-throw the error for further handling
                    return [2 /*return*/, null];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// Main code in collection processing & request & response running
function runCollection(inputfile, outputfile) {
    return __awaiter(this, void 0, void 0, function () {
        var summary, tests, start, data, jsonData, i, item, request, test, event_1, _loop_1, j, httpstart, ret, response, data_1, httpend, _loop_2, j, err_1, end, result, jsonString;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    summary = {
                        tested: 0,
                        passed: 0,
                        failed: 0,
                        pending: 0,
                        skipped: 0,
                        other: 0,
                        start: 0,
                        stop: 0,
                    };
                    tests = [];
                    start = Date.now();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    data = fs.readFileSync(inputfile, 'utf8');
                    jsonData = JSON.parse(data);
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < jsonData.item.length)) return [3 /*break*/, 5];
                    item = jsonData.item[i];
                    request = item.request;
                    console.log(request.url);
                    console.log(request.method);
                    test = {
                        name: request.url,
                        status: "",
                        duration: 0,
                        message: "",
                        trace: [],
                        data: "",
                    };
                    event_1 = item.event;
                    if (item.event != null) {
                        console.log(item.event);
                        _loop_1 = function (j) {
                            var event_2 = item.event[j];
                            if (event_2 != null && event_2.listen != null && event_2.listen == "prerequest" && event_2.script != null && event_2.script.exec != null) {
                                var script = event_2.script.exec;
                                var child = child_process.fork('-e', [script]);
                                var output_1 = '';
                                var errorOutput_1 = '';
                                child.stdout.on('data', function (data) {
                                    // Convert the Buffer to a string and append it
                                    output_1 += data.toString();
                                });
                                child.stderr.on('data', function (data) {
                                    errorOutput_1 += data.toString();
                                });
                                test.trace.push(output_1);
                            }
                        };
                        for (j = 0; j < item.event.length; ++j) {
                            _loop_1(j);
                        }
                    }
                    httpstart = Date.now();
                    return [4 /*yield*/, fetchDataSynchronously(request.url.raw, request.method)];
                case 3:
                    ret = _a.sent();
                    if (ret != null) {
                        response = ret[0];
                        data_1 = ret[1];
                        httpend = Date.now();
                        summary.tested += 1;
                        test.duration = httpend - httpstart;
                        if (response != null) {
                            test.status = response.statusText;
                            console.log(response);
                            test.data = JSON.stringify(data_1);
                            console.log(JSON.stringify(data_1));
                        }
                        // pass the data as new request
                        if (response != null) {
                            summary.passed += 1;
                            // post-event handling
                            event_1 = item.event;
                            if (item.event != null) {
                                console.log(item.event);
                                _loop_2 = function (j) {
                                    var event_3 = item.event[j];
                                    if (event_3 != null && event_3.listen != null && event_3.listen == "postresponse" && event_3.script != null && event_3.script.exec != null) {
                                        var script = event_3.script.exec;
                                        var child = child_process.fork('-e', [script]);
                                        var output_2 = '';
                                        var errorOutput_2 = '';
                                        child.stdout.on('data', function (data) {
                                            // Convert the Buffer to a string and append it
                                            output_2 += data.toString();
                                        });
                                        child.stderr.on('data', function (data) {
                                            errorOutput_2 += data.toString();
                                        });
                                        test.trace.push(output_2);
                                    }
                                };
                                for (j = 0; j < item.event.length; ++j) {
                                    _loop_2(j);
                                }
                            }
                        }
                        else {
                            summary.failed += 1;
                        }
                    }
                    tests.push(test);
                    _a.label = 4;
                case 4:
                    ++i;
                    return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 7];
                case 6:
                    err_1 = _a.sent();
                    console.error('Error reading or parsing file:', err_1);
                    return [3 /*break*/, 7];
                case 7:
                    end = Date.now();
                    summary.start = start;
                    summary.stop = end;
                    result = {
                        summary: summary,
                        tests: tests,
                    };
                    jsonString = JSON.stringify(result, null, 2);
                    try {
                        // Use a synchronous method for simplicity, or an asynchronous one with a callback
                        fs.writeFileSync(outputfile, jsonString, 'utf8');
                        console.log('Data successfully saved to output.json');
                    }
                    catch (error) {
                        console.error('An error occurred:', error);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
var args = process.argv.slice(2);
console.log(args);
if (args.length >= 2) {
    runCollection(args[0], args[1]);
}
