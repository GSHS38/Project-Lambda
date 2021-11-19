const {contextBridge, ipcRenderer} = require("electron");

contextBridge.exposeInMainWorld(
    "api",
    {
        send: (channel, data)=>{
            const validChannels = ["openNotepad","saveNotepad"];
            if(validChannels.includes(channel)){
                ipcRenderer.send(channel,data);
            }
        },
        receive: (channel, func)=>{
            const validChannels = ["openedNotepad","savedNotepad","errsaveNotepad"];
            if(validChannels.includes(channel)){
                ipcRenderer.on(channel, (event,...args)=>func(...args));
            }
        }
}
);
