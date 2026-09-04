/* =====================================================
   GREMBLE WALLET
   FULL wallet.js

   - Only ONE wallet state is shown at a time
   - CONNECT WALLET disappears after connection
   - Last verified wallet is loaded from member profile
   - Saved wallet can appear on another device
   - New verified wallet replaces the previous one
   - Message signature only
   - NO transactions
   - NO access to funds
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


const MEMBER_PROFILE_ENDPOINT =
    "https://tffzjqeckoezursrvcpw.supabase.co/functions/v1/member-profile";


const GREMBLE_SESSION_KEY =
    "gremble_session_token";


/* =====================================================
   METADATA
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
   ELEMENTS
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


/*
    Wallet currently connected through Reown
    on THIS browser/device.
*/

let localWalletAddress =
    "";


/*
    Last wallet verified and saved in Supabase.

    This can be shown on another device even if
    Reown is not connected there.
*/

let savedWalletAddress =
    "";


let savedWalletProvider =
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
   CURRENT SOLANA PROVIDER
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
   CURRENT REOWN ADDRESS
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
   CURRENT WALLET PROVIDER NAME
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
   UI
===================================================== */

function showConnectButton() {

    if (
        walletConnectButton
    ) {

        walletConnectButton.hidden =
            false;


        walletConnectButton.disabled =
            false;
    }


    if (
        walletConnectedBox
    ) {

        walletConnectedBox.hidden =
            true;
    }


    if (
        walletDisconnectButton
    ) {

        walletDisconnectButton.hidden =
            true;
    }
}


