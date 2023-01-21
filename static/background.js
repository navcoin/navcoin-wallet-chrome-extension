let tabId=0;
let e_message=undefined;
let e_sender=undefined;
chrome.runtime.onInstalled.addListener(() =>
{
  console.log('Welcome to Navcoin Wallet');
});

function openPopup(filename,o)
{
  console.log("Opening popup...");
  const NOTIFICATION_WIDTH = 430;
  const NOTIFICATION_HEIGHT = 640;
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

function processExternalMessage(message, sender, sendResponse)
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

  chrome.tabs.query({}, function(tabs)
  {
    var doFlag = true;
    for (var i=tabs.length-1; i>=0; i--)
    {
      console.log(tabs[i].url);
      if (tabs[i].url === "chrome-extension://"+extension_id+"/index.html"||tabs[i].url === "chrome-extension://"+extension_id+"/index.html#")
      {
        doFlag = false;
        console.log("window exist");
        chrome.runtime.sendMessage({cmd:"update_action",message:e_message,sender:e_sender}, function(response)
        {
          console.log("response received from existing window");
          console.log(response);
        });
        if (e_message.method!="list_nft_collections"&&e_message.method!="get_wallet_info")
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
chrome.runtime.onMessageExternal.addListener(
(message, sender, sendResponse) =>
{
  //processExternalMessage(message,sender,sendResponse);
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse)
{
    console.log(sender);
    console.log(message);
    if (message.cmd=="ready")
    {
      sendResponse({message:e_message,sender:e_sender});
    }
    else if (message.cmd=="accept_connection")
    {
      console.log("Accepting connection");
      console.log("Sending to tab :" + tabId);
      sendResponse({cmd: message.cmd,result:true});
      chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        world:"MAIN",
        function: m_accept_connection,
        args:[message.address]
      });
    }
    else if (message.cmd=="reject_connection")
    {
      console.log("Rejecting connection");
      console.log("Sending to tab :" + tabId);
      sendResponse({cmd: message.cmd,result:true});
      chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        world:"MAIN",
        function: m_reject_connection
      });
    }
    else if (message.cmd=="accept_create_token")
    {
      console.log("Accepting create token");
      console.log("Sending to tab :" + tabId);
      sendResponse({cmd: message.cmd,result:true});
      chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        world:"MAIN",
        function: m_create_token,
        args:[true,message.tx]
      });
    } 
    else if (message.cmd=="reject_create_token")
    {
      console.log("Reject create token");
      console.log("Sending to tab :" + tabId);
      sendResponse({cmd: message.cmd,result:true});
      chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        world:"MAIN",
        function: m_create_token,
        args:[false,false]
      });
    }
    else if (message.cmd=="accept_create_nft_collection")
    {
      console.log("Accept nft collection");
      console.log("Sending to tab :" + tabId);
      sendResponse({cmd: message.cmd,result:true});
      chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        world:"MAIN",
        function: m_create_nft_collection,
        args:[true,message.tx]
      });
    } 
    else if (message.cmd=="reject_create_nft_collection")
    {
      console.log("Reject nft collection");
      console.log("Sending to tab :" + tabId);
      sendResponse({cmd: message.cmd,result:true});
      chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        world:"MAIN",
        function: m_create_nft_collection,
        args:[false,false]
      });
    }
    else if (message.cmd=="accept_create_nft")
    {
      console.log("Accept create nft");
      console.log("Sending to tab :" + tabId);
      sendResponse({cmd: message.cmd,result:true});
      chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        world:"MAIN",
        function: m_create_nft,
        args:[true]
      });
    }
    else if (message.cmd=="reject_create_nft")
    {
      console.log("Reject create nft");
      console.log("Sending to tab :" + tabId);
      sendResponse({cmd: message.cmd,result:true});
      chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        world:"MAIN",
        function: m_create_nft,
        args:[false]
      });
    }
    else if (message.cmd=="list_nft_collections")
    {
      console.log("List nft collections");
      console.log("Sending to tab :" + tabId);
      sendResponse({cmd: message.cmd,result:true});
      chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        world:"MAIN",
        function: m_list_nft_collections,
        args:[message.collections,message.private_tokens]
      });
    }
    else if (message.cmd=="get_wallet_info")
    {
      console.log("Get wallet info");
      console.log("Sending to tab :" + tabId);
      sendResponse({cmd: message.cmd,result:true});
      chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        world:"MAIN",
        function: m_get_wallet_info,
        args:[message.wallet_info]
      });
    }
    else if (message.cmd=="accept_create_nft_sell_order")
    {
      console.log("Accepting create nft sell order");
      console.log("Sending to tab :" + tabId);
      sendResponse({cmd: message.cmd,result:true});
      chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        world:"MAIN",
        function: m_accept_create_nft_sell_order,
        args:[message.result,(message.token_id?message.token_id:null),(message.nft_id?message.nft_id:null)]
      });
    }
    else if (message.cmd=="reject_create_nft_sell_order")
    {
      console.log("Reject create nft sell order");
      console.log("Sending to tab :" + tabId);
      sendResponse({cmd: message.cmd,result:true});
      chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        world:"MAIN",
        function: m_reject_create_nft_sell_order,
        args:[]
      });
    }
    else if (message.cmd=="accept_get_nft_sell_order")
    {
      console.log("Returning nft sell order");
      console.log("Sending to tab :" + tabId);
      sendResponse({cmd: message.cmd,result:true});
      chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        world:"MAIN",
        function: m_accept_get_nft_sell_order,
        args:[message.order]
      });
    }
    else if (message.cmd=="accept_cancel_nft_order")
    {
      console.log("Accepting cancel nft sell order");
      console.log("Sending to tab :" + tabId);
      sendResponse({cmd: message.cmd,result:true});
      chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        world:"MAIN",
        function: m_accept_cancel_nft_order,
        args:[message.token_id,message.nft_id]
      });
    }
    else if (message.cmd=="reject_cancel_nft_order")
    {
      console.log("Rejecting cancel nft sell order");
      console.log("Sending to tab :" + tabId);
      sendResponse({cmd: message.cmd,result:true});
      chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        world:"MAIN",
        function: m_reject_cancel_nft_order,
        args:[message.token_id,message.nft_id]
      });
    }
    else if (message.cmd=="accept_cancel_token_order")
    {
      console.log("Accepting cancel token order");
      console.log("Sending to tab :" + tabId);
      sendResponse({cmd: message.cmd,result:true});
      chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        world:"MAIN",
        function: m_accept_cancel_token_order,
        args:[message.order_id]
      });
    }
    else if (message.cmd=="reject_cancel_token_order")
    {
      console.log("Rejecting cancel token order");
      console.log("Sending to tab :" + tabId);
      sendResponse({cmd: message.cmd,result:true});
      chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        world:"MAIN",
        function: m_reject_cancel_token_order,
        args:[message.order_id]
      });
    }    
    else if (message.cmd=="accept_create_transaction")
    {
      console.log("Accepting create transaction");
      console.log("Sending to tab :" + tabId);
      sendResponse({cmd: message.cmd,result:true});
      chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        world:"MAIN",
        function: m_accept_create_transaction,
        args:[message.tx]
      });
    }
    else if (message.cmd=="reject_create_transaction")
    {
      console.log("Rejecting create transaction");
      console.log("Sending to tab :" + tabId);
      sendResponse({cmd: message.cmd,result:true});
      chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        world:"MAIN",
        function: m_reject_create_transaction,
        args:[]
      });
    }
    else if (message.cmd=="accept_sign_message")
    {
      console.log("Accepting sign message");
      console.log("Sending to tab :" + tabId);
      sendResponse({cmd: message.cmd,result:true});
      chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        world:"MAIN",
        function: m_accept_sign_message,
        args:[message.signed_message,message.address]
      });
    }
    else if (message.cmd=="reject_sign_message")
    {
      console.log("Rejecting sign message");
      console.log("Sending to tab :" + tabId);
      sendResponse({cmd: message.cmd,result:true});
      chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        world:"MAIN",
        function: m_reject_sign_message,
        args:[]
      });
    }
    else if (message.cmd=="accept_create_private_token")
    {
      console.log("Accepting create private token");
      console.log("Sending to tab :" + tabId);
      sendResponse({cmd: message.cmd,result:true});
      chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        world:"MAIN",
        function: m_accept_create_private_token,
        args:[message.tx]
      });
    }
    else if (message.cmd=="reject_create_private_token")
    {
      console.log("Rejecting create private token");
      console.log("Sending to tab :" + tabId);
      sendResponse({cmd: message.cmd,result:true});
      chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        world:"MAIN",
        function: m_reject_create_private_token,
        args:[]
      });
    }
    else if (message.cmd=="accept_mint_private_token")
    {
      console.log("Accepting mint private token");
      console.log("Sending to tab :" + tabId);
      sendResponse({cmd: message.cmd,result:true});
      chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        world:"MAIN",
        function: m_accept_mint_private_token,
        args:[message.tx]
      });
    }
    else if (message.cmd=="reject_mint_private_token")
    {
      console.log("Rejecting mint private token");
      console.log("Sending to tab :" + tabId);
      sendResponse({cmd: message.cmd,result:true});
      chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        world:"MAIN",
        function: m_reject_mint_private_token,
        args:[]
      });
    }
    else if (message.cmd=="reject_nft_order")
    {
      console.log("Rejecting nft buy order");
      console.log("Sending to tab :" + tabId);
      sendResponse({cmd: message.cmd,result:true});
      chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        world:"MAIN",
        function: m_reject_nft_order,
        args:[]
      });
    }
    else if (message.cmd=="accept_create_token_order")
    {
      console.log("Accepting create token order");
      console.log("Sending to tab :" + tabId);
      sendResponse({cmd: message.cmd,result:true});
      chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        world:"MAIN",
        function: m_accept_create_token_order,
        args:[message.result]
      });
    }
    else if (message.cmd=="reject_create_token_order")
    {
      console.log("Reject create token order");
      console.log("Sending to tab :" + tabId);
      sendResponse({cmd: message.cmd,result:true});
      chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        world:"MAIN",
        function: m_reject_create_token_order,
        args:[]
      });
    }
    else if (message.cmd=="accept_token_order")
    {
      console.log("Accepting token order");
      console.log("Sending to tab :" + tabId);
      sendResponse({cmd: message.cmd,result:true});
      chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        world:"MAIN",
        function: m_accept_token_order,
        args:[message.result]
      });
    }
    else if (message.cmd=="reject_token_order")
    {
      console.log("Reject token order");
      console.log("Sending to tab :" + tabId);
      sendResponse({cmd: message.cmd,result:true});
      chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        world:"MAIN",
        function: m_reject_token_order,
        args:[]
      });
    }
    else if (message.cmd=="reject_create_token_pair")
    {
      console.log("Rejecting create token pair");
      console.log("Sending to tab :" + tabId);
      sendResponse({cmd: message.cmd,result:true});
      chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        world:"MAIN",
        function: m_reject_create_token_pair,
        args:[]
      });
    }
    else if (message.cmd=="accept_create_token_pair")
    {
      console.log("Accepting create token pair");
      console.log("Sending to tab :" + tabId);
      sendResponse({cmd: message.cmd,result:true});
      chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        world:"MAIN",
        function: m_accept_create_token_pair,
        args:[]
      });
    }
    else if (message.cmd=="reject_wrong_network")
    {
      console.log("Rejecting wrong network");
      console.log("Sending to tab :" + tabId);
      sendResponse({cmd: message.cmd,result:true});
      chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        world:"MAIN",
        function: m_reject_wrong_network,
        args:[message.network]
      });
    }
    else
    {
        console.log("Processing external message");
        processExternalMessage(message,sender,sendResponse);
        sendResponse({method: message.method,result:true});
    }
});

chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'install')
  {
    openExtensionInBrowser();
  }
});

function checkForError() {
  const { lastError } = chrome.runtime;
  if (!lastError) {
    return undefined;
  }
  // if it quacks like an Error, its an Error
  if (lastError.stack && lastError.message) {
    return lastError;
  }
  // repair incomplete error object (eg chromium v77)
  return new Error(lastError.message);
}

function openTab(options)
{
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

function openExtensionInBrowser(route = null,queryString = null,keepWindowOpen = false)
{
    let extensionURL = chrome.runtime.getURL('index.html');
    if (route) {
      extensionURL += `#${route}`;
    }
    if (queryString) {
      extensionURL += `?${queryString}`;
    }
    openTab({ url: extensionURL });
}

function m_accept_connection(address)
{
  accept_connection(address);
}

function m_reject_connection()
{
  reject_connection();
}

function m_create_token(result,tx)
{
  create_token(result,tx);
}

function m_create_nft_collection(result,tx)
{
  create_nft_collection(result,tx);
}

function m_create_nft(result)
{
  create_nft(result);
}

function m_list_nft_collections(collections,private_tokens)
{
  list_nft_collections(collections,private_tokens);
}

function m_get_wallet_info(wallet_info)
{
  get_wallet_info(wallet_info);
}

function m_accept_create_nft_sell_order(result,token_id,nft_id)
{
  accept_create_nft_sell_order(result,token_id,nft_id);
}

function m_reject_create_nft_sell_order()
{
  reject_create_nft_sell_order();
}

function m_accept_get_nft_sell_order(order)
{
  accept_get_nft_sell_order(order);
}

function m_accept_cancel_nft_order(token_id,nft_id)
{
  accept_cancel_nft_order(token_id,nft_id);
}

function m_reject_cancel_nft_order(token_id,nft_id)
{
  reject_cancel_nft_order(token_id,nft_id);
}

function m_accept_cancel_token_order(order_id)
{
  accept_cancel_token_order(order_id);
}

function m_reject_cancel_nft_order(order_id)
{
  reject_cancel_token_order(order_id);
}

function m_accept_create_transaction(tx)
{
  accept_create_transaction(tx);
}

function m_reject_create_transaction()
{
  reject_create_transaction();
}

function m_accept_sign_message(signed_message,address)
{
  accept_sign_message(signed_message,address);
}

function m_reject_sign_message()
{
  reject_sign_message();
}

function m_accept_create_private_token(tx)
{
  accept_create_private_token(tx);
}

function m_reject_create_private_token()
{
  reject_create_private_token();
}

function m_accept_mint_private_token(tx)
{
  accept_mint_private_token(tx);
}

function m_reject_mint_private_token()
{
  reject_mint_private_token();
}

function m_reject_nft_order()
{
  reject_nft_order();
}

function m_reject_create_token_order()
{
  reject_create_token_order();
}

function m_accept_create_token_order(order)
{
  accept_create_token_order(order);
}

function m_accept_token_order(result)
{
  accept_token_order(result);
}

function m_reject_token_order()
{
  reject_token_order();
}

function m_reject_create_token_pair()
{
  reject_create_token_pair();
}

function m_accept_create_token_pair()
{
  accept_create_token_pair();
}

function m_reject_wrong_network(network)
{
  reject_wrong_network(network);
}