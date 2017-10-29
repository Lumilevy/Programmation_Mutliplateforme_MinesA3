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

let exists = false;

fetch('./data.json')
.then(function(responseNotes) {
    return responseNotes.json();
})
.then(function(responseNotesAsJson) {
        detailNote(responseNotesAsJson);
});

function detailSession(responseAsJson){
        
    let sessionId = getURLParameter("id");
    let session = Object.values(responseAsJson).find(e => e.id === parseInt(sessionId));
    var title = document.getElementById("note-titre");
    var h2 = document.createElement("h5");
    var titleContent = document.createTextNode(session.title);
    h2.appendChild(titleContent);
    title.appendChild(h2);

    document.addEventListener("deviceready", onDeviceReady, false);
    
    function onDeviceReady() {
        console.log("navigator.camera");   
        }

};

function valider(){

    let sessionId = getURLParameter("id");
    let note = document.getElementById('icon_prefix2').value;
    var btn = document.getElementById("btn-ok");

    fetch('http://localhost:3000/notes/'+(exists? sessionId : ""), {
        method: exists ? 'PATCH' : 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: '{"id":"'+ sessionId +'", "note":"'+ note +'"}'
    })
    .then(function(response){
        if(response.ok){
            exists = true;
        }
    })

    btn.setAttribute("href", "detailSession.html?id="+sessionId);
}

function detailNote(responseNotesAsJson){

    let sessionId = getURLParameter("id");
    for(var i in responseNotesAsJson){
        for(var j in responseNotesAsJson[i]){
            if(responseNotesAsJson[i][j].id === sessionId){
                var textNote = document.getElementById("icon_prefix2");
                var content = document.createTextNode(responseNotesAsJson[i][j].note);
                textNote.appendChild(content);
                exists = true;
            }
        }
        
    }
}

function setOptions(srcType) {
    var options = {
        // Some common settings are 20, 50, and 100
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI,
        // In this app, dynamically set the picture source, Camera or photo gallery
        sourceType: srcType,
        encodingType: Camera.EncodingType.JPEG,
        mediaType: Camera.MediaType.PICTURE,
        allowEdit: true,
        correctOrientation: true  //Corrects Android orientation quirks
    }
    return options;
}


function openCamera(){

    var srcType = Camera.PictureSourceType.CAMERA;
    var options = setOptions(srcType);
    
    options.targetHeight = 100;
    options.targetWidth = 100;
    
    
    navigator.camera.getPicture(function cameraSuccess(imageUri) {
            
        var listImages = document.getElementById('listImages');
        var src = imageUri;
        var imgSrc = document.createElement("img");
        imgSrc.setAttribute("src", src);
        listImages.appendChild(imgSrc);
         
        }, function cameraError(error) {
            console.debug("Unable to obtain picture: " + error, "app");
        }, options);    
}

    
function onFail(message) {
    alert('Failed because: ' + message);
}


function openGallery(){

    var srcType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
    var options = setOptions(srcType);

    options.targetHeight = 100;
    options.targetWidth = 100;

    navigator.camera.getPicture(function(result){

        console.log(result);
        var listImages = document.getElementById('listImages');
        var src = result;
        var imgSrc = document.createElement("img");
        imgSrc.setAttribute("src", src);
        listImages.appendChild(imgSrc);

    },function(error){
        console.log(error);
    },options);
}

$(".button-collapse").sideNav();