<template>
  <div class="container">
    <div class="uk-container" v-if="walletUnlocked" style="margin-top:5px;">
      <div class="uk-inline" style="width:100%">
        <button class="uk-button uk-button-small uk-button-default" type="button"><i
          class="fa-solid fa-ellipsis-vertical"></i>&nbsp;
        </button>
        <div class="uk-width-1-1" uk-dropdown="mode:click" id="menu" style="min-width: 350px;">
          <div class="uk-dropdown-grid uk-child-width-1-2" uk-grid>
            <div>
              <ul class="uk-nav uk-dropdown-nav">
                <li class="uk-nav-header">dApps</li>
                <li><a href="#" v-on:click="changePage('trusted_sites')">Trusted Sites</a></li>
              </ul>
            </div>
            <div>
              <ul class="uk-nav uk-dropdown-nav">
                <li class="uk-nav-header">Assets</li>
                <li><a href="#" v-on:click="changePage('swap')">Swap</a></li>
              </ul>
            </div>
            <div>
              <ul class="uk-nav uk-dropdown-nav">
                <li class="uk-nav-header">Message</li>
                <li><a href="#" v-on:click="changePage('sign-message')">Sign message</a></li>
                <li><a href="#" v-on:click="changePage('verify-message')">Verify message</a></li>
              </ul>
            </div>
            <div>
              <ul class="uk-nav uk-dropdown-nav">
                <li class="uk-nav-header">Wallet</li>
                <li><a href="#" v-on:click="changePage('address_book')">Address Book</a></li>
                <li><a href="#" v-on:click="closeWallet()">Close Wallet</a></li>
                <li><a href="#" v-on:click="changePage('backup-wallet')">Backup Wallet</a></li>
                <li><a href="#" v-on:click="changePage('remove-wallet')">Remove Wallet</a></li>
                <li class="uk-nav-divider"></li>
                <li><a href="#" v-on:click="changePage('about')">About</a></li>
              </ul>
            </div>
          </div>
        </div>
        <button class="uk-button uk-button-small uk-button-default" type="button" v-if="page!='home'"
                v-on:click="changePage('home')"><i class="fa-solid fa-home"></i>&nbsp;
        </button>
        <span v-if="progress!=100" style="margin-left:5px;width:100%;">
          <span uk-spinner style="width:14px;height:14px;"></span>&nbsp;<small>{{ status }}</small>
        </span>
        <span v-if="progress==100" style="float:right;margin-left:5px;margin-bottom: 0px !important;"><small><i class="fa-solid fa-hammer"></i>&nbsp;{{ height }}</small></span>
        <span v-if="progress==100" style="float:right;margin-left:5px;margin-bottom: 0px !important;"><small><i class="fa-solid fa-bolt"></i>&nbsp;{{ current_node }}</small></span>
        <span v-if="progress==100" style="float:right;margin-left:5px;margin-bottom: 0px !important;"><small><i class="fa-solid fa-diagram-project"></i>&nbsp;{{ network }}</small></span>
      </div>
    </div>
    <div class="uk-container" v-if="page=='verify-mnemonics'" style="margin-top:15px;">
      <h4>Backup Your Wallet</h4>
      <p>Below are the seed phrases created for your wallet. If you do not back up these seed phrases, you cannot import
        them back into your wallet in future. Please backup your seed phrases in a safe place.</p>
      <div class="uk-grid-column-small uk-grid-row-small uk-grid-small" uk-grid>
        <div class="uk-width-1-3" v-for="(word,index) in wordArrayOriginal">
          <button class="uk-button uk-button-small uk-button-default uk-text-lowercase uk-text-small uk-width-1-1"
                  modifier="outline">
            <b>{{ index + 1 }}</b><br />{{ word }}
          </button>
        </div>
      </div>
      <div class="uk-margin">
        <button class="uk-button uk-button-default" v-on:click="changePage('verify-seed-phrases')"><i
          class="fa-solid fa-arrow-right"></i>&nbsp;Verify seed phrases
        </button>
      </div>
    </div>
    <div class="uk-container" v-if="page=='verify-seed-phrases'" style="margin-top:15px;">
      <h4>Verify Seed Phrases</h4>
      <p>Please select the seed phrases you have backed up in order.</p>
      <div class="uk-grid-column-small uk-grid-row-small uk-grid-small uk-child-width-1-3@s" uk-grid>
        <div class="uk-width-1-3" v-for="(word,i) in wordArray">
          <button class="uk-button uk-button-small uk-button-default uk-text-lowercase uk-text-small uk-width-1-1"
                  modifier="outline" v-on:click="addWordtoArray(word)">
            {{ word }}
          </button>
        </div>
      </div>
      <div class="uk-card uk-card-body">
				<span v-for="(word,i) in wordArrayConfirm">
					{{ word }}
				</span>
      </div>
      <button class="uk-button uk-button-primary" v-on:click="confirmVerifySeedPhrases()"><i
        class="fa-solid fa-check"></i>&nbsp;Verify
      </button>
      <button class="uk-button uk-button-default uk-align-right" v-on:click="skipVerifySeedPhrases()"><i
        class="fa-solid fa-arrow-right-long"></i>&nbsp;Skip
      </button>
    </div>
    <div class="uk-container" v-if="page=='backup-wallet'" style="margin-top:15px;">
      <h4>Backup Wallet</h4>
      <p v-if="mnemonics">{{ mnemonics }}</p>
      <button v-if="mnemonics" class="uk-button uk-button-default" v-on:click="doCopy(mnemonics)"><i
        class="fa-solid fa-copy"></i>&nbsp;Copy
      </button>
    </div>
    <div class="uk-container" v-if="page=='remove-wallet'" style="margin-top:15px;">
      <div class="uk-alert-danger uk-margin" uk-alert>
        <a class="uk-alert-close" uk-close></a>
        <p>You will need your seed phrases to restore the wallet after deleting it. Please be sure to take note of your
          seed phrases.</p>
      </div>
      <div class="uk-margin">
        <input class="uk-input" placeholder="Password" type="password" v-model="v_password"></input>
      </div>
      <div class="uk-margin">
        <button :disabled="!password" class="uk-button uk-button-primary uk-width-1-1" v-on:click="removeWallet()"><i
          class="fa-solid fa-trash"></i>&nbsp;Remove Wallet
        </button>
      </div>
    </div>
    <div class="uk-container" v-if="page=='swap'" style="margin-top:15px;">
      <ul class="uk-subnav uk-subnav-pill" uk-switcher>
        <li><a v-on:click="isPrivateToPublic=false">From Public</a></li>
        <li><a v-on:click="isPrivateToPublic=true">From Private</a></li>
      </ul>
      <ul class="uk-switcher uk-margin">
        <li v-if="balance">{{ formatBalance(balance.nav.confirmed) }} NAV Available</li>
        <li v-if="balance">{{ formatBalance(balance.xnav.confirmed) }} xNAV Available</li>
      </ul>
      <div class="uk-margin">
        <input class="uk-input" placeholder="Amount" type="number" v-model="swap_amount"></input>
      </div>
      <div class="uk-margin">
          <h5>Includes Transaction Fee</h5>
          <div class="uk-grid uk-grid-small" uk-grid>
            <div class="uk-width-auto">
              <label class="uk-switch" for="lbl-swap">
                <input type="checkbox" id="lbl-swap" :checked="isSwapIncludesTxFee">
                <div class="uk-switch-slider" v-on:click="isSwapIncludesTxFee=!isSwapIncludesTxFee"></div>
              </label>
            </div>
            <div class="uk-width-expand">
              <p v-if="isSwapIncludesTxFee">Transaction fee will be included in total amount</p>
              <p v-else>Transaction fee will not be included in total amount</p>
            </div>
          </div>
      </div>
      <div class="uk-margin">
        <button class="uk-button uk-button-default" v-on:click="swapUseAllFunds()"><i class="fa-solid fa-coins"></i>&nbsp;Use
          All Funds
        </button>
        <button :disabled="!swap_amount" class="uk-button uk-button-primary uk-align-right" v-on:click="swap()"><i
          class="fa-solid fa-arrow-right-arrow-left"></i>&nbsp;Swap
        </button>
      </div>
      <div class="uk-margin" v-show="signedMessage">
        <h5>Signed Message : </h5>
        <pre>{{ signedMessage }}</pre>
        <button class="uk-button uk-button-default" v-on:click="doCopy(signedMessage)"><i class="fa-solid fa-copy"></i>&nbsp;Copy
        </button>
      </div>
    </div>
    <div class="uk-container" v-if="page=='sign-message'" style="margin-top:15px;">
      <div class="uk-margin">
        <input class="uk-input" placeholder="Message" type="text" v-model="message"></input>
      </div>
      <div class="uk-margin">
        <button :disabled="!message" class="uk-button uk-button-primary uk-width-1-1" v-on:click="signMessage()"><i
          class="fa-solid fa-signature"></i>&nbsp;Sign Message
        </button>
      </div>
      <div class="uk-margin" v-show="signedMessage">
        <h5>Signed Message : </h5>
        <pre>{{ signedMessage }}</pre>
        <button class="uk-button uk-button-default" v-on:click="doCopy(signedMessage)"><i class="fa-solid fa-copy"></i>&nbsp;Copy
        </button>
      </div>
    </div>
    <div class="uk-container" v-if="page=='verify-message'" style="margin-top:15px;">
      <div class="uk-margin">
        <input class="uk-input" placehoder="Message" type="text" v-model="vMessage"></input>
      </div>
      <div class="uk-margin">
        <input class="uk-input" placeholder="Address" type="text" v-model="vAddress"></input>
      </div>
      <div class="uk-margin">
        <input class="uk-input" placeholder="Signature" type="text" v-model="vSignature"></input>
      </div>
      <div class="uk-margin">
        <button :disabled="!vMessage||!vAddress||!vSignature" class="uk-button uk-button-primary uk-width-1-1"
                v-on:click="verifyMessage()"><i class="fa-solid fa-check-double"></i>&nbsp;Verify Message
        </button>
      </div>
    </div>
    <div class="uk-container" v-if="page=='about'" style="margin-top:15px;">
      <center>
        <img style="width:50%;height:auto" src="images/nav-logo-border.png">
        <div class="uk-margin">
          <p>Navcoin Wallet Extension for Chrome</p>
          <p>Build {{version}}</p>
          <p>Developed by Navcoin Developers</p>
          <a href="https://www.navcoin.org">https://www.navcoin.org</a>
        </div>
        <div class="uk-margin">
          <p>navcoin-js v{{ njs.version }}</p>
          <p>bitcore-lib {{ njs.wallet.bitcore.version }}</p>
        </div>
      </center>
    </div>
    <div class="uk-container" v-if="page=='welcome'" style="margin-top:15px;">
      <center>
        <img style="width:50%;height:auto" src="images/nav-logo-border.png">
        <h1 style="margin-top:10px;">Welcome</h1>
        <p>With Navcoin wallet you can send NAV, xNAV.</p>
        <p>You can create Private NFT collections and mint NFTs in your wallet.</p>
        <p>You can interact with decentralized applications (DApps) running on in the browser.</p>
        <div class="uk-margin">
          <button class="uk-button uk-button-primary" v-on:click="changePage('license-agreement')"><i
            class="fa-solid fa-right-long"></i>&nbsp;Get Started
          </button>
        </div>
      </center>
    </div>
    <div class="uk-container" v-if="page=='license-agreement'" style="margin-top:15px;">
      <h1>License Agreement</h1>
      <p>
        This is a binding Agreement between Navcoin Developers (“Navcoin” or “We”) and the person, persons, or entity
        (“You” or “Your”) using the service, Software, or application (“Software”).
      </p>
      <p class="terms__heading">
        RIGHTS AND OBLIGATIONS
      </p>
      <p>
        Navcoin provides the Software solely on the terms and conditions set forth in this Agreement and on the
        condition that You accept and comply with them. By using the Software You (a) accept this Agreement and agree
        that You are legally bound by its terms; and (b) represent and warrant that: (i) You are of legal age to enter
        into a binding agreement; and (ii) if You are a corporation, governmental organization or other legal entity,
        You have the right, power and authority to enter into this Agreement on behalf of the corporation, governmental
        organization or other legal entity and bind them to these terms.
      </p>
      <p>
        This Software functions as a free, open source, and multi-signature digital wallet. The Software does not
        constitute an account where We or other third parties serve as financial intermediaries or custodians of Your
        Navcoin(s).
      </p>
      <p>
        While the Software has undergone beta testing and continues to be improved by feedback from the open-source user
        and developer community, We cannot guarantee there will not be bugs in the Software. You acknowledge that Your
        use of this Software is at Your own discretion and in compliance with all applicable laws. You are responsible
        for safekeeping Your passwords, private key pairs, PINs, and any other codes You use to access the Software.
      </p>
      <p>
        IF YOU LOSE ACCESS TO YOUR NAV COIN WALLET OR YOUR ENCRYPTED PRIVATE KEYS AND YOU HAVE NOT SEPARATELY STORED A
        BACKUP OF YOUR WALLET AND CORRESPONDING PASSWORD, YOU ACKNOWLEDGE AND AGREE THAT ANY NAV COIN YOU HAVE
        ASSOCIATED WITH THAT WALLET WILL BECOME INACCESSIBLE. All transaction requests are irreversible. The authors of
        the Software, employees and affiliates of NAV COIN, copyright holders, and NAV COIN cannot retrieve Your private
        keys or passwords if You lose or forget them and cannot guarantee transaction confirmation as they do not have
        control over the Navcoin network.
      </p>
      <p class="terms__heading">
        DISCLAIMER
      </p>
      <p>
        THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
        THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
        AUTHORS OF THE SOFTWARE, EMPLOYEES AND AFFILIATES OF NAV COIN, COPYRIGHT HOLDERS, OR NAV COIN BE LIABLE FOR ANY
        CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR
        IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
      </p>
      <p>
        IN NO EVENT WILL NAV COIN OR ITS AFFILIATES, OR ANY OF ITS OR THEIR RESPECTIVE SERVICE PROVIDERS, BE LIABLE TO
        YOU OR ANY THIRD PARTY FOR ANY USE, INTERRUPTION, DELAY OR INABILITY TO USE THE SOFTWARE, LOST REVENUES OR
        PROFITS, DELAYS, INTERRUPTION OR LOSS OF SERVICES, BUSINESS OR GOODWILL, LOSS OR CORRUPTION OF DATA, LOSS
        RESULTING FROM SYSTEM OR SYSTEM SERVICE FAILURE, MALFUNCTION OR SHUTDOWN, FAILURE TO ACCURATELY TRANSFER, READ
        OR TRANSMIT INFORMATION, FAILURE TO UPDATE OR PROVIDE CORRECT INFORMATION, SYSTEM INCOMPATIBILITY OR PROVISION
        OF INCORRECT COMPATIBILITY INFORMATION OR BREACHES IN SYSTEM SECURITY, OR FOR ANY CONSEQUENTIAL, INCIDENTAL,
        INDIRECT, EXEMPLARY, SPECIAL OR PUNITIVE DAMAGES, WHETHER ARISING OUT OF OR IN CONNECTION WITH THIS AGREEMENT,
        BREACH OF CONTRACT, TORT (INCLUDING NEGLIGENCE) OR OTHERWISE, REGARDLESS OF WHETHER SUCH DAMAGES WERE
        FORESEEABLE AND WHETHER OR NOT WE WERE ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
      </p>
      <p class="terms__heading">
        INTELLECTUAL PROPERTY
      </p>
      <p>
        We retain all right, title, and interest in and to the Content and all of Navcoin’s brands, logos, and
        trademarks, including, but not limited to, Navcoin, NEXT, NEXT Wallet, NEXT Mobile Wallet, and variations of the
        wording of the aforementioned brands, logos, and trademarks.
      </p>
      <p class="terms__heading">
        CHOICE OF LAW
      </p>
      <p>
        This Agreement, and its application and interpretation, shall be governed exclusively by the laws of the State
        of Georgia, without regard to its conflict of law rules. You consent to the exclusive jurisdiction of the
        federal and state courts located in or near Atlanta, Georgia for any dispute arising under this Agreement.
      </p>
      <p class="terms__heading">
        SEVERABILITY
      </p>
      <p>
        In the event any court shall declare any section or sections of this Agreement invalid or void, such declaration
        shall not invalidate the entire Agreement and all other paragraphs of the Agreement shall remain in full force
        and effect.
      </p>
      <p class="terms__heading">
        BINDING AGREEMENT
      </p>
      <p>
        The terms and provisions of this Agreement are binding upon Your heirs, successors, assigns, and other
        representatives. This Agreement may be executed in counterparts, each of which shall be considered to be an
        original, but both of which constitute the same Agreement.
      </p>
      <p>
        You assume any and all risks associated with the use of the Software. We reserve the right to modify this
        Agreement from time to time.
      </p>
      <div class="uk-margin">
        <button class="uk-button uk-button-primary uk-width-1-1" v-on:click="changePage('select-network')"><i
          class="fa-solid fa-right-long"></i>&nbsp;I accept the license agreement
        </button>
      </div>
      <div class="uk-margin">
        <button class="uk-button uk-button-secondary uk-width-1-1" v-on:click="goBack()" style="margin-bottom:15px;"><i
          class="fa-solid fa-arrow-left"></i>&nbsp;Back
        </button>
      </div>
    </div>
    <div class="uk-container" v-if="page=='wallet-loading'" style="margin-top:15px;">
      <div uk-spinner></div>
    </div>
    <div class="uk-container" v-if="page=='select-network'" style="margin-top:15px;">
      <h5 class="uk-heading-divider">Please choose a network</h5>
      <button class="uk-button uk-button-default uk-width-1-1 uk-text-capitalize uk-padding-small uk-margin-small"
              v-for="(network,index) in networks" v-on:click="setNetwork(network)">{{ network.name }}
      </button>
      <button class="uk-button uk-button-secondary uk-width-1-1" v-on:click="goBack()"><i
        class="fa-solid fa-arrow-left"></i>&nbsp;Back
      </button>
    </div>
    <div class="uk-container" v-if="page=='create-wallet'" style="margin-top:15px;">
      <ul class="uk-subnav uk-subnav-pill" style="width:100%" :active="(isImportActive?1:0)"
          uk-switcher="animation: uk-animation-slide-left-medium, uk-animation-slide-right-medium">
        <li><a href="#">Create New Wallet</a></li>
        <li><a href="#">Import Wallet</a></li>
      </ul>
      <ul class="uk-switcher uk-margin" :active="(isImportActive?1:0)"
          uk-switcher="animation: uk-animation-slide-left-medium, uk-animation-slide-right-medium">
        <li>
          <form>
            <fieldset class="uk-fieldset">
              <legend class="uk-legend">Create New Wallet</legend>
              <div class="uk-margin">
                <input class="uk-input" type="text" placeholder="Wallet name" v-model="wallet_name">
              </div>
              <div class="uk-margin">
                <input class="uk-input" type="password" placeholder="Password" v-model="password">
              </div>
              <div class="uk-margin">
                <input class="uk-input" type="password" placeholder="Password (again)" v-model="password_again">
              </div>
              <div class="uk-margin">
                <button v-show="!busy" class="uk-button uk-button-primary uk-width-1-1" v-on:click="createWallet()"><i
                  class="fa-solid fa-asterisk"></i>&nbsp;Create Wallet
                </button>
              </div>
            </fieldset>
          </form>
        </li>
        <li>
          <form>
            <fieldset class="uk-fieldset">
              <legend class="uk-legend">Import Wallet</legend>
              <div class="uk-margin">
                <input class="uk-input" type="text" placeholder="Wallet name" v-model="wallet_name">
              </div>
              <div class="uk-margin">
                <input class="uk-input" type="text" placeholder="Mnemonic words" v-model="mnemonics">
              </div>
              <div class="uk-margin">
                <input class="uk-input" type="password" placeholder="Password" v-model="password">
              </div>
              <div class="uk-margin">
                <input class="uk-input" type="password" placeholder="Password (again)" v-model="password_again">
              </div>
              <div class="uk-margin">
                <button v-show="!busy" class="uk-button uk-button-primary uk-width-1-1" v-on:click="importWallet()"><i
                  class="fa-solid fa-file-import"></i>&nbsp;Import Wallet
                </button>
              </div>
            </fieldset>
          </form>
        </li>
      </ul>
      <button class="uk-button uk-button-secondary uk-width-1-1" v-on:click="goBack()"><i
        class="fa-solid fa-arrow-left"></i>&nbsp;Back
      </button>
    </div>
    <div class="uk-container" v-if="page=='select-wallet'">
      <div class="uk-margin" style="margin-top:15px;">
        <h5>Please choose a wallet</h5>
      </div>
      <div v-for="(wallet, index) in wallets"
           :class="{ 'uk-background-secondary uk-light': wallet.name+'_'+wallet.type+'_'+wallet.network==active_wallet_name, 'uk-background-muted': wallet.name+'_'+wallet.type+'_'+wallet.network!=active_wallet_name }"
           class="uk-card uk-border-rounded" style="padding:5px;cursor: pointer;" @click="setActiveWallet(wallet)">
        <article class="uk-comment">
          <header class="uk-comment-header">
            <div class="uk-grid-medium uk-flex-middle" uk-grid>
              <div class="uk-width-auto" style="width:64px;">
                <center>
                  <i v-if="wallet.name+'_'+wallet.type+'_'+wallet.network==active_wallet_name"
                     class="fa-2x fa-solid fa-wallet uk-text-primary"></i>
                  <i v-else class="fa-2x fa-solid fa-wallet"></i>
                </center>
              </div>
              <div class="uk-width-expand">
                <div><a class="uk-link-reset" href="#">{{ wallet.name }}</a></div>
                <ul class="uk-comment-meta uk-subnav uk-subnav-divider uk-margin-remove-top">
                  <li>{{ wallet.network }}</li>
                </ul>
              </div>
            </div>
          </header>
        </article>
      </div>
      <fieldset class="uk-fieldset uk-margin-small">
        <div class="uk-margin">
          <input class="uk-input" placeholder="Password" type="password" v-model="password" v-on:keyup.enter="unlockWallet()" ></input>
        </div>
        <div class="uk-margin">
          <button :disabled="!password" class="uk-button uk-button-secondary uk-width-1-1" v-on:click="unlockWallet()">
            <i class="fa-solid fa-unlock"></i>&nbsp;Unlock Wallet
          </button>
        </div>
        <div class="uk-margin">
          <button class="uk-button uk-button-primary uk-width-1-1" v-on:click="createNewWallet()"><i
            class="fa-solid fa-plus"></i>&nbsp;Create New Wallet
          </button>
        </div>
        <div class="uk-margin">
          <button class="uk-button uk-button-primary uk-width-1-1" v-on:click="importExistingWallet()"><i
            class="fa-solid fa-file-import"></i>&nbsp;Import Wallet
          </button>
        </div>
      </fieldset>
    </div>
    <div class="uk-container">
      <div v-if="page=='trusted_sites'" class="uk-card uk-card-default uk-card-body uk-width-1-2@m">
        <h3 class="uk-card-title">Trusted Sites</h3>
        <p>Below you can find a list of sites that you have previously granted access to your wallet and that have been
          marked as trusted.</p>
        <p>If there is a site that you do not want to access your wallet, you can delete it.</p>
        <ul class="uk-list uk-list-divider" v-if="trustedSites.length>0">
          <li v-for="(site,index) in trustedSites">
            <button class="uk-button uk-button-text" v-on:click="removeSite(index)"><i class="fas fa-trash"></i>
            </button>&nbsp;{{ site }}
          </li>
        </ul>
        <p v-else>No site was found that has been granted access to your wallet.</p>
      </div>
      <div v-if="page=='address_book'" class="uk-card uk-card-default uk-card-body uk-width-1-2@m">
        <div class="uk-margin">
          <h3 class="uk-card-title"><i class="fa-solid fa-address-book"></i>&nbsp;Address Book<button title="Clear Address Book" class="uk-button uk-button-text uk-align-right" type="button" v-on:click="clearAddressBook()"><i class="fa-solid fa-broom"></i></button></h3>
        </div>
        <div class="uk-margin">
          <form>
            <fieldset class="uk-fieldset">
              <div class="uk-margin">
                <input class="uk-input" placeholder="Name" type="text" v-model="book_name"></input>
              </div>
              <div class="uk-margin">
                <input class="uk-input" placeholder="Address" type="text" v-model="book_address"></input>
              </div>
              <div class="uk-margin">
                <button :disabled="!book_name&&!book_address" class="uk-button uk-button-primary uk-modal-close" type="button" v-on:click="addAddress()">
                  <i class="fa-solid fa-plus"></i> Add
                </button>
              </div>
            </fieldset>
          </form>
        </div>
        <ul class="uk-list uk-list-divider" v-if="addressBook.length>0">
          <li v-for="(address,index) in addressBook">
            <div>
              <i class="fa-solid fa-user"></i>&nbsp;{{ address.name }}
              <button class="uk-button uk-button-text uk-align-right" title="Delete Entry" v-on:click="removeAddress(index)"><i class="fas fa-trash"></i></button>
            </div>
            <div class="address" style="word-break:break-word;clear:both">
              {{ address.address }}
            </div>
          </li>
        </ul>
        <p v-else>No address found.</p>
      </div>
      <div id="modal-please-wait" uk-modal="esc-close:false;bg-close:false">
        <div class="uk-modal-dialog uk-modal-body">
          <h2 class="uk-modal-title"><i class="fa-solid fa-circle-notch fa-spin"></i>&nbsp;Processing</h2>
          <p>Please wait...</p>
          <p>{{ process_message }}</p>
        </div>
      </div>
      <div id="modal-connect-confirm" uk-modal v-if="action">
        <div class="uk-modal-dialog uk-modal-body">
          <h2 class="uk-modal-title">Connection Request</h2>
          <p>The website "<b>{{ sender.origin }}</b>" will have access to your private address and NFT collections.</p>
          <p>Please only give access to sites you trust.</p>
          <p class="uk-text-right">
            <button class="uk-button uk-button-default uk-modal-close" type="button" v-on:click="rejectConnection()">
              Cancel
            </button>
            <button class="uk-button uk-button-primary uk-modal-close" type="button" v-on:click="acceptConnection()">
              Accept
            </button>
          </p>
        </div>
      </div>
      <div id="modal-cancel-nft-sell-order-confirm" uk-modal v-if="action">
        <div class="uk-modal-dialog uk-modal-body">
          <h3>Cancel NFT Sell Order</h3>
          <p>The website "<b>{{ sender.origin }}</b>" requests to cancel an NFT sell order.</p>
          <p class="uk-text-break">Collection ID : {{ action.token_id }}</p>
          <p>NFT ID : {{ action.nft_id }}</p>
          <p>Do you confirm to cancel NFT sell order?</p>
          <p class="uk-text-right">
            <button class="uk-button uk-button-default uk-modal-close" type="button"
                    v-on:click="rejectCancelNFTSellOrder()">Reject
            </button>
            <button class="uk-button uk-button-primary uk-modal-close" type="button"
                    v-on:click="acceptCancelNFTSellOrder()">Accept
            </button>
          </p>
        </div>
      </div>
      <div id="modal-create-transaction-confirm" uk-modal v-if="action">
        <div class="uk-modal-dialog uk-modal-body">
          <h3>Create Transaction</h3>
          <p>The website "<b>{{ sender.origin }}</b>" requests to submit a transaction.</p>
          <p class="uk-text-break">Address : {{ action.address }}</p>
          <p>Amount to send : {{ action.amount }}</p>
          <p>Do you confirm to submit transaction?</p>
          <p class="uk-text-right">
            <button class="uk-button uk-button-default uk-modal-close" type="button"
                    v-on:click="rejectCreateTransaction()">Reject
            </button>
            <button class="uk-button uk-button-primary uk-modal-close" type="button"
                    v-on:click="acceptCreateTransaction()">Accept
            </button>
          </p>
        </div>
      </div>
      <div id="modal-sign-message-confirm" uk-modal v-if="action">
        <div class="uk-modal-dialog uk-modal-body">
          <h3>Sign Message</h3>
          <p>The website "<b>{{ sender.origin }}</b>" requests to sign a message.</p>
          <p class="uk-text-break">Message : {{ action.message }}</p>
          <p>Do you confirm to sign message?</p>
          <p class="uk-text-right">
            <button class="uk-button uk-button-default uk-modal-close" type="button" v-on:click="rejectSignMessage()">
              Reject
            </button>
            <button class="uk-button uk-button-primary uk-modal-close" type="button" v-on:click="acceptSignMessage()">
              Sign Message
            </button>
          </p>
        </div>
      </div>
      <div id="modal-create-private-token-confirm" uk-modal v-if="action">
        <div class="uk-modal-dialog uk-modal-body">
          <h3>Create Private Token</h3>
          <p>The website "<b>{{ sender.origin }}</b>" requests to create a private token on your wallet.</p>
          Name : {{ action.name }}<br />
          Symbol : {{ action.symbol }}<br />
          Maximum Supply : {{ action.max_supply }}<br />
          <p>Do you confirm to create private token?</p>
          <p class="uk-text-right">
            <button class="uk-button uk-button-default uk-modal-close" type="button"
                    v-on:click="rejectCreatePrivateToken()">Reject
            </button>
            <button class="uk-button uk-button-primary uk-modal-close" type="button"
                    v-on:click="acceptCreatePrivateToken()">Accept
            </button>
          </p>
        </div>
      </div>
      <div id="modal-mint-private-token-confirm" uk-modal v-if="action">
        <div class="uk-modal-dialog uk-modal-body">
          <h3>Mint Private Token</h3>
          <p>The website "<b>{{ sender.origin }}</b>" requests to mint private token on your wallet.</p>
          Token ID :
          <div style="word-break:break-word;">{{ action.token_id }}</div>
          Amount : {{ action.amount }}<br />
          <p>Do you confirm to mint private token?</p>
          <p class="uk-text-right">
            <button class="uk-button uk-button-default uk-modal-close" type="button"
                    v-on:click="rejectMintPrivateToken()">Reject
            </button>
            <button class="uk-button uk-button-primary uk-modal-close" type="button"
                    v-on:click="acceptMintPrivateToken()">Accept
            </button>
          </p>
        </div>
      </div>
      <div id="modal-create-nft-collection-confirm" uk-modal v-if="action">
        <div class="uk-modal-dialog uk-modal-body">
          <h3>Create NFT Collection</h3>
          <p>The website "<b>{{ sender.origin }}</b>" requests to create an NFT collection on your wallet.</p>
          Collection name : {{ action.name }}<br />
          Maximum Supply : {{ action.max_supply }}<br />
          Scheme :<br />
          <p class="uk-text-break">{{ action.scheme }}</p>
          <p>Do you confirm to create NFT collection?</p>
          <p class="uk-text-right">
            <button class="uk-button uk-button-default uk-modal-close" type="button"
                    v-on:click="rejectCreateNFTCollection()">Reject
            </button>
            <button class="uk-button uk-button-primary uk-modal-close" type="button"
                    v-on:click="acceptCreateNFTCollection()">Accept
            </button>
          </p>
        </div>
      </div>
      <div id="modal-create-nft-confirm" uk-modal v-if="action">
        <div class="uk-modal-dialog uk-modal-body">
          <h3>Mint NFT</h3>
          <p>The website "<b>{{ sender.origin }}</b>" requests to mint an NFT on your wallet.</p>
          NFT ID : {{ action.nft_id }}
          <br />
          Scheme :
          <br />
          <p class="uk-text-break">{{ action.scheme }}</p>
          <div v-if="!isPrivateTokensSynced">
            <span uk-spinner style="width:14px;height:14px;"></span>&nbsp;<small>Loading NFT collections...</small>
          </div>
          <div v-if="isPrivateTokensSynced && privateTokens.length>0">
            <p>Please select a collection for import :</p>
            <select class="uk-select" style="width: 100%" v-model="mint_nft_token_id">
              <option v-bind:value="item.id" v-for="(item,index) in privateTokens.filter(item => item.version==1)">
                {{ item.name }}
              </option>
            </select>
          </div>
          <div class="uk-alert-warning" uk-alert v-if="isPrivateTokensSynced && privateTokens.length==0">
            <a class="uk-alert-close" uk-close></a>
            <p><b>You don't have any NFT collection.</b></p>
          </div>
          <p v-if="isPrivateTokensSynced && privateTokens.length>0">Do you confirm to mint NFT?</p>
          <p class="uk-text-right">
            <button class="uk-button uk-button-default uk-modal-close" type="button" v-on:click="rejectCreateNFT()">
              Reject
            </button>
            <button :disabled="!mint_nft_token_id" class="uk-button uk-button-primary uk-modal-close" type="button"
                    v-on:click="acceptCreateNFT()">Accept
            </button>
          </p>
        </div>
      </div>
      <div id="modal-accept-nft-order-confirm" uk-modal v-if="action">
        <div class="uk-modal-dialog uk-modal-body">
          <h3>Purchase NFT</h3>
          <div v-if="action.order">
            <p>The website "<b>{{ sender.origin }}</b>" requests to purchase an NFT from marketplace.</p>
            <b>Collection ID</b>
            <div style="word-break:break-word;">
              {{ action.order.receive[0].tokenId }}
            </div>
            <b>NFT ID</b>
            <div>
              {{ action.order.receive[0].tokenNftId }}
            </div>
            <b>Price</b>
            <div>
              {{ formatBalance(action.order.pay[0].amount) }} xNAV
            </div>
          </div>
          <p>Do you confirm to purchase NFT?</p>
          <p class="uk-text-right">
            <button class="uk-button uk-button-default uk-modal-close" type="button" v-on:click="rejectNFTOrder()">
              Reject
            </button>
            <button class="uk-button uk-button-primary uk-modal-close" type="button" v-on:click="acceptNFTOrder()">
              Accept
            </button>
          </p>
        </div>
      </div>
      <div id="modal-create-nft-sell-order-confirm" uk-modal v-if="action">
        <div class="uk-modal-dialog uk-modal-body">
          <h3>Create NFT Sell Order</h3>
          <p>The website "<b>{{ sender.origin }}</b>" requests to create an NFT sell order.</p>
          <b>Token ID</b><br />
          <div style="word-break:break-word;">{{ action.token_id }}</div>
          <b>NFT ID :</b> {{ action.nft_id }}<br />
          <b>NFT Name : </b>{{ sell_nft_metadata.name }}<br />
          <b>Price : </b>{{ action.price }} xNAV<br />
          <div v-if="sell_nft_metadata.attributes">
            <center>
              <img v-if="sell_nft_metadata.attributes.content_type.split('/')[0]=='image'"
                   style="width:128px;height:auto;" :src="ipfs_to_url(sell_nft_metadata.image)">
            </center>
            <div style="margin-top:5px;" v-if="sell_nft_metadata.attributes.content_type.split('/')[0]=='audio'">
              <audio controls style="width:100%">
                <source :src="sell_nft_metadata.image" type="audio/ogg">
                <source :src="sell_nft_metadata.image" type="audio/mpeg">
                Your browser does not support the audio element.
              </audio>
            </div>
            <div style="margin-top:5px;" v-if="sell_nft_metadata.attributes.content_type.split('/')[0]=='video'">
              <video controls playsinline style="width:100%">
                <source :src="sell_nft_metadata.image" type="video/mp4">
                <source :src="sell_nft_metadata.image" type="video/ogg">
                Your browser does not support the audio element.
              </video>
            </div>
          </div>
          <p>Do you confirm to create NFT sell order?</p>
          <p class="uk-text-right">
            <button class="uk-button uk-button-default uk-modal-close" type="button"
                    v-on:click="rejectCreateNFTSellOrder()">Reject
            </button>
            <button class="uk-button uk-button-primary uk-modal-close" type="button"
                    v-on:click="acceptCreateNFTSellOrder()">Accept
            </button>
          </p>
        </div>
      </div>
      <ul v-if="page=='home'" class="uk-subnav uk-subnav-pill" style="width:100%"
          uk-switcher="animation: uk-animation-slide-left-medium, uk-animation-slide-right-medium">
        <li><a href="#">Wallet</a></li>
        <li><a href="#">Receive</a></li>
        <li><a href="#">Send</a></li>
        <li><a href="#">NFTs</a></li>
      </ul>
      <ul v-if="page=='home'" class="uk-switcher uk-margin"
          uk-switcher="animation: uk-animation-slide-left-medium, uk-animation-slide-right-medium">
        <li>
          <ul class="uk-list uk-grid-small">
            <li class="uk-padding-small uk-light card-public" v-if="balance">
              <div uk-grid>
                <div>
                  <img style="width:64px;height:auto;" src="images/nav-logo-border.png">
                </div>
                <div>
                  <p>Public</p>
                  <p v-if="balance">NAV {{ formatBalance(balance.nav.confirmed) }}</p>
                  <p v-if="balance && balance.nav.pending">Pending : NAV {{ formatBalance(balance.nav.pending) }}</p>
                  <div v-if="!balance" uk-spinner style="width:14px;height:14px;"></div>
                </div>
              </div>
            </li>
            <li class="uk-padding-small uk-light card-private" v-if="balance">
              <div uk-grid>
                <div>
                  <img style="width:64px;height:auto;" src="images/xnav-logo-border.png">
                </div>
                <div>
                  <p>Private</p>
                  <p v-if="balance">xNAV {{ formatBalance(balance.xnav.confirmed) }}</p>
                  <p v-if="balance && balance.xnav.pending">Pending : xNAV {{ formatBalance(balance.xnav.pending) }}</p>
                  <div v-if="!balance" uk-spinner style="width:14px;height:14px;"></div>
                </div>
              </div>
            </li>
            <li class="uk-padding-small uk-light card-private-tokens" v-if="balance">
              <div uk-grid>
                <div style="width:64px;height:auto;">
                  <center>
                    <i class="fa-3x fa-solid fa-coins"></i>
                  </center>
                </div>
                <div>
                  <p>Private Tokens</p>
                  <p v-if="Object.keys(balance.tokens).length==0">You don't have private token</p>
                  <ul v-else class="uk-list uk-list-bullet" v-if="balance.tokens">
                    <li v-for="(token,index) in balance.tokens">
                      <p v-if="token.confirmed">{{ token.code }} {{ formatBalance(token.confirmed) }}</p>
                      <p v-if="token.pending">Pending : {{ token.code }} {{ formatBalance(token.pending) }}</p>
                    </li>
                  </ul>
                </div>
              </div>
            </li>
            <!--<li class="uk-padding-small uk-light card-private-tokens" v-if="balance&&privateTokens">
							<div uk-grid>
								<div style="width:64px;height:auto;">
									<center>
										<i class="fa-3x fa-solid fa-coins"></i>
									</center>
								</div>
								<div>
									<p>Private Tokens</p>
									<ul class="uk-list uk-list-bullet">
										<li v-for="(token,index) in privateTokens.filter(item => item.version==0)">
											<p>{{token.name}}</p>
										</li>
									</ul>
								</div>
							</div>
						</li>!-->
            <li class="uk-padding-small uk-light card-private-nfts" v-if="balance&&privateTokens">
              <div uk-grid>
                <div style="width:64px;height:auto;">
                  <center>
                    <i class="fa-3x fa-solid fa-images"></i>
                  </center>
                </div>
                <div>
                  <p>Private NFT Collections</p>
                  <p v-if="privateTokens.filter(item => item.version==1).length==0">You don't have private NFT
                    collection</p>
                  <ul class="uk-list uk-list-bullet">
                    <li v-for="(token,index) in privateTokens.filter(item => item.version==1)">
                      <p>{{ token.name }}</p>
                    </li>
                  </ul>
                </div>
              </div>
            </li>
          </ul>
        </li>
        <li>
          <ul class="uk-subnav uk-subnav-pill uk-subnav-pill-o"
              uk-switcher="animation: uk-animation-slide-left-medium, uk-animation-slide-right-medium">
            <li><a href="#">Public</a></li>
            <li><a href="#">Private</a></li>
            <li><a href="#">History</a></li>
          </ul>
          <ul class="uk-switcher uk-margin"
              uk-switcher="animation: uk-animation-slide-left-medium, uk-animation-slide-right-medium">
            <li>
              <center>
                <div v-html="qrcode_nav"></div>
                <div class="address" style="word-break:break-word;">
                  <p>{{ publicAddress }}</p>
                </div>
                <button class="uk-button uk-button-default" v-on:click="doCopy(publicAddress)"><i
                  class="fa-solid fa-copy"></i>&nbsp;Copy
                </button>
              </center>
            </li>
            <li>
              <center>
                <div v-html="qrcode_xnav"></div>
                <div class="address" style="word-break:break-word;">
                  <p>{{ privateAddress }}</p>
                </div>
                <button class="uk-button uk-button-default" v-on:click="doCopy(privateAddress)"><i
                  class="fa-solid fa-copy"></i>&nbsp;Copy
                </button>
              </center>
            </li>
            <li>
              <div v-if="history.length>0">
                <center>
                  <button class="uk-button uk-button-small uk-button-default" :disabled="currentPage==1" @click="prev">
                    <i class="fa-solid fa-arrow-left"></i>&nbsp;
                  </button>
                  <span>{{ currentPage }} / {{ maxPage }}</span>
                  <button class="uk-button uk-button-small uk-button-default"
                          :disabled="currentPage==maxPage || maxPage==0" @click="next"><i
                    class="fa-solid fa-arrow-right"></i>&nbsp;
                  </button>
                </center>
              </div>
              <div v-else>
                <div class="uk-alert-warning" uk-alert>
                  <p>You do not have a transaction.</p>
                </div>
              </div>
              <div class="uk-card uk-card-small  uk-card-default uk-width-1-2@m" v-for="(tx,i) in paginatedTxs"
                   style="margin-top:15px;margin-bottom:15px;">
                <div class="uk-card-header">
                  <div class="uk-grid-small uk-flex-middle" uk-grid>
                    <div class="uk-width-auto">
                      <img v-show="tx.type=='nav'" style="width:32px;height:auto;" src="images/nav-logo-no-border.png">
                      <img v-show="tx.type=='xnav'" style="width:32px;height:auto;"
                           src="images/xnav-logo-no-border.png">
                    </div>
                    <div class="uk-width-expand">
                      <span class="notification">{{ tx.type.toUpperCase() }}</span>
                    </div>
                  </div>
                </div>
                <div class="uk-card-body">
                  <i v-show="tx.type=='cold_staking'" style="margin-left: 5px;width:19px;height:auto;"
                     class="fa-solid fa-asterisk"></i>
                  <i v-if="tx.amount>0" style="color:#669900" class="fa-solid fa-arrow-down"></i>
                  <i v-if="tx.amount<0" style="color:#cc6600" class="fa-solid fa-arrow-up"></i>
                  <span style="color:#cc6600" v-if="tx.amount<0">
										<span
                      v-if="tx.type!='nft'">{{ formatBalance(tx.amount) }} {{ tx.token_code
                      }} {{ (tx.token_name ? "(" + tx.token_name + ")" : "") }}</span>
										<span v-else>{{ tx.token_name }}</span>
									</span>
                  <span style="color:#669900" v-if="tx.amount>0">
										<span
                      v-if="tx.type!='nft'">+{{ formatBalance(tx.amount) }} {{ tx.token_code
                      }} {{ (tx.token_name ? "(" + tx.token_name + ")" : "") }}</span>
										<span v-else>{{ tx.token_name }}</span>
									</span>
                  <template v-if="tx.memos">
                    <div v-if="tx.memos.in.length>0">
                      <div v-for="(item,index) in tx.memos.in" style="margin-top:10px;">
                        <small v-if="item!=undefined && item!='' && item!='Change'"><i style="color:#cc6600" class="fa-solid fa-arrow-up"></i>{{item}}</small>
                      </div>
                    </div>
                    <div v-if="tx.memos.out.length>0">
										<span v-for="(item,index) in tx.memos.out" style="margin-top:10px;">
											<small v-if="item!=undefined && item!='' && item!='Change'"><i style="color:#669900" class="fa-solid fa-arrow-down"></i>{{item}}</small>
										</span>
                    </div>
                  </template>
                </div>
                <div class="uk-card-footer">
                  <span>{{ (tx.confirmed ? "Confirmed" : "Not Confirmed") }}</span>
                  <span class="uk-align-right">{{ formatDate(tx.timestamp) }}</span>
                </div>
              </div>
            </li>
          </ul>
        </li>
        <li>
          <ul class="uk-subnav uk-subnav-pill uk-subnav-pill-o"
              uk-switcher="animation: uk-animation-slide-left-medium, uk-animation-slide-right-medium">
            <li><a href="#">Native</a></li>
            <li><a href="#">Token</a></li>
            <li><a href="#">NFT</a></li>
          </ul>
          <ul class="uk-switcher uk-margin"
              uk-switcher="animation: uk-animation-slide-left-medium, uk-animation-slide-right-medium">
            <li>
              <form>
                <fieldset class="uk-fieldset">
                  <div class="uk-margin">
                    <button :disabled="addressBook.length==0" class="uk-button uk-button-link uk-align-right" type="button" :title="(addressBook.length>0?'Address Book':'Address Book Empty')"><i class="fa-solid fa-address-book"></i></button>
                    <div uk-dropdown="pos: bottom-center;mode:hover;" v-if="addressBook.length>0">
                        <ul class="uk-nav uk-dropdown-nav">
                            <li v-for="(a,index) in addressBook">
                              <a v-on:click="address=a.address" class="uk-dropdown-close"><i class="fa-solid fa-user"></i>&nbsp;{{a.name}}</a>
                            </li>
                        </ul>
                    </div>
                    <input class="uk-input" placeholder="Address" type="text" v-model="address"></input>
                    <span class="uk-badge" v-if="address&&!isAddressValid(address)">Invalid address</span>
                    <span class="uk-badge" v-if="isAddressValid(address)&&isAddressValid(address).type=='pubkeyhash'">Public</span>
                    <span class="uk-badge" v-if="isAddressValid(address)&&isAddressValid(address).type=='xnav'">Private</span>
                  </div>
                  <div class="uk-margin">
                    <input class="uk-input" placeholder="Amount" type="number" v-model="amount"></input>
                  </div>
                  <div class="uk-margin">
                      <div class="uk-grid uk-grid-small" uk-grid>
                        <div class="uk-width-auto">
                          <label class="uk-switch" for="lbl-private-transaction">
                            <input type="checkbox" id="lbl-private-transaction" :checked="isPrivateTransaction">
                            <div class="uk-switch-slider uk-switch-small" v-on:click="isPrivateTransaction=!isPrivateTransaction"></div>
                          </label>
                        </div>
                        <div class="uk-width-expand">
                          <h5 style="margin:0px;">Private Transaction</h5>
                          <p style="margin:0px;" v-if="isPrivateTransaction">Private (xNAV) balance will be used</p>
                          <p style="margin:0px;" v-else>Public (NAV) balance will be used</p>
                        </div>
                      </div>
                  </div>
                  <div class="uk-margin">
                      <div class="uk-grid uk-grid-small" uk-grid>
                        <div class="uk-width-auto">
                          <label class="uk-switch" for="lbl-includes-tx-fee">
                            <input type="checkbox" id="lbl-includes-tx-fee" :checked="isIncludesTxFee">
                            <div class="uk-switch-slider uk-switch-small" v-on:click="isIncludesTxFee=!isIncludesTxFee"></div>
                          </label>
                        </div>
                        <div class="uk-width-expand">
                          <h5 style="margin:0px;">Includes Transaction Fee</h5>
                          <p style="margin:0px;" v-if="isIncludesTxFee">Transaction fee will be included in total amount</p>
                          <p style="margin:0px;" v-else>Transaction fee will not be included in total amount</p>
                        </div>
                      </div>
                  </div>
                  <div class="uk-margin">
                    <button class="uk-button uk-button-default"
                            v-on:click="useAllFunds()">
                      <i class="fa-solid fa-coins"></i>&nbsp;Use All Funds
                    </button>
                    <button class="uk-button uk-button-primary uk-align-right" :disabled="!address || !amount"
                            v-on:click="send()"><i class="fa-solid fa-paper-plane"></i>&nbsp;Send
                    </button>
                  </div>
                </fieldset>
              </form>
            </li>
            <li>
              <form>
                <fieldset class="uk-fieldset">
                  <div class="uk-margin">
                    <button :disabled="addressBook.length==0" class="uk-button uk-button-link uk-align-right" type="button" :title="(addressBook.length>0?'Address Book':'Address Book Empty')"><i class="fa-solid fa-address-book"></i></button>
                    <div uk-dropdown="pos: bottom-center;mode:hover;" v-if="addressBook.length>0">
                        <ul class="uk-nav uk-dropdown-nav">
                            <li v-for="(a,index) in addressBook">
                              <a v-on:click="token_xnav_address=a.address" class="uk-dropdown-close"><i class="fa-solid fa-user"></i>&nbsp;{{a.name}}</a>
                            </li>
                        </ul>
                    </div>
                    <select class="uk-select" float style="width: 100%" v-model="token_id" v-if="balance">
                      <option v-bind:value="index" v-for="(item,index) in balance.tokens">{{ item.name }} -
                        {{ formatBalance(item.confirmed) }} {{ item.code }}
                      </option>
                    </select>
                  </div>
                  <div class="uk-margin">
                    <input class="uk-input" placeholder="XNAV Address" type="text" v-model="token_xnav_address"></input>
                  </div>
                  <div class="uk-margin">
                    <input class="uk-input" placeholder="Amount" type="number" v-model="token_amount"></input>
                  </div>
                  <div class="uk-margin">
                    <input class="uk-input" placeholder="Memo" type="text" v-model="token_memo"></input>
                  </div>
                  <div class="uk-margin">
                    <button class="uk-button uk-align-right uk-button-primary"
                            :disabled="!token_id || !token_xnav_address || !token_amount"
                            v-on:click="sendPrivateToken()"><i class="fa-solid fa-paper-plane"></i>&nbsp;Send
                    </button>
                  </div>
                </fieldset>
              </form>
            </li>
            <li>
              <form>
                <fieldset class="uk-fieldset">
                  <div class="uk-margin">
                    <button :disabled="addressBook.length==0" class="uk-button uk-button-link uk-align-right" type="button" :title="(addressBook.length>0?'Address Book':'Address Book Empty')"><i class="fa-solid fa-address-book"></i></button>
                    <div uk-dropdown="pos: bottom-center;mode:hover;" v-if="addressBook.length>0">
                        <ul class="uk-nav uk-dropdown-nav">
                            <li v-for="(a,index) in addressBook">
                              <a v-on:click="nft_xnav_address=a.address" class="uk-dropdown-close"><i class="fa-solid fa-user"></i>&nbsp;{{a.name}}</a>
                            </li>
                        </ul>
                    </div>
                    <select class="uk-select" float style="width: 100%" v-model="nft_token_id" v-if="balance">
                      <option v-bind:value="index" v-for="(item,index) in balance.nfts">{{ item.name }}</option>
                    </select>
                  </div>
                  <div class="uk-margin">
                    <select class="uk-select" float style="width: 100%" v-model="nft_id" v-if="nft_token_id">
                      <option v-bind:value="index" v-for="(item,index) in balance.nfts[nft_token_id].confirmed">
                        {{ index }} - {{ (parseJSON(item) ? parseJSON(item).name : item) }}
                      </option>
                    </select>
                  </div>
                  <div class="uk-margin">
                    <input class="uk-input" placeholder="XNAV Address" type="text" v-model="nft_xnav_address"></input>
                  </div>
                  <div class="uk-margin">
                    <input class="uk-input" placeholder="Memo" type="text" v-model="nft_memo"></input>
                  </div>
                  <div class="uk-margin">
                    <button class="uk-button uk-align-right uk-button-primary"
                            :disabled="!nft_token_id || !nft_id || !nft_xnav_address"
                            v-on:click="sendPrivateNFT()"><i class="fa-solid fa-paper-plane"></i>&nbsp;Send
                    </button>
                  </div>
                </fieldset>
              </form>
            </li>
          </ul>
        </li>
        <li>
          <div v-if="balance && Object.keys(balance.nfts).length>0">
            <h5>{{ Object.keys(balance.nfts).length }} Collection</h5>
            <div class="uk-card uk-card-default" v-for="(item,index) in balance.nfts"
                 v-if="parseJSON(item.scheme).version==1">
              <div class="uk-card-header">
                <!--<h3 class="uk-card-title">
									{{item.name}}
								</h3>!-->
                <img v-if="parseJSON(item.scheme).image" style="width:100%;height:auto"
                     :src="ipfs_to_url(parseJSON(item.scheme).image)">
                <div>
                  {{ parseJSON(item.scheme).name }}
                </div>
                <div>
                  {{ parseJSON(item.scheme).description }}
                </div>
                <div>
                  <i class="fa-solid fa-link"></i>&nbsp;<a target="_blank" :href="parseJSON(item.scheme).external_url">{{ parseJSON(item.scheme).external_url
                  }}</a>
                </div>
                <div>
                  <b><i class="fa-solid fa-clock"></i>&nbsp;Pending NFT(s) :</b> {{ Object.keys(item.pending).length }}
                </div>
              </div>
              <div class="uk-card-body">
                <div>
                  <div v-for="(item2,index) in item.confirmed"
                       class="uk-card uk-card-default uk-grid-collapse uk-child-width-1-1@s uk-margin" uk-grid>
                    <div class="uk-cover-container" v-if="parseJSON(item2).attributes.content_type">
                      <img v-if="parseJSON(item2).attributes.content_type.split('/')[0]=='image'"
                           onerror="this.style.display='none'" uk-cover :src="ipfs_to_url(parseJSON(item2).image)">
                      <canvas v-if="parseJSON(item2).attributes.content_type.split('/')[0]=='image'" width="400"
                              height="400"></canvas>
                    </div>
                    <div class="uk-card-body" style="margin-left:10px;">
                      <div class="uk-card-title">
                        <small>
                          <i v-if="parseJSON(item2).attributes.content_type&&parseJSON(item2).attributes.content_type.split('/')[0]=='audio'"
                             class="fa-solid fa-music"></i>
                          <i v-if="parseJSON(item2).attributes.content_type&&parseJSON(item2).attributes.content_type.split('/')[0]=='video'"
                             class="fa-solid fa-circle-play"></i>
                          &nbsp;{{ parseJSON(item2).name }} (#{{ index }})
                        </small>
                      </div>
                      <div>
                        <small>
                          {{ parseJSON(item2).description }}
                        </small>
                      </div>
                      <div>
                        <small>
                          <i class="fa-solid fa-link"></i>&nbsp;<a target="_blank"
                                                                   :href="parseJSON(item2).external_url">{{ parseJSON(item2).external_url
                          }}</a>
                        </small>
                      </div>
                      <div style="margin-top:5px;"
                           v-if="parseJSON(item2).attributes.content_type&&parseJSON(item2).attributes.content_type.split('/')[0]=='audio'">
                        <audio controls style="width:100%">
                          <source :src="parseJSON(item2).image" type="audio/ogg">
                          <source :src="parseJSON(item2).image" type="audio/mpeg">
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                      <div style="margin-top:5px;"
                           v-if="parseJSON(item2).attributes.content_type&&parseJSON(item2).attributes.content_type.split('/')[0]=='video'">
                        <video onplay="this.webkitEnterFullscreen();" controls playsinline style="width:100%">
                          <source :src="parseJSON(item2).image" type="video/mp4">
                          <source :src="parseJSON(item2).image" type="video/ogg">
                          Your browser does not support the audio element.
                        </video>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            <div class="uk-alert-warning" uk-alert>
              <p>You do not have an NFT collection.</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import * as njs from "navcoin-js";
import axios from "axios";
import sb from "satoshi-bitcoin";
import moment from "moment";
import bitcore from "@aguycalled/bitcore-lib";
import Mnemonic from "@aguycalled/bitcore-mnemonic";
import crypto from "crypto";
import buffer from "buffer";
const IV_LENGTH = 16; // For AES, this is always 16
var ENCRYPTION_KEY;
var wallet;
export default {
  data() {
    return {
      networks:
        [
          {
            name: "Mainnet",
            code: "mainnet"
          },
          {
            name: "Testnet",
            code: "testnet"
          }
        ],
      version:"1.0.3",
      walletType: "next",
      network: "testnet",
      wallet_name: "",
      password: "",
      password_again: "",
      spendingPassword:undefined,
      v_password: undefined,
      mnemonics: undefined,
      busy: false,
      active_wallet_already_exist: false,
      walletUnlocked: false,
      walletLoginSuccess: false,
      action: undefined,
      is_action_processed: false,
      sender: {},
      trustedSites: [],
      addressBook:[],
      status: "",
      page: "",
      pages: [],
      pageindex: 0,
      publicAddress: "",
      privateAddress: "",
      balance: undefined,
      history: [],
      qrcode_nav: "",
      qrcode_xnav: "",
      prefix: "navcoin:",
      wallets: [],
      active_wallet_name: "",
      pageSize: 10,
      currentPage: 1,
      progress: 0,
      njs: undefined,
      isPrivateTransaction: false,
      isIncludesTxFee: false,
      address: "",
      amount: "",
      swap_amount: "",
      token_id: "",
      token_xnav_address: "",
      token_amount: "",
      token_memo: "",
      nft_token_id:"",
      nft_id:"",
      nft_xnav_address:"",
      nft_memo:"",
      isPrivateToPublic: false,
      isSwapIncludesTxFee: false,
      fee: 100000,
      current_node: "",
      height: "",
      message: "",
      signedMessage: "",
      vMessage: "",
      vAddress: "",
      vSignature: "",
      isNewWallet: false,
      wordArrayOriginal: [],
      wordArray: [],
      wordArrayConfirm: [],
      privateTokens: [],
      isPrivateTokensSynced: false,
      mint_nft_token_id: "",
      sell_nft_metadata: {},
      process_message: "",
      isImportActive: false,
      db_load_failed: false,
      book_name:'',
      book_address:'',
    };
  },
  beforeCreate() {
  },
  computed:
    {
      indexStart() {
        return (this.currentPage - 1) * this.pageSize;
      },
      indexEnd() {
        return this.indexStart + this.pageSize;
      },
      maxPage() {
        return Math.ceil(this.history.length / this.pageSize);
      },
      paginatedTxs() {
        return this.history.slice(this.indexStart, this.indexEnd);
      }
    },
  created: function()
  {
    //chrome.storage.local.clear();
    let vm=this;
    try {
      chrome.storage.local.get({ addressBook: [] }, function(result)
      {
        vm.addressBook = result.addressBook;
      });
    }
    catch (e)
    {
    }
  },
  mounted: function() {
    let vm = this;
    vm.njs = njs;
    window.bitcore=bitcore;
    console.log("navcoin-js build " + njs.version);
    var views = [];
    try {
      views = chrome.extension.getViews({ type: "popup" });
      console.log("Popup mode...");
      console.log(views);
    } catch (e) {
      console.log("Window mode...");
      vm.listWallets();
    }
    console.log("Views length -> " + views.length);
    if (views.length > 0) {
      vm.listWallets();
    }
    try {
      chrome.runtime.sendMessage({ cmd: "ready" }, function(response) {
        vm.is_action_processed = false;
        vm.action = response.message;
        vm.sender = response.sender;
        chrome.storage.session.get(['last_active_wallet','password'], function(result)
        {
          if (result.last_active_wallet&&result.password)
          {
            console.log(result.last_active_wallet);
            console.log(result.password);
            let arr = result.last_active_wallet.split("_");
            {
              console.log("Latest used wallet -> " + result.last_active_wallet);
              console.log("Latest used network -> " + arr[2]);
              console.log("dApp network -> " + vm.action.network);
              if (arr[2]==vm.action.network)
              {
                console.log("Wallet & dAPP network are same, unlocking wallet...");
                console.log("Active wallet -> " + vm.active_wallet_name);
                vm.active_wallet_name=result.last_active_wallet;
                vm.active_wallet_already_exist=true;
                vm.password=result.password;
                vm.unlockWallet();
              }
              else
              {
                console.log("Wallet & dAPP network are not same...");
              }
            }
          }
        }); 
        if (views.length < 1) {
          vm.listWallets();
        }
      });
      chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
        console.log("new message");
        console.log(sender);
        console.log(msg.cmd);
        console.log(msg.message);
        if (msg.cmd == "update_action")
        {
          vm.is_action_processed = false;
          vm.action = msg.message;
          vm.sender = msg.sender;
          vm.processAction();
        }
      });
    } catch (e) {
    }
  },
  updated: function() {
    this.qrcode_nav = new QRCode(this.prefix + this.publicAddress).svg();
    this.qrcode_xnav = new QRCode(this.prefix + this.privateAddress).svg();
  },
  methods:
    {
      encrypt (text)
      {
          let iv = crypto.randomBytes(IV_LENGTH);
          let cipher = crypto.createCipheriv('aes-256-cbc', new Buffer(ENCRYPTION_KEY), iv);
          let encrypted = cipher.update(text);
          encrypted = Buffer.concat([encrypted, cipher.final()]);
          return iv.toString('hex') + ':' + encrypted.toString('hex');
      },
      decrypt (text)
      {
          try
          {
              let textParts=text.split(':');
              let iv=new buffer.Buffer(textParts.shift(), 'hex');
              let encryptedText=new buffer.Buffer(textParts.join(':'), 'hex');
              let decipher=crypto.createDecipheriv('aes-256-cbc', new buffer.Buffer(ENCRYPTION_KEY), iv);
              let decrypted=decipher.update(encryptedText);
              decrypted=buffer.Buffer.concat([decrypted, decipher.final()]);
              return decrypted.toString();
          }
          catch (e)
          {
              return false;
          }
      },
      randomString(length, chars)
      {
        if (!chars)
        {
          throw new Error('Argument \'chars\' is undefined');
        }

        const charsLength = chars.length;
        if (charsLength > 256)
        {
        throw new Error('Argument \'chars\' should not have more than 256 characters'
          + ', otherwise unpredictability will be broken');
        }

        const randomBytes = crypto.randomBytes(length);
        let result = new Array(length);

        let cursor = 0;
        for (let i = 0; i < length; i++)
        {
          cursor += randomBytes[i];
          result[i] = chars[cursor % charsLength];
        }
        return result.join('');
      },
      generateRandomPassword(length)
      {
        return this.randomString(length,'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');
      },
      isAddressValid(address)
      {
        if (!address) return;
        try
        {
          return new bitcore.Address(address,(address.length==34?this.network:"mainnet"));
        }
        catch
        {
          return false;
        }
      },
      setNetwork(network) {
        console.log("Changing network to -> " + network.code);
        this.network = network.code;
        this.changePage("create-wallet");
      },
      listWallets() {
        let vm = this;
        vm.wallets = [];
        console.log("Listing wallets...");
        vm.njs.wallet.WalletFile.ListWallets().then((wallets) => {
          let i = 0;
          console.log(wallets);
          wallets.forEach((wallet) => {
            if (wallet) {
              let arr = wallet.split("_");
              if (!vm.action || !vm.action.network || vm.action.network == arr[2]) {
                vm.wallets.push({
                  name: arr[0],
                  type: (arr[1] ? arr[1] : "next"),
                  network: (arr[2] ? arr[2] : "mainnet")
                });
                i++;
                console.log(i + "->" + wallet);
              }
            }
          });
          console.log(i);
          if (i == 1) {
            vm.setActiveWallet(vm.wallets[0]);
            vm.page = "select-wallet";
          } else if (i > 1) {
            vm.page = "select-wallet";
          } else {
            vm.page = "welcome";
          }
          vm.pages.push(vm.page);
          vm.pageindex = 0;
        });
      },
      prev() {
        this.currentPage--;
      },
      next() {
        this.currentPage++;
      },
      useAllFunds() {
        if (this.isPrivateTransaction) {
          this.amount = (this.balance.xnav.confirmed) / 1e8;
        } else {
          this.amount = (this.balance.nav.confirmed + this.balance.staked.confirmed) / 1e8;
        }
      },
      swapUseAllFunds()
      {
        if (!this.balance)
        {
            UIkit.modal.alert("Wallet synchronizing, try again later...");
            return;
        }
        if (this.isPrivateToPublic) {
          this.swap_amount = (this.balance.xnav.confirmed) / 1e8;
        } else {
          this.swap_amount = (this.balance.nav.confirmed + this.balance.staked.confirmed) / 1e8;
        }
      },
      swap() {
        let vm = this;
        vm.process_message = "Swapping assets...";
        if (!this.swap_amount) {
          UIkit.modal.alert("Missing amount");
          return;
        }
        const publicAddress = this.publicAddress;
        const privateAddress = this.privateAddress;
        let amount = parseFloat((vm.swap_amount * 1e8).toFixed(0));
        if (vm.isPrivateToPublic) {
          try {
            UIkit.modal("#modal-please-wait").show();
            wallet.xNavCreateTransaction(publicAddress, amount, "", vm.spendingPassword, vm.isSwapIncludesTxFee).then(function(tx) {
              let msg = "<h3>Swap</h3><p>Amount to swap : " + sb.toBitcoin((vm.isSwapIncludesTxFee ? amount - tx.fee : amount)) + " xNAV</p><p>Transaction fee : " + sb.toBitcoin(tx.fee) + " xNAV</p><p>Total amount : " + sb.toBitcoin((vm.isSwapIncludesTxFee ? amount : amount + tx.fee)) + " xNAV</p>" + "<p>Do you confirm swap?</p>";
              UIkit.modal.confirm(msg).then(function() {
                  UIkit.modal("#modal-please-wait").show();
                  wallet.SendTransaction(tx.tx).then(function(result) {
                    if (result.error) {
                      UIkit.modal.alert(result.error);
                    } else {
                      UIkit.modal.alert("Asset swap completed.");
                    }
                  })
                    .catch((e) => {
                      UIkit.modal.alert(e.message);
                    });
                }
                , function() {
                  console.log("Rejected.");
                });
            })
              .catch((e) => {
                UIkit.modal.alert(e.message);
              });
          } catch (e) {
            UIkit.modal.alert(e.message);
          }
        } else {
          try {
            UIkit.modal("#modal-please-wait").show();
            wallet.NavCreateTransaction(privateAddress, amount, "", vm.spendingPassword, vm.isSwapIncludesTxFee).then(function(tx) {
              let msg = "<h3>Swap</h3><p>Amount to swap : " + sb.toBitcoin((vm.isSwapIncludesTxFee ? amount - tx.fee : amount)) + " NAV</p><p>Transaction fee : " + sb.toBitcoin(tx.fee) + " NAV</p><p>Total amount : " + sb.toBitcoin((vm.isSwapIncludesTxFee ? amount : amount + tx.fee)) + " NAV</p>" + "<p>Do you confirm swap?</p>";
              UIkit.modal.confirm(msg).then(function() {
                  UIkit.modal("#modal-please-wait").show();
                  wallet.SendTransaction(tx.tx).then(function(result) {
                    if (result.error) {
                      UIkit.modal.alert(result.error);
                    } else {
                      UIkit.modal.alert("Asset swap completed.");
                    }
                  })
                    .catch((e) => {
                      UIkit.modal.alert(e.message);
                    });
                }
                , function() {
                  console.log("Rejected.");
                });
            })
              .catch((e) => {
                UIkit.modal.alert(e.message);
              });
          } catch (e) {
            UIkit.modal.alert(e.message);
          }
        }
      },
      doCopy: function(content) {
        this.$copyText(content).then(function(e) {
            UIkit.notification("Copied", { status: "success" });
          },
          function(e) {
            UIkit.notification("Not copied", { status: "warning" });
          });
      },
      shuffle: function(array) {
        return array.sort(() => Math.random() - 0.5);
      },
      ipfs_to_url: function(link) {
        let base_url = "https://ipfs.nextwallet.org/ipfs/";
        let e = link.split("ipfs://");
        return base_url + e[1];
      },
      skipVerifySeedPhrases: function() {
        let vm = this;
        UIkit.modal.confirm("<h3>Warning!</h3><p>If you do not back up your seed phrases, you will lose access to your balance in this wallet in the future.</p><p>Do you still want to skip the backup process?</p>").then(function() {
            vm.walletUnlocked = true;
            vm.page = "home";
          }
          , function() {
            console.log("Rejected.");
          });
      },
      confirmVerifySeedPhrases: function() {
        if (this.mnemonics.toString() == this.wordArrayConfirm.join(" ")) {
          this.walletUnlocked = true;
          this.page = "home";
        } else {
          UIkit.notification("Your seed phrases could not be verified, please try again.");
          this.wordArrayConfirm = [];
        }
      },
      addWordtoArray: function(word) {
        this.wordArrayConfirm.push(word);
      },
      signMessage() {
        let vm = this;
        try {
          console.log("Signing message with -> " + vm.publicAddress);
          wallet.NavGetPrivateKeys(vm.spendingPassword, vm.publicAddress).then(function(e) {
            console.log(e);
            vm.signedMessage = wallet.Sign(bitcore.PrivateKey.fromWIF(e[0].privateKey), vm.message);
          });
        } catch (err) {
          UIkit.modal.alert(e.message);
        }
      },
      verifyMessage() {
        try {
          let result = wallet.VerifySignature(this.vAddress, this.vMessage, this.vSignature);
          UIkit.notification((result.toString() == "true" ? "Message successfully validated" : "Message not valid"), { status: (result.toString() == "true" ? "success" : "warning") });
        } catch (e) {
          UIkit.notification(e.message);
        }
      },
      removeWallet() {
        let vm = this;
        if (this.v_password == this.password)
        {
            wallet.Disconnect();
            wallet.CloseDb();
            chrome.storage.session.clear();
            this.mnemonics = undefined;
            this.balance = undefined;
            this.privateTokens = [];
            this.password = undefined;
            this.password_again = undefined;
            this.spendingPassword = undefined;
            this.walletUnlocked = false;
            this.walletLoginSuccess=false;
            this.isNewWallet = false;
            this.wallet_name=undefined;
            this.active_wallet_name=undefined;
            this.wallet=undefined;
            njs.wallet.WalletFile.RemoveWallet(this.active_wallet_name).then(() => {
            console.log("Wallet " + this.active_wallet_name + " removed.");
            UIkit.notification("<i class='fas fa-check'></i>&nbsp;Wallet removed", { status: "success" });
            njs.wallet.WalletFile.ListWallets().then((wallets) => {
              console.log("Remaining wallet numbers : " + wallets.length);
              vm.listWallets();
              if (wallets.length < 1) {
                vm.changePage("welcome");
              } else {
                vm.changePage("select-wallet");
              }
            });
          })
            .catch((e) => {
              UIkit.modal.alert(e.message);
            });
        } else {
          UIkit.notification("<i class='fas fa-close'></i>&nbsp;Invalid password", { status: "danger" });
        }
      },
      send() {
        let vm = this;
        if (!vm.isAddressValid(vm.address))
        {
          UIkit.modal.alert("Invalid receiver address, please check it...");
          return;
        }
        let amount = parseFloat((vm.amount * 1e8).toFixed(0));
        if (vm.isPrivateTransaction) {
          try {
            UIkit.modal("#modal-please-wait").show();
            wallet.xNavCreateTransaction(vm.address, amount, "", vm.spendingPassword, vm.isIncludesTxFee).then(function(tx) {
              let msg = "<p>Amount to send : " + sb.toBitcoin((vm.isIncludesTxFee ? amount - tx.fee : amount)) + " xNAV</p><p>Transaction fee : " + sb.toBitcoin(tx.fee) + " xNAV</p><p>Total amount : " + sb.toBitcoin((vm.isIncludesTxFee ? amount : amount + tx.fee)) + " xNAV</p>" + "<p>Do you confirm transaction?</p>";
              UIkit.modal.confirm(msg).then(function() {
                UIkit.modal("#modal-please-wait").show();
                  wallet.SendTransaction(tx.tx).then(function(result) {
                    if (result.error) {
                      UIkit.modal.alert(result.error);
                    } else {
                      vm.address = null;
                      vm.amount = null;
                      UIkit.modal.alert("Transaction completed.");
                    }
                  })
                    .catch((e) => {
                      UIkit.modal.alert(e.message);
                    });
                }
                , function() {
                  console.log("Rejected.");
                });
            })
              .catch((e) => {
                UIkit.modal.alert(e.message);
              });
          } catch (e) {
            UIkit.modal.alert(e.message);
          }
        } else {
          try {
            UIkit.modal("#modal-please-wait").show();
            wallet.NavCreateTransaction(vm.address, amount, "", vm.spendingPassword, vm.isIncludesTxFee).then(function(tx) {
              let msg = "<p>Amount to send : " + sb.toBitcoin((vm.isIncludesTxFee ? amount - tx.fee : amount)) + " NAV</p><p>Transaction fee : " + sb.toBitcoin(tx.fee) + " NAV</p><p>Total amount : " + sb.toBitcoin((vm.isIncludesTxFee ? amount : amount + tx.fee)) + " NAV</p>" + "<p>Do you confirm transaction?</p>";
              UIkit.modal.confirm(msg).then(function() {
                  UIkit.modal("#modal-please-wait").show();
                  wallet.SendTransaction(tx.tx).then(function(result) {
                    if (result.error) {
                      UIkit.modal.alert(result.error);
                    } else {
                      vm.address = null;
                      vm.amount = null;
                      UIkit.modal.alert("Transaction completed.");
                    }
                  })
                    .catch((e) => {
                      UIkit.modal.alert(e.message);
                    });
                }
                , function() {
                  console.log("Rejected.");
                });
            })
              .catch((e) => {
                UIkit.modal.alert(e.message);
              });
          } catch (e) {
            UIkit.modal.alert(e.message);
          }
        }
      },
      sendPrivateToken() {
        let vm = this;
        let token_amount = parseFloat((vm.token_amount * 1e8).toFixed(0));
        try {
          UIkit.modal("#modal-please-wait").show();
          wallet.tokenCreateTransaction(vm.token_xnav_address, token_amount, vm.token_memo, vm.spendingPassword, vm.token_id).then(function(tx) {
            let msg = "<p>Amount to send : " + sb.toBitcoin(token_amount) + " " + vm.balance.tokens[vm.token_id].code + "</p><p>Transaction fee : " + sb.toBitcoin(tx.fee) + " xNAV</p><p>Do you confirm transaction?</p>";
            UIkit.modal.confirm(msg).then(function() {
                UIkit.modal("#modal-please-wait").show();
                wallet.SendTransaction(tx.tx).then(function(result) {
                  if (result.error) {
                    UIkit.modal.alert(result.error);
                  } else {
                    vm.token_address = null;
                    vm.token_amount = null;
                    vm.token_memo = null;
                    UIkit.modal.alert("Private Token transaction completed.");
                  }
                })
                  .catch((e) => {
                    UIkit.modal.alert(e.message);
                  });
              }
              , function() {
                console.log("Rejected.");
              });
          })
            .catch((e) => {
              UIkit.modal.alert(e.message);
            });
        } catch (e) {
          UIkit.modal.alert(e.message);
        }
      },
      sendPrivateNFT() {
        let vm = this;
        let token_amount = parseFloat((vm.token_amount * 1e8).toFixed(0));
        try {
          UIkit.modal("#modal-please-wait").show();
          wallet.tokenCreateTransaction(vm.nft_xnav_address, 1, vm.nft_memo, vm.spendingPassword, vm.nft_token_id, vm.nft_id).then(function(tx) {
            let msg = "<p>Transaction fee : " + sb.toBitcoin(tx.fee) + " xNAV</p><p>Do you confirm transaction?</p>";
            UIkit.modal.confirm(msg).then(function() {
                UIkit.modal("#modal-please-wait").show();
                wallet.SendTransaction(tx.tx).then(function(result) {
                  if (result.error) {
                    UIkit.modal.alert(result.error);
                  } else {
                    vm.token_nft_address = null;
                    vm.token_memo = null;
                    UIkit.modal.alert("Private NFT transaction completed.");
                  }
                })
                  .catch((e) => {
                    UIkit.modal.alert(e.message);
                  });
              }
              , function() {
                console.log("Rejected.");
              });
          })
            .catch((e) => {
              UIkit.modal.alert(e.message);
            });
        } catch (e) {
          UIkit.modal.alert(e.message);
        }
      },
      createWallet: function() {
        if (!this.password) {
          UIkit.modal.alert("Please specify a password");
        } else if (this.password.length < 6) {
          UIkit.modal.alert("Your password must be at least 6 characters long.");
        } else if (this.password != this.password_again) {
          UIkit.modal.alert("The passwords you specify must be the same.");
        } else {
          this.active_wallet_name = this.wallet_name + "_" + this.walletType + "_" + this.network;
          this.isNewWallet = true;
          this.initWallet();
        }
      },
      importWallet: function() {
        if (!this.mnemonics) {
          UIkit.modal.alert("Please specify mnemonic words");
        } else if (!this.password) {
          UIkit.modal.alert("Please specify a password");
        } else if (this.password.length < 6) {
          UIkit.modal.alert("Your password must be at least 6 characters long.");
        } else if (this.password!=this.password_again) {
          UIkit.modal.alert("The passwords you specify must be the same.");
        } else {
          var valid = Mnemonic.isValid(this.mnemonics);
          if (!valid) {
            UIkit.modal.alert("Mnemonics word checking failed, please correct your mnemonics and try again...");
          } else {
            this.active_wallet_name = this.wallet_name + "_" + this.walletType + "_" + this.network;
            this.initWallet();
          }
        }
      },
      createNewWallet() {
        this.active_wallet_already_exist = false;
        this.isImportActive = false;
        this.changePage("select-network");
      },
      importExistingWallet() {
        this.active_wallet_already_exist = false;
        this.isImportActive = true;
        this.changePage("create-wallet");
      },
      unlockWallet: function() {
        if (!this.active_wallet_name) {
          UIkit.modal.alert("Please choose a wallet.");
          return;
        }
        this.busy = true;
        this.initWallet();
      },
      parseJSON: function(str) {
        try {
          //console.log(JSON.parse(str));
          return JSON.parse(str);
        } catch (err) {
          return false;
        }
      },
      setActiveWallet(wallet) {
        this.active_wallet_name = wallet.name + "_" + wallet.type + "_" + wallet.network;
        this.active_wallet_already_exist = true;
        console.log("Active wallet -> " + this.active_wallet_name);
      },
      removeSite(index)
      {
        this.trustedSites.splice(index, 1);
        try {
          chrome.storage.local.set({ trustedSites: this.trustedSites }, function() {
          });
        } catch (e) {
        }
      },
      removeAddress(index)
      {
        let vm=this;
        UIkit.modal.confirm('Are you sure you want to delete? This action cannot be undone.').then(function()
        {
            try
            {
              vm.addressBook.splice(index, 1);
              chrome.storage.local.set({ addressBook: vm.addressBook }, function()
              {
                UIkit.notification("<i class='fas fa-check'></i>&nbsp;Entry deleted.", { status: "success" });
              });
            }
            catch (e)
            {
            }
        },
        function ()
        {
            console.log('Rejected.')
        });
      },
      clearAddressBook()
      {
        let vm=this;
        UIkit.modal.confirm('Are you sure you want to permanently clear the entries in the address book? This action cannot be undone.').then(function()
        {
            chrome.storage.local.set({ addressBook: [] }, function()
            {
              vm.addressBook=[];
              UIkit.notification("<i class='fas fa-check'></i>&nbsp;Address book cleared.", { status: "success" });
            });
        },
        function ()
        {
            console.log('Rejected.')
        });
      },
      addAddress()
      {
          let vm=this;
          chrome.storage.local.get({ addressBook: [] }, function(result) {
            var addressBook = result.addressBook;
            if (!addressBook.includes(vm.book_address))
            {
              addressBook.push({name:vm.book_name,address:vm.book_address});
              chrome.storage.local.set({ addressBook: addressBook }, function() {
                chrome.storage.local.get("addressBook", function(result)
                {
                  vm.addressBook=result.addressBook;
                  console.log(result.addressBook);
                  this.book_name="";
                  this.book_address="";
                  UIkit.notification("<i class='fas fa-check'></i>&nbsp;Address successfully added", { status: "success" });
                });
              });
            }
          });
       },
      closeWallet: function() {
        wallet.Disconnect();
        wallet.CloseDb();
        chrome.storage.session.clear();
        this.mnemonics = undefined;
        this.balance = undefined;
        this.privateTokens = [];
        this.password = undefined;
        this.password_again = undefined;
        this.spendingPassword = undefined;
        this.walletUnlocked = false;
        this.walletLoginSuccess=false;
        this.isNewWallet = false;
        this.wallet_name=undefined;
        this.active_wallet_name=undefined;
        this.wallet=undefined;
        this.listWallets();
        this.changePage("select-wallet");
      },
      changePage: function(page) {
        this.pages.push(page);
        this.pageindex++;
        this.page = page;
        let vm = this;
        try {
          UIkit.dropdown("#menu").hide(0);
        } catch (e) {
        }
        if (this.page == "trusted_sites") {
          try {
            chrome.storage.local.get({ trustedSites: [] }, function(result) {
              vm.trustedSites = result.trustedSites;
            });
          } catch (e) {
          }
        }
        if (this.page == "address_book") {
          try {
            chrome.storage.local.get({ addressBook: [] }, function(result) {
              vm.addressBook = result.addressBook;
            });
          } catch (e) {
          }
        } 
        else if (this.page == "backup-wallet") {
          vm.mnemonics = undefined;
          UIkit.modal.prompt("Wallet Password:", "").then(function(password) {
            if (!password) return;
            if (password!=vm.password)
            {
              UIkit.modal.alert("Wrong password");
            }
            else
            {
              wallet.db.GetMasterKey("mnemonic", vm.spendingPassword)
                .then(function(e) {
                  if (e) {
                    vm.mnemonics = e;
                  } else {
                    UIkit.modal.alert("Wrong password");
                  }
                });
              }
          });
        }
      },
      goBack: function() {
        console.log(this.pages);
        console.log(this.pageindex - 1);
        this.page = this.pages[this.pageindex - 1];
        this.pages.splice(this.pageindex, 1);
        this.pageindex--;
      },
      formatBalance: n => {
        if (n == 0) return n;
        if (n) {
          var amount = sb.toBitcoin(n);
          var parts = amount.toString().split(".");
          return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
        } else {
          return "";
        }
      },
      formatDate: n => {
        if (n) return moment.unix(n).format("DD.MM.YY HH:mm:ss"); else return "";
      },
      acceptConnection() {
        let vm = this;
        chrome.runtime.sendMessage({ cmd: "accept_connection", address: this.privateAddress }, function(response) {
          console.log(response);
          chrome.storage.local.get({ trustedSites: [] }, function(result) {
            var trustedSites = result.trustedSites;
            if (!trustedSites.includes(vm.sender.origin)) {
              trustedSites.push(vm.sender.origin);
              chrome.storage.local.set({ trustedSites: trustedSites }, function() {
                chrome.storage.local.get("trustedSites", function(result) {
                  console.log(result.trustedSites);
                  //window.close();
                });
              });
            }
          });
        });
      },
      rejectNFTOrder() {
        try {
          chrome.runtime.sendMessage({ cmd: "reject_nft_order" }, function(response) {
            console.log(response);
            //window.close();
          });
        } catch (e) {
        }
      },
      acceptNFTOrder() {
        let vm = this;
        console.log("Accepting nft order...");
        console.log(this.action.order);
        vm.process_message = "Accepting order...";
        UIkit.modal("#modal-please-wait").show();
        wallet.AcceptOrder(vm.action.order, vm.spendingPassword).then(function(tx) {
          vm.process_message = "Submitting transaction...";
          wallet.SendTransaction(tx.tx).then(function(result) {
            if (result.error) {
              UIkit.modal.alert(result.error);
            } else {
              UIkit.modal.alert("NFT order accepted successfully.");
            }
          })
            .catch((e) => {
              UIkit.modal.alert(e.message);
            });
        })
          .catch((e) => {
            UIkit.modal.alert(e.message);
          });
      },
      rejectConnection() {
        try {
          chrome.runtime.sendMessage({ cmd: "reject_connection" }, function(response) {
            console.log(response);
            //window.close();
          });
        } catch (e) {
        }
      },
      acceptCreatePrivateToken: function() {
        console.log(this.action.name);
        console.log(this.action.symbol);
        console.log(this.action.max_supply);
        console.log("Creating transaction...");
        let vm = this;
        vm.process_message = "Creating private token...";
        setTimeout(function(){UIkit.modal("#modal-please-wait").show();}, 1000);
        wallet.CreateToken(this.action.name, this.action.symbol, this.action.max_supply * 1e8, this.spendingPassword).then(function(response) {
          console.log(response);
          if (response.tx) {
            console.log("Submitting transaction...");
            wallet.SendTransaction(response.tx).then(function(result) {
              console.log(result);
              if (result.error) {
                UIkit.modal.alert(result.error);
              } else {
                UIkit.modal.alert("Private token created successfully.");
                chrome.runtime.sendMessage({ cmd: "accept_create_private_token", tx: result }, function(response) {
                  console.log(response);
                });
              }
            }).catch((e) => {
              UIkit.modal.alert(e.message);
              chrome.runtime.sendMessage({ cmd: "reject_create_private_token" }, function(response) {
                console.log(response);
              });
            });
          }
        })
          .catch((e) => {
            UIkit.modal.alert(e.message);
            chrome.runtime.sendMessage({ cmd: "reject_create_private_token" }, function(response) {
              console.log(response);
            });
          });
      },
      rejectCreatePrivateToken() {
        try {
          chrome.runtime.sendMessage({ cmd: "reject_create_private_token" }, function(response) {
            console.log(response);
            //window.close();
          });
        } catch (e) {
        }
      },
      acceptMintPrivateToken: function() {
        console.log(this.action.token_id);
        console.log(this.action.amount);
        console.log(this.privateAddress);
        console.log("Creating transaction...");
        let vm = this;
        vm.process_message = "Minting private token...";
        setTimeout(function(){UIkit.modal("#modal-please-wait").show();}, 1000);
        wallet.MintToken(this.action.token_id, this.privateAddress, this.action.amount * 1e8, this.spendingPassword).then(function(response) {
          console.log(response);
          if (response.tx) {
            console.log("Submitting transaction...");
            wallet.SendTransaction(response.tx).then(function(result) {
              console.log(result);
              if (result.error) {
                UIkit.modal.alert(result.error);
              } else {
                UIkit.modal.alert("Private token minted successfully.");
                chrome.runtime.sendMessage({ cmd: "accept_mint_private_token", tx: result }, function(response) {
                  console.log(response);
                });
              }
            }).catch((e) => {
              UIkit.modal.alert(e.message);
              chrome.runtime.sendMessage({ cmd: "reject_mint_private_token" }, function(response) {
                console.log(response);
              });
            });
          }
        })
          .catch((e) => {
            UIkit.modal.alert(e.message);
            chrome.runtime.sendMessage({ cmd: "reject_mint_private_token" }, function(response) {
              console.log(response);
            });
          });
      },
      rejectMintPrivateToken() {
        try {
          chrome.runtime.sendMessage({ cmd: "reject_mint_private_token" }, function(response) {
            console.log(response);
            //window.close();
          });
        } catch (e) {
        }
      },
      acceptSignMessage() {
        let vm = this;
        try {
          console.log("Signing message with -> " + vm.publicAddress);
          wallet.NavGetPrivateKeys(vm.spendingPassword, vm.publicAddress).then(function(e) {
            console.log(e);
            let signed_message = wallet.Sign(bitcore.PrivateKey.fromWIF(e[0].privateKey), vm.message);
            chrome.runtime.sendMessage({
              cmd: "accept_sign_message",
              signed_message: signed_message,
              address: vm.publicAddress
            }, function(response) {
              console.log(response);
            });
          });
        } catch (err) {
          UIkit.modal.alert(e.message);
        }
      },
      acceptCreateTransaction() {
        let vm = this;
        console.log("accepting create transaction");
        console.log(this.action.address);
        console.log(this.action.amount);
        vm.process_message = "Creating transaction...";
        setTimeout(function(){UIkit.modal("#modal-please-wait").show();}, 1000);
        try {
          wallet.xNavCreateTransaction(this.action.address, this.action.amount, "", vm.spendingPassword, vm.isIncludesTxFee).then(function(tx) {
            if (tx.tx) {
              let msg = "<h3>Create Transaction</h3><p>Transaction fee : " + sb.toBitcoin(tx.fee) + " xNAV</p><p>Do you confirm transaction?</p>";
              UIkit.modal.confirm(msg).then(function()
              {
                  UIkit.modal("#modal-please-wait").show();
                  wallet.SendTransaction(tx.tx).then(function(result) {
                    console.log(result);
                    if (result.error) {
                      UIkit.modal.alert(result.error);
                      chrome.runtime.sendMessage({ cmd: "reject_create_transaction" }, function(response) {
                        console.log(response);
                      });
                      UIkit.modal("#modal-please-wait").hide();
                    } else {
                      UIkit.modal("#modal-please-wait").hide();
                      UIkit.modal.alert("Transaction submitted successfully.");
                      chrome.runtime.sendMessage({ cmd: "accept_create_transaction", tx: result }, function(response) {
                        console.log(response);
                      });
                    }
                  })
                    .catch((e) => {
                      UIkit.modal("#modal-please-wait").hide();
                      console.log(e);
                      chrome.runtime.sendMessage({ cmd: "reject_create_transaction" }, function(response) {
                        console.log(response);
                      });
                      UIkit.modal.alert(e.message);
                    });
                }
                , function() {
                  UIkit.modal("#modal-please-wait").hide();
                  console.log("Rejected.");
                  chrome.runtime.sendMessage({ cmd: "reject_create_transaction" }, function(response) {
                    console.log(response);
                  });
                });
            }
          })
            .catch((e) => {
              console.log(e);
            });
        } catch (e) {
          console.log(e);
        }
      },
      acceptCancelNFTSellOrder() {
        let vm = this;
        console.log("accepting cancel nft sell order");
        console.log(this.privateAddress);
        console.log(this.action.token_id);
        console.log(this.action.nft_id);
        vm.process_message = "Cancelling NFT Sell Order...";
        setTimeout(function(){UIkit.modal("#modal-please-wait").show();}, 1000);
        try {
          wallet.tokenCreateTransaction(vm.privateAddress, 1, undefined, vm.spendingPassword, vm.action.token_id, vm.action.nft_id).then(function(tx) {
            if (tx.tx) {
              let msg = "<h3>Cancel NFT Sell Order</h3><p>Transaction fee : " + sb.toBitcoin(tx.fee) + " xNAV</p><p>Do you confirm transaction?</p>";
              UIkit.modal.confirm(msg).then(function() {
                  UIkit.modal("#modal-please-wait").show();
                  wallet.SendTransaction(tx.tx).then(function(result) {
                    console.log(result);
                    if (result.error) {
                      UIkit.modal.alert(result.error);
                      chrome.runtime.sendMessage({ cmd: "reject_cancel_nft_order" }, function(response) {
                        console.log(response);
                      });
                      UIkit.modal("#modal-please-wait").hide();
                    } else {
                      UIkit.modal("#modal-please-wait").hide();
                      UIkit.modal.alert("NFT sell order has been successfully canceled.");
                      chrome.runtime.sendMessage({ cmd: "accept_cancel_nft_order" }, function(response) {
                        console.log(response);
                      });
                    }
                  })
                    .catch((e) => {
                      UIkit.modal("#modal-please-wait").hide();
                      console.log(e);
                      chrome.runtime.sendMessage({ cmd: "reject_cancel_nft_order" }, function(response) {
                        console.log(response);
                      });
                      UIkit.modal.alert(e.message);
                    });
                }
                , function() {
                  UIkit.modal("#modal-please-wait").hide();
                  console.log("Rejected.");
                  chrome.runtime.sendMessage({ cmd: "reject_cancel_nft_order" }, function(response) {
                    console.log(response);
                  });
                });
            }
          })
            .catch((e) => {
              console.log(e);
            });
        } catch (e) {
          console.log(e);
        }
      },
      rejectSignMessage() {
        try {
          chrome.runtime.sendMessage({ cmd: "reject_sign_message" }, function(response) {
            console.log(response);
            //window.close();
          });
        } catch (e) {
        }
      },
      rejectCreateTransaction() {
        try {
          chrome.runtime.sendMessage({ cmd: "reject_create_transaction" }, function(response) {
            console.log(response);
            //window.close();
          });
        } catch (e) {
        }
      },
      rejectCancelNFTSellOrder() {
        try {
          chrome.runtime.sendMessage({ cmd: "reject_cancel_nft_order" }, function(response) {
            console.log(response);
            //window.close();
          });
        } catch (e) {
        }
      },
      rejectCreateNFTCollection() {
        try {
          chrome.runtime.sendMessage({ cmd: "reject_cancel_nft_order" }, function(response) {
            console.log(response);
            //window.close();
          });
        } catch (e) {
        }
      },
      acceptCreateNFTCollection() {
        console.log("Accepting create nft collection request...");
        console.log(this.action);
        let vm = this;
        vm.process_message = "Creating NFT collection...";
        UIkit.modal("#modal-please-wait").show();
        wallet.CreateNft(this.action.name, this.action.scheme, this.action.max_supply * 1e8, this.spendingPassword).then(function(tx) {
          UIkit.modal("#modal-please-wait").hide();
          if (tx.tx) {
            let msg = "<h3>Create NFT Collection</h3><p>Transaction fee : " + sb.toBitcoin(tx.fee) + " xNAV</p><p>Do you confirm transaction?</p>";
            UIkit.modal.confirm(msg).then(function() {
                UIkit.modal("#modal-please-wait").show();
                wallet.SendTransaction(tx.tx).then(function(result) {
                  console.log(result);
                  if (result.error)
                  {
                    chrome.runtime.sendMessage({ cmd: "reject_create_nft_collection" }, function(response) {
                      console.log(response);
                    });
                    UIkit.modal("#modal-please-wait").hide();
                    UIkit.modal.alert(result.error);
                  } else {
                    UIkit.modal("#modal-please-wait").hide();
                    UIkit.modal.alert("NFT collection has been successfully created.");
                    chrome.runtime.sendMessage({ cmd: "accept_create_nft_collection" }, function(response) {
                      console.log(response);
                    });
                  }
                })
                  .catch((e) => {
                    UIkit.modal("#modal-please-wait").hide();
                    UIkit.modal.alert(e.message);
                    console.log(e);
                    chrome.runtime.sendMessage({ cmd: "reject_create_nft_collection" }, function(response) {
                      console.log(response);
                    });
                  });
              }
              , function() {
                UIkit.modal("#modal-please-wait").hide();
                console.log("Rejected.");
                chrome.runtime.sendMessage({ cmd: "reject_create_nft_collection" }, function(response) {
                  console.log(response);
                });
              });
          }
        })
          .catch((e) => {
            console.log("Creat nft failed");
            console.log(e);
            UIkit.modal("#modal-please-wait").hide();
            UIkit.modal.alert(e.message);
            chrome.runtime.sendMessage({ cmd: "reject_create_nft_collection" }, function(response) {
              console.log(response);
            });
          });
      },
      rejectCreateNFTCollection() {
        try {
          chrome.runtime.sendMessage({ cmd: "reject_create_nft_collection" }, function(response) {
            console.log(response);
            //window.close();
          });
        } catch (e) {
        }
      },
      acceptCreateNFT() {
        console.log("Accepting create nft request...");
        console.log("NFT Token ID ->" + this.mint_nft_token_id);
        console.log(this.action);
        let vm = this;
        vm.process_message = "Minting NFT...";
        setTimeout(function(){UIkit.modal("#modal-please-wait").show();}, 1000);
        wallet.MintNft(this.mint_nft_token_id, this.action.nft_id, this.privateAddress, this.action.scheme, this.spendingPassword).then(function(tx) {
          if (tx.tx) {
            let msg = "<h3>Mint NFT</h3><p>Transaction fee : " + sb.toBitcoin(tx.fee) + " xNAV</p><p>Do you confirm transaction?</p>";
            UIkit.modal.confirm(msg).then(function() {
                UIkit.modal("#modal-please-wait").show();
                wallet.SendTransaction(tx.tx).then(function(result) {
                  console.log(result);
                  if (result.error) {
                    UIkit.modal.alert(result.error);
                    chrome.runtime.sendMessage({ cmd: "reject_create_nft" }, function(response) {
                      console.log(response);
                    });
                    UIkit.modal("#modal-please-wait").hide();
                  } else {
                    UIkit.modal("#modal-please-wait").hide();
                    UIkit.modal.alert("NFT successfully minted.");
                    chrome.runtime.sendMessage({ cmd: "accept_create_nft" }, function(response) {
                      console.log(response);
                    });
                  }
                })
                  .catch((e) => {
                    UIkit.modal("#modal-please-wait").hide();
                    console.log(e);
                    chrome.runtime.sendMessage({ cmd: "reject_create_nft" }, function(response) {
                      console.log(response);
                    });
                    UIkit.modal.alert(e.message);
                  });
              }
              , function() {
                UIkit.modal("#modal-please-wait").hide();
                console.log("Rejected.");
                chrome.runtime.sendMessage({ cmd: "reject_create_nft" }, function(response) {
                  console.log(response);
                });
              });
          }
        })
          .catch((e) => {
            UIkit.modal.alert(e.message);
            console.log("Creat nft failed");
            console.log(e);
            chrome.runtime.sendMessage({ cmd: "reject_create_nft" }, function(response) {
              console.log(response);
            });
          });
      },
      rejectCreateNFT() {
        try {
          chrome.runtime.sendMessage({ cmd: "reject_create_nft" }, function(response) {
            console.log(response);
            //window.close();
          });
        } catch (e) {
        }
      },
      rejectCreateNFTSellOrder() {
        try {
          chrome.runtime.sendMessage({ cmd: "reject_create_nft_sell_order" }, function(response) {
            console.log(response);
            //window.close();
          });
        } catch (e) {
        }
      },
      acceptCreateNFTSellOrder() {
        let vm = this;
        console.log("Submitting nft sell order...");
        console.log(this.action.token_id);
        console.log(this.action.nft_id);
        console.log(this.action.price);
        console.log(this.action.api_url);
        console.log(this.privateAddress);
        vm.process_message = "Submitting NFT Sell Order...";
        UIkit.modal("#modal-please-wait").show();
        let amount = parseFloat((vm.action.price * 1e8).toFixed(0));
        try {
          vm.process_message = "Creating NFT proof...";
          console.log("Creating NFT proof...");
          wallet.CreateNftProof(vm.action.token_id, vm.action.nft_id, vm.spendingPassword).then((p) => {
            let hex = Buffer.from(p.sig).toString("hex");
            let proof = { nftId: vm.action.nft_id, tokenId: vm.action.token_id, sig: Buffer.from(hex, "hex") };
            console.log(proof);
            wallet.CreateSellNftOrder(vm.action.token_id, vm.action.nft_id, this.privateAddress, amount, vm.spendingPassword).then(function(order) {
              vm.process_message = "Creating NFT sell order";
              console.log(order);
              wallet.VerifyOrder(order).then((result) => {
                console.log("Verify order result -> " + result);
              });
              //console.log(JSON.stringify(order));
              //console.log(JSON.parse(JSON.stringify(order)));
              console.log("Verifying proof...");
              console.log("Token : "+vm.action.token_id);
              console.log("NFT ID : "+vm.action.nft_id);
              wallet.VerifyNftProof(vm.action.token_id, vm.action.nft_id, proof)
              .then((v) =>
              {
                console.log("NFT Proof successfully verified.");
                console.log(v);
              })
              .catch(function(e)
              {
                console.log(e);
                UIkit.modal.alert("<p>NFT Proof verification failed.</p><p>" + e.message + "</p>");
              });
              if (vm.action.return_order) {
                vm.process_message = "Returning NFT sell order to origin...";
                chrome.runtime.sendMessage({ cmd: "accept_get_nft_sell_order", order: order }, function(response) {
                });
                UIkit.modal.alert("<p>NFT sell order data sent to origin.</p>");
              }
              if (!vm.action.return_order && (vm.action.submit_order && vm.action.api_url)) {
                vm.process_message = "Submitting NFT sell order...";
                axios.post(vm.action.api_url + "CreateSellNftOrder", {
                  order: order,
                  proof: proof
                }, {}).then(function(retval) {
                  console.log(retval.data);
                  if (retval.data.status == "order_created") {
                    chrome.runtime.sendMessage({
                      cmd: "accept_create_nft_sell_order",
                      result: true
                    }, function(response) {
                    });
                    UIkit.modal.alert("<p>NFT sell order successfully created.</p>");
                  } else {
                    chrome.runtime.sendMessage({
                      cmd: "accept_create_nft_sell_order",
                      result: false
                    }, function(response) {
                    });
                    UIkit.modal.alert("<p>NFT sell order cannot created.</p><p>" + retval.data.message + "</p>");
                  }
                }).catch(function(e) {
                  console.log(e);
                  chrome.runtime.sendMessage({
                    cmd: "accept_create_nft_sell_order",
                    result: false
                  }, function(response) {
                  });
                  UIkit.modal.alert("<p>NFT sell order cannot created.</p><p>" + e.message + "</p>");
                });
              }
            })
              .catch((e) => {
                console.log("CreateSellNftOrder failed (#1) -> " + e.message);
                chrome.runtime.sendMessage({ cmd: "accept_create_nft_sell_order", result: false }, function(response) {
                });
                UIkit.modal.alert("<p>NFT sell order cannot created.</p><p>" + e.message + "</p>");
              });
          }).catch((e) => {
            console.log(e);
            console.log("CreateSellNftOrder failed (#2) -> " + e.message);
            chrome.runtime.sendMessage({ cmd: "accept_create_nft_sell_order", result: false }, function(response) {
            });
            UIkit.modal.alert("<p>NFT sell order cannot created.</p><p>" + e.message + "</p>");
          });
        } catch (e) {
          console.log("CreateSellNftOrder failed (#3) -> " + e.message);
          chrome.runtime.sendMessage({ cmd: "accept_create_nft_sell_order", result: false }, function(response) {
          });
          UIkit.modal.alert("<p>NFT sell order cannot created.</p><p>" + e.message + "</p>");
        }
      },
      processAction() {
        let vm = this;
        if (vm.action.network!=vm.network)
        {
          chrome.runtime.sendMessage({ cmd: "reject_wrong_network", network:vm.network }, function(response)
          {
          });
          UIkit.notification("<i class='fas fa-close'></i>&nbsp;Wallet is on different network ("+vm.network+"). Your dAPP currently is on "+vm.action.network+". Close wallet and re-open...", { status: "warning" });
          return;
        }
        if (vm.is_action_processed) return;
        vm.process_message="";
        console.log("Processing action...");
        console.log(vm.action);
        vm.is_action_processed = true;
        if (vm.action.method == "connect") {
          chrome.storage.local.get({ trustedSites: [] }, function(result) {
            if (!result.trustedSites.includes(vm.sender.origin)) {
              UIkit.modal("#modal-connect-confirm").show();
            } else {
              vm.acceptConnection();
              UIkit.notification("<i class='fas fa-check'></i>&nbsp;Access granted", { status: "success" });
            }
          });
        }
        if (vm.action.method == "create_nft_collection") {
          console.log("creating nft collection...");
          console.log(vm.action.name);
          console.log(vm.action.scheme);
          console.log(vm.action.max_supply);
          UIkit.modal("#modal-create-nft-collection-confirm").show();
        } else if (vm.action.method == "create_nft") {
          console.log("creating nft...");
          console.log(vm.action.name);
          console.log(vm.action.nft_id);
          console.log(vm.action.scheme);
          if (vm.action.token_id) this.mint_nft_token_id = vm.action.token_id;
          UIkit.modal("#modal-create-nft-confirm").show();
        } else if (vm.action.method == "list_nft_collections") {
          console.log("listing nft collections...");
          chrome.runtime.sendMessage({ cmd: "list_nft_collections", collections: vm.balance.nfts }, function(response)
          {
          });
        } else if (vm.action.method == "create_nft_sell_order") {
          if (vm.isPrivateTokensSynced) {
            console.log("creating nft sell order...");
            console.log(vm.action.token_id);
            console.log(vm.action.nft_id);
            console.log(vm.action.price);
            wallet.GetNftInfo(vm.action.token_id, vm.action.nft_id).then((nft) => {
              vm.sell_nft_metadata = JSON.parse(nft[0].metadata);
              UIkit.modal("#modal-create-nft-sell-order-confirm").show();
            });
          } else {
            //UIkit.modal.alert("<p>Private tokens not loaded, please try again later</p>");
          }
        } else if (vm.action.method == "accept_order") {
          console.log("accept order confirm");
          console.log(vm.action.order);
          UIkit.modal("#modal-accept-nft-order-confirm").show();
        } else if (vm.action.method == "cancel_nft_sell_order") {
          console.log("cancel sell order");
          console.log(vm.action.token_id);
          console.log(vm.action.nft_id);
          UIkit.modal("#modal-cancel-nft-sell-order-confirm").show();
        } else if (vm.action.method == "create_transaction") {
          console.log("create transaction");
          console.log(vm.action.address);
          console.log(vm.action.amount);
          UIkit.modal("#modal-create-transaction-confirm").show();
        } else if (vm.action.method == "sign_message") {
          console.log("sign message");
          console.log(vm.action.message);
          UIkit.modal("#modal-sign-message-confirm").show();
        } else if (vm.action.method == "create_private_token") {
          console.log("creating private token...");
          console.log(vm.action.name);
          console.log(vm.action.scheme);
          console.log(vm.action.max_supply);
          UIkit.modal("#modal-create-private-token-confirm").show();
        } else if (vm.action.method == "mint_private_token") {
          console.log("minting private token...");
          console.log(vm.action.token_id);
          console.log(vm.action.amount);
          UIkit.modal("#modal-mint-private-token-confirm").show();
        }
      },
      subcribeWalletEvents()
      {
          let vm=this;
          wallet.on("new_mnemonic", (mnemonic) => {
            if (!vm.db_load_failed) {
              vm.mnemonics = mnemonic;
              vm.wordArrayOriginal = vm.mnemonics.toString().split(" ");
              vm.wordArray = vm.shuffle(vm.mnemonics.toString().split(" "));
              console.log(`wallet created with mnemonic ${mnemonic} - please back it up!`);
            }
          });
          wallet.on("loaded", async () => {
            vm.status = "Wallet loaded";
            vm.busy = false;
            console.log("wallet loaded");
            wallet.NavReceivingAddresses(true).then((value) => {
              vm.publicAddress = value[0].address;
              console.log("NAV receiving address : " + value[0].address);
            });
            wallet.xNavReceivingAddresses(false).then((value) => {
              let xNAVAddress = value.filter((e) => e.path == "0/0")[0].address;
              vm.privateAddress = xNAVAddress;
              console.log("xNAV receiving address : " + xNAVAddress);
              try {
                chrome.storage.local.set({ privateAddress: vm.privateAddress }, function() {
                  console.log("Private address saved to storage");
                });
              } catch (e) {
              }
              if (vm.action && vm.action.method != "list_nft_collections") {
                vm.processAction();
              }
            });
            wallet.ClearNodeList();
            wallet.AddNode('electrum.nextwallet.org', 40004, 'wss');
            await wallet.Connect();
          });
          wallet.on("connected", async (node) => {
            console.log("connected to -> " + node);
            vm.current_node = node;
            vm.status = "Connected, waiting for sync...";
          });
          wallet.on("sync_status", async (progress, pending) => {
            vm.progress = progress;
            vm.status = "Sync progress : % " + progress;
          });
          wallet.on("db_load_error", async (e) => {
            vm.status = "Database load error";
            vm.db_load_failed = true;
            console.log("Error Load DB -> " + e);
            UIkit.modal.alert("<p>Wallet cannot loaded.</p><p>" + e + "</p>");
          });
          wallet.on("sync_started", async () => {
            console.log("sync_started");
            vm.status = "Sync started...";
          });
          wallet.on("sync_finished", async () => {
            vm.status = "Sync finished...";
            vm.progress = 100;
            wallet.GetBalance().then((value) => {
              vm.balance = value;
              wallet.GetMyTokens(vm.spendingPassword).then((value) => {
                vm.isPrivateTokensSynced = true;
                vm.privateTokens = value;
                console.log("Getting private tokens...");
                console.log(value);
                if (vm.action) {
                  vm.processAction();
                }
              })
                .catch(function(e) {
                  console.log("Error while getting tokens -> " + e.message);
                });
            });
            wallet.GetHistory().then((value) => {
              vm.history = value;
              console.log(vm.history);
            });
            console.log("sync_finished");
            console.log(`Balance ${JSON.stringify(await wallet.GetBalance())}`);
          });
          wallet.on("bootstrap_started", () => {
            vm.status = "Bootstrap started...";
            console.log("bootstrap_started");
          });
          wallet.on("bootstrap_progress", (count) => {
            console.log("bootstrap_progress -> " + count);
            vm.status = "Bootstrap progress :  " + count;
          });
          wallet.on("bootstrap_finished", () => {
            vm.status = "Bootstrap finished...";
            console.log("bootstrap_finished");
          });
          wallet.on("new_block", async (height) => {
            vm.height = height;
          });
          wallet.on("new_tx", async (list) => {
            //console.log(`Received transaction ${JSON.stringify(list)}`);
            //console.log(`Balance ${JSON.stringify(await wallet.GetBalance())}`);
          });
          wallet.Load({ bootstrap: njs.wallet.xNavBootstrap })
            .then(() => {
              console.log("wallet loaded");
              if (vm.isNewWallet) {
                vm.page = "verify-mnemonics";
              } else {
                vm.walletUnlocked = true;
                vm.page = "home";
              }
            })
            .catch(function(e) {
              vm.walletLoginSuccess = false;
              vm.page = "select-wallet";
            });
      },
      setLatestUsedWallet(walletName,password)
      {
        console.log("Saving last used wallet details...");
        chrome.storage.session.set({ last_active_wallet: walletName, password: password }, function()
        {
          chrome.storage.session.get(["last_active_wallet","password"], function(result)
          {
            console.log(result);
          });
        });
      },
      initWallet()
      {
        let vm = this;
        const walletFile = vm.active_wallet_name; // File name of the wallet database, persistence using dexie db backend only works on the browser
        const zapwallettxes = false; // Should the wallet be cleared of its history?
        const log = false; // Log to console
        ENCRYPTION_KEY=crypto.createHash('md5').update(vm.password).digest("hex");
        njs.wallet.Init().then(async () => {
          if (vm.active_wallet_already_exist)
          {
            try
            {
                let arr = vm.active_wallet_name.split("_");
                vm.network=arr[2];
                console.log("Getting wallet details from chrome storage...");
                chrome.storage.local.get({ wallets: [] }, function(result) {
                result.wallets.forEach(w => 
                {
                  if (w.name==vm.active_wallet_name)
                  {
                    console.log("Existing wallet found from chrome storage...");
                    let open_password=vm.decrypt(w.open_password);
                    let spending_password=vm.decrypt(w.spending_password);
                    vm.spendingPassword=spending_password;
                    if (open_password!=false&&spending_password!=false)
                    {
                      vm.setLatestUsedWallet(vm.active_wallet_name,vm.password);
                      console.log("Password verified...");
                      console.log(open_password);
                      console.log(spending_password);
                      console.log("Loading existing wallet : " + vm.active_wallet_name);
                      vm.walletLoginSuccess = true;
                      vm.page = "wallet-loading";
                      wallet = new njs.wallet.WalletFile(
                        {
                          file: vm.active_wallet_name,
                          zapwallettxes: zapwallettxes,
                          password: open_password,
                          spendingPassword: spending_password,
                          log: true
                        });
                      vm.setLatestUsedWallet(vm.active_wallet_name,vm.password);
                      vm.subcribeWalletEvents();
                      window.wallet = wallet;
                      window.njs = njs;
                    }
                    else
                    {
                      console.log("Invalid password...");
                      UIkit.modal.alert("<p>Invalid password.</p><p>Please try again...</p>");
                    }
                  }
                });
              });
            }
            catch (e)
            {
            }
          }
          else
          {
            console.log("Creating and loading new wallet : " + vm.active_wallet_name + "(" + vm.walletType + ")" + "(" + vm.network + ")");
            console.log("Password : " + vm.password);
            let randomOpenPassword=this.generateRandomPassword(64);
            let randomSpendingPassword=this.generateRandomPassword(64);
            vm.spendingPassword=randomSpendingPassword;
            console.log("Open password:"+randomOpenPassword);
            console.log("Spending password:"+randomSpendingPassword);
            try
            {
                console.log("Getting wallet details from chrome storage...");
                chrome.storage.local.get({ wallets: [] }, function(result)
                {
                  var wallets = result.wallets;
                  console.log(wallets);
                  let is_wallet_found=false;
                  wallets.forEach(w => 
                  {
                    if (w.name==vm.active_wallet_name)
                    {
                      console.log("Wallet already added to chrome storage, updating encrypted passwords...");
                      is_wallet_found=true;
                      w.name=vm.active_wallet_name;
                      w.open_password=vm.encrypt(randomOpenPassword);
                      w.spending_password=vm.encrypt(randomSpendingPassword);
                    }
                  });
                  if (!is_wallet_found)
                  {
                    console.log("Adding wallet encrypted passwords to chrome storage...");
                    wallets.push({
                      name:vm.active_wallet_name,
                      open_password: vm.encrypt(randomOpenPassword),
                      spending_password: vm.encrypt(randomSpendingPassword)
                    });
                  }
                  chrome.storage.local.set({ wallets: wallets }, function()
                  {
                    chrome.storage.local.get("wallets", function(result) {
                      console.log(result.wallets);
                    });
                  });
                  vm.setLatestUsedWallet(vm.active_wallet_name,vm.password);
                  wallet = new njs.wallet.WalletFile(
                  {
                    file: vm.active_wallet_name,
                    network: vm.network,
                    mnemonic: (vm.mnemonics ? vm.mnemonics : undefined),
                    type: vm.walletType,
                    password: randomOpenPassword,
                    spendingPassword: randomSpendingPassword,
                    zapwallettxes: zapwallettxes,
                    log: true
                  });
                  vm.subcribeWalletEvents();
                  window.wallet = wallet;
                  window.njs = njs;
                });
            }
            catch (e)
            {
            }
          }
        });
      }
    }
};
</script>
<style>

