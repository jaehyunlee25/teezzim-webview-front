export const sendResponse = (command, parameter) => {
    if(command==='test1'){
        window.BRIDGE.sendResponse();
    }
    if(command==='test2'){
        window.BRIDGE.sendResponse();
    }
}