function showWalletBox(
    address,
    providerName,
    localConnection = false
) {

    const cleanAddress =
        cleanText(address);


    if (
        !cleanAddress
    ) {

        showConnectButton();

        return;
    }


    /*
        IMPORTANT:

        When wallet exists, CONNECT WALLET
        must NOT be visible.
    */

    if (
        walletConnectButton
    ) {

        walletConnectButton.hidden =
            true;


        walletConnectButton.disabled =
            false;
    }


    if (
        walletConnectedBox
    ) {

        walletConnectedBox.hidden =
            false;
    }


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
            cleanText(
                providerName
            ) ||
            "Wallet";
    }


    if (
        walletDisconnectButton
    ) {

        walletDisconnectButton.hidden =
            false;


        /*
            If wallet is physically connected in
            this browser -> DISCONNECT.

            If it is only remembered from Supabase
            on another device -> CHANGE WALLET.
        */

        walletDisconnectButton.textContent =
            localConnection
                ? "DISCONNECT"
                : "CHANGE";
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
   TELEGRAM ID
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
   SIGNATURE -> BASE58
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
   LOAD SAVED WALLET FROM GREMBLE PROFILE

   This is what allows:

   PC -> verify wallet
   PHONE -> same Telegram account -> see saved wallet
===================================================== */

async function loadSavedWalletFromProfile() {

    const sessionToken =
        getGrembleSessionToken();


    if (
        !sessionToken
    ) {

        savedWalletAddress =
            "";


        savedWalletProvider =
            "";


        return null;
    }


    try {

        const response =
            await fetch(
                MEMBER_PROFILE_ENDPOINT,
                {

                    method:
                        "GET",

                    headers: {

                        "Authorization":
                            `Bearer ${sessionToken}`,

                        "Content-Type":
                            "application/json"
                    }
                }
            );


        if (
            !response.ok
        ) {

            return null;
        }


        const result =
            await response.json();


        /*
            Supports both possible response styles:

            {
                member: {...}
            }

            or

            {
                profile: {...}
            }

            or direct object.
        */

        const member =
            result?.member ||
            result?.profile ||
            result?.data ||
            result ||
            {};


        savedWalletAddress =
            cleanText(
                member.wallet_address
            );


        savedWalletProvider =
            cleanText(
                member.wallet_provider
            );


        return {

            address:
                savedWalletAddress,

            provider:
                savedWalletProvider
        };

    }
    catch (error) {

        console.warn(
            "Could not load saved wallet:",
            error
        );


        return null;
    }
}


/* =====================================================
   WAIT FOR REOWN CONNECTION
===================================================== */

async function waitForWalletConnection(
    timeoutMs = 120000
) {

    const startedAt =
        Date.now();


    while (
        Date.now() - startedAt <
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

            localWalletAddress =
                address;


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
   VERIFY WALLET
===================================================== */

async function verifyConnectedWallet(
    provider,
    walletAddress
) {

    if (
        verificationInProgress
    ) {

        return null;
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


        /*
            New wallet becomes the ONE
            last verified wallet.
        */

        savedWalletAddress =
            walletAddress;


        savedWalletProvider =
            walletName;


        localWalletAddress =
            walletAddress;


        showWalletBox(
            walletAddress,
            walletName,
            true
        );


        setWalletStatus(
            "",
            ""
        );


        return result;

    }
    finally {

        verificationInProgress =
            false;
    }
}


/* =====================================================
   CONNECT + VERIFY NEW WALLET
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
            Wallet may already be connected
            through Reown.
        */

        let address =
            getConnectedWalletAddress();


        let provider =
            getSolanaProvider();


        if (
            !address ||
            !provider
        ) {

            setWalletStatus(
                "SELECT YOUR WALLET...",
                "loading"
            );


            /*
                IMPORTANT:

                Do NOT await modal.open().
            */

            grembleWalletModal.open({

                view:
                    "Connect",

                namespace:
                    "solana"
            });


            const connection =
                await waitForWalletConnection();


            address =
                connection.address;


            provider =
                connection.provider;
        }


        localWalletAddress =
            address;


        /*
            As soon as wallet connects,
            CONNECT button disappears.
        */

        showWalletBox(
            address,
            getConnectedWalletName(),
            true
        );


        setWalletStatus(
            "VERIFYING OWNERSHIP...",
            "loading"
        );


        /*
            Verify ownership.

            Successful verification overwrites
            previous wallet in Supabase.
        */

        await verifyConnectedWallet(
            provider,
            address
        );


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
            If wallet physically connected but
            signature was cancelled, don't pretend
            it is verified.
        */

        const currentAddress =
            getConnectedWalletAddress();


        if (
            savedWalletAddress
        ) {

            showWalletBox(
                savedWalletAddress,
                savedWalletProvider,
                currentAddress === savedWalletAddress
            );

        }
        else {

            showConnectButton();
        }


        setWalletStatus(
            error?.message ||
            "Wallet verification was not completed.",
            "error"
        );
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
   DISCONNECT LOCAL WALLET

   IMPORTANT:

   This does NOT delete wallet_address
   from Supabase.

   The last verified wallet stays remembered.
===================================================== */

async function disconnectLocalWallet() {

    if (
        walletDisconnectButton
    ) {

        walletDisconnectButton.disabled =
            true;
    }


    try {

        const connectionController =
            grembleWalletModal
                .adapter
                ?.connectionControllerClient;


        if (
            connectionController?.disconnect
        ) {

            await connectionController
                .disconnect();
        }


        localWalletAddress =
            "";


        /*
            Supabase wallet remains visible.
        */

        if (
            savedWalletAddress
        ) {

            showWalletBox(
                savedWalletAddress,
                savedWalletProvider,
                false
            );


            setWalletStatus(
                "",
                ""
            );

        }
        else {

            showConnectButton();


            setWalletStatus(
                "",
                ""
            );
        }

    }
    catch (error) {

        console.error(
            "Wallet disconnect error:",
            error
        );


        setWalletStatus(
            "COULD NOT DISCONNECT WALLET.",
            "error"
        );
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
   CHANGE WALLET

   Used when Supabase remembers a wallet,
   but no wallet is connected in this browser.
===================================================== */

async function changeWallet() {

    /*
        If another wallet session is somehow
        active, disconnect it first.
    */

    try {

        const currentAddress =
            getConnectedWalletAddress();


        if (
            currentAddress
        ) {

            const connectionController =
                grembleWalletModal
                    .adapter
                    ?.connectionControllerClient;


            if (
                connectionController?.disconnect
            ) {

                await connectionController
                    .disconnect();
            }
        }

    }
    catch (error) {

        console.warn(
            "Could not disconnect previous wallet:",
            error
        );
    }


    localWalletAddress =
        "";


    await sleep(
        200
    );


    await connectAndVerifyWallet();
}


/* =====================================================
   WALLET ACTION BUTTON

   Same button behaves differently depending on state.

   LOCAL WALLET:
   DISCONNECT

   SAVED-ONLY WALLET:
   CHANGE
===================================================== */

async function walletAction() {

    const currentAddress =
        getConnectedWalletAddress();


    if (
        currentAddress
    ) {

        await disconnectLocalWallet();

    }
    else {

        await changeWallet();
    }
}


/* =====================================================
   RESTORE WALLET STATE
===================================================== */

async function restoreWalletUi() {

    if (
        !getGrembleSessionToken()
    ) {

        showConnectButton();


        setWalletStatus(
            "",
            ""
        );


        return;
    }


    /*
        STEP 1:
        Load wallet remembered by Supabase.
    */

    await loadSavedWalletFromProfile();


    /*
        STEP 2:
        Give Reown time to restore local session.
    */

    let currentAddress =
        "";


    let currentProvider =
        null;


    for (
        let attempt = 0;
        attempt < 20;
        attempt++
    ) {

        currentAddress =
            getConnectedWalletAddress();


        currentProvider =
            getSolanaProvider();


        if (
            currentAddress &&
            currentProvider
        ) {

            break;
        }


        await sleep(
            250
        );
    }


    /*
        CASE 1:
        Reown has an active wallet in this browser.
    */

    if (
        currentAddress &&
        currentProvider
    ) {

        localWalletAddress =
            currentAddress;


        /*
            Only show it as verified automatically
            if it matches the saved verified wallet.
        */

        if (
            savedWalletAddress &&
            currentAddress === savedWalletAddress
        ) {

            showWalletBox(
                savedWalletAddress,
                savedWalletProvider ||
                getConnectedWalletName(),
                true
            );


            setWalletStatus(
                "",
                ""
            );


            return;
        }


        /*
            A different local wallet exists.

            We still show the last VERIFIED wallet,
            not an unverified one.
        */

        if (
            savedWalletAddress
        ) {

            showWalletBox(
                savedWalletAddress,
                savedWalletProvider,
                false
            );


            setWalletStatus(
                "",
                ""
            );


            return;
        }
    }


    /*
        CASE 2:
        No wallet locally connected,
        but Telegram profile has a saved wallet.

        This is the PC -> PHONE case.
    */

    if (
        savedWalletAddress
    ) {

        showWalletBox(
            savedWalletAddress,
            savedWalletProvider,
            false
        );


        setWalletStatus(
            "",
            ""
        );


        return;
    }


    /*
        CASE 3:
        User has never verified a wallet.
    */

    showConnectButton();


    setWalletStatus(
        "",
        ""
    );
}


/* =====================================================
   WATCH REOWN PROVIDERS
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

                    localWalletAddress =
                        address;


                    /*
                        Only automatically show it as
                        verified if it matches Supabase.
                    */

                    if (
                        savedWalletAddress &&
                        address === savedWalletAddress
                    ) {

                        showWalletBox(
                            savedWalletAddress,
                            savedWalletProvider ||
                            getConnectedWalletName(),
                            true
                        );


                        setWalletStatus(
                            "",
                            ""
                        );
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

                    localWalletAddress =
                        address;


                    if (
                        savedWalletAddress &&
                        address === savedWalletAddress
                    ) {

                        showWalletBox(
                            savedWalletAddress,
                            savedWalletProvider ||
                            getConnectedWalletName(),
                            true
                        );


                        setWalletStatus(
                            "",
                            ""
                        );
                    }

                }
                else if (
                    state?.isConnected === false
                ) {

                    localWalletAddress =
                        "";


                    /*
                        Keep last verified wallet visible.
                    */

                    if (
                        savedWalletAddress
                    ) {

                        showWalletBox(
                            savedWalletAddress,
                            savedWalletProvider,
                            false
                        );


                        setWalletStatus(
                            "",
                            ""
                        );

                    }
                    else if (
                        !connectionInProgress
                    ) {

                        showConnectButton();
                    }
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
   CONNECT BUTTON
===================================================== */

if (
    walletConnectButton
) {

    walletConnectButton.addEventListener(
        "click",
        connectAndVerifyWallet
    );
}


/* =====================================================
   DISCONNECT / CHANGE BUTTON
===================================================== */

if (
    walletDisconnectButton
) {

    walletDisconnectButton.addEventListener(
        "click",
        walletAction
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