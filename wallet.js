/* =====================================================
   GREMBLE WALLET
   File: wallet.js

   - Reown AppKit
   - Solana wallet connection
   - Message signature only
   - NO transactions
   - NO access to funds
   - NO seed phrase / private key
===================================================== */


/* =====================================================
   IMPORTS
===================================================== */

import {
    createAppKit
} from "https://esm.sh/@reown/appkit@1.8.23?bundle";


import {
    SolanaAdapter
} from "https://esm.sh/@reown/appkit-adapter-solana@1.8.23?bundle";


import {
    solana
} from "https://esm.sh/@reown/appkit@1.8.23/networks?bundle";


import bs58 from "https://esm.sh/bs58@6.0.0?bundle";


/* =====================================================
   CONFIG
===================================================== */

const REOWN_PROJECT_ID =
    "dfb02cb38e16d66022a31414454ae649";


const WALLET_VERIFY_ENDPOINT =
    "https://tffzjqeckoezursrvcpw.supabase.co/functions/v1/wallet-verify";


const GREMBLE_SESSION_KEY =
    "gremble_session_token";


/* =====================================================
   APP METADATA
===================================================== */

const metadata = {

    name:
        "Gremble",

    description:
        "Gremble community wallet connection",

    url:
        "https://gremblecoin.com",

    icons: [
        "https://gremblecoin.com/gremble.png"
    ]
};


/* =====================================================
   APPKIT
===================================================== */

const solanaAdapter =
    new SolanaAdapter();


const grembleWalletModal =
    createAppKit({

        adapters: [
            solanaAdapter
        ],

        networks: [
            solana
        ],

        defaultNetwork:
            solana,

        projectId:
            REOWN_PROJECT_ID,

        metadata,

        features: {

            analytics:
                true,

            email:
                false,

            socials:
                []
        },

        themeMode:
            "dark",

        themeVariables: {

            "--w3m-accent":
                "#65ff83",

            "--w3m-border-radius-master":
                "2px"
        }
    });


/* =====================================================
   HTML ELEMENTS
===================================================== */

const walletConnectButton =
    document.getElementById(
        "walletConnectButton"
    );


const walletDisconnectButton =
    document.getElementById(
        "walletDisconnectButton"
    );


const walletConnectedBox =
    document.getElementById(
        "walletConnectedBox"
    );


const walletConnectedAddress =
    document.getElementById(
        "walletConnectedAddress"
    );


const walletConnectedProvider =
    document.getElementById(
        "walletConnectedProvider"
    );


const walletStatus =
    document.getElementById(
        "walletStatus"
    );


/* =====================================================
   STATE
===================================================== */

let connectionInProgress =
    false;


let verificationInProgress =
    false;


let lastVerifiedAddress =
    "";


/* =====================================================
   HELPERS
===================================================== */

function cleanText(value) {

    return typeof value === "string"
        ? value.trim()
        : "";
}


function sleep(ms) {

    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                ms
            )
    );
}


function getGrembleSessionToken() {

    return cleanText(

        localStorage.getItem(
            GREMBLE_SESSION_KEY
        )
    );
}


function shortenAddress(address) {

    const value =
        cleanText(address);


    if (
        value.length <= 16
    ) {

        return value;
    }


    return (
        value.slice(0, 7) +
        "..." +
        value.slice(-7)
    );
}


/* =====================================================
   STATUS
===================================================== */

function setWalletStatus(
    message,
    type = ""
) {

    if (
        !walletStatus
    ) {

        return;
    }


    walletStatus.textContent =
        message;


    walletStatus.classList.remove(
        "loading",
        "success",
        "error"
    );


    if (
        type
    ) {

        walletStatus.classList.add(
            type
        );
    }
}


/* =====================================================
   SOLANA PROVIDER
===================================================== */

function getSolanaProvider() {

    try {

        const providers =
            grembleWalletModal
                .getProviders();


        return (
            providers?.["solana"] ||
            null
        );

    }
    catch (error) {

        console.warn(
            "Could not get Solana provider:",
            error
        );


        return null;
    }
}