body {
  min-width: 400px;
  min-height: 600px;
  font-size: 10pt !important;
}

.container {
  padding: 5px;
}

.address {
  width: 320px;
  font-family:"Courier New";
  font-size:9pt;
}

.card-public {
  margin-left: 15px;
  border-radius: 5px;
  background: #4568DC; /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #B06AB3, #4568DC); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, #B06AB3, #4568DC); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}

.card-private {
  margin-left: 15px;
  border-radius: 5px;
  background: #000000; /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #434343, #000000); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, #434343, #000000); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}

.card-private-tokens {
  margin-left: 15px;
  border-radius: 5px;
  background: #000000; /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #35226c, #11081f); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, #35226c, #11081f); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}

.card-private-nfts {
  margin-left: 15px;
  border-radius: 5px;
  background: #000000; /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #4b226c, #11081f); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, #4b226c, #11081f); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}

::-webkit-scrollbar {
  background-color: #fff;
  width: 16px;
}

/* background of the scrollbar except button or resizer */
::-webkit-scrollbar-track {
  background-color: #fff;
}

/* scrollbar itself */
::-webkit-scrollbar-thumb {
  background-color: #babac0;
  border-radius: 16px;
  border: 4px solid #fff;
}

/* set button(top and bottom of the scrollbar) */
::-webkit-scrollbar-button {
  display: none;
}

.uk-subnav-pill > .uk-active > a {
  background-color: #1e87f0;
  color: #fff;
  border-radius: 3px;
}

.uk-switch {
  position: relative;
  display: inline-block;
  height: 34px;
  width: 60px;
}

/* Hide default HTML checkbox */
.uk-switch input {
  display:none;
}
/* Slider */
.uk-switch-slider {
  background-color: rgba(0,0,0,0.22);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  border-radius: 500px;
  bottom: 0;
  cursor: pointer;
  transition-property: background-color;
  transition-duration: .2s;
  box-shadow: inset 0 0 2px rgba(0,0,0,0.07);
}
/* Switch pointer */
.uk-switch-slider:before {
  content: '';
  background-color: #fff;
  position: absolute;
  width: 30px;
  height: 30px;
  left: 2px;
  bottom: 2px;
  border-radius: 50%;
  transition-property: transform, box-shadow;
  transition-duration: .2s;
}
/* Slider active color */
input:checked + .uk-switch-slider {
  background-color: #39f !important;
}
/* Pointer active animation */
input:checked + .uk-switch-slider:before {
  transform: translateX(26px);
}

/* Modifiers */
.uk-switch-slider.uk-switch-on-off {
  background-color: #f0506e;
}
input:checked + .uk-switch-slider.uk-switch-on-off {
  background-color: #32d296 !important;
}

/* Style Modifier */
.uk-switch-slider.uk-switch-big:before {
  transform: scale(1.2);
  box-shadow: 0 0 6px rgba(0,0,0,0.22);
}
.uk-switch-slider.uk-switch-small:before {
  box-shadow: 0 0 6px rgba(0,0,0,0.22);
}
input:checked + .uk-switch-slider.uk-switch-big:before {
  transform: translateX(26px) scale(1.2);
}

/* Inverse Modifier - affects only default */
.uk-light .uk-switch-slider:not(.uk-switch-on-off) {
  background-color: rgba(255,255,255,0.22);
}
.uk-subnav-pill-o > .uk-active > a {
    background-color: #640ac4 !important;
    color: #fff;
    border-radius: 3px;
}
</style>