//calling a http get async and returns the data to the callback function
function httpGetAsync(theUrl, callback){
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function (){
        if(xmlHttp.readyState == 4 && xmlHttp.status == 200){
            // console.log(xmlHttp.responseText);
            // var data = JSON.parse(xmlHttp.statusText);
            callback(xmlHttp.responseText);
        }
    }
    xmlHttp.open("GET",theUrl,true); // true for async
    xmlHttp.send(null);
}

function httpPostAsync(theUrl,body, callback){
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function (){
        if(xmlHttp.readyState == 4 && xmlHttp.status == 200){
            // var data = JSON.parse(xmlHttp.statusText);
            callback(xmlHttp.responseText);
        }
    }
    xmlHttp.open("POST",theUrl,true); // true for async
    xmlHttp.send(body);
}

function httpPostAsyncResponse(theUrl,body, callback,res){
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function (){
        if(xmlHttp.readyState == 4 && xmlHttp.status == 200){
            // var data = JSON.parse(xmlHttp.statusText);
            callback(xmlHttp.responseText,res);
        }
        else if (xmlHttp.readyState == 4 && xmlHttp.status != 200){
            callback(xmlHttp.responseText,res);
        }
    }
    xmlHttp.open("POST",theUrl,true); // true for async
    xmlHttp.send(body);
}