/* =====================================================
   CONNECTED ADDRESS
===================================================== */

function getConnectedWalletAddress() {

    try {

        const address =
            grembleWalletModal
                .getAddress();


        return cleanText(
            address
        );

    }
    catch {

        return "";
    }
}


/* =====================================================
   CONNECTION STATE
===================================================== */

function isWalletConnected() {

    try {

        return Boolean(
            grembleWalletModal
                .getIsConnected()
        );

    }
    catch {

        return Boolean(
            getConnectedWalletAddress()
        );
    }
}


/* =====================================================
   WALLET NAME
===================================================== */

function getConnectedWalletName() {

    try {

        const walletInfo =
            grembleWalletModal
                .getWalletInfo();


        return (
            cleanText(
                walletInfo?.name
            ) ||
            "Wallet"
        );

    }
    catch {

        return "Wallet";
    }
}


/* =====================================================
   UI - CONNECTED
===================================================== */

function showConnectedWallet(
    address,
    providerName
) {

    const cleanAddress =
        cleanText(address);


    if (
        walletConnectedAddress
    ) {

        walletConnectedAddress.textContent =
            shortenAddress(
                cleanAddress
            );


        walletConnectedAddress.title =
            cleanAddress;
    }


    if (
        walletConnectedProvider
    ) {

        walletConnectedProvider.textContent =
            providerName ||
            "Wallet";
    }


    if (
        walletConnectedBox
    ) {

        walletConnectedBox.hidden =
            false;
    }


    if (
        walletConnectButton
    ) {

        walletConnectButton.hidden =
            true;

        walletConnectButton.disabled =
            false;
    }


    if (
        walletDisconnectButton
    ) {

        walletDisconnectButton.hidden =
            false;
    }
}


/* =====================================================
   UI - DISCONNECTED
===================================================== */

function showDisconnectedWallet() {

    if (
        walletConnectedBox
    ) {

        walletConnectedBox.hidden =
            true;
    }


    if (
        walletConnectButton
    ) {

        walletConnectButton.hidden =
            false;

        walletConnectButton.disabled =
            false;
    }


    if (
        walletDisconnectButton
    ) {

        walletDisconnectButton.hidden =
            true;

        walletDisconnectButton.disabled =
            false;
    }


    if (
        walletConnectedAddress
    ) {

        walletConnectedAddress.textContent =
            "";
    }


    if (
        walletConnectedProvider
    ) {

        walletConnectedProvider.textContent =
            "";
    }
}


/* =====================================================
   RANDOM NONCE
===================================================== */

function createVerificationNonce() {

    const bytes =
        new Uint8Array(24);


    crypto.getRandomValues(
        bytes
    );


    return Array
        .from(bytes)
        .map(
            byte =>
                byte
                    .toString(16)
                    .padStart(2, "0")
        )
        .join("");
}


/* =====================================================
   TELEGRAM ID FROM SESSION
===================================================== */

function getTelegramIdFromSession() {

    const token =
        getGrembleSessionToken();


    if (
        !token
    ) {

        throw new Error(
            "Connect Telegram first."
        );
    }


    const parts =
        token.split(".");


    if (
        parts.length !== 3
    ) {

        throw new Error(
            "Invalid Gremble session."
        );
    }


    try {

        let payload =
            parts[1]
                .replace(/-/g, "+")
                .replace(/_/g, "/");


        while (
            payload.length % 4
        ) {

            payload += "=";
        }


        const decoded =
            JSON.parse(

                decodeURIComponent(

                    Array
                        .from(
                            atob(payload)
                        )
                        .map(
                            character =>
                                "%" +
                                character
                                    .charCodeAt(0)
                                    .toString(16)
                                    .padStart(2, "0")
                        )
                        .join("")
                )
            );


        const telegramId =
            decoded.telegram_id ??
            decoded.telegramId ??
            decoded.sub;


        if (
            telegramId === undefined ||
            telegramId === null ||
            String(telegramId).trim() === ""
        ) {

            throw new Error(
                "Telegram ID missing from session."
            );
        }


        return String(
            telegramId
        );

    }
    catch (error) {

        console.error(
            "Could not read Gremble session:",
            error
        );


        throw new Error(
            "Invalid Gremble session."
        );
    }
}


