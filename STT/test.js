//  FORCE DARRETER L'UPGRADE VERS LA V1 CAR SDK SOUDAINEMENT HS


var request = require('request');
var yaml = require('js-yaml');
var fs = require('fs');

var commandsCount = 0
var currentGroup = 0
var commands = []
var file = "commands/"
var errorsString = ""

var files = [
// 'basic',
'play_artist',
// 'play',
// 'playlist',
// 'album',
// 'mood',
// 'genre',
// 'radio',
// 'like'
]

files.forEach(file => {
    var group = {name: file.toUpperCase(), commands: yaml.safeLoad(fs.readFileSync('commands/'+ file + '.yml', 'utf8'))}
    commands.push(group)
  });
displayGroup()

function updateDisplay(){
    commandsCount --
    if (commandsCount == 0){
        currentGroup ++
        if(currentGroup < commands.length){
            displayGroup()
        }else{
            fs.writeFile("err.out", errorsString, function(err) {
                if(err) {
                    return console.log(err);
                }
                console.log("\x1b[37m\n\nErrors details saved in `err.out' ! ");
            });
        }
    }
}

function displayGroup(){
    var group = commands[currentGroup]
    console.log("\x1b[37m \n\n **************** \n " + group.name + " \n **************** ")

    commandsCount = group.commands.length
    for (j = 0; j < commandsCount; j++) { 
        var elem = group.commands[j]
        test(elem.query, elem.goal)
    }
}


function isArray(what) {
    return Object.prototype.toString.call(what) === '[object Array]';
}

function arraysEqual(a1,a2) {
    /* WARNING: arrays must not contain {objects} or behavior may be undefined */
    return JSON.stringify(a1)==JSON.stringify(a2);
}

function checkValue(data, expected ){
    checkedValue = true
    for (let key of Array.range(0,Object.keys(data).length-1)) {
        var dataValue = data[key]
        var expectedValue = expected[key]
        // console.log("\n\n\n Object.keys -----------", Array.range(0,Object.keys(data).length))
        console.log("key ----------", key)
        // console.log("expected ---------", expected)
        console.log("expected[key].slot_name---------", expected[key].slot_name)
         // console.log("\n\n\n data ----------", data)
        console.log("data[key].slot_name ----------", data[key].slot_name)
        console.log("expected[key].value---------", expected[key].value)
        // console.log("\n\n\n data ----------", data)
        console.log("data[key].value ----------", data[key].value)
        // console.log("data[key]  length ----------", data[key].length)
        if (dataValue.length != 0){ // if == 0 then the expected value is somewhere else => FALSE
            if (isArray(dataValue)){
                // console.log(">ARRAY", key)
                if (dataValue.length > 1){
                    action = []
                    for (len = 0; len < dataValue.length; len++){
                        action = action.concat(dataValue[len].value)
                    }
                    // return (arraysEqual(action,expectedValue)) 
                }

                // console.log("dataValue[0] ----------", dataValue[0])
                // return checkValue(dataValue[0], expectedValue )
            }else if (typeof expectedValue === "object"){
                // console.log(">OBJECT", key)
                // return checkValue(dataValue, expectedValue )
            }else if (typeof expectedValue === "string"){
                // console.log(">string", (dataValue.toLowerCase() == expectedValue.toLowerCase()))
                if (dataValue.toLowerCase() != expectedValue.toLowerCase()){
                    // return false
                }
                // return (dataValue.toLowerCase() == expectedValue.toLowerCase())
            }if (typeof expectedValue === "boolean"){
                // console.log(">boolean", key)
                // return (dataValue == expectedValue)
            }
        }else {
            // console.log("FALSE because data[key]= [] ----------")
            return false
        }
        // var dataValue = ((data[key])?data[key].toString(): "null").toLowerCase()
        // var intentValue = intent[key].toString().toLowerCase()
        // if(dataValue != intentValue) {
           // error = true
        // }
    }
    return true
}

function test(query, goal){
    callApi(query.toLowerCase(), function(data){
        var error = false 
        console.log('RESULT ')
        console.log(data)
        // console.log(" expectedValue ==>", expectedValue)
        if(data){
            if (checkValue(data, goal)){
                console.log(" \x1b[32m \u2713 Test passed : '" + query + "'  \u001b[39m")
            }else{
                var message = "RESULT => " + JSON.stringify(data, null, 4)
                message += "\n   EXPECTED => " + JSON.stringify(goal, null, 4)
                displayFailed(query, message)    
            }
        }else{
            var message = "'" + query + "' : NO RESULT"
            message += "\n   EXPECTED => " + JSON.stringify(goal, null, 4)
            displayFailed(query, message)
        }
        updateDisplay()
    })
}

function displayFailed(query, message){
    var text = "\u2718 Test failed : '" + query + "' \u001b[39m"
    console.log("\x1b[31m " + text) 
    errorsString += "\n\n" + text + "\n   " + message
}

function callApi(query, cb){
  request({ 
        method: 'POST',
        uri:  "https://whyd-poc.snips.ai/api/v1/inference",
        json: { 
            assistantId: "proj_r1FYKA40g",
            query: query
            // token: "3c55c08b871a459f93bf231bbfe0bfbc"
        }
    },function (error, response, body) {
        if (error) {
            console.log(error)    
            return
        }   
        if(response.statusCode == 200){
            console.log(body)
            if(body.data){
                cb(body.data.slots)
                console.log('cb true')
                console.log(cb(body.data.slots))
            }else{
                cb(false)
                console.log('cb false')
            }
          } else {
            console.log('error: '+ response.statusCode)
          }
        }
    )
}


// function callApi(query, cb){
//   request({ 
//         method: 'POST',
//         uri:  "https://nluexplorer-dev.snips.ai/api/v0/parse",
//         json: { 
//             query: query, 
//             token: "3c55c08b871a459f93bf231bbfe0bfbc"
//         }
//     },function (error, response, body) {
//         if (error) {
//             console.log(error)    
//             return
//         }
//         if(response.statusCode == 200){
//             if(body.data){
//                 cb(body.data.result)
//             }else{
//                 cb(false)
//             }
//           } else {
//             console.log('error: '+ response.statusCode)
//           }
//         }
//     )
// }

Array.range= function(a, b, step){
    var A= [];
    if(typeof a== 'number'){
        A[0]= a;
        step= step || 1;
        while(a+step<= b){
            A[A.length]= a+= step;
        }
    }
    else{
        var s= 'abcdefghijklmnopqrstuvwxyz';
        if(a=== a.toUpperCase()){
            b=b.toUpperCase();
            s= s.toUpperCase();
        }
        s= s.substring(s.indexOf(a), s.indexOf(b)+ 1);
        A= s.split('');        
    }
    return A;
}
