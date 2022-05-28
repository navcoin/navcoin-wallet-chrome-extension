let tabId=0;
let e_message=undefined;
let e_sender=undefined;
chrome.runtime.onInstalled.addListener(() =>
{
  console.log('Welcome to Navcoin Wallet');
});

function openTab(options) {
  return new Promise((resolve, reject) => {
    chrome.tabs.create(options).then((newTab) => {
      const error = checkForError();
      if (error) {
        return reject(error);
      }
      return resolve(newTab);
    });
  });
}

function openPopup(filename,o)
{
  console.log("Opening popup...");
  const NOTIFICATION_HEIGHT = 600;
  const NOTIFICATION_WIDTH = 410;
  chrome.windows.getCurrent(function(win)
  {
    top = 0;
    left = parseInt(win.width-NOTIFICATION_WIDTH);
    chrome.windows.create({
        url:filename,
        type: 'popup',
        width: NOTIFICATION_WIDTH,
        height: NOTIFICATION_HEIGHT,
        left:left,
        top:top,
        focused: true
    })
    .then((e)=>
    {
      console.log(e);
    });
  });
}

chrome.runtime.onMessageExternal.addListener(
(message, sender, sendResponse) =>
{
  console.log(sender);
  console.log(message);
  console.log("Sender origin -> " + sender.origin);
  console.log("Sender url -> " + sender.url);
  e_message=message;
  e_sender=sender;
  tabId=sender.tab.id;

  let extension_id = chrome.runtime.id;
  console.log("Extension id ->" + extension_id); 

  if (message.method == 'version')
  {
     let connected=false;
     chrome.storage.local.get({privateAddress:'',trustedSites: []}, function (result)
     {
        console.log("Private address :" + result.privateAddress);
        console.log(result.trustedSites);
        if (result.trustedSites.includes(sender.origin))
        {
          connected=true;
        }
        const manifest = chrome.runtime.getManifest();
        sendResponse({
          type: 'success',
          version: manifest.version,
          connected : connected,
          address:(result.privateAddress?result.privateAddress:'')
        });        
    });
    return true;
  }
  else
  {
    chrome.tabs.query({}, function(tabs)
    {
      var doFlag = true;
      for (var i=tabs.length-1; i>=0; i--)
      {
        console.log(tabs[i].url);
        if (tabs[i].url === "chrome-extension://"+extension_id+"/index.html")
        {
          doFlag = false;
          console.log("window exist");
          chrome.runtime.sendMessage({cmd:"update_action",message:e_message,sender:e_sender}, function(response)
          {
            console.log("response received from existing window");
            console.log(response);
          });
          if (e_message.method!="list_nft_collections")
          {
            chrome.windows.update(tabs[i].windowId, { "focused": true });
          }
          break;
        }
      }
      if (doFlag)
      {
        console.log("window not exist");
        this.openPopup("index.html");
        return true;
      }
    });
  }
});

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse)
{
    if (msg.cmd=="ready")
    {
      sendResponse({message:e_message,sender:e_sender});
    }
    else if (msg.cmd=="accept_connection")
    {
      console.log("Accepting connection");
      console.log("Sending to tab :" + tabId);
      sendResponse({cmd: msg.cmd,result:true});
      chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        world:"MAIN",
        function: m_accept_connection,
        args:[msg.address]
      });
    }
    else if (msg.cmd=="reject_connection")
    {
      console.log("Rejecting connection");
      console.log("Sending to tab :" + tabId);
      sendResponse({cmd: msg.cmd,result:true});
      chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        world:"MAIN",
        function: m_reject_connection
      });
    }
    else if (msg.cmd=="accept_create_nft_collection")
    {
      console.log("Accept nft collection");
      console.log("Sending to tab :" + tabId);
      sendResponse({cmd: msg.cmd,result:true});
      chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        world:"MAIN",
        function: m_create_nft_collection,
        args:[true]
      });
    } 
    else if (msg.cmd=="reject_create_nft_collection")
    {
      console.log("Reject nft collection");
      console.log("Sending to tab :" + tabId);
      sendResponse({cmd: msg.cmd,result:true});
      chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        world:"MAIN",
        function: m_create_nft_collection,
        args:[false]
      });
    }
    else if (msg.cmd=="accept_create_nft")
    {
      console.log("Accept create nft");
      console.log("Sending to tab :" + tabId);
      sendResponse({cmd: msg.cmd,result:true});
      chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        world:"MAIN",
        function: m_create_nft,
        args:[true]
      });
    }
    else if (msg.cmd=="reject_create_nft")
    {
      console.log("Reject create nft");
      console.log("Sending to tab :" + tabId);
      sendResponse({cmd: msg.cmd,result:true});
      chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        world:"MAIN",
        function: m_create_nft,
        args:[false]
      });
    }
    else if (msg.cmd=="list_nft_collections")
    {
      console.log("List nft collections");
      console.log("Sending to tab :" + tabId);
      sendResponse({cmd: msg.cmd,result:true});
      chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        world:"MAIN",
        function: m_list_nft_collections,
        args:[msg.collections]
      });
    }
    else if (msg.cmd=="accept_create_nft_sell_order")
    {
      console.log("Accepting create nft sell order");
      console.log("Sending to tab :" + tabId);
      sendResponse({cmd: msg.cmd,result:true});
      chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        world:"MAIN",
        function: m_accept_create_nft_sell_order,
        args:[msg.result]
      });
    }
    else if (msg.cmd=="reject_create_nft_sell_order")
    {
      console.log("Reject create nft sell order");
      console.log("Sending to tab :" + tabId);
      sendResponse({cmd: msg.cmd,result:true});
      chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        world:"MAIN",
        function: m_reject_create_nft_sell_order,
        args:[]
      });
    }       
    else if (msg.cmd=="accept_get_nft_sell_order")
    {
      console.log("Returning nft sell order");
      console.log("Sending to tab :" + tabId);
      sendResponse({cmd: msg.cmd,result:true});
      chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        world:"MAIN",
        function: m_accept_get_nft_sell_order,
        args:[msg.order]
      });
    }       
    else if (msg.cmd=="accept_cancel_nft_order")
    {
      console.log("Accepting cancel nft sell order");
      console.log("Sending to tab :" + tabId);
      sendResponse({cmd: msg.cmd,result:true});
      chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        world:"MAIN",
        function: m_accept_cancel_nft_order,
        args:[]
      });
    }       
    else if (msg.cmd=="reject_cancel_nft_order")
    {
      console.log("Rejecting cancel nft sell order");
      console.log("Sending to tab :" + tabId);
      sendResponse({cmd: msg.cmd,result:true});
      chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        world:"MAIN",
        function: m_reject_cancel_nft_order,
        args:[]
      });
    }       
});

function m_accept_connection(address)
{
  accept_connection(address);
}

function m_reject_connection()
{
  reject_connection();
}

function m_create_nft_collection(result)
{
  create_nft_collection(result);
}

function m_create_nft(result)
{
  create_nft(result);
}

function m_list_nft_collections(collections)
{
  list_nft_collections(collections);
}

function m_accept_create_nft_sell_order(result)
{
  accept_create_nft_sell_order(result);
}

function m_reject_create_nft_sell_order()
{
  reject_create_nft_sell_order();
}

function m_accept_get_nft_sell_order(order)
{
  accept_get_nft_sell_order(order);
}

function m_accept_cancel_nft_order()
{
  accept_cancel_nft_order();
}

function m_reject_cancel_nft_order()
{
  reject_cancel_nft_order();
}