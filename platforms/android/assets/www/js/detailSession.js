function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
  }

fetch('https://raw.githubusercontent.com/DevInstitut/conference-data/master/sessions.json')
.then(function(responseSessions) {
    return responseSessions.json();
})
.then(function(responseAsJson) {
        detailSession(responseAsJson);
});

function detailSession(responseAsJson){

    let sessionId = getURLParameter("id");
    let session = Object.values(responseAsJson).find(e => e.id === parseInt(sessionId));
        
    var title = document.getElementById("title");
    var titleContent = document.createTextNode(session.title);
    title.appendChild(titleContent);
    var description = document.getElementById("session-description");
    var descContent = document.createTextNode(session.description);
    description.appendChild(descContent);

    var speakersDoc = document.getElementById("speakers");
    var sessSpeak = session.speakers; 
    
    speakersPromise = getSpeakers(sessSpeak);
    speakersPromise.then(function(speakers){
        for(var i in speakers){
            var presContent = document.createTextNode(speakers[i]);
            var a = document.createElement('a');
            a.setAttribute("href", "detailSpeaker.html?id="+sessSpeak[i]);
            a.appendChild(presContent);
            speakersDoc.appendChild(a);
        }
    });

    var notes = document.getElementById("btn-notes");
    notes.setAttribute('href', 'notes.html?id='+sessionId);
}

function getSpeakers(speakers){
       
       return fetch('https://raw.githubusercontent.com/DevInstitut/conference-data/master/speakers.json')
       .then(function(responseSpeakers){
           return responseSpeakers.json();
       })
       .then(function(responseSpeakersAsJson){
           var someSpeakers =[];
           for(var i in responseSpeakersAsJson){
               for(var j in speakers){
                   if(speakers[j] === responseSpeakersAsJson[i].id){
                       someSpeakers[j] = responseSpeakersAsJson[i].name;
                   }
               }
            }
        return someSpeakers;
    });
}

$(".button-collapse").sideNav();