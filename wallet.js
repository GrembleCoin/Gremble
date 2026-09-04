/* =====================================================
   GREMBLE WALLET
   FULL wallet.js

   STATES:

   1. NO WALLET
      -> CONNECT WALLET

   2. WALLET CONNECTED LOCALLY
      -> WALLET CONNECTED
      -> ownership verification starts

   3. WALLET VERIFIED
      -> WALLET VERIFIED
      -> saved in Supabase
      -> visible on every device after Telegram login

   IMPORTANT:
   - Telegram profile is the cross-device identity
   - Supabase verified wallet is the source of truth
   - Reown local connection is device/browser specific
   - Message signature only
   - NO transaction
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


let profileLoading =
    false;


let profileLoaded =
    false;


let localWalletAddress =
    "";


let localWalletProvider =
    "";


let activeSolanaProvider =
    null;


let savedWalletAddress =
    "";


let savedWalletProvider =
    "";


let savedWalletVerifiedAt =
    "";


let loadedSessionToken =
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


function getSessionToken() {

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
   WALLET ICON
===================================================== */

function installWalletIcon() {

    if (
        !walletConnectButton
    ) {

        return;
    }


    const icon =
        walletConnectButton.querySelector(
            ".wallet-button-icon, .wallet-connect-icon"
        );


    if (
        !icon
    ) {

        return;
    }


    icon.innerHTML = `
        <svg
            viewBox="0 0 24 24"
            width="19"
            height="19"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
        >
            <path
                d="
                    M5 6.5
                    C5 5.12 6.12 4 7.5 4
                    H17.5
                    C18.88 4 20 5.12 20 6.5
                    V8
                    H7.5
                    C6.12 8 5 9.12 5 10.5
                    V6.5
                "
            ></path>

            <path
                d="
                    M5 10.5
                    C5 9.12 6.12 8 7.5 8
                    H20
                    V19
                    C20 20.1 19.1 21 18 21
                    H7.5
                    C6.12 21 5 19.88 5 18.5
                    V10.5
                "
            ></path>

            <path
                d="
                    M15.5 12.5
                    H21
                    V16.5
                    H15.5
                    C14.12 16.5 13 15.6 13 14.5
                    C13 13.4 14.12 12.5 15.5 12.5
                "
            ></path>

            <circle
                cx="16"
                cy="14.5"
                r=".7"
                fill="currentColor"
                stroke="none"
            ></circle>
        </svg>
    `;


    icon.setAttribute(
        "aria-hidden",
        "true"
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
   REOWN PROVIDER
===================================================== */

function getSolanaProvider() {

    if (
        activeSolanaProvider
    ) {

        return activeSolanaProvider;
    }


    try {

        const provider =
            grembleWalletModal
                .getWalletProvider();


        if (
            provider
        ) {

            activeSolanaProvider =
                provider;


            return provider;
        }

    }
    catch (error) {

        console.warn(
            "Could not read active Solana provider:",
            error
        );
    }


    return null;
}


/* =====================================================
   REOWN ADDRESS
===================================================== */

function getModalAddress() {

    try {

        return cleanText(
            grembleWalletModal
                .getAddress()
        );

    }
    catch {

        return "";
    }
}


function getConnectedWalletAddress() {

    return (
        getModalAddress() ||
        cleanText(
            localWalletAddress
        )
    );
}


/* =====================================================
   PROVIDER NAME
===================================================== */

function getConnectedWalletName() {

    try {

        const walletInfo =
            grembleWalletModal
                .getWalletInfo();


        const name =
            cleanText(
                walletInfo?.name
            );


        if (
            name
        ) {

            localWalletProvider =
                name;


            return name;
        }

    }
    catch {

    }


    return (
        cleanText(
            localWalletProvider
        ) ||
        "Wallet"
    );
}


/* =====================================================
   HIDE CONNECT BUTTON
===================================================== */

function hideConnectButton() {

    if (
        !walletConnectButton
    ) {

        return;
    }


    walletConnectButton.hidden =
        true;


    walletConnectButton.style.display =
        "none";


    walletConnectButton.disabled =
        false;
}


/* =====================================================
   SHOW CONNECT BUTTON
===================================================== */

function showConnectButton() {

    if (
        savedWalletAddress
    ) {

        showVerifiedWallet();

        return;
    }


    if (
        localWalletAddress
    ) {

        showLocalConnectedWallet();

        return;
    }


    if (
        walletConnectButton
    ) {

        walletConnectButton.hidden =
            false;


        walletConnectButton.style.removeProperty(
            "display"
        );


        walletConnectButton.disabled =
            false;
    }


    if (
        walletConnectedBox
    ) {

        walletConnectedBox.hidden =
            true;


        walletConnectedBox.style.display =
            "none";
    }


    if (
        walletDisconnectButton
    ) {

        walletDisconnectButton.hidden =
            true;
    }
}


/* =====================================================
   SHOW WALLET BOX
===================================================== */

function showWalletBox(
    address,
    label,
    provider,
    actionText
) {

    const cleanAddress =
        cleanText(address);


    if (
        !cleanAddress
    ) {

        return;
    }


    hideConnectButton();


    if (
        walletConnectedBox
    ) {

        walletConnectedBox.hidden =
            false;


        walletConnectedBox.style.removeProperty(
            "display"
        );
    }


    if (
        walletConnectedProvider
    ) {

        const walletName =
            cleanText(
                provider
            ) ||
            "Wallet";


        walletConnectedProvider.textContent =
            `${label} · ${walletName}`;
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
        walletDisconnectButton
    ) {

        walletDisconnectButton.hidden =
            false;


        walletDisconnectButton.textContent =
            actionText;
    }
}


/* =====================================================
   LOCAL CONNECTED STATE
===================================================== */

function showLocalConnectedWallet() {

    const address =
        cleanText(
            localWalletAddress
        );


    if (
        !address
    ) {

        return;
    }


    showWalletBox(
        address,
        verificationInProgress
            ? "VERIFYING WALLET"
            : "WALLET CONNECTED",
        getConnectedWalletName(),
        "DISCONNECT"
    );
}


/* =====================================================
   VERIFIED STATE
===================================================== */

function showVerifiedWallet() {

    const address =
        cleanText(
            savedWalletAddress
        );


    if (
        !address
    ) {

        return;
    }


    showWalletBox(
        savedWalletAddress,
        "WALLET VERIFIED",
        savedWalletProvider,
        "CHANGE WALLET"
    );
}


/* =====================================================
   CENTRAL RENDER
===================================================== */

function renderWalletUi() {

    const sessionToken =
        getSessionToken();


    if (
        !sessionToken
    ) {

        savedWalletAddress =
            "";

        savedWalletProvider =
            "";

        savedWalletVerifiedAt =
            "";

        profileLoaded =
            false;


        showConnectButton();


        return;
    }


    if (
        savedWalletAddress
    ) {

        showVerifiedWallet();

        return;
    }


    if (
        localWalletAddress
    ) {

        showLocalConnectedWallet();

        return;
    }


    if (
        profileLoading ||
        !profileLoaded
    ) {

        hideConnectButton();


        if (
            walletConnectedBox
        ) {

            walletConnectedBox.hidden =
                true;


            walletConnectedBox.style.display =
                "none";
        }


        return;
    }


    showConnectButton();
}


/* =====================================================
   NONCE
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
        getSessionToken();


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
                                    .padStart(
                                        2,
                                        "0"
                                    )
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
            String(
                telegramId
            ).trim() === ""
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
        typeof signatureResult ===
            "object" &&
        "signature" in
            signatureResult
    ) {

        signature =
            signatureResult.signature;
    }


    if (
        typeof signature ===
            "string"
    ) {

        return signature;
    }


    if (
        signature instanceof
            Uint8Array
    ) {

        return bs58.encode(
            signature
        );
    }


    if (
        Array.isArray(
            signature
        )
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

                signature.byteOffset ||
                    0,

                signature.byteLength
            )
        );
    }


    throw new Error(
        "Unsupported wallet signature format."
    );
}


/* =====================================================
   LOAD SAVED WALLET FROM SUPABASE
===================================================== */

async function loadSavedWalletFromProfile(
    force = false
) {

    const sessionToken =
        getSessionToken();


    if (
        !sessionToken
    ) {

        savedWalletAddress =
            "";

        savedWalletProvider =
            "";

        savedWalletVerifiedAt =
            "";

        profileLoaded =
            false;

        loadedSessionToken =
            "";


        renderWalletUi();


        return null;
    }


    if (
        profileLoading
    ) {

        return null;
    }


    if (
        !force &&
        profileLoaded &&
        loadedSessionToken ===
            sessionToken
    ) {

        renderWalletUi();


        return {
            address:
                savedWalletAddress,

            provider:
                savedWalletProvider,

            verifiedAt:
                savedWalletVerifiedAt
        };
    }


    profileLoading =
        true;


    renderWalletUi();


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
                    },

                    cache:
                        "no-store"
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
            !response.ok
        ) {

            throw new Error(
                result?.error ||
                "Could not load member profile."
            );
        }


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


        savedWalletVerifiedAt =
            cleanText(
                member.wallet_verified_at
            );


        profileLoaded =
            true;


        loadedSessionToken =
            sessionToken;


        return {
            address:
                savedWalletAddress,

            provider:
                savedWalletProvider,

            verifiedAt:
                savedWalletVerifiedAt
        };

    }
    catch (error) {

        console.warn(
            "Could not load saved wallet:",
            error
        );


        return null;

    }
    finally {

        profileLoading =
            false;


        renderWalletUi();
    }
}


