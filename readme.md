<p align="center">
  <img src="./attachments/crumbs-logo.png" alt="Crumbs logo" width="100">
</p>

<h1 align="center">Crumbs</h1>

<p align="center">
  <i>Crumbs is dapp for commenting everything, everywhere.</i>
</p>

## Abstract

If you played elden ring, you know how useful/fun the messages left by other players are. This is the same concept but for the web.

The crumbs is a dApp that allows users to create small comments on any website they wish to.
All comments commitment is pernamently stored on chain and can be view by anyone.

[Crumbs website](https://crumbs.eurekonomicon.com/)

[Chrome store extention](https://chromewebstore.google.com/detail/crumbs/hboepmaapmajfbafkkokfijpkjninbcm?authuser=0&hl=pl)

## How it works

Each website is represented by a unique hash that is generated by the website's URL.

```sh
cast keccak "https://amazon.com"
# returns 0x8f27e3e37487112bee4cf14def31d887af3a99e26bf5ec708e3e14860b4a8546
```

The user can then create a comment on the website by signing the hash of the website and the comment itself.

```sh
cast keccak "common jeffrey you can do it"

# returns 0x5483c75da019b9e9df6e65578e208793759ac3e3e1f4e0fbc9e5b92f85ffa293
```

The user can then submit the comment to the contract by calling the `storeComment(bytes32 _url, bytes32 _commentHash)` function with the hash of the website and the comment.

The comment is then stored on chain and can be viewed by anyone.

Technically, there is no reason why you shouldn't be able to send the commitment of entire Kalevala to the chain, but as of now, I won't be indexing offchain any comment that is larger than ~280 characters.

To view the comment content, we need a hash to value dictionary, which is stored offchain.

## Components of the Crumbs

- Contracts [crumbs-contracts](https://github.com/maaasyn/crumbs-contracts)
- Offchain [crumbs-offchain](https://github.com/maaasyn/crumbs-offchain)
- Extension [crumbs-extention](https://github.com/maaasyn/crumbs-extention)

### Basic flow

Get extention installed.

<p>
  <img src="./attachments/crumbs-cropped.gif" width="300px" align="center" alt="animated worflow with crumbs extention" />
</p>

Connect wallet and your account.

Send a message and see what happens.
As of 2024-05-05 it requires metamask to be installed and everything is on eth sepolia.

After submitting the message, the message will be stored on chain and can be viewed by anyone.
