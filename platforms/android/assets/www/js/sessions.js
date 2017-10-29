fetch('https://raw.githubusercontent.com/DevInstitut/conference-data/master/sessions.json')
.then(function(responseSessions) {
    return responseSessions.json();
})
.then(function(responseAsJson) {
        parseSessionData(responseAsJson);
});

function parseSessionData(responseAsJson) {


    var keynote = document.getElementById("keynotes");
    var talk = document.getElementById("talk");
    var quicky = document.getElementById("quicky");

    for(var i in responseAsJson){

        if(responseAsJson[i].type=="keynote"){
            let title = responseAsJson[i].title;
            var a = document.createElement('a');
            a.setAttribute("class", "collection-item");
            a.setAttribute("href", "detailSession.html?id="+responseAsJson[i].id);
            var content = document.createTextNode(title);
            a.appendChild(content);
            keynote.appendChild(a);
            
        } else if(responseAsJson[i].type=="talk"){
            let title = responseAsJson[i].title;
            var a = document.createElement('a');
            a.setAttribute("class", "collection-item");
            a.setAttribute("href", "detailSession.html?id="+responseAsJson[i].id)
            var content = document.createTextNode(title);
            a.appendChild(content);
            talk.appendChild(a);

        } else if(responseAsJson[i].type=="quicky"){
            let title = responseAsJson[i].title;
            var a = document.createElement('a');
            a.setAttribute("class", "collection-item");
            a.setAttribute("href", "detailSession.html?id="+responseAsJson[i].id)
            var content = document.createTextNode(title);
            a.appendChild(content);
            quicky.appendChild(a);
        }
    }
}

$(".button-collapse").sideNav();