const textArea = document.querySelector('textarea');
const savedPopup = document.querySelector('#saved');

console.log("hello! I am notepad!");
window.api.send("openNotepad");
window.api.receive("openedNotepad",(data)=>{
    console.log(data);
    textArea.value=data;
});

document.addEventListener('keydown',(event)=>{
    if(event.key=='s' && event.ctrlKey){
        window.api.send("saveNotepad",textArea.value);
        setPopupValue(0);
        console.log("saving...");
        showPopup();
    }
    textArea.focus();
});


window.api.receive('savedNotepad',(data)=>{
    setPopupValue(1);
    console.log("saved notepad!");
    popupTimeoutId = setTimeout(hidePopup, 1000);
});

window.api.receive('errsaveNotepad',()=>{
    setPopupValue(2);
    console.log("error while saving!");
    popupTimeoutId = setTimeout(hidePopup, 1000);
});

let popupTimeoutId;
function showPopup(){
    clearTimeout(popupTimeoutId);
    savedPopup.classList.add('visible');
}
function hidePopup(){
    savedPopup.classList.remove('visible');
}
const popupValue=['Saving...','Saved!','Error while saving!']
function setPopupValue(i){
    const popupClass=['saving','saved','error'];
    for(k in popupClass){
        savedPopup.classList.remove(popupClass[k]);
    }
    savedPopup.classList.add(popupClass[i]);
    savedPopup.innerHTML = popupValue[i];
}