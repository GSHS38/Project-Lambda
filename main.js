const {app,BrowserWindow,ipcMain}=require('electron');
const fs = require('fs');
const path = require('path');

let win;
async function createWindow(){
    win = new BrowserWindow({
        width:1000,
        height:800,
        title:'lambda',
        show:false,
        webPreferences:{
            contextIsolation:true,
            preload: path.join(__dirname,'preload.js')
        }
    });


    win.loadFile(path.join(__dirname,'docs/html/index.html'));

    win.on('ready-to-show',()=>{
        win.show();
    });
    win.on('closed',()=>{
        win=null;
    });
}
app.on('ready',()=>{
    createWindow();
});

app.on('window-all-closed',()=>{
    if(process.platform !== 'darwin'){
        app.quit();
    }
    process.exit(0);
});
app.on('activate',()=>{
    if(win===null){
        createWindow();
    }
});

ipcMain.on('openNotepad',(event,args)=>{
    fs.readFile(path.join(__dirname,'data/notepad_data'),{encoding:'utf-8'},(err,data)=>{
        if(err){
            console.log(err);
            data = "";
        }
        
        win.webContents.send("openedNotepad",data);
    });
});

ipcMain.on('saveNotepad',(event,data)=>{
    if(!fs.existsSync(path.join(__dirname,"/data"))){
        let err= fs.mkdirSync(path.join(__dirname,"/data"));
        if(err){
            win.webContents.send("errsaveNotepad");
            return;
        }
    }

    fs.writeFile(path.join(__dirname,"/data/notepad_data"),data,(err)=>{
        if(err){
            win.webContents.send("errsaveNotepad");
        }else{
            win.webContents.send("savedNotepad");
        }
    });
});