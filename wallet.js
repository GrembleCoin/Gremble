/* =====================================================
   GREMBLE WALLET CONNECTION
   File: wallet.js

   IMPORTANT:
   - Wallet connection only
   - Message signing only
   - NO transactions
   - NO access to funds
   - NO seed phrase / private key
===================================================== */


/* =====================================================
   IMPORT REOWN APPKIT

   We use ESM modules directly because the Gremble site
   is a static GitHub Pages website without npm/Vite.
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
   WEBSITE METADATA
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
   SOLANA ADAPTER
===================================================== */

const solanaAdapter =
    new SolanaAdapter();


/* =====================================================
   CREATE REOWN APPKIT

   We only need Solana account verification because
   GREMBLE will live on Solana.

   Users still see this simply as CONNECT WALLET.
===================================================== */

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

   These elements will be added to index.html next.
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
   HELPERS
===================================================== */

function cleanText(value) {

    return typeof value === "string"
        ? value.trim()
        : "";
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

    if (value.length <= 14) {
        return value;
    }

    return (
        value.slice(0, 6) +
        "..." +
        value.slice(-6)
    );
}


function setWalletStatus(
    message,
    type = ""
) {

    if (!walletStatus) {
        return;
    }


    walletStatus.textContent =
        message;


    walletStatus.classList.remove(
        "loading",
        "success",
        "error"
    );


    if (type) {

        walletStatus.classList.add(
            type
        );
    }
}


/* =====================================================
   RANDOM NONCE

   Used inside the message that the user signs.
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
   READ CURRENT SOLANA PROVIDER
===================================================== */

function getSolanaProvider() {

    try {

        const providers =
            grembleWalletModal
                .getProviders();

        return (
            providers?.solana ||
            null
        );

    }
    catch (error) {

        console.error(
            "Could not read Solana provider:",
            error
        );

        return null;
    }
}


/* =====================================================
   READ CURRENT WALLET ADDRESS
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
   BUILD EXACT MESSAGE

   IMPORTANT:
   This must match wallet-verify index.ts exactly.
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
   READ TELEGRAM ID FROM SESSION JWT

   We ONLY read the public payload locally so the exact
   message matches what the server verifies.

   The backend still verifies the JWT cryptographically.
===================================================== */

function getTelegramIdFromSession() {

    const token =
        getGrembleSessionToken();


    if (!token) {

        throw new Error(
            "Connect Telegram first."
        );
    }


    const parts =
        token.split(".");


    if (parts.length !== 3) {

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
   NORMALIZE SIGNATURE

   Solana wallets can return the signature in slightly
   different shapes. Backend expects base58.
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
        "Wallet returned an unsupported signature format."
    );
}


/* =====================================================
   SHOW CONNECTED WALLET
===================================================== */

function showConnectedWallet(
    address,
    providerName
) {

    if (walletConnectedAddress) {

        walletConnectedAddress.textContent =
            shortenAddress(
                address
            );

        walletConnectedAddress.title =
            address;
    }


    if (walletConnectedProvider) {

        walletConnectedProvider.textContent =
            providerName ||
            "Wallet";
    }


    if (walletConnectedBox) {

        walletConnectedBox.hidden =
            false;
    }


    if (walletConnectButton) {

        walletConnectButton.hidden =
            true;
    }


    if (walletDisconnectButton) {

        walletDisconnectButton.hidden =
            false;
    }
}


/* =====================================================
   SHOW DISCONNECTED STATE
===================================================== */

function showDisconnectedWallet() {

    if (walletConnectedBox) {

        walletConnectedBox.hidden =
            true;
    }


    if (walletConnectButton) {

        walletConnectButton.hidden =
            false;
    }


    if (walletDisconnectButton) {

        walletDisconnectButton.hidden =
            true;
    }


    if (walletConnectedAddress) {

        walletConnectedAddress.textContent =
            "";
    }


    if (walletConnectedProvider) {

        walletConnectedProvider.textContent =
            "";
    }
}


/* =====================================================
   WAIT FOR SOLANA CONNECTION
===================================================== */

function waitForSolanaConnection(
    timeoutMs = 120000
) {

    return new Promise(
        (resolve, reject) => {

            let finished =
                false;


            const finishSuccess =
                () => {

                    if (finished) {
                        return;
                    }


                    const provider =
                        getSolanaProvider();

                    const address =
                        getConnectedWalletAddress();


                    if (
                        !provider ||
                        !address
                    ) {

                        return;
                    }


                    finished =
                        true;


                    clearTimeout(
                        timeout
                    );


                    if (unsubscribeProvider) {

                        unsubscribeProvider();
                    }


                    resolve({
                        provider,
                        address
                    });
                };


            let unsubscribeProvider =
                null;


            try {

                unsubscribeProvider =
                    grembleWalletModal
                        .subscribeProvider(
                            () => {

                                finishSuccess();
                            }
                        );

            }
            catch (error) {

                console.warn(
                    "Provider subscription unavailable:",
                    error
                );
            }


            const interval =
                setInterval(
                    () => {

                        if (finished) {

                            clearInterval(
                                interval
                            );

                            return;
                        }


                        finishSuccess();

                    },
                    500
                );


            const timeout =
                setTimeout(
                    () => {

                        if (finished) {
                            return;
                        }


                        finished =
                            true;


                        clearInterval(
                            interval
                        );


                        if (unsubscribeProvider) {

                            unsubscribeProvider();
                        }


                        reject(
                            new Error(
                                "Wallet connection timed out."
                            )
                        );

                    },
                    timeoutMs
                );


            finishSuccess();
        }
    );
}


/* =====================================================
   VERIFY WALLET WITH GREMBLE BACKEND
===================================================== */

async function verifyConnectedWallet(
    provider,
    walletAddress
) {

    const sessionToken =
        getGrembleSessionToken();


    if (!sessionToken) {

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
        "CHECK YOUR WALLET AND SIGN THE VERIFICATION MESSAGE.",
        "loading"
    );


    /*
       IMPORTANT:
       signMessage only.

       There is NO signTransaction here.
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


    return result;
}


/* =====================================================
   CONNECT + VERIFY
===================================================== */

async function connectAndVerifyWallet() {

    const sessionToken =
        getGrembleSessionToken();


    if (!sessionToken) {

        setWalletStatus(
            "CONNECT TELEGRAM FIRST.",
            "error"
        );

        return;
    }


    if (walletConnectButton) {

        walletConnectButton.disabled =
            true;
    }


    try {

        setWalletStatus(
            "SELECT YOUR WALLET...",
            "loading"
        );


        /*
           Open normal Reown wallet modal.

           We target the Solana namespace because the verified
           account must be usable for $GREMBLE on Solana.
        */

        await grembleWalletModal.open({
            view:
                "Connect",

            namespace:
                "solana"
        });


        const {
            provider,
            address
        } =
            await waitForSolanaConnection();


        const result =
            await verifyConnectedWallet(
                provider,
                address
            );


        const providerName =
            cleanText(
                result?.wallet?.provider
            ) ||
            getConnectedWalletName();


        showConnectedWallet(
            address,
            providerName
        );


        setWalletStatus(
            "WALLET VERIFIED.",
            "success"
        );


    }
    catch (error) {

        console.error(
            "Wallet connection error:",
            error
        );


        /*
           User cancelling the wallet modal is not dangerous.
           We simply return to disconnected state.
        */

        setWalletStatus(
            error?.message ||
            "Could not connect wallet.",
            "error"
        );


    }
    finally {

        if (walletConnectButton) {

            walletConnectButton.disabled =
                false;
        }
    }
}


/* =====================================================
   DISCONNECT WALLET

   IMPORTANT:
   This only disconnects the current wallet session.

   The last VERIFIED wallet stays saved in Supabase.
===================================================== */

async function disconnectWallet() {

    if (walletDisconnectButton) {

        walletDisconnectButton.disabled =
            true;
    }


    try {

        await grembleWalletModal
            .adapter
            ?.connectionControllerClient
            ?.disconnect();


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


        setWalletStatus(
            "COULD NOT DISCONNECT WALLET.",
            "error"
        );

    }
    finally {

        if (walletDisconnectButton) {

            walletDisconnectButton.disabled =
                false;
        }
    }
}


/* =====================================================
   RESTORE CURRENT WALLET CONNECTION

   Reown may restore a wallet session automatically.
   This does NOT re-write the database.

   Database changes happen only after a fresh successful
   message verification.
===================================================== */

function restoreWalletUi() {

    try {

        const provider =
            getSolanaProvider();

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
                "WALLET CONNECTED.",
                "success"
            );


            return;
        }


        showDisconnectedWallet();

    }
    catch (error) {

        console.error(
            "Wallet restore error:",
            error
        );


        showDisconnectedWallet();
    }
}


/* =====================================================
   WATCH WALLET CHANGES
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

                }
                else {

                    const currentAddress =
                        getConnectedWalletAddress();


                    if (!currentAddress) {

                        showDisconnectedWallet();
                    }
                }
            }
        );

}
catch (error) {

    console.warn(
        "Wallet provider subscription failed:",
        error
    );
}


/* =====================================================
   EVENTS
===================================================== */

if (walletConnectButton) {

    walletConnectButton.addEventListener(
        "click",
        connectAndVerifyWallet
    );
}


if (walletDisconnectButton) {

    walletDisconnectButton.addEventListener(
        "click",
        disconnectWallet
    );
}


/* =====================================================
   START
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        restoreWalletUi();
    }
);