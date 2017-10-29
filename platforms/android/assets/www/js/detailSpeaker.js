let speaker;

function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}


fetch('https://raw.githubusercontent.com/DevInstitut/conference-data/master/speakers.json')
.then(function(responseSpeakers) {
    return responseSpeakers.json();
})
.then(function(responseAsJson) {
    
    let speakerId = getURLParameter("id");
    speaker = Object.values(responseAsJson).find(e => e.id === parseInt(speakerId));
    detailSpeaker(responseAsJson);
});

function detailSpeaker(responseAsJson){

    //let speakerId = getURLParameter("id");
    //speaker = Object.values(responseAsJson).find(e => e.id === parseInt(speakerId));

    var name = document.getElementById("name");
    var nameContent = document.createTextNode(speaker.name);
    name.appendChild(nameContent);

    var description = document.getElementById("speaker-description");
    var descContent = document.createTextNode(speaker.bio);
    description.appendChild(descContent);

    var listSessions = document.getElementById("listPres");
    sessionsPromise = getSessions(speaker);
    sessionsPromise.then(function(sessions){
       for(var i in sessions){
           var sessionsContent = document.createTextNode(sessions[i].title);
           var a = document.createElement('a');
           a.setAttribute("class", "collection-item");
           a.setAttribute("href", "detailSession.html?id="+sessions[i].id);
           a.appendChild(sessionsContent);
           listSessions.appendChild(a);
       } 
    });

    document.addEventListener("deviceready", onDeviceReady, false);
    
    function onDeviceReady() {
        console.log("navigator.contacts");   
    }

}

function getSessions(speaker){
    
    return fetch('https://raw.githubusercontent.com/DevInstitut/conference-data/master/sessions.json')
    .then(function(responseSessions){
        return responseSessions.json();
    })
    .then(function(responseSessionsAsJson){
        var someSessions=[];
        for(var i in responseSessionsAsJson){
            for(var j in responseSessionsAsJson[i].speakers){
                if(responseSessionsAsJson[i].speakers[j]===speaker.id){
                    someSessions[i]=responseSessionsAsJson[i];
                }
            }
        }
        return someSessions;

 });



}

function chooseEvent(){
    var check = document.getElementById("addContact").checked;

    if(check===true){
        saveContact();
    } else {
        deleteContact();
    }
}

function saveContact(){

    function onSuccess(contact) {
        alert("Save Success");
    };
    
    function onError(contactError) {
        alert("Error = " + contactError.code);
    };
 
    var links = [];
    for(var i in speaker.socials){
        links[i] = new ContactField(speaker.socials[i].name, speaker.socials[i].link, false);
    }
    newContact = navigator.contacts.create({
        "displayName": speaker.name,
        "name": speaker.name,
        "nickname": speaker.name,
        "urls": links,
        "organizations": speaker.company,
        "note": speaker.shortBio,
        "id": speaker.id,
    });
    console.log(newContact);
    newContact.save(onSuccess,onError);
}

function deleteContact(){
    var options = new ContactFindOptions();
    options.filter = speaker.name;
    options.desiredFields = [navigator.contacts.fieldType.id];
    var champs = [navigator.contacts.fieldType.name, navigator.contacts.fieldType.nickname];
    navigator.contacts.find(champs, onSuccessFind, onErrorFind, options);
}

function onSuccessFind(contact){
    contact[0].remove(onSuccessRemove, onErrorRemove);
}

function onErrorFind(contactError){
    alert("Error = " + contactError.code);
}

function onSuccessRemove() {
    alert("Removal Success");
};

function onErrorRemove(contactError) {
    alert("Error = " + contactError.code);
};




$(".button-collapse").sideNav();