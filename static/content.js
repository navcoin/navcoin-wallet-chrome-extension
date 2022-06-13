console.log("content.js");
let connected=false;
chrome.storage.local.get({privateAddress:'',trustedSites: []}, function (result)
{
    //console.log("Private address :" + result.privateAddress);
    //console.log(result.trustedSites);
    if (result.trustedSites.includes(window.origin))
    {
      connected=true;
    }
    const manifest = chrome.runtime.getManifest();
    window.postMessage({
      type: 'extension',
      version: manifest.version,
      connected : connected,
      address:(connected&&result.privateAddress?result.privateAddress:undefined)
    }, "*");
});
window.addEventListener("message", function (event)
{
    if (event.source != window) return;
    //console.log(event);
    //console.log(event.origin);
    //console.log(event.data);
    if (event.data.method)
    {
        chrome.runtime.sendMessage(event.data,function (response)
        {
            console.log(response);
        });
    }
}, false);