/* =====================================================
   VERIFICATION MESSAGE

   MUST MATCH wallet-verify EDGE FUNCTION
===================================================== */

function buildWalletVerificationMessage(
    telegramId,
    walletAddress,
    nonce
) {

    return [

        "Gremble Wallet Verification",

        "",

        "Sign this message to verify that you own this wallet.",

        "This does not create a transaction and does not give Gremble access to your funds.",

        "",

        `Telegram ID: ${telegramId}`,

        `Wallet: ${walletAddress}`,

        `Nonce: ${nonce}`

    ].join("\n");
}


/* =====================================================
   SIGNATURE TO BASE58
===================================================== */

function signatureToBase58(
    signatureResult
) {

    let signature =
        signatureResult;


    if (
        signatureResult &&
        typeof signatureResult === "object" &&
        "signature" in signatureResult
    ) {

        signature =
            signatureResult.signature;
    }


    if (
        typeof signature === "string"
    ) {

        return signature;
    }


    if (
        signature instanceof Uint8Array
    ) {

        return bs58.encode(
            signature
        );
    }


    if (
        Array.isArray(signature)
    ) {

        return bs58.encode(

            new Uint8Array(
                signature
            )
        );
    }


    if (
        signature?.buffer
    ) {

        return bs58.encode(

            new Uint8Array(

                signature.buffer,

                signature.byteOffset || 0,

                signature.byteLength
            )
        );
    }


    throw new Error(
        "Unsupported wallet signature format."
    );
}


/* =====================================================
   WAIT FOR REOWN CONNECTION
===================================================== */

async function waitForWalletConnection(
    timeoutMs = 120000
) {

    const start =
        Date.now();


    while (
        Date.now() - start <
        timeoutMs
    ) {

        const address =
            getConnectedWalletAddress();


        const provider =
            getSolanaProvider();


        if (
            address &&
            provider
        ) {

            return {
                address,
                provider
            };
        }


        await sleep(
            250
        );
    }


    throw new Error(
        "Wallet connection timed out."
    );
}


/* =====================================================
   VERIFY CONNECTED WALLET
===================================================== */

async function verifyConnectedWallet(
    provider,
    walletAddress
) {

    if (
        verificationInProgress
    ) {

        return;
    }


    verificationInProgress =
        true;


    try {

        const sessionToken =
            getGrembleSessionToken();


        if (
            !sessionToken
        ) {

            throw new Error(
                "Connect Telegram first."
            );
        }


        const telegramId =
            getTelegramIdFromSession();


        const nonce =
            createVerificationNonce();


        const message =
            buildWalletVerificationMessage(
                telegramId,
                walletAddress,
                nonce
            );


        const encodedMessage =
            new TextEncoder()
                .encode(
                    message
                );


        setWalletStatus(
            "SIGN THE MESSAGE IN YOUR WALLET...",
            "loading"
        );


        /*
           MESSAGE SIGNATURE ONLY.
           NO TRANSACTION.
        */

        const signatureResult =
            await provider
                .signMessage(
                    encodedMessage
                );


        const signatureBase58 =
            signatureToBase58(
                signatureResult
            );


        const walletName =
            getConnectedWalletName();


        setWalletStatus(
            "VERIFYING WALLET...",
            "loading"
        );


        const response =
            await fetch(
                WALLET_VERIFY_ENDPOINT,
                {

                    method:
                        "POST",

                    headers: {

                        "Authorization":
                            `Bearer ${sessionToken}`,

                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({

                            wallet_address:
                                walletAddress,

                            wallet_provider:
                                walletName,

                            signature:
                                signatureBase58,

                            nonce
                        })
                }
            );


        let result =
            null;


        try {

            result =
                await response.json();

        }
        catch {

            result =
                null;
        }


        if (
            !response.ok ||
            !result?.success ||
            !result?.verified
        ) {

            throw new Error(
                result?.error ||
                "Wallet verification failed."
            );
        }


        lastVerifiedAddress =
            walletAddress;


        showConnectedWallet(
            walletAddress,
            walletName
        );


        setWalletStatus(
            "WALLET CONNECTED",
            "success"
        );


        return result;

    }
    finally {

        verificationInProgress =
            false;
    }
}


/* =====================================================
   HANDLE CONNECTED WALLET
===================================================== */

async function handleWalletConnected(
    address,
    provider,
    shouldVerify = false
) {

    const walletName =
        getConnectedWalletName();


    showConnectedWallet(
        address,
        walletName
    );


    /*
       As soon as Reown reports a connection,
       the CONNECT WALLET button disappears.
    */

    setWalletStatus(
        "WALLET CONNECTED",
        "success"
    );


    if (
        shouldVerify &&
        lastVerifiedAddress !== address
    ) {

        try {

            await verifyConnectedWallet(
                provider,
                address
            );

        }
        catch (error) {

            console.error(
                "Wallet verification error:",
                error
            );


            /*
               Wallet itself remains connected.
               Only verification failed/cancelled.
            */

            showConnectedWallet(
                address,
                walletName
            );


            setWalletStatus(
                error?.message ||
                "WALLET CONNECTED — VERIFICATION NOT COMPLETED.",
                "error"
            );
        }
    }
}


/* =====================================================
   CONNECT WALLET
===================================================== */

async function connectAndVerifyWallet() {

    if (
        connectionInProgress
    ) {

        return;
    }


    if (
        !getGrembleSessionToken()
    ) {

        setWalletStatus(
            "CONNECT TELEGRAM FIRST.",
            "error"
        );


        return;
    }


    connectionInProgress =
        true;


    if (
        walletConnectButton
    ) {

        walletConnectButton.disabled =
            true;
    }


    try {

        /*
           FIRST CHECK:
           wallet may already be connected.
        */

        const existingAddress =
            getConnectedWalletAddress();


        const existingProvider =
            getSolanaProvider();


        if (
            existingAddress &&
            existingProvider
        ) {

            await handleWalletConnected(
                existingAddress,
                existingProvider,
                true
            );


            return;
        }


        setWalletStatus(
            "SELECT YOUR WALLET...",
            "loading"
        );


        /*
           IMPORTANT FIX:

           DO NOT AWAIT modal.open().

           Reown keeps the modal lifecycle separate from
           the wallet connection state.
        */

        grembleWalletModal.open({

            view:
                "Connect",

            namespace:
                "solana"
        });


        /*
           Wait until Reown actually gives us both
           the Solana address and provider.
        */

        const {
            address,
            provider
        } =
            await waitForWalletConnection();


        /*
           Immediately switch UI to CONNECTED.
        */

        await handleWalletConnected(
            address,
            provider,
            true
        );


        /*
           Close modal after wallet has connected.
        */

        try {

            grembleWalletModal
                .close();

        }
        catch {
            // nothing needed
        }

    }
    catch (error) {

        console.error(
            "Wallet connection error:",
            error
        );


        /*
           If Reown connected despite another
           later error, still show connected state.
        */

        const address =
            getConnectedWalletAddress();


        const provider =
            getSolanaProvider();


        if (
            address &&
            provider
        ) {

            showConnectedWallet(
                address,
                getConnectedWalletName()
            );


            setWalletStatus(
                "WALLET CONNECTED",
                "success"
            );

        }
        else {

            showDisconnectedWallet();


            setWalletStatus(
                error?.message ||
                "Could not connect wallet.",
                "error"
            );
        }
    }
    finally {

        connectionInProgress =
            false;


        if (
            walletConnectButton
        ) {

            walletConnectButton.disabled =
                false;
        }
    }
}


/* =====================================================
   DISCONNECT WALLET

   Does NOT delete the last verified wallet
   from Supabase.
===================================================== */

async function disconnectWallet() {

    if (
        walletDisconnectButton
    ) {

        walletDisconnectButton.disabled =
            true;
    }


    try {

        await grembleWalletModal
            .adapter
            ?.connectionControllerClient
            ?.disconnect();


        lastVerifiedAddress =
            "";


        showDisconnectedWallet();


        setWalletStatus(
            "WALLET DISCONNECTED.",
            "success"
        );

    }
    catch (error) {

        console.error(
            "Wallet disconnect error:",
            error
        );


        /*
           Check whether it actually disconnected.
        */

        const address =
            getConnectedWalletAddress();


        if (
            !address
        ) {

            showDisconnectedWallet();


            setWalletStatus(
                "WALLET DISCONNECTED.",
                "success"
            );

        }
        else {

            showConnectedWallet(
                address,
                getConnectedWalletName()
            );


            setWalletStatus(
                "COULD NOT DISCONNECT WALLET.",
                "error"
            );
        }
    }
    finally {

        if (
            walletDisconnectButton
        ) {

            walletDisconnectButton.disabled =
                false;
        }
    }
}


/* =====================================================
   RESTORE UI AFTER REFRESH
===================================================== */

async function restoreWalletUi() {

    /*
       Reown may need a short moment after page load
       to restore its saved session.
    */

    for (
        let attempt = 0;
        attempt < 20;
        attempt++
    ) {

        const address =
            getConnectedWalletAddress();


        const provider =
            getSolanaProvider();


        if (
            address &&
            provider
        ) {

            showConnectedWallet(
                address,
                getConnectedWalletName()
            );


            setWalletStatus(
                "WALLET CONNECTED",
                "success"
            );


            return;
        }


        await sleep(
            250
        );
    }


    showDisconnectedWallet();


    setWalletStatus(
        "",
        ""
    );
}


/* =====================================================
   WATCH PROVIDERS

   Reown officially exposes providers by namespace.
===================================================== */

try {

    grembleWalletModal
        .subscribeProviders(
            providers => {

                const provider =
                    providers?.["solana"];


                const address =
                    getConnectedWalletAddress();


                if (
                    provider &&
                    address
                ) {

                    showConnectedWallet(
                        address,
                        getConnectedWalletName()
                    );


                    setWalletStatus(
                        "WALLET CONNECTED",
                        "success"
                    );

                }
                else if (
                    !connectionInProgress
                ) {

                    const currentAddress =
                        getConnectedWalletAddress();


                    if (
                        !currentAddress
                    ) {

                        showDisconnectedWallet();
                    }
                }
            }
        );

}
catch (error) {

    console.warn(
        "Could not subscribe to wallet providers:",
        error
    );
}


/* =====================================================
   WATCH PROVIDER STATE
===================================================== */

try {

    grembleWalletModal
        .subscribeProvider(
            state => {

                const address =
                    cleanText(
                        state?.address
                    );


                if (
                    state?.isConnected &&
                    address
                ) {

                    showConnectedWallet(
                        address,
                        getConnectedWalletName()
                    );


                    setWalletStatus(
                        "WALLET CONNECTED",
                        "success"
                    );

                }
                else if (
                    !connectionInProgress &&
                    state?.isConnected === false
                ) {

                    showDisconnectedWallet();
                }
            }
        );

}
catch (error) {

    console.warn(
        "Could not subscribe to provider state:",
        error
    );
}


/* =====================================================
   EVENTS
===================================================== */

if (
    walletConnectButton
) {

    walletConnectButton.addEventListener(
        "click",
        connectAndVerifyWallet
    );
}


if (
    walletDisconnectButton
) {

    walletDisconnectButton.addEventListener(
        "click",
        disconnectWallet
    );
}


/* =====================================================
   START
===================================================== */

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        restoreWalletUi
    );

}
else {

    restoreWalletUi();
}