/* =====================================================
   WAIT FOR LOCAL WALLET
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
            address
        ) {

            localWalletAddress =
                address;


            localWalletProvider =
                getConnectedWalletName();


            renderWalletUi();
        }


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
            200
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

        return null;
    }


    verificationInProgress =
        true;


    renderWalletUi();


    try {

        const sessionToken =
            getSessionToken();


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


        const signatureResult =
            await provider
                .signMessage(
                    encodedMessage
                );


        const signature =
            signatureToBase58(
                signatureResult
            );


        const providerName =
            getConnectedWalletName();


        localWalletProvider =
            providerName;


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
                                providerName,

                            signature,

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
            result?.success !== true ||
            result?.verified !== true
        ) {

            throw new Error(
                result?.error ||
                "Wallet verification failed."
            );
        }


        savedWalletAddress =
            walletAddress;


        savedWalletProvider =
            providerName;


        savedWalletVerifiedAt =
            cleanText(
                result?.wallet_verified_at
            ) ||
            cleanText(
                result?.wallet?.verified_at
            ) ||
            new Date()
                .toISOString();


        profileLoaded =
            true;


        loadedSessionToken =
            sessionToken;


        localWalletAddress =
            walletAddress;


        verificationInProgress =
            false;


        renderWalletUi();


        setWalletStatus(
            "",
            ""
        );


        await loadSavedWalletFromProfile(
            true
        );


        return result;

    }
    catch (error) {

        verificationInProgress =
            false;


        renderWalletUi();


        throw error;

    }
    finally {

        verificationInProgress =
            false;


        renderWalletUi();
    }
}


/* =====================================================
   CONNECT + VERIFY
===================================================== */

async function connectAndVerifyWallet() {

    if (
        connectionInProgress
    ) {

        return;
    }


    if (
        !getSessionToken()
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


        localWalletProvider =
            getConnectedWalletName();


        renderWalletUi();


        setWalletStatus(
            "WALLET CONNECTED. VERIFYING OWNERSHIP...",
            "loading"
        );


        await verifyConnectedWallet(
            provider,
            address
        );


        try {

            grembleWalletModal
                .close();

        }
        catch {

        }

    }
    catch (error) {

        console.error(
            "Wallet connection error:",
            error
        );


        renderWalletUi();


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


        renderWalletUi();
    }
}


/* =====================================================
   DISCONNECT LOCAL WALLET
===================================================== */

async function disconnectLocalWallet() {

    if (
        walletDisconnectButton
    ) {

        walletDisconnectButton.disabled =
            true;
    }


    try {

        const controller =
            grembleWalletModal
                .adapter
                ?.connectionControllerClient;


        if (
            controller?.disconnect
        ) {

            await controller
                .disconnect();
        }


        localWalletAddress =
            "";


        localWalletProvider =
            "";


        activeSolanaProvider =
            null;


        renderWalletUi();


        setWalletStatus(
            "",
            ""
        );

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


        renderWalletUi();
    }
}


/* =====================================================
   CHANGE WALLET
===================================================== */

async function changeWallet() {

    if (
        connectionInProgress ||
        verificationInProgress
    ) {

        return;
    }


    setWalletStatus(
        "SELECT A NEW WALLET...",
        "loading"
    );


    /*
       IMPORTANT:
       We DO NOT clear savedWalletAddress here.

       The old verified wallet remains in Supabase until
       the new wallet is successfully verified.
    */

    try {

        const controller =
            grembleWalletModal
                .adapter
                ?.connectionControllerClient;


        if (
            controller?.disconnect
        ) {

            await controller
                .disconnect();
        }

    }
    catch (error) {

        console.warn(
            "Could not disconnect previous local wallet:",
            error
        );
    }


    localWalletAddress =
        "";


    localWalletProvider =
        "";


    activeSolanaProvider =
        null;


    renderWalletUi();


    await sleep(
        300
    );


    try {

        grembleWalletModal.open({

            view:
                "Connect",

            namespace:
                "solana"
        });

    }
    catch (error) {

        console.error(
            "Could not open wallet selector:",
            error
        );


        setWalletStatus(
            "COULD NOT OPEN WALLET SELECTOR.",
            "error"
        );


        return;
    }


    try {

        const connection =
            await waitForWalletConnection();


        const newAddress =
            connection.address;


        const newProvider =
            connection.provider;


        if (
            !newAddress ||
            !newProvider
        ) {

            throw new Error(
                "New wallet connection failed."
            );
        }


        /*
           If user reconnects the same wallet,
           no database change is necessary.
        */

        if (
            newAddress ===
            savedWalletAddress
        ) {

            localWalletAddress =
                newAddress;


            localWalletProvider =
                getConnectedWalletName();


            renderWalletUi();


            setWalletStatus(
                "",
                ""
            );


            try {

                grembleWalletModal
                    .close();

            }
            catch {

            }


            return;
        }


        localWalletAddress =
            newAddress;


        localWalletProvider =
            getConnectedWalletName();


        renderWalletUi();


        setWalletStatus(
            "WALLET CONNECTED. VERIFYING OWNERSHIP...",
            "loading"
        );


        await verifyConnectedWallet(
            newProvider,
            newAddress
        );


        try {

            grembleWalletModal
                .close();

        }
        catch {

        }

    }
    catch (error) {

        console.error(
            "Wallet change error:",
            error
        );


        /*
           The old verified wallet is still stored.
           Reload it from Supabase so UI returns to the
           previous verified wallet if change failed.
        */

        await loadSavedWalletFromProfile(
            true
        );


        setWalletStatus(
            error?.message ||
            "WALLET CHANGE WAS NOT COMPLETED.",
            "error"
        );


        renderWalletUi();
    }
}


/* =====================================================
   WALLET ACTION
===================================================== */

async function walletAction() {

    const currentAddress =
        getConnectedWalletAddress();


    /*
       VERIFIED WALLET

       Always allow user to replace it.
    */

    if (
        savedWalletAddress
    ) {

        await changeWallet();

        return;
    }


    /*
       Local wallet connected but not verified.

       In this state DISCONNECT is correct.
    */

    if (
        currentAddress
    ) {

        await disconnectLocalWallet();

        return;
    }


    showConnectButton();
}


/* =====================================================
   RESTORE
===================================================== */

async function restoreWalletUi() {

    installWalletIcon();


    const sessionToken =
        getSessionToken();


    if (
        !sessionToken
    ) {

        loadedSessionToken =
            "";

        profileLoaded =
            false;

        savedWalletAddress =
            "";

        savedWalletProvider =
            "";

        savedWalletVerifiedAt =
            "";


        localWalletAddress =
            getModalAddress();


        renderWalletUi();


        return;
    }


    await loadSavedWalletFromProfile(
        true
    );


    for (
        let i = 0;
        i < 20;
        i++
    ) {

        const address =
            getModalAddress();


        if (
            address
        ) {

            localWalletAddress =
                address;


            localWalletProvider =
                getConnectedWalletName();


            break;
        }


        await sleep(
            200
        );
    }


    renderWalletUi();


    setWalletStatus(
        "",
        ""
    );
}


/* =====================================================
   TELEGRAM SESSION WATCH
===================================================== */

async function watchTelegramSession() {

    const currentToken =
        getSessionToken();


    if (
        currentToken !==
        loadedSessionToken
    ) {

        if (
            currentToken
        ) {

            profileLoaded =
                false;


            await loadSavedWalletFromProfile(
                true
            );


            renderWalletUi();

        }
        else {

            loadedSessionToken =
                "";

            profileLoaded =
                false;

            savedWalletAddress =
                "";

            savedWalletProvider =
                "";

            savedWalletVerifiedAt =
                "";


            renderWalletUi();
        }
    }
}


/* =====================================================
   REOWN PROVIDERS WATCH
===================================================== */

try {

    grembleWalletModal
        .subscribeProviders(
            providers => {

                const provider =
                    providers?.["solana"] ||
                    null;


                if (
                    provider
                ) {

                    activeSolanaProvider =
                        provider;
                }


                const address =
                    getModalAddress();


                if (
                    provider &&
                    address
                ) {

                    localWalletAddress =
                        address;


                    localWalletProvider =
                        getConnectedWalletName();


                    renderWalletUi();

                }
                else if (
                    !address
                ) {

                    localWalletAddress =
                        "";


                    localWalletProvider =
                        "";


                    activeSolanaProvider =
                        null;


                    renderWalletUi();
                }
            }
        );

}
catch (error) {

    console.warn(
        "Could not subscribe to providers:",
        error
    );
}


/* =====================================================
   REOWN PROVIDER STATE WATCH
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
                    state?.provider
                ) {

                    activeSolanaProvider =
                        state.provider;
                }


                if (
                    state?.isConnected &&
                    address
                ) {

                    localWalletAddress =
                        address;


                    localWalletProvider =
                        getConnectedWalletName();


                    renderWalletUi();


                    const sessionToken =
                        getSessionToken();


                    const provider =
                        state?.provider ||
                        getSolanaProvider();


                    if (
                        sessionToken &&
                        provider &&
                        !verificationInProgress &&
                        !connectionInProgress &&
                        !savedWalletAddress
                    ) {

                        setWalletStatus(
                            "WALLET CONNECTED. VERIFYING OWNERSHIP...",
                            "loading"
                        );


                        verifyConnectedWallet(
                            provider,
                            address
                        )
                            .catch(
                                error => {

                                    console.error(
                                        "Automatic wallet verification failed:",
                                        error
                                    );


                                    setWalletStatus(
                                        error?.message ||
                                        "Wallet connected but verification was not completed.",
                                        "error"
                                    );


                                    renderWalletUi();
                                }
                            );
                    }

                }
                else if (
                    state?.isConnected ===
                        false
                ) {

                    localWalletAddress =
                        "";


                    localWalletProvider =
                        "";


                    activeSolanaProvider =
                        null;


                    renderWalletUi();
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
   CHANGE / DISCONNECT BUTTON
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
   PUBLIC REFRESH FUNCTION
===================================================== */

window.grembleRefreshWalletUi =
    async function () {

        profileLoaded =
            false;


        await loadSavedWalletFromProfile(
            true
        );


        renderWalletUi();
    };


/* =====================================================
   START
===================================================== */

async function startWalletSystem() {

    installWalletIcon();


    await restoreWalletUi();


    setInterval(
        watchTelegramSession,
        1000
    );
}


if (
    document.readyState ===
        "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        startWalletSystem
    );

}
else {

    startWalletSystem();
}