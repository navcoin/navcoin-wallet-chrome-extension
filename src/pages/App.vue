<template>
	<div class="container">
		<div class="uk-container" v-if="walletUnlocked" style="margin-top:5px;">
			<div class="uk-inline">
				<button style="margin-left:5px;" class="uk-button uk-button-small uk-button-default" type="button" v-if="page!='home'" v-on:click="changePage('home')"><i class="fa-solid fa-home"></i>&nbsp;</button>
				<button style="margin-left:5px;" class="uk-button uk-button-small uk-button-default" type="button"><i class="fa-solid fa-ellipsis-vertical"></i>&nbsp;</button>
				<div uk-dropdown='mode:click' id="menu">
					<div class="uk-dropdown-grid uk-child-width-1-2@m" uk-grid>
						<div>
							<ul class="uk-nav uk-dropdown-nav">
								<li class="uk-nav-header">dApps</li>
								<li><a href='#' v-on:click="changePage('trusted_sites')">Trusted Sites</a></li>
							</ul>
						</div>
						<div>
							<ul class="uk-nav uk-dropdown-nav">
								<li class="uk-nav-header">Message</li>
								<li><a href="#" v-on:click="changePage('sign-message')">Sign message</a></li>
								<li><a href="#" v-on:click="changePage('verify-message')">Verify message</a></li>
								<li class="uk-nav-header">Wallet</li>
								<li><a href="#" v-on:click="changePage('backup-wallet')">Backup Wallet</a></li>
								<li><a href='#' v-on:click="changePage('remove-wallet')">Remove Wallet</a></li>
								<li class="uk-nav-divider"></li>
								<li><a href='#' v-on:click="changePage('about')">About</a></li>
							</ul>
						</div>
					</div>
				</div>
			</div>
			<div class="uk-align-right">
				<div v-show="progress!=100">
					<span uk-spinner style="width:14px;height:14px;"></span>&nbsp;<small>{{status}}</small>
				</div>
				<span v-if="current_node"><small><i class="fa-solid fa-bolt"></i>&nbsp;{{current_node}}</small></span>
				<span v-if="height"><small><i class="fa-solid fa-hammer"></i>&nbsp;{{height}}</small></span>
			</div>
		</div>
		<div class="uk-container" v-if="page=='verify-mnemonics'" style="margin-top:15px;">
			<h4>Backup Your Wallet</h4>
			<p>Below are the seed phrases created for your wallet. If you do not back up these seed phrases, you cannot import them back into your wallet in future. Please backup your seed phrases in a safe place.</p>
			<div class="uk-grid-column-small uk-grid-row-small uk-grid-small" uk-grid>
				<div class="uk-width-1-3" v-for="(word,index) in wordArrayOriginal">
					<button class="uk-button uk-button-small uk-button-default uk-text-lowercase uk-text-small uk-width-1-1" modifier="outline">
						<b>{{index+1}}</b><br/>{{word}}
					</button>
				</div>
			</div>
			<div class="uk-margin">
				<button class="uk-button uk-button-default" v-on:click="changePage('verify-seed-phrases')"><i class="fa-solid fa-arrow-right"></i>&nbsp;Verify seed phrases</button>
			</div>
		</div>
		<div class="uk-container" v-if="page=='verify-seed-phrases'" style="margin-top:15px;">
			<h4>Verify Seed Phrases</h4>
			<p>Please select the seed phrases you have backed up in order.</p>
			<div class="uk-grid-column-small uk-grid-row-small uk-grid-small uk-child-width-1-3@s" uk-grid>
				<div class="uk-width-1-3" v-for="(word,i) in wordArray">
					<button class="uk-button uk-button-small uk-button-default uk-text-lowercase uk-text-small uk-width-1-1" modifier="outline" v-on:click="addWordtoArray(word)">
						{{word}}
					</button>
				</div>
			</div>
			<div class="uk-card uk-card-body">
				<span v-for="(word,i) in wordArrayConfirm">
					{{word}}
				</span>
			</div>
			<button class="uk-button uk-button-primary" v-on:click="confirmVerifySeedPhrases()"><i class="fa-solid fa-check"></i>&nbsp;Verify</button>
			<button class="uk-button uk-button-default uk-align-right" v-on:click="skipVerifySeedPhrases()"><i class="fa-solid fa-arrow-right-long"></i>&nbsp;Skip</button>
		</div>
		<div class="uk-container" v-if="page=='backup-wallet'" style="margin-top:15px;">
			<h4>Backup Wallet</h4>
			<p v-if="mnemonics">{{mnemonics}}</p>
			<button v-if="mnemonics" class="uk-button uk-button-default" v-on:click="doCopy(mnemonics)"><i class="fa-solid fa-copy"></i>&nbsp;Copy</button>
		</div>
		<div class="uk-container" v-if="page=='remove-wallet'" style="margin-top:15px;">
			<div class="uk-alert-danger uk-margin" uk-alert>
				<a class="uk-alert-close" uk-close></a>
				<p>You will need your seed phrases to restore the wallet after deleting it. Please be sure to take note of your seed phrases.</p>
			</div>
			<div class="uk-margin">
				<input class="uk-input" placeholder="Password" type="password" v-model="v_password"></input>
			</div>
			<div class="uk-margin">
				<button :disabled="!password" class="uk-button uk-button-primary uk-width-1-1" v-on:click="removeWallet()"><i class="fa-solid fa-trash"></i>&nbsp;Remove Wallet</button>
			</div>
		</div>
		<div class="uk-container" v-if="page=='sign-message'" style="margin-top:15px;">
			<div class="uk-margin">
				<input class="uk-input" placeholder="Message" type="text" v-model="message"></input>
			</div>
			<div class="uk-margin">
				<button :disabled="!message" class="uk-button uk-button-primary uk-width-1-1" v-on:click="signMessage()"><i class="fa-solid fa-signature"></i>&nbsp;Sign Message</button>
			</div>
			<div class="uk-margin" v-show="signedMessage">
				<h5>Signed Message : </h5>
				<pre>{{signedMessage}}</pre>
				<button class="uk-button uk-button-default" v-on:click="doCopy(signedMessage)"><i class="fa-solid fa-copy"></i>&nbsp;Copy</button>
			</div>
		</div>
		<div class="uk-container" v-if="page=='verify-message'" style="margin-top:15px;">
			<div class="uk-margin">
				<input class="uk-input" placeholder="Message" type="text" v-model="vMessage"></input>
			</div>
			<div class="uk-margin">
				<input class="uk-input" placeholder="Address" type="text" v-model="vAddress"></input>
			</div>
			<div class="uk-margin">
				<input class="uk-input" placeholder="Signature" type="text" v-model="vSignature"></input>
			</div>
			<div class="uk-margin">
				<button :disabled="!vMessage||!vAddress||!vSignature" class="uk-button uk-button-primary uk-width-1-1" v-on:click="verifyMessage()"><i class="fa-solid fa-check-double"></i>&nbsp;Verify Message</button>
			</div>
		</div>
		<div class="uk-container" v-if="page=='about'" style="margin-top:15px;">
			<center>
				<img style="width:50%;height:auto" src="images/nav-logo-border.png">
				<div class="uk-margin">
					<p>Navcoin Wallet for Chrome</p>
					<p>Build 1.0.10</p>
					<p>Developed by Navcoin Developers</p>
					<a href="https://www.navcoin.org">https://www.navcoin.org</a>
				</div>
				<div class="uk-margin">
					<p>navcoin-js v{{njs.version}}</p>
					<p>bitcore-lib {{njs.wallet.bitcore.version}}</p>
				</div>
			</center>
		</div>
		<div class="uk-container" v-if="page=='welcome'" style="margin-top:15px;">
			<center>
				<img style="width:50%;height:auto" src="images/nav-logo-border.png">
				<h1>Welcome</h1>
				<p>Welcome to the Navcoin wallet!</p>
				<p>With Navcoin wallet you can send NAV, xNAV, view your NFTs and interact with websites.</p>
				<div class="uk-margin">
					<button class="uk-button uk-button-primary" v-on:click="changePage('license-agreement')"><i class="fa-solid fa-right-long"></i>&nbsp;Get Started</button>
				</div>
			</center>
		</div>
		<div class="uk-container" v-if="page=='license-agreement'" style="margin-top:15px;">
			<h1>License Agreement</h1>
			<p>
				This is a binding Agreement between Navcoin Developers (“Navcoin” or “We”) and the person, persons, or entity (“You” or “Your”) using the service, Software, or application (“Software”).
			  </p>
			  <p class="terms__heading">
				RIGHTS AND OBLIGATIONS
			  </p>
			  <p>
				Navcoin provides the Software solely on the terms and conditions set forth in this Agreement and on the condition that You accept and comply with them. By using the Software You (a) accept this Agreement and agree that You are legally bound by its terms; and (b) represent and warrant that: (i) You are of legal age to enter into a binding agreement; and (ii) if You are a corporation, governmental organization or other legal entity, You have the right, power and authority to enter into this Agreement on behalf of the corporation, governmental organization or other legal entity and bind them to these terms.
			  </p>
			  <p>
				This Software functions as a free, open source, and multi-signature digital wallet. The Software does not constitute an account where We or other third parties serve as financial intermediaries or custodians of Your Navcoin(s).
			  </p>
			  <p>
				While the Software has undergone beta testing and continues to be improved by feedback from the open-source user and developer community, We cannot guarantee there will not be bugs in the Software. You acknowledge that Your use of this Software is at Your own discretion and in compliance with all applicable laws. You are responsible for safekeeping Your passwords, private key pairs, PINs, and any other codes You use to access the Software.
			  </p>
			  <p>
				IF YOU LOSE ACCESS TO YOUR NAV COIN WALLET OR YOUR ENCRYPTED PRIVATE KEYS AND YOU HAVE NOT SEPARATELY STORED A BACKUP OF YOUR WALLET AND CORRESPONDING PASSWORD, YOU ACKNOWLEDGE AND AGREE THAT ANY NAV COIN YOU HAVE ASSOCIATED WITH THAT WALLET WILL BECOME INACCESSIBLE. All transaction requests are irreversible. The authors of the Software, employees and affiliates of NAV COIN, copyright holders, and NAV COIN cannot retrieve Your private keys or passwords if You lose or forget them and cannot guarantee transaction confirmation as they do not have control over the Navcoin network.
			  </p>
			  <p class="terms__heading">
				DISCLAIMER
			  </p>
			  <p>
				THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OF THE SOFTWARE, EMPLOYEES AND AFFILIATES OF NAV COIN, COPYRIGHT HOLDERS, OR NAV COIN BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
			  </p>
			  <p>
				IN NO EVENT WILL NAV COIN OR ITS AFFILIATES, OR ANY OF ITS OR THEIR RESPECTIVE SERVICE PROVIDERS, BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY USE, INTERRUPTION, DELAY OR INABILITY TO USE THE SOFTWARE, LOST REVENUES OR PROFITS, DELAYS, INTERRUPTION OR LOSS OF SERVICES, BUSINESS OR GOODWILL, LOSS OR CORRUPTION OF DATA, LOSS RESULTING FROM SYSTEM OR SYSTEM SERVICE FAILURE, MALFUNCTION OR SHUTDOWN, FAILURE TO ACCURATELY TRANSFER, READ OR TRANSMIT INFORMATION, FAILURE TO UPDATE OR PROVIDE CORRECT INFORMATION, SYSTEM INCOMPATIBILITY OR PROVISION OF INCORRECT COMPATIBILITY INFORMATION OR BREACHES IN SYSTEM SECURITY, OR FOR ANY CONSEQUENTIAL, INCIDENTAL, INDIRECT, EXEMPLARY, SPECIAL OR PUNITIVE DAMAGES, WHETHER ARISING OUT OF OR IN CONNECTION WITH THIS AGREEMENT, BREACH OF CONTRACT, TORT (INCLUDING NEGLIGENCE) OR OTHERWISE, REGARDLESS OF WHETHER SUCH DAMAGES WERE FORESEEABLE AND WHETHER OR NOT WE WERE ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
			  </p>
			  <p class="terms__heading">
				INTELLECTUAL PROPERTY
			  </p>
			  <p>
				We retain all right, title, and interest in and to the Content and all of Navcoin’s brands, logos, and trademarks, including, but not limited to, Navcoin, NEXT, NEXT Wallet, NEXT Mobile Wallet, and variations of the wording of the aforementioned brands, logos, and trademarks.
			  </p>
			  <p class="terms__heading">
				CHOICE OF LAW
			  </p>
			  <p>
				This Agreement, and its application and interpretation, shall be governed exclusively by the laws of the State of Georgia, without regard to its conflict of law rules. You consent to the exclusive jurisdiction of the federal and state courts located in or near Atlanta, Georgia for any dispute arising under this Agreement.
			  </p>
			  <p class="terms__heading">
				SEVERABILITY
			  </p>
			  <p>
				In the event any court shall declare any section or sections of this Agreement invalid or void, such declaration shall not invalidate the entire Agreement and all other paragraphs of the Agreement shall remain in full force and effect.
			  </p>
			  <p class="terms__heading">
				BINDING AGREEMENT
			  </p>
			  <p>
				The terms and provisions of this Agreement are binding upon Your heirs, successors, assigns, and other representatives. This Agreement may be executed in counterparts, each of which shall be considered to be an original, but both of which constitute the same Agreement.
			  </p>
			  <p>
				You assume any and all risks associated with the use of the Software. We reserve the right to modify this Agreement from time to time.
			  </p>
			<div class="uk-margin">
				<button class="uk-button uk-button-primary uk-width-1-1" v-on:click="changePage('select-network')"><i class="fa-solid fa-right-long"></i>&nbsp;I accept the license agreement</button>
			</div>
			<div class="uk-margin">
				<button class="uk-button uk-button-secondary uk-width-1-1" v-on:click="goBack()" style="margin-bottom:15px;"><i class="fa-solid fa-arrow-left"></i>&nbsp;Back</button>
			</div>
		</div>
		<div class="uk-container" v-if="page=='wallet-loading'" style="margin-top:15px;">
			<div uk-spinner></div>
		</div>
		<div class="uk-container" v-if="page=='select-network'" style="margin-top:15px;">
			<h5 class="uk-heading-divider">Please choose a network</h5>
			<button class="uk-button uk-button-default uk-width-1-1 uk-text-capitalize uk-padding-small uk-margin-small" v-for="(network,index) in networks" v-on:click="setNetwork(network)">{{network.name}}</button>
			<button class="uk-button uk-button-secondary uk-width-1-1" v-on:click="goBack()"><i class="fa-solid fa-arrow-left"></i>&nbsp;Back</button>
		</div>
		<div class="uk-container" v-if="page=='create-wallet'" style="margin-top:15px;">
			<ul class="uk-subnav uk-subnav-pill" style="width:100%" :active="(isImportActive?1:0)" uk-switcher="animation: uk-animation-slide-left-medium, uk-animation-slide-right-medium">
				<li><a href="#">Create New Wallet</a></li>
				<li><a href="#">Import Wallet</a></li>
			</ul>
			<ul class="uk-switcher uk-margin" :active="(isImportActive?1:0)" uk-switcher="animation: uk-animation-slide-left-medium, uk-animation-slide-right-medium">
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
								<button v-show="!busy" class="uk-button uk-button-primary uk-width-1-1" v-on:click="createWallet()"><i class="fa-solid fa-asterisk"></i>&nbsp;Create Wallet</button>
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
								<button v-show="!busy" class="uk-button uk-button-primary uk-width-1-1" v-on:click="importWallet()"><i class="fa-solid fa-file-import"></i>&nbsp;Import Wallet</button>
							</div>
						</fieldset>
					</form>
				</li>
			</ul>
			<button class="uk-button uk-button-secondary uk-width-1-1" v-on:click="goBack()"><i class="fa-solid fa-arrow-left"></i>&nbsp;Back</button>
		</div>
		<div class="uk-container" v-if="page=='select-wallet'">
			<div class="uk-margin" style="margin-top:15px;">
				<h5>Please choose a wallet</h5>
			</div>
			<div v-for="(wallet, $index) in wallets" :class="{ 'uk-background-secondary uk-light': wallet.name+'_'+wallet.type+'_'+wallet.network==active_wallet_name, 'uk-background-muted': wallet.name+'_'+wallet.type+'_'+wallet.network!=active_wallet_name }" class="uk-card uk-border-rounded" style="padding:5px;cursor: pointer;" @click="setActiveWallet(wallet)">
				<article class="uk-comment">
					<header class="uk-comment-header">
						<div class="uk-grid-medium uk-flex-middle" uk-grid>
							<div class="uk-width-auto" style="width:64px;">
								<center>
									<i v-if="wallet.name+'_'+wallet.type+'_'+wallet.network==active_wallet_name" class="fa-2x fa-solid fa-wallet uk-text-primary"></i>
									<i v-else class="fa-2x fa-solid fa-wallet"></i>
								</center>
							</div>
							<div class="uk-width-expand">
								<div><a class="uk-link-reset" href="#">{{wallet.name}}</a></div>
								<ul class="uk-comment-meta uk-subnav uk-subnav-divider uk-margin-remove-top">
									<li>{{wallet.network}}</li>
								</ul>
							</div>
						</div>
					</header>
				</article>
			</div>
			<fieldset class="uk-fieldset uk-margin-small">
				<div class="uk-margin">
					<input class="uk-input" placeholder="Password" type="password" v-model="password"></input>
				</div>
				<div class="uk-margin">
					<button class="uk-button uk-button-secondary uk-width-1-1" v-on:click="unlockWallet()"><i class="fa-solid fa-lock"></i>&nbsp;Unlock Wallet</button>
				</div>
				<div class="uk-margin">
					<button class="uk-button uk-button-primary uk-width-1-1" v-on:click="createNewWallet()"><i class="fa-solid fa-plus"></i>&nbsp;Create New Wallet</button>
				</div>
				<div class="uk-margin">
					<button class="uk-button uk-button-primary uk-width-1-1" v-on:click="importExistingWallet()"><i class="fa-solid fa-file-import"></i>&nbsp;Import Wallet</button>
				</div>
			</fieldset>
		</div>
		<div class="uk-container">
			<div v-if="page=='trusted_sites'" class="uk-card uk-card-default uk-card-body uk-width-1-2@m">
				<h3 class="uk-card-title">Trusted Sites</h3>
				<p>Below you can find a list of sites that you have previously granted access to your wallet and that have been marked as trusted.</p>
				<p>If there is a site that you do not want to access your wallet, you can delete it.</p>
				<ul class="uk-list uk-list-divider" v-if="trustedSites.length>0">
					<li v-for="(site,index) in trustedSites">
					<button class="uk-button uk-button-text" v-on:click="removeSite(index)"><i class="fas fa-trash"></i></button>&nbsp;{{site}}
					</li>
				</ul>
				<p v-else>No site was found that has been granted access to your wallet.</p>
			</div>
			<div id="modal-please-wait" uk-modal="esc-close:false;bg-close:false">
				<div class="uk-modal-dialog uk-modal-body">
					<h2 class="uk-modal-title">Processing</h2>
					<p>Please wait...</p>
					<p>{{process_message}}</p>
				</div>
			</div>
			<div id="modal-connect-confirm" uk-modal v-if="action">
				<div class="uk-modal-dialog uk-modal-body">
					<h2 class="uk-modal-title">Connection Request</h2>
					<p>The website "<b>{{sender.origin}}</b>" will have access to your private address and NFT collections.</p>
					<p>Please only give access to sites you trust.</p>
					<p class="uk-text-right">
						<button class="uk-button uk-button-default uk-modal-close" type="button" v-on:click="rejectConnection()">Cancel</button>
						<button class="uk-button uk-button-primary uk-modal-close" type="button" v-on:click="acceptConnection()">Accept</button>
					</p>
				</div>
			</div>
			<div id="modal-cancel-nft-sell-order-confirm" uk-modal v-if="action">
				<div class="uk-modal-dialog uk-modal-body">
					<h3>Cancel NFT Sell Order</h3>
					<p>The website "<b>{{sender.origin}}</b>" requests to cancel an NFT sell order.</p>
					<p class="uk-text-break">Collection ID : {{action.token_id}}</p>
					<p>NFT ID : {{action.nft_id}}</p>
					<p>Do you confirm to cancel NFT sell order?</p>
					<p class="uk-text-right">
						<button class="uk-button uk-button-default uk-modal-close" type="button" v-on:click="rejectCancelNFTSellOrder()">Reject</button>
						<button class="uk-button uk-button-primary uk-modal-close" type="button" v-on:click="acceptCancelNFTSellOrder()">Accept</button>
					</p>
				</div>
			</div>
			<div id="modal-create-nft-collection-confirm" uk-modal v-if="action">
				<div class="uk-modal-dialog uk-modal-body">
					<h3>Create NFT Collection</h3>
					<p>The website "<b>{{sender.origin}}</b>" requests to create an NFT collection on your wallet.</p>
					Collection name : {{action.name}}<br/>
					Maximum Supply : {{action.max_supply}}<br/>
					Scheme :<br/>
					<p class="uk-text-break">{{action.scheme}}</p>
					<p>Do you confirm to create NFT collection?</p>
					<p class="uk-text-right">
						<button class="uk-button uk-button-default uk-modal-close" type="button" v-on:click="rejectCreateNFTCollection()">Reject</button>
						<button class="uk-button uk-button-primary uk-modal-close" type="button" v-on:click="acceptCreateNFTCollection()">Accept</button>
					</p>
				</div>
			</div>
			<div id="modal-create-nft-confirm" uk-modal v-if="action">
				<div class="uk-modal-dialog uk-modal-body">
					<h3>Mint NFT</h3>
					<p>The website "<b>{{sender.origin}}</b>" requests to mint an NFT on your wallet.</p>
					NFT Name : {{action.name}}<br/>
					NFT ID : {{action.nft_id}}<br/>
					Scheme :<br/>
					<p class="uk-text-break">{{action.scheme}}</p>
					<div v-if="!isPrivateTokensSynced">
						<span uk-spinner style="width:14px;height:14px;"></span>&nbsp;<small>Loading NFT collections...</small>
					</div>
					<div v-if="isPrivateTokensSynced && privateTokens.length>0">
						<p>Please select a collection for import :</p>
						<select class="uk-select" style="width: 100%" v-model="mint_nft_token_id">
							<option v-bind:value="item.id" v-for="(item,index) in privateTokens.filter(item => item.version==1)">{{item.name}}</option>
						</select>
					</div>
					<div class="uk-alert-warning" uk-alert v-if="isPrivateTokensSynced && privateTokens.length==0">
						<a class="uk-alert-close" uk-close></a>
						<p><b>You don't have any NFT collection.</b></p>
					</div>
					<p v-if="isPrivateTokensSynced && privateTokens.length>0">Do you confirm to mint NFT?</p>
					<p class="uk-text-right">
						<button class="uk-button uk-button-default uk-modal-close" type="button" v-on:click="rejectCreateNFT()">Reject</button>
						<button :disabled="!mint_nft_token_id" class="uk-button uk-button-primary uk-modal-close" type="button" v-on:click="acceptCreateNFT()">Accept</button>
					</p>
				</div>
			</div>
			<div id="modal-accept-nft-order-confirm" uk-modal v-if="action">
				<div class="uk-modal-dialog uk-modal-body">
					<h3>Purchase NFT</h3>
					<div v-if="action.order">
						<p>The website "<b>{{sender.origin}}</b>" requests to purchase an NFT from marketplace.</p>
						<b>Collection ID</b> 
						<div style="word-break:break-word;">
							{{action.order.receive[0].tokenId}}
						</div>
						<b>NFT ID</b>
						<div>
							{{action.order.receive[0].tokenNftId}}
						</div>
						<b>Price</b>
						<div>
							{{formatBalance(action.order.pay[0].amount)}} xNAV
						</div>
					</div>
					<p>Do you confirm to purchase NFT?</p>
					<p class="uk-text-right">
						<button class="uk-button uk-button-default uk-modal-close" type="button" v-on:click="rejectNFTOrder()">Reject</button>
						<button class="uk-button uk-button-primary uk-modal-close" type="button" v-on:click="acceptNFTOrder()">Accept</button>
					</p>
				</div>
			</div>
			<div id="modal-create-nft-sell-order-confirm" uk-modal v-if="action">
				<div class="uk-modal-dialog uk-modal-body">
					<h3>Create NFT Sell Order</h3>
					<p>The website "<b>{{sender.origin}}</b>" requests to create an NFT sell order.</p>
					<b>Token ID</b><br/>
					<div style="word-break:break-word;">{{action.token_id}}</div>
					<b>NFT ID :</b> {{action.nft_id}}<br/>
					<b>NFT Name : </b>{{sell_nft_metadata.name}}<br/>
					<b>Price : </b>{{action.price}} xNAV<br/>
					<div v-if="sell_nft_metadata.attributes">
						<center>
							<img v-if="sell_nft_metadata.attributes.content_type.split('/')[0]=='image'" style="width:128px;height:auto;" :src="ipfs_to_url(sell_nft_metadata.image)">
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
						<button class="uk-button uk-button-default uk-modal-close" type="button" v-on:click="rejectCreateNFTSellOrder()">Reject</button>
						<button class="uk-button uk-button-primary uk-modal-close" type="button" v-on:click="acceptCreateNFTSellOrder()">Accept</button>
					</p>
				</div>
			</div>
			<ul v-if="page=='home'" class="uk-subnav uk-subnav-pill" style="width:100%" uk-switcher="animation: uk-animation-slide-left-medium, uk-animation-slide-right-medium">
				<li><a href="#">Wallet</a></li>
				<li><a href="#">Receive</a></li>
				<li><a href="#">Send</a></li>
				<li><a href="#">NFTs</a></li>
			</ul>
			<ul v-if="page=='home'" class="uk-switcher uk-margin" uk-switcher="animation: uk-animation-slide-left-medium, uk-animation-slide-right-medium">
				<li>
					<ul class="uk-list uk-grid-small">
						<li class="uk-padding-small uk-light card-public">
							<div uk-grid>
								<div>
									<img style="width:64px;height:auto;" src="images/nav-logo-border.png">
								</div>
								<div>
									<p>Public</p>
									<p v-if="balance">NAV {{formatBalance(balance.nav.confirmed)}}</p>
									<p v-if="balance && balance.nav.pending">Pending : NAV {{formatBalance(balance.nav.pending)}}</p>
									<div v-if="!balance" uk-spinner style="width:14px;height:14px;"></div>
								</div>
							</div>
						</li>
						<li class="uk-padding-small uk-light card-private">
							<div uk-grid>
								<div>
									<img style="width:64px;height:auto;" src="images/xnav-logo-border.png">
								</div>
								<div>
									<p>Private</p>
									<p v-if="balance">xNAV {{formatBalance(balance.xnav.confirmed)}}</p>
									<p v-if="balance && balance.xnav.pending">Pending : xNAV {{formatBalance(balance.xnav.pending)}}</p>
									<div v-if="!balance" uk-spinner style="width:14px;height:14px;"></div>
								</div>
							</div>
						</li>
					</ul>
				</li>
				<li>
					<ul class="uk-subnav uk-subnav-pill" uk-switcher="animation: uk-animation-slide-left-medium, uk-animation-slide-right-medium">
						<li><a href="#">Public</a></li>
						<li><a href="#">Private</a></li>
						<li><a href="#">History</a></li>
					</ul>
					<ul class="uk-switcher uk-margin" uk-switcher="animation: uk-animation-slide-left-medium, uk-animation-slide-right-medium">
						<li>
							<center>
								<p>{{publicAddress}}</p>
								<button class="uk-button uk-button-default" v-on:click="doCopy(publicAddress)"><i class="fa-solid fa-copy"></i>&nbsp;Copy</button>
								<div v-html="qrcode_nav"></div>
							</center>
						</li>
						<li>
							<center>
								<div class="address" style="word-break:break-word;">
									<p>{{privateAddress}}</p>
								</div>
								<button class="uk-button uk-button-default" v-on:click="doCopy(privateAddress)"><i class="fa-solid fa-copy"></i>&nbsp;Copy</button>
								<div v-html="qrcode_xnav"></div>
							</center>
						</li>
						<li>
							<div v-show="history.length>0">
								<center>
									<button class="uk-button uk-button-small uk-button-default" :disabled="currentPage==1" @click="prev"><i class="fa-solid fa-arrow-left"></i>&nbsp;</button>
									<span>{{currentPage}} / {{maxPage}}</span>
									<button class="uk-button uk-button-small uk-button-default" :disabled="currentPage==maxPage || maxPage==0" @click="next"><i class="fa-solid fa-arrow-right"></i>&nbsp;</button>
								</center>
							</div>
							<div class="uk-card uk-card-small  uk-card-default uk-width-1-2@m" v-for="(tx,i) in paginatedTxs" style="margin-top:15px;margin-bottom:15px;">
								<div class="uk-card-header">
									<div class="uk-grid-small uk-flex-middle" uk-grid>
										<div class="uk-width-auto">
											<img v-show="tx.type=='nav'" style="width:32px;height:auto;" src="images/nav-logo-no-border.png">
											<img v-show="tx.type=='xnav'" style="width:32px;height:auto;" src="images/xnav-logo-no-border.png">
										</div>
										<div class="uk-width-expand">
											<span class="notification">{{tx.type.toUpperCase()}}</span>
										</div>
									</div>
								</div>
								<div class="uk-card-body">
									<i v-show="tx.type=='cold_staking'" style="margin-left: 5px;width:19px;height:auto;" class="fa-solid fa-asterisk"></i>
									<i v-if="tx.amount>0" style="color:#669900" class="fa-solid fa-arrow-down"></i>
									<i v-if="tx.amount<0" style="color:#cc6600" class="fa-solid fa-arrow-up"></i>
									<span style="color:#cc6600" v-if="tx.amount<0">
										<span v-if="tx.type!='nft'">{{formatBalance(tx.amount)}} {{tx.token_code}} {{(tx.token_name?"("+tx.token_name+")":"")}}</span>
										<span v-else>{{tx.token_name}}</span>
									</span>
									<span style="color:#669900" v-if="tx.amount>0">
										<span v-if="tx.type!='nft'">+{{formatBalance(tx.amount)}} {{tx.token_code}} {{(tx.token_name?"("+tx.token_name+")":"")}}</span>
										<span v-else>{{tx.token_name}}</span>
									</span>
								</div>
								<div class="uk-card-footer">
									<span>{{(tx.confirmed?"Confirmed":"Not Confirmed")}}</span>
									<span class="uk-align-right">{{formatDate(tx.timestamp)}}</span>
								</div>
							</div>
						</li>
					</ul>
				</li>
				<li>
					<form>
						<fieldset class="uk-fieldset">
							<div class="uk-margin">
								<button class="uk-button uk-button-default uk-button-small" type="button" v-on:click="isPrivateTransaction=!isPrivateTransaction"><span v-show="isPrivateTransaction" class="fa-solid fa-eye-slash"></span><span v-show="!isPrivateTransaction" class="fa-solid fa-eye"></span>&nbsp;Private Transaction</button>
							</div>
							<div class="uk-margin">
								<button class="uk-button uk-button-default uk-button-small" type="button" v-on:click="isIncludesTxFee=!isIncludesTxFee"><span v-show="isIncludesTxFee" class="fa-solid fa-check"></span><span v-show="!isIncludesTxFee" class="fa-solid fa-circle-xmark"></span>&nbsp;Includes Transaction Fee</button>
							</div>
							<div class="uk-margin">
								<input class="uk-input" placeholder="Address" type="text" v-model="address"></input>
							</div>
							<div class="uk-margin">
								<input class="uk-input" placeholder="Amount" type="number" v-model="amount"></input>
							</div>
							<div class="uk-margin">
								<button class="uk-button uk-button-small uk-button-secondary" :disabled="!address || !amount" v-on:click="send()"><i class="fa-solid fa-paper-plane"></i>&nbsp;Send</button>
								<button class="uk-button uk-button-small uk-button-primary uk-align-right" v-on:click="useAllFunds()">Use All Funds</button>
							</div>
						</fieldset>
					</form>
				</li>
				<li>
					<div v-if="balance && Object.keys(balance.nfts).length>0">
						<h5>{{Object.keys(balance.nfts).length}} Collection</h5>
						<div class="uk-card uk-card-default" v-for="(item,index) in balance.nfts" v-if="parseJSON(item.scheme).version==1">
							<div class="uk-card-header">
								<!--<h3 class="uk-card-title">
									{{item.name}}
								</h3>!-->
								<img v-if="parseJSON(item.scheme).image" style="width:100%;height:auto" :src="ipfs_to_url(parseJSON(item.scheme).image)">
								<div>
									{{parseJSON(item.scheme).name}}
								</div>
								<div>
									{{parseJSON(item.scheme).description}}
								</div>
								<div>
									<i class="fa-solid fa-link"></i>&nbsp;<a target="_blank" :href="parseJSON(item.scheme).external_url">{{parseJSON(item.scheme).external_url}}</a>
								</div>
							</div>
							<div class="uk-card-body">
								<div>
									<div v-for="(item2,index) in item.confirmed" class="uk-card uk-card-default uk-grid-collapse uk-child-width-1-1@s uk-margin" uk-grid>
										<div class="uk-cover-container">
											<img v-if="parseJSON(item2).attributes.content_type.split('/')[0]=='image'" onerror="this.style.display='none'" uk-cover :src="ipfs_to_url(parseJSON(item2).image)">
											<canvas v-if="parseJSON(item2).attributes.content_type.split('/')[0]=='image'" width="400" height="400"></canvas>
										</div>
											<div class="uk-card-body" style="margin-left:10px;">
											<div class="uk-card-title">
												<small>
													<i v-if="parseJSON(item2).attributes.content_type.split('/')[0]=='audio'" class="fa-solid fa-music"></i>
													<i v-if="parseJSON(item2).attributes.content_type.split('/')[0]=='video'" class="fa-solid fa-circle-play"></i>
													&nbsp;{{parseJSON(item2).name}} (#{{index}})
												</small>
											</div>
											<div>
												<small>
													{{parseJSON(item2).description}}
												</small>
											</div>
											<div>
												<small>
													<i class="fa-solid fa-link"></i>&nbsp;<a target="_blank" :href="parseJSON(item2).external_url">{{parseJSON(item2).external_url}}</a>
												</small>
											</div>
											<div style="margin-top:5px;" v-if="parseJSON(item2).attributes.content_type.split('/')[0]=='audio'">
												<audio controls style="width:100%">
													<source :src="parseJSON(item2).image" type="audio/ogg">
													<source :src="parseJSON(item2).image" type="audio/mpeg">
													Your browser does not support the audio element.
												</audio>
											</div>
											<div style="margin-top:5px;" v-if="parseJSON(item2).attributes.content_type.split('/')[0]=='video'">
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
				</li>
			</ul>
		</div>
	</div>
</template>
<script>
import * as njs from 'navcoin-js';
import axios from 'axios';
import sb from 'satoshi-bitcoin';
import moment from 'moment';
import bitcore from '@aguycalled/bitcore-lib';
import Mnemonic from '@aguycalled/bitcore-mnemonic';
export default
{
	data()
	{
		return {
			networks:
			[
				{
					name:'Mainnet',
					code:'mainnet'
				},
				{
					name:'Testnet',
					code:'testnet'
				}
			],
			walletType:'next',
			network:'testnet',
			wallet_name:'',
			password:'',
			password_again:'',
			v_password:undefined,
			mnemonics:undefined,
			busy:false,
			active_wallet_already_exist:false,
			walletUnlocked:false,
			walletLoginSuccess:false,
			action:undefined,
			is_action_processed:false,
			sender:{},
			trustedSites:[],
			status:'',
			page:'welcome',
			pages:[],
			pageindex:0,
			publicAddress:'',
			privateAddress:'',
			balance:undefined,
			history:[],
			qrcode_nav:'',
			qrcode_xnav:'',
			prefix:"navcoin:",
			wallets:[],
			active_wallet_name:'',
			pageSize: 10,
			currentPage:1,
			progress:0,
			njs:undefined,
			isPrivateTransaction:false,
			isIncludesTxFee:false,
			address:'',
			amount:'',
			fee:100000,
			current_node:'',
			height:'',
			message:'',
			signedMessage:'',
			vMessage:'',
			vAddress:'',
			vSignature:'',
			isNewWallet:false,
			wordArrayOriginal:[],
			wordArray:[],
			wordArrayConfirm:[],
			privateTokens:[],
			isPrivateTokensSynced:false,
			mint_nft_token_id:'',
			sell_nft_metadata:{},
			process_message:'',
			isImportActive:false,
			db_load_failed:false
		}
	},
	beforeCreate()
	{
	},
	computed:
	{
		indexStart()
		{
			return (this.currentPage - 1) * this.pageSize;
		},
		indexEnd()
		{
			return this.indexStart + this.pageSize;
		},
		maxPage()
		{
			return Math.ceil(this.history.length/this.pageSize);
		},
		paginatedTxs()
		{
			return this.history.slice(this.indexStart, this.indexEnd);
		}
	},
	created: function ()
	{
		let vm=this;
		vm.njs=njs;
		console.log("navcoin-js build "+njs.version);
		console.log("Listing wallets...");
		njs.wallet.WalletFile.ListWallets().then((wallets) =>
		{
			let i=0;
			console.log(wallets);
			wallets.forEach((wallet) =>
			{
				if (wallet)
				{
					console.log(i+"->"+wallet);
					i++;
					let arr=wallet.split("_");
					vm.wallets.push({name: arr[0],type: (arr[1]?arr[1]:"next"),network: (arr[2]?arr[2]:"mainnet")})
				}
			});
			if (wallets.length==1)
			{
				vm.setActiveWallet(vm.wallets[0]);
			}
			if (wallets.length>0)
			{
				vm.page="select-wallet";
			}
			else
			{
				vm.page="welcome";
			}
			vm.pages.push(vm.page);
			vm.pageindex=0;
		});
	},
	mounted: function ()
	{
		let vm=this;
		try
		{
			chrome.runtime.sendMessage({cmd:"ready"}, function(response)
			{
				vm.is_action_processed=false;
				vm.action=response.message;
				vm.sender=response.sender;
			});
			chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse)
			{
				console.log("new message");
				console.log(sender);
				console.log(msg.cmd);
				console.log(msg.message);
				if (msg.cmd=="update_action")
				{
					vm.is_action_processed=false;
					vm.action=msg.message;
					vm.sender=msg.sender;
					vm.processAction();
				}
			});
		}
		catch (e)
		{}
	},
	updated: function()
	{
		this.qrcode_nav=new QRCode(this.prefix+this.publicAddress).svg();
		this.qrcode_xnav=new QRCode(this.prefix+this.privateAddress).svg();
	},
	methods:
	{
		setNetwork(network)
		{
			console.log("Changing network to -> " + network.code);
			this.network=network.code;
			this.changePage("create-wallet");
		},
		prev()
		{
			this.currentPage--;
		},
		next()
		{
			this.currentPage++;
		},
		useAllFunds()
		{
			if (this.isPrivateTransaction)
			{
				this.amount=(this.balance.xnav.confirmed)/1e8;
			}
			else
			{
				this.amount=(this.balance.nav.confirmed+this.balance.staked.confirmed)/1e8;
			}
		},
		doCopy: function (content)
		{
			this.$copyText(content).then(function (e)
			{
				UIkit.notification("Copied", {status:'success'})
			},
			function (e)
			{
				UIkit.notification("Not copied", {status:'warning'})
			})
		},
		shuffle: function (array)
		{
			return array.sort(() => Math.random() - 0.5);
		},
		ipfs_to_url: function(link)
		{
			let base_url="https://ipfs.nextwallet.org/ipfs/";
			let e=link.split("ipfs://");
			return base_url+e[1];
		},
		skipVerifySeedPhrases: function ()
		{
			let vm=this;
			UIkit.modal.confirm("<h3>Warning!</h3><p>If you do not back up your seed phrases, you will lose access to your balance in this wallet in the future.</p><p>Do you still want to skip the backup process?</p>").then(function()
			{
				vm.walletUnlocked=true;
				vm.page="home";
			}
			,function ()
			{
				console.log('Rejected.');
			});
		},
		confirmVerifySeedPhrases: function ()
		{
			if (this.mnemonics.toString()==this.wordArrayConfirm.join(" "))
			{
				this.walletUnlocked=true;
				this.page="home";
			}
			else
			{
				UIkit.notification("Your seed phrases could not be verified, please try again.");
				this.wordArrayConfirm=[];
			}
		},
		addWordtoArray: function (word)
		{
			this.wordArrayConfirm.push(word);
		},
		signMessage()
		{
			let vm=this;
			try
			{
				console.log("Signing message with -> " + vm.publicAddress);
				wallet.NavGetPrivateKeys(vm.password,vm.publicAddress).then(function (e)
				{
					console.log(e);
					vm.signedMessage=wallet.Sign(bitcore.PrivateKey.fromWIF(e[0].privateKey),vm.message);
				});
			}
			catch (err)
			{
				UIkit.modal.alert(e.message);
			}
		},
		verifyMessage()
		{
			try
			{
				let result=wallet.VerifySignature(this.vAddress,this.vMessage,this.vSignature)
				UIkit.notification((result.toString()=="true"?"Message successfully validated":"Message not valid"), {status:(result.toString()=="true"?"success":"warning")})
			}
			catch (e)
			{
				UIkit.notification(e.message);
			}
		},
		removeWallet()
		{
			if (this.v_password==this.password)
			{
				njs.wallet.WalletFile.RemoveWallet(this.active_wallet_name).then(() =>
				{
					console.log("Wallet "+this.active_wallet_name+" removed.");
					UIkit.notification("<i class='fas fa-check'></i>&nbsp;Wallet removed", {status:'success'})
				});
			}
			else
			{
				UIkit.notification("<i class='fas fa-close'></i>&nbsp;Invalid password", {status:'danger'})
			}
		},
		send()
		{
			let vm=this;
			let amount=parseFloat((vm.amount*1e8).toFixed(0));
			if (vm.isPrivateTransaction)
			{
				try
				{
					UIkit.modal("#modal-please-wait").show();
					wallet.xNavCreateTransaction(vm.address, amount, '', vm.password, vm.isIncludesTxFee).then(function (tx)
					{
						let msg="<p>Amount to send : " + sb.toBitcoin((vm.isIncludesTxFee?amount-tx.fee:amount)) + " xNAV</p><p>Transaction fee : " + sb.toBitcoin(tx.fee) + " xNAV</p><p>Total amount : " + sb.toBitcoin((vm.isIncludesTxFee?amount:amount+tx.fee)) + " xNAV</p>"+"<p>Do you confirm transaction?</p>";
						UIkit.modal.confirm(msg).then(function()
						{
							wallet.SendTransaction(tx.tx).then(function (result)
							{
								if (result.error)
								{
									UIkit.modal.alert(result.error);
								}
								else
								{
									vm.address=null;
									vm.amount=null;
									UIkit.modal.alert("Success");
								}
							})
							.catch((e) =>
							{
								UIkit.modal.alert(e.message);
							});
						}
						, function ()
						{
							console.log('Rejected.');
						});
					})
					.catch((e) =>
					{
						UIkit.modal.alert(e.message);
					});
				}
				catch(e)
				{
					UIkit.modal.alert(e.message);
				}
			}
			else
			{
				try
				{
					UIkit.modal("#modal-please-wait").show();
					wallet.NavCreateTransaction(vm.address,amount, '', vm.password, vm.isIncludesTxFee).then(function (tx)
					{
						let msg="<p>Amount to send : " + sb.toBitcoin((vm.isIncludesTxFee?amount-tx.fee:amount)) + " NAV</p><p>Transaction fee : " + sb.toBitcoin(tx.fee) + " NAV</p><p>Total amount : " + sb.toBitcoin((vm.isIncludesTxFee?amount:amount+tx.fee)) + " NAV</p>"+"<p>Do you confirm transaction?</p>";
						UIkit.modal.confirm(msg).then(function()
						{
							wallet.SendTransaction(tx.tx).then(function (result)
							{
								if (result.error)
								{
									UIkit.modal.alert(result.error);
								}
								else
								{
									vm.address=null;
									vm.amount=null;
									UIkit.modal.alert("Success");
								}
							})
							.catch((e) =>
							{
								UIkit.modal.alert(e.message);
							});
						}
						, function ()
						{
							console.log('Rejected.');
						});
					})
					.catch((e) =>
					{
						UIkit.modal.alert(e.message);
					});
				}
				catch(e)
				{
					UIkit.modal.alert(e.message);
				}
			}
		},
		createWallet: function ()
		{
			if (!this.password)
			{
				UIkit.modal.alert('Please specify a password');
			}
			else if (this.password.length<6)
			{
				UIkit.modal.alert('Your password must be at least 6 characters long.');
			}
			else if (this.password!=this.password_again)
			{
				UIkit.modal.alert('The passwords you specify must be the same.');
			}
			else
			{
				this.active_wallet_name=this.wallet_name+"_"+this.walletType+"_"+this.network;
				this.isNewWallet=true;
				this.initWallet();
			}
		},
		importWallet: function ()
		{
			if (!this.mnemonics)
			{
				UIkit.modal.alert('Please specify mnemonic words');
			}
			else if (!this.password)
			{
				UIkit.modal.alert('Please specify a password');
			}
			else if (this.password.length<6)
			{
				UIkit.modal.alert('Your password must be at least 6 characters long.');
			}
			else if (this.password!=this.password_again)
			{
				UIkit.modal.alert('The passwords you specify must be the same.');
			}
			else
			{
				var valid=Mnemonic.isValid(this.mnemonics);
				if (!valid)
				{
					UIkit.modal.alert('Mnemonics word checking failed, please correct your mnemonics and try again...');
				}
				else
				{
					this.active_wallet_name=this.wallet_name+"_"+this.walletType+"_"+this.network;
					this.initWallet();
				}
			}
		},
		createNewWallet()
		{
			this.active_wallet_already_exist=false;
			this.isImportActive=false;
			this.changePage("select-network");
		},
		importExistingWallet()
		{
			this.active_wallet_already_exist=false;
			this.isImportActive=true;
			this.changePage("create-wallet");
		},
		unlockWallet: function ()
		{
			if (!this.active_wallet_name)
			{
				UIkit.modal.alert('Please choose a wallet.');
				return;
			}
			this.busy=true;
			this.initWallet();
		},
		parseJSON: function(str)
		{
			try
			{
				//console.log(JSON.parse(str));
				return JSON.parse(str);
			}
			catch(err)
			{
				return false;
			}
		},
		setActiveWallet(wallet)
		{
			this.active_wallet_name=wallet.name+"_"+wallet.type+"_"+wallet.network;
			this.active_wallet_already_exist=true;
			console.log("Active wallet -> " + this.active_wallet_name);
		},
		removeSite(index)
		{
			this.trustedSites.splice(index,1);
			try
			{
				chrome.storage.local.set({trustedSites: this.trustedSites}, function () {});
			}
			catch(e)
			{}
		},
		changePage:function(page)
		{
			this.pages.push(page);
			this.pageindex++;
			this.page=page;
			let vm=this;
			try
			{
				UIkit.dropdown("#menu").hide(0);
			}
			catch (e){}
			if (this.page=="trusted_sites")
			{
				try
				{
					chrome.storage.local.get({trustedSites: []}, function (result)
					{
						vm.trustedSites=result.trustedSites;
					});
				}
				catch (e){}
			}
			else if (this.page=="backup-wallet")
			{
				vm.mnemonics=undefined;
				UIkit.modal.prompt('Wallet Password:', '').then(function (password)
				{
					if (!password) return; 
					wallet.db.GetMasterKey("mnemonic",password)
					.then(function (e)
					{
						if(e)
						{
							vm.mnemonics=e;
						}
						else
						{
							UIkit.modal.alert("Wrong password");
						}
					});
				});
			}
		},
		goBack:function()
		{
			console.log(this.pages);
			console.log(this.pageindex-1);
			this.page=this.pages[this.pageindex-1];
			this.pages.splice(this.pageindex,1);
			this.pageindex--;
		},
		formatBalance: n =>
		{
			if (n==0) return n;
			if (n)
			{
				var amount=sb.toBitcoin(n);
				var parts=amount.toString().split(".");
				return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
			}
			else
			{
				return "";
			}
		},
		formatDate: n =>
		{
			if (n) return moment.unix(n).format('DD.MM.YY HH:mm:ss'); else return "";
		},
		acceptConnection()
		{
			let vm=this;
			chrome.runtime.sendMessage({cmd:"accept_connection",address:this.privateAddress}, function(response)
			{
				console.log(response);
				chrome.storage.local.get({trustedSites: []}, function (result)
				{
					var trustedSites = result.trustedSites;
					if (!trustedSites.includes(vm.sender.origin))
					{
						trustedSites.push(vm.sender.origin);
						chrome.storage.local.set({trustedSites: trustedSites}, function ()
						{
							chrome.storage.local.get('trustedSites', function (result)
							{
								console.log(result.trustedSites);
								//window.close();
							});
						});
					}
				});
			});
		},
		rejectNFTOrder()
		{
			try
			{
				chrome.runtime.sendMessage({cmd:"reject_nft_order"}, function(response)
				{
					console.log(response);
					//window.close();
				});
			}
			catch (e)
			{}
		},
		acceptNFTOrder()
		{
			let vm=this;
			console.log("Accepting nft order...");
			console.log(this.action.order);
			vm.process_message="Accepting order...";
			UIkit.modal("#modal-please-wait").show();
			wallet.AcceptOrder(vm.action.order,vm.password).then(function (tx)
			{
				vm.process_message="Submitting transaction...";
				wallet.SendTransaction(tx.tx).then(function (result)
				{
					if (result.error)
					{
						UIkit.modal.alert(result.error);
					}
					else
					{
						UIkit.modal.alert("Success");
					}
				})
				.catch((e) =>
				{
					UIkit.modal.alert(e.message);
				});
			})
			.catch((e) =>
			{
				UIkit.modal.alert(e.message);
			});
		},
		rejectConnection()
		{
			try
			{
				chrome.runtime.sendMessage({cmd:"reject_connection"}, function(response)
				{
					console.log(response);
					//window.close();
				});
			}
			catch (e)
			{}
		},
		acceptCancelNFTSellOrder()
		{
			console.log("accepting cancel nft sell order");
			console.log(this.privateAddress);
			console.log(this.action.token_id);
			console.log(this.action.nft_id);
			let vm=this;
			try
			{
				UIkit.modal("#modal-please-wait").show();
				wallet.tokenCreateTransaction(vm.privateAddress, 1, undefined, vm.password, vm.action.token_id,vm.action.nft_id).then(function (tx)
				{
					if (tx.tx)
					{
						let msg="<h3>Cancel NFT Sell Order</h3><p>Transaction fee : " + sb.toBitcoin(tx.fee) + " xNAV</p><p>Do you confirm transaction?</p>";
						UIkit.modal.confirm(msg).then(function()
						{
							UIkit.modal("#modal-please-wait").show();
							wallet.SendTransaction(tx.tx).then(function (result)
							{
								console.log(result);
								if (result.error)
								{
									UIkit.modal.alert(result.error);
									chrome.runtime.sendMessage({cmd:"reject_cancel_nft_order"}, function(response)
									{
										console.log(response);
									});
									UIkit.modal("#modal-please-wait").hide();
								}
								else
								{
									UIkit.modal("#modal-please-wait").hide();
									UIkit.modal.alert("Success");
									chrome.runtime.sendMessage({cmd:"accept_cancel_nft_order"}, function(response)
									{
										console.log(response);
									});
								}
							})
							.catch((e) =>
							{
								UIkit.modal("#modal-please-wait").hide();
								console.log(e);
								chrome.runtime.sendMessage({cmd:"reject_cancel_nft_order"}, function(response)
								{
									console.log(response);
								});
								UIkit.modal.alert(e.message);
							});
						}
						,function ()
						{
							UIkit.modal("#modal-please-wait").hide();
							console.log('Rejected.');
							chrome.runtime.sendMessage({cmd:"reject_cancel_nft_order"}, function(response)
							{
								console.log(response);
							});
						});
					}
				})
				.catch((e) =>
				{
					console.log(e);
				});
			}
			catch(e)
			{
				console.log(e);
			}
		},
		rejectCancelNFTSellOrder()
		{
			try
			{
				chrome.runtime.sendMessage({cmd:"reject_cancel_nft_order"}, function(response)
				{
					console.log(response);
					//window.close();
				});
			}
			catch (e)
			{}
		},
		rejectCreateNFTCollection()
		{
			try
			{
				chrome.runtime.sendMessage({cmd:"reject_cancel_nft_order"}, function(response)
				{
					console.log(response);
					//window.close();
				});
			}
			catch (e)
			{}
		},
		acceptCreateNFTCollection()
		{
			console.log("Accepting create nft collection request...")
			console.log(this.action);
			let vm=this;
			UIkit.modal("#modal-please-wait").show();
			wallet.CreateNft(this.action.name,this.action.scheme,this.action.max_supply*1e8,this.password).then(function (tx)
			{
				UIkit.modal("#modal-please-wait").hide();
				if (tx.tx)
				{
					let msg="<h3>Create NFT Collection</h3><p>Transaction fee : " + sb.toBitcoin(tx.fee) + " xNAV</p><p>Do you confirm transaction?</p>";
					UIkit.modal.confirm(msg).then(function()
					{
						UIkit.modal("#modal-please-wait").show();
						wallet.SendTransaction(tx.tx).then(function (result)
						{
							console.log(result);
							if (result.error)
							{
								UIkit.modal.alert(result.error);
								chrome.runtime.sendMessage({cmd:"reject_create_nft_collection"}, function(response)
								{
									console.log(response);
								});
								UIkit.modal("#modal-please-wait").hide();
							}
							else
							{
								UIkit.modal("#modal-please-wait").hide();
								UIkit.modal.alert("Success");
								chrome.runtime.sendMessage({cmd:"accept_create_nft_collection"}, function(response)
								{
									console.log(response);
								});
							}
						})
						.catch((e) =>
						{
							UIkit.modal("#modal-please-wait").hide();
							console.log(e);
							chrome.runtime.sendMessage({cmd:"reject_create_nft_collection"}, function(response)
							{
								console.log(response);
							});
							UIkit.modal.alert(e.message);
						});
					}
					, function ()
					{
						UIkit.modal("#modal-please-wait").hide();
						console.log('Rejected.')
						chrome.runtime.sendMessage({cmd:"reject_create_nft_collection"}, function(response)
						{
							console.log(response);
						});
					});
				}
			})
			.catch((e) =>
			{
				UIkit.modal("#modal-please-wait").hide();
				console.log("Creat nft failed");
				console.log(e);
				chrome.runtime.sendMessage({cmd:"reject_create_nft_collection"}, function(response)
				{
					console.log(response);
				});
			});
		},
		rejectCreateNFTCollection()
		{
			try
			{
				chrome.runtime.sendMessage({cmd:"reject_create_nft_collection"}, function(response)
				{
					console.log(response);
					//window.close();
				});
			}
			catch (e)
			{}
		},
		acceptCreateNFT()
		{
			console.log("Accepting create nft request...")
			console.log("NFT Token ID ->" + this.mint_nft_token_id)
			console.log(this.action);
			let vm=this;
			UIkit.modal("#modal-please-wait").show();
			wallet.MintNft(this.mint_nft_token_id,this.action.nft_id,this.privateAddress,this.action.scheme,this.password).then(function (tx)
			{
				UIkit.modal("#modal-please-wait").hide();
				if (tx.tx)
				{
					let msg="<h3>Mint NFT</h3><p>Transaction fee : " + sb.toBitcoin(tx.fee) + " xNAV</p><p>Do you confirm transaction?</p>";
					UIkit.modal.confirm(msg).then(function()
					{
						UIkit.modal("#modal-please-wait").show();
						wallet.SendTransaction(tx.tx).then(function (result)
						{
							console.log(result);
							if (result.error)
							{
								UIkit.modal.alert(result.error);
								chrome.runtime.sendMessage({cmd:"reject_create_nft"}, function(response)
								{
									console.log(response);
								});
								UIkit.modal("#modal-please-wait").hide();
							}
							else
							{
								UIkit.modal("#modal-please-wait").hide();
								UIkit.modal.alert("Success");
								chrome.runtime.sendMessage({cmd:"accept_create_nft"}, function(response)
								{
									console.log(response);
								});
							}
						})
						.catch((e) =>
						{
							UIkit.modal("#modal-please-wait").hide();
							console.log(e);
							chrome.runtime.sendMessage({cmd:"reject_create_nft"}, function(response)
							{
								console.log(response);
							});
							UIkit.modal.alert(e.message);
						});
					}
					, function ()
					{
						UIkit.modal("#modal-please-wait").hide();
						console.log('Rejected.')
						chrome.runtime.sendMessage({cmd:"reject_create_nft"}, function(response)
						{
							console.log(response);
						});
					});
				}
			})
			.catch((e) =>
			{
				UIkit.modal("#modal-please-wait").hide();
				console.log("Creat nft failed");
				console.log(e);
				chrome.runtime.sendMessage({cmd:"reject_create_nft"}, function(response)
				{
					console.log(response);
				});
			});
		},
		rejectCreateNFT()
		{
			try
			{
				chrome.runtime.sendMessage({cmd:"reject_create_nft"}, function(response)
				{
					console.log(response);
					//window.close();
				});
			}
			catch (e)
			{}
		},
		rejectCreateNFTSellOrder()
		{
			try
			{
				chrome.runtime.sendMessage({cmd:"reject_create_nft_sell_order"}, function(response)
				{
					console.log(response);
					//window.close();
				});
			}
			catch (e)
			{}
		},
		acceptCreateNFTSellOrder()
		{
			console.log(this.action.token_id);
			console.log(this.action.nft_id);
			console.log(this.action.price);
			console.log(this.privateAddress);
			console.log("Submitting sell order...");
			let vm=this;
			let amount=parseFloat((vm.action.price*1e8).toFixed(0));
			UIkit.modal("#modal-please-wait").show();
			try
			{
				vm.process_message="Creating NFT proof...";
				console.log("Creating NFT proof...");
				wallet.CreateNftProof(vm.action.token_id,vm.action.nft_id,vm.password).then((p) =>
				{
					let hex=Buffer.from(p.sig).toString('hex');
					let proof={nftId:vm.action.nft_id,tokenId:vm.action.token_id,sig:Buffer.from(hex,'hex')};
					console.log(proof);
					wallet.CreateSellNftOrder(vm.action.token_id, vm.action.nft_id, this.privateAddress, amount,vm.password).then(function (order)
					{
						vm.process_message="Creating NFT sell order";
						console.log(order);
						wallet.VerifyOrder(order).then((result) =>
						{
							console.log("Verify order result -> " + result);
						})
						//console.log(JSON.stringify(order));
						//console.log(JSON.parse(JSON.stringify(order)));
						console.log("Verifying proof...");
						wallet.VerifyNftProof(vm.action.token_id,parseInt(vm.action.price),proof).then((v) =>
						{
							console.log(v);
						});
						if (vm.action.return_order)
						{
							vm.process_message="Returning NFT sell order to origin...";
							chrome.runtime.sendMessage({cmd:"accept_get_nft_sell_order",order:order}, function(response){});
							UIkit.modal.alert("<p>NFT sell order data sent to origin.</p>");
						}
						if (!vm.action.return_order && (vm.action.submit_order&& vm.action.api_url))
						{
							vm.process_message="Submitting NFT sell order...";
							axios.post(vm.action.api_url+'CreateSellNftOrder',{order:order,proof:proof},{}).then(function(retval)
							{
								console.log(retval.data);
								if (retval.data.status=="order_created")
								{
									chrome.runtime.sendMessage({cmd:"accept_create_nft_sell_order",result:true}, function(response){});
									UIkit.modal.alert("<p>Order created</p>");
								}
								else
								{
									chrome.runtime.sendMessage({cmd:"accept_create_nft_sell_order",result:false}, function(response){});
									UIkit.modal.alert("<p>NFT sell order cannot created.</p><p>"+retval.data.message+"</p>");
								}
							}).
							catch(function(e)
							{
								console.log(e);
								chrome.runtime.sendMessage({cmd:"accept_create_nft_sell_order",result:false}, function(response){});
								UIkit.modal.alert("<p>NFT sell order cannot created.</p><p>"+e.message+"</p>");
							})
						}
					})
					.catch((e) =>
					{
						console.log("CreateSellNftOrder failed -> " + e.message);
						chrome.runtime.sendMessage({cmd:"accept_create_nft_sell_order",result:false}, function(response){});
						UIkit.modal.alert("<p>NFT sell order cannot created.</p><p>"+e.message+"</p>");
					});
				}).
				catch((e) =>
				{
					console.log("CreateSellNftOrder failed -> " + e.message);
					chrome.runtime.sendMessage({cmd:"accept_create_nft_sell_order",result:false}, function(response){});
					UIkit.modal.alert("<p>NFT sell order cannot created.</p><p>"+e.message+"</p>");
				});
			}
			catch(e)
			{
				console.log("CreateSellNftOrder failed -> " + e.message);
				chrome.runtime.sendMessage({cmd:"accept_create_nft_sell_order",result:false}, function(response){});
				UIkit.modal.alert("<p>NFT sell order cannot created.</p><p>"+e.message+"</p>");
			}
		},
		processAction()
		{
			let vm=this;
			if (vm.is_action_processed) return;
			vm.is_action_processed=true;
			if (vm.action.method=='connect')
			{
				chrome.storage.local.get({trustedSites: []}, function (result)
				{
					if (!result.trustedSites.includes(vm.sender.origin))
					{
						UIkit.modal("#modal-connect-confirm").show();
					}
					else
					{
						vm.acceptConnection();
						UIkit.notification("<i class='fas fa-check'></i>&nbsp;Access granted", {status:'success'})
					}
				});
			}
			if (vm.action.method=='create_nft_collection')
			{
				console.log("creating nft collection...");
				console.log(vm.action.name);
				console.log(vm.action.scheme);
				console.log(vm.action.max_supply);
				UIkit.modal("#modal-create-nft-collection-confirm").show();
			}
			else if (vm.action.method=='create_nft')
			{
				console.log("creating nft...");
				console.log(vm.action.name);
				console.log(vm.action.nft_id);
				console.log(vm.action.scheme);
				UIkit.modal("#modal-create-nft-confirm").show();
			}
			else if (vm.action.method=='list_nft_collections')
			{
				console.log("listing nft collections...");
				chrome.runtime.sendMessage({cmd:"list_nft_collections",collections:vm.balance.nfts}, function(response)
				{
				});
			}
			else if (vm.action.method=='create_nft_sell_order')
			{
				if (vm.isPrivateTokensSynced)
				{
					console.log("creating nft sell order...");
					console.log(vm.action.token_id);
					console.log(vm.action.nft_id);
					console.log(vm.action.price);
					wallet.GetNftInfo(vm.action.token_id,vm.action.nft_id).then((nft) =>
					{
						vm.sell_nft_metadata=JSON.parse(nft.metadata);
						UIkit.modal("#modal-create-nft-sell-order-confirm").show();
					});
				}
				else
				{
					//UIkit.modal.alert("<p>Private tokens not loaded, please try again later</p>");
				}
			}
			else if (vm.action.method=='accept_order')
			{
				console.log("accept order confirm");
				console.log(vm.action.order);
				UIkit.modal("#modal-accept-nft-order-confirm").show();
			}
			else if (vm.action.method=='cancel_nft_sell_order')
			{
				console.log("cancel sell order");
				console.log(vm.action.token_id);
				console.log(vm.action.nft_id);
				UIkit.modal("#modal-cancel-nft-sell-order-confirm").show();
			}
		},
		initWallet()
		{
			let vm=this;
			let wallet;
			this.walletLoginSuccess=true;
			this.page="wallet-loading";
			const walletFile = vm.active_wallet_name; // File name of the wallet database, persistence using dexie db backend only works on the browser
			const password = vm.password; // Password used to encrypt and open the wallet database
			const spendingPassword = vm.password; // Password used to send transactions
			const zapwallettxes = false; // Should the wallet be cleared of its history?
			const log = true; // Log to console
			njs.wallet.Init().then(async () => {
			if (vm.active_wallet_already_exist)
			{
				console.log("Loading existing wallet : " + vm.active_wallet_name);
				wallet=new njs.wallet.WalletFile(
				{
					file:vm.active_wallet_name,
					zapwallettxes:zapwallettxes,
					password:password,
					log:log
				})
			}
			else
			{
				console.log("Creating and loading new wallet : " + vm.active_wallet_name + "("+vm.walletType+")" + "("+vm.network+")");
				console.log("Password : " + password);
				wallet=new njs.wallet.WalletFile(
				{
					file:vm.active_wallet_name,
					network:vm.network,
					mnemonic:(vm.mnemonics?vm.mnemonics:undefined),
					type: vm.walletType,
					password:password,
					spendingPassword:spendingPassword,
					zapwallettxes:zapwallettxes,
					log:log
				})
			}
			console.log("is open -> " + wallet.db.open);
			window.wallet=wallet;
			wallet.on("new_mnemonic", (mnemonic) =>
			{
				if (!vm.db_load_failed)
				{
					vm.mnemonics=mnemonic;
					vm.wordArrayOriginal = vm.mnemonics.toString().split(' ');
					vm.wordArray = vm.shuffle(vm.mnemonics.toString().split(' '));
					console.log(`wallet created with mnemonic ${mnemonic} - please back it up!`);
				}
			});
			wallet.on("loaded", async () =>
			{
				vm.status="Wallet loaded";
				console.log("wallet loaded");
				wallet.NavReceivingAddresses(true).then((value) =>
				{
					vm.publicAddress=value[0].address;
					console.log("NAV receiving address : " + value[0].address);
				});
				wallet.xNavReceivingAddresses(false).then((value) =>
				{
					let xNAVAddress=value.filter((e) => e.path == "0/0")[0].address;
					vm.privateAddress=xNAVAddress;
					console.log("xNAV receiving address : " + xNAVAddress);
					try
					{
						chrome.storage.local.set({privateAddress: vm.privateAddress}, function()
						{
							console.log('Private address saved to storage');
						});
					}
					catch (e) {}
					if (vm.action)
					{
						vm.processAction();
					}
				});
				await wallet.Connect();
			});
			wallet.on('connected', async(node) =>
			{
				console.log('connected to -> ' + node);
				vm.current_node=node;
				vm.status="Connected, waiting for sync...";
			});
			wallet.on("sync_status", async (progress, pending) => {
				vm.progress=progress;
				vm.status="Sync progress : % " + progress;
			});
			wallet.on("db_load_error", async (e) => {
				vm.status="Database load error";
				vm.db_load_failed=true;
				console.log("Error Load DB -> " + e);
				UIkit.modal.alert("<p>Wallet cannot loaded.</p><p>"+e+"</p>");
			});
			wallet.on("sync_started", async () => {
				console.log("sync_started");
				vm.status="Sync started...";
			});
			wallet.on("sync_finished", async () =>
			{
				vm.status="Sync finished...";
				vm.progress=100;
				wallet.GetBalance().then((value) =>
				{
					vm.balance=value;
					if (vm.action)
					{
						vm.processAction();
					}
				});
				wallet.GetMyTokens(vm.password).then((value) =>
				{
					vm.isPrivateTokensSynced=true;
					vm.privateTokens=value;
				})
				.catch(function(e)
				{
					console.log("Error while getting tokens -> " + e.message);
				});
				wallet.GetHistory().then((value) =>
				{
					vm.history=value;
					console.log(vm.history);
				});
				console.log("sync_finished");
				console.log(`Balance ${JSON.stringify(await wallet.GetBalance())}`);
			});
			wallet.on("bootstrap_started", () => {
				vm.status="Bootstrap started...";
				console.log("bootstrap_started");
			});
			wallet.on("bootstrap_progress", (count) => {
				console.log("bootstrap_progress -> " + count);
				vm.status="Bootstrap progress :  " + count;
			});
			wallet.on("bootstrap_finished", () => {
				vm.status="Bootstrap finished...";
				console.log("bootstrap_finished");
			});
			wallet.on('new_block', async (height) => 
			{
				vm.height=height;
			});
			wallet.on("new_tx", async (list) => {
				console.log(`Received transaction ${JSON.stringify(list)}`);
				console.log(`Balance ${JSON.stringify(await wallet.GetBalance())}`);
			});
			wallet.Load({bootstrap: njs.wallet.xNavBootstrap})
				.then(() =>
				{
					console.log("wallet loaded");
					if (this.isNewWallet)
					{
						this.page="verify-mnemonics";
					}
					else
					{
						this.walletUnlocked=true;
						this.page="home";
					}
				})
				.catch(function(e)
				{
					vm.walletLoginSuccess=false;
					vm.page="select-wallet";
				})
			});
		},
	}
};
</script>
<style>
.container
{
	width:370px;
	height:550px;
}
.address
{
	width:320px;
}
.card-public
{
	margin-left:15px;
	border-radius: 5px;
	background: #4568DC;  /* fallback for old browsers */
	background: -webkit-linear-gradient(to right, #B06AB3, #4568DC);  /* Chrome 10-25, Safari 5.1-6 */
	background: linear-gradient(to right, #B06AB3, #4568DC); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
.card-private
{
	margin-left:15px;
	border-radius: 5px;
	background: #000000;  /* fallback for old browsers */
	background: -webkit-linear-gradient(to right, #434343, #000000);  /* Chrome 10-25, Safari 5.1-6 */
	background: linear-gradient(to right, #434343, #000000); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
body
{
	font-size:10pt !important;
}
::-webkit-scrollbar
{
	background-color: #fff;
	width: 16px;
}
/* background of the scrollbar except button or resizer */
::-webkit-scrollbar-track
{
	background-color: #fff;
}
/* scrollbar itself */
::-webkit-scrollbar-thumb
{
	background-color: #babac0;
	border-radius: 16px;
	border: 4px solid #fff;
}
/* set button(top and bottom of the scrollbar) */
::-webkit-scrollbar-button
{
	display:none;
}
</style>