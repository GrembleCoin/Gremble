/* =====================================================
   GREMBLE TELEGRAM LOGIN
   FILE: telegram.js
===================================================== */


/* =====================================================
   EDGE FUNCTION URL
===================================================== */

const TELEGRAM_LOGIN_ENDPOINT =
    "https://tffzjqeckoezursrvcpw.supabase.co/functions/v1/telegram-login";


/* =====================================================
   ELEMENTS
===================================================== */

const telegramLoginStatus =
    document.getElementById(
        "telegramLoginStatus"
    );

const telegramWidgetWrap =
    document.getElementById(
        "telegramWidgetWrap"
    );

const memberProfile =
    document.getElementById(
        "memberProfile"
    );

const memberTelegramName =
    document.getElementById(
        "memberTelegramName"
    );

const memberTelegramUsername =
    document.getElementById(
        "memberTelegramUsername"
    );

const memberXUsername =
    document.getElementById(
        "memberXUsername"
    );

const memberSolanaAddress =
    document.getElementById(
        "memberSolanaAddress"
    );

const memberSaveButton =
    document.getElementById(
        "memberSaveButton"
    );


/* =====================================================
   STATUS MESSAGE
===================================================== */

function setTelegramStatus(
    message,
    type = ""
) {

    if (!telegramLoginStatus) {
        return;
    }


    telegramLoginStatus.textContent =
        message;


    telegramLoginStatus.classList.remove(
        "loading",
        "error",
        "success"
    );


    if (type) {

        telegramLoginStatus.classList.add(
            type
        );

    }

}


/* =====================================================
   CLEAN TEXT
===================================================== */

function cleanText(value) {

    if (
        typeof value !== "string"
    ) {

        return "";

    }


    return value.trim();

}


/* =====================================================
   X USERNAME FORMAT
===================================================== */

function normalizeXUsername(value) {

    const username =
        cleanText(value);


    if (!username) {
        return "";
    }


    if (
        username.startsWith("@")
    ) {

        return username;

    }


    return `@${username}`;

}


/* =====================================================
   SHOW VERIFIED MEMBER
===================================================== */

function showVerifiedMember(member) {

    if (
        !member ||
        !memberProfile
    ) {

        return;

    }


    const telegramName =
        cleanText(
            member.telegram_name
        ) || "Gremble Member";


    const telegramUsername =
        cleanText(
            member.telegram_username
        );


    /* TELEGRAM NAME */

    if (memberTelegramName) {

        memberTelegramName.textContent =
            telegramName;

    }


    /* TELEGRAM USERNAME */

    if (memberTelegramUsername) {

        if (telegramUsername) {

            memberTelegramUsername.textContent =
                `@${telegramUsername.replace(
                    /^@/,
                    ""
                )}`;

        }
        else {

            memberTelegramUsername.textContent =
                "Telegram username not available";

        }

    }


    /* EXISTING X USERNAME */

    if (memberXUsername) {

        memberXUsername.value =
            normalizeXUsername(
                member.x_username || ""
            );

    }


    /* EXISTING SOLANA ADDRESS */

    if (memberSolanaAddress) {

        memberSolanaAddress.value =
            cleanText(
                member.solana_address || ""
            );

    }


    /* SHOW PROFILE */

    memberProfile.hidden =
        false;


    /* HIDE LOGIN BUTTON */

    if (telegramWidgetWrap) {

        telegramWidgetWrap.style.display =
            "none";

    }

}


/* =====================================================
   TELEGRAM CALLBACK

   Telegram Widget automatically calls:
   onTelegramAuth(user)
===================================================== */

window.onTelegramAuth =
async function onTelegramAuth(user) {


    /* CHECK TELEGRAM RESPONSE */

    if (
        !user ||
        typeof user !== "object"
    ) {

        setTelegramStatus(
            "Telegram did not return valid login information.",
            "error"
        );

        return;

    }


    /* SHOW VERIFYING STATUS */

    setTelegramStatus(
        "VERIFYING TELEGRAM LOGIN...",
        "loading"
    );


    try {


        /* =================================================
           SEND TELEGRAM DATA TO OUR SUPABASE EDGE FUNCTION
        ================================================= */

        const response =
            await fetch(
                TELEGRAM_LOGIN_ENDPOINT,
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(user)

                }
            );


        /* =================================================
           READ RESPONSE
        ================================================= */

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


        /* =================================================
           ERROR
        ================================================= */

        if (
            !response.ok ||
            !result ||
            result.success !== true
        ) {

            throw new Error(
                result?.error ||
                "Telegram verification failed."
            );

        }


        /* =================================================
           SUCCESS
        ================================================= */

        showVerifiedMember(
            result.member
        );


        setTelegramStatus(
            "TELEGRAM VERIFIED — WELCOME TO GREMBLE.",
            "success"
        );


        console.log(
            "Telegram login successful:",
            result.member
        );


    }
    catch (error) {


        console.error(
            "Telegram login error:",
            error
        );


        setTelegramStatus(
            error?.message ||
            "Could not verify Telegram login.",
            "error"
        );

    }

};


/* =====================================================
   PROFILE SAVE BUTTON

   IMPORTANT:
   We do NOT save X or Solana yet.

   First we need to create a secure member session.
   Otherwise someone could try to edit another user's
   profile by changing Telegram ID in browser requests.

   We will add secure saving in the next backend step.
===================================================== */

if (memberSaveButton) {

    memberSaveButton.addEventListener(
        "click",
        () => {

            setTelegramStatus(
                "Secure profile saving will be enabled in the next step.",
                "error"
            );

        }
    );

}


/* =====================================================
   INITIAL STATUS
===================================================== */

setTelegramStatus(
    "LOGIN WITH TELEGRAM TO CONTINUE"
);