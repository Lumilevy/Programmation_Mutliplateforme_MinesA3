fetch('https://raw.githubusercontent.com/DevInstitut/conference-data/master/speakers.json')
.then(function(responseSessions) {
    return responseSessions.json();
})
.then(function(responseAsJson) {
        parseSpeakerData(responseAsJson);
});

function parseSpeakerData(responseAsJson){
    
    var listSpeakers = document.getElementById("presentateurs");

    for(var i in responseAsJson){
        var a = document.createElement('a');
        a.setAttribute("class", "collection-item");
        a.setAttribute("href", "detailSpeaker.html?id="+responseAsJson[i].id);
        var content = document.createTextNode(responseAsJson[i].name);
        a.appendChild(content);
        listSpeakers.appendChild(a);
    }

}

$(".button-collapse").sideNav();