/* =========================================================
   MY GREMBLE
   File: avatar.js
========================================================= */


/* =========================================================
   API
========================================================= */

const GREMBLE_AVATAR_ENDPOINT =
    "https://tffzjqeckoezursrvcpw.supabase.co/functions/v1/member-avatar";


/* =========================================================
   LOCAL CACHE
========================================================= */

const GREMBLE_AVATAR_CACHE_KEY =
    "gremble_avatar_cache_v1";


/* =========================================================
   DEFAULT AVATAR
========================================================= */

const DEFAULT_GREMBLE_AVATAR = {

    pose:
        "pose-01",

    outfit:
        "streetwear",

    hat:
        "none",

    background:
        "none",

    custom_background_path:
        null,

    custom_background_url:
        null,

    role:
        "Builder",

    energy:
        "Mischievous",

    here_for:
        "Community",

    message:
        "Building a better tomorrow with Gremble."
};


/* =========================================================
   ALLOWED VALUES
========================================================= */

const GREMBLE_POSES = [
    "pose-01",
    "pose-02",
    "pose-03",
    "pose-04",
    "pose-05",
    "pose-06",
    "pose-07"
];


const GREMBLE_OUTFITS = [
    "streetwear",
    "suit"
];


const GREMBLE_HATS = [
    "none",
    "cap-1",
    "cap-2",
    "cap-3",
    "cap-4",
    "cap-5"
];


const GREMBLE_BACKGROUNDS = [
    "none",
    "wall-1",
    "wall-2",
    "wall-3",
    "custom"
];


const GREMBLE_ROLES = [
    "Builder",
    "Explorer",
    "Dreamer"
];


const GREMBLE_ENERGIES = [
    "Mischievous",
    "Chill",
    "Bold"
];


const GREMBLE_HERE_FOR = [
    "Community",
    "Fun",
    "Future"
];


/* =========================================================
   HAT POSITION BY POSE

   Every pose has its own calibration.

   top:
       position from top of card

   left:
       horizontal center of cap

   width:
       base width of cap

   rotate:
       cap angle

   scaleX:
       horizontal correction

   scaleY:
       vertical correction
========================================================= */

const GREMBLE_HAT_POSITIONS = {

    "pose-01": {
        top: "4.6%",
        left: "50.0%",
        width: "45.0%",
        rotate: "-1.5deg",
        scaleX: 1.00,
        scaleY: 0.92
    },

    "pose-02": {
        top: "4.0%",
        left: "49.8%",
        width: "44.0%",
        rotate: "-0.5deg",
        scaleX: 1.00,
        scaleY: 0.91
    },

    "pose-03": {
        top: "4.8%",
        left: "49.2%",
        width: "44.5%",
        rotate: "-1.8deg",
        scaleX: 1.02,
        scaleY: 0.92
    },

    "pose-04": {
        top: "4.3%",
        left: "49.9%",
        width: "45.5%",
        rotate: "-1.2deg",
        scaleX: 1.00,
        scaleY: 0.91
    },

    "pose-05": {
        top: "3.8%",
        left: "49.7%",
        width: "45.0%",
        rotate: "-0.4deg",
        scaleX: 1.00,
        scaleY: 0.90
    },

    "pose-06": {
        top: "4.7%",
        left: "50.2%",
        width: "44.0%",
        rotate: "0.3deg",
        scaleX: 0.99,
        scaleY: 0.91
    },

    "pose-07": {
        top: "5.1%",
        left: "51.2%",
        width: "43.0%",
        rotate: "2.0deg",
        scaleX: 0.98,
        scaleY: 0.90
    }
};


/* =========================================================
   STATE
========================================================= */

let savedGrembleAvatar = {
    ...DEFAULT_GREMBLE_AVATAR
};


let editingGrembleAvatar = {
    ...DEFAULT_GREMBLE_AVATAR
};


let customBackgroundPreviewUrl =
    "";


let avatarLoadedForSession =
    false;


let lastAvatarSessionToken =
    "";


/* =========================================================
   ELEMENTS
========================================================= */

const myGremblePage =
    document.querySelector(
        ".my-gremble-page"
    );


const grembleCardCanvas =
    document.getElementById(
        "grembleCardCanvas"
    );


const grembleCardCharacter =
    document.getElementById(
        "grembleCardCharacter"
    );


const grembleCardBackground =
    document.getElementById(
        "grembleCardBackground"
    );


const grembleRoleValue =
    document.getElementById(
        "grembleRoleValue"
    );


const grembleEnergyValue =
    document.getElementById(
        "grembleEnergyValue"
    );


const grembleHereForValue =
    document.getElementById(
        "grembleHereForValue"
    );


const grembleMessageValue =
    document.getElementById(
        "grembleMessageValue"
    );


const editMyGrembleButton =
    document.getElementById(
        "editMyGrembleButton"
    );


const downloadMyGrembleButton =
    document.getElementById(
        "downloadMyGrembleButton"
    );


const shareMyGrembleButton =
    document.getElementById(
        "shareMyGrembleButton"
    );


/* =========================================================
   CLEAN TEXT
========================================================= */

function cleanAvatarText(
    value
) {

    return typeof value === "string"
        ? value.trim()
        : "";
}


/* =========================================================
   SESSION TOKEN

   We support several possible key names so this file
   remains compatible with the existing Telegram login.
========================================================= */

function getGrembleAvatarSessionToken() {

    const possibleKeys = [

        "gremble_telegram_session_token",

        "gremble_session_token",

        "telegram_session_token",

        "grembleSessionToken",

        "telegramSessionToken"
    ];


    for (
        const key
        of possibleKeys
    ) {

        const value =
            cleanAvatarText(
                localStorage.getItem(
                    key
                )
            );


        if (value) {

            return value;
        }
    }


    const helperNames = [

        "getTelegramSessionToken",

        "getGrembleSessionToken"
    ];


    for (
        const helperName
        of helperNames
    ) {

        try {

            const helper =
                window[
                    helperName
                ];


            if (
                typeof helper ===
                "function"
            ) {

                const token =
                    cleanAvatarText(
                        helper()
                    );


                if (token) {

                    return token;
                }
            }

        }
        catch {}
    }


    return "";
}


/* =========================================================
   LOCAL CACHE
========================================================= */

function loadAvatarCache() {

    try {

        const raw =
            localStorage.getItem(
                GREMBLE_AVATAR_CACHE_KEY
            );


        if (!raw) {

            return null;
        }


        const parsed =
            JSON.parse(
                raw
            );


        if (
            !parsed ||
            typeof parsed !== "object"
        ) {

            return null;
        }


        return parsed;

    }
    catch {

        return null;
    }
}


function saveAvatarCache(
    avatar
) {

    try {

        localStorage.setItem(
            GREMBLE_AVATAR_CACHE_KEY,
            JSON.stringify(
                avatar
            )
        );

    }
    catch {}
}


/* =========================================================
   NORMALIZE AVATAR
========================================================= */

function normalizeAvatar(
    avatar,
    customBackgroundUrl = null
) {

    const source =
        avatar &&
        typeof avatar === "object"
            ? avatar
            : {};


    return {

        pose:
            GREMBLE_POSES.includes(
                source.pose
            )
                ? source.pose
                : DEFAULT_GREMBLE_AVATAR.pose,


        outfit:
            GREMBLE_OUTFITS.includes(
                source.outfit
            )
                ? source.outfit
                : DEFAULT_GREMBLE_AVATAR.outfit,


        hat:
            GREMBLE_HATS.includes(
                source.hat
            )
                ? source.hat
                : DEFAULT_GREMBLE_AVATAR.hat,


        background:
            GREMBLE_BACKGROUNDS.includes(
                source.background
            )
                ? source.background
                : DEFAULT_GREMBLE_AVATAR.background,


        custom_background_path:
            cleanAvatarText(
                source.custom_background_path
            ) || null,


        custom_background_url:
            cleanAvatarText(
                customBackgroundUrl ||
                source.custom_background_url
            ) || null,


        role:
            GREMBLE_ROLES.includes(
                source.role
            )
                ? source.role
                : DEFAULT_GREMBLE_AVATAR.role,


        energy:
            GREMBLE_ENERGIES.includes(
                source.energy
            )
                ? source.energy
                : DEFAULT_GREMBLE_AVATAR.energy,


        here_for:
            GREMBLE_HERE_FOR.includes(
                source.here_for
            )
                ? source.here_for
                : DEFAULT_GREMBLE_AVATAR.here_for,


        message:
            typeof source.message ===
                "string"
                ? source.message
                    .trim()
                    .slice(
                        0,
                        200
                    )
                : DEFAULT_GREMBLE_AVATAR.message
    };
}


/* =========================================================
   CHARACTER IMAGE
========================================================= */

function getCharacterImage(
    avatar
) {

    const poseNumber =
        avatar.pose
            .replace(
                "pose-",
                ""
            );


    if (
        avatar.outfit ===
        "suit"
    ) {

        return (
            `suit-pose-${poseNumber}.png`
        );
    }


    return (
        `pose-${poseNumber}.png`
    );
}


/* =========================================================
   BACKGROUND IMAGE
========================================================= */

function getBackgroundImage(
    avatar
) {

    if (
        avatar.background ===
        "custom"
    ) {

        return (
            customBackgroundPreviewUrl ||
            avatar.custom_background_url ||
            ""
        );
    }


    if (
        avatar.background ===
        "none"
    ) {

        return "";
    }


    return (
        `${avatar.background}.png`
    );
}


/* =========================================================
   HAT IMAGE
========================================================= */

function getHatImage(
    avatar
) {

    if (
        avatar.hat ===
        "none"
    ) {

        return "";
    }


    return (
        `${avatar.hat}.png`
    );
}


/* =========================================================
   CREATE HAT LAYER
========================================================= */

function ensureMainHatLayer() {

    if (!grembleCardCanvas) {

        return null;
    }


    let hat =
        grembleCardCanvas
            .querySelector(
                ".gremble-card-hat"
            );


    if (!hat) {

        hat =
            document.createElement(
                "img"
            );


        hat.className =
            "gremble-card-hat";


        hat.id =
            "grembleCardHat";


        hat.alt =
            "";


        hat.hidden =
            true;


        grembleCardCanvas
            .appendChild(
                hat
            );
    }


    return hat;
}


/* =========================================================
   APPLY HAT POSITION
========================================================= */

function applyHatPosition(
    element,
    pose
) {

    if (!element) {

        return;
    }


    const config =
        GREMBLE_HAT_POSITIONS[
            pose
        ] ||
        GREMBLE_HAT_POSITIONS[
            "pose-01"
        ];


    /*
        Everything is set inline here so old CSS
        positioning cannot override the cap.
    */

    element.style.position =
        "absolute";


    element.style.top =
        config.top;


    element.style.left =
        config.left;


    element.style.width =
        config.width;


    element.style.height =
        "auto";


    element.style.maxWidth =
        "none";


    element.style.objectFit =
        "contain";


    element.style.zIndex =
        "6";


    element.style.pointerEvents =
        "none";


    element.style.transformOrigin =
        "50% 50%";


    element.style.transform =
        `translateX(-50%) rotate(${config.rotate}) scaleX(${config.scaleX}) scaleY(${config.scaleY})`;
}


/* =========================================================
   RENDER ONE CANVAS
========================================================= */

function renderAvatarCanvas(
    canvas,
    avatar
) {

    if (!canvas) {

        return;
    }


    const character =
        canvas.querySelector(
            ".gremble-card-character"
        );


    const background =
        canvas.querySelector(
            ".gremble-card-background"
        );


    let hat =
        canvas.querySelector(
            ".gremble-card-hat"
        );


    if (!hat) {

        hat =
            document.createElement(
                "img"
            );


        hat.className =
            "gremble-card-hat";


        hat.alt =
            "";


        canvas.appendChild(
            hat
        );
    }


    /* CHARACTER */

    if (character) {

        character.src =
            getCharacterImage(
                avatar
            );
    }


    /* BACKGROUND */

    const backgroundSrc =
        getBackgroundImage(
            avatar
        );


    if (background) {

        if (backgroundSrc) {

            background.src =
                backgroundSrc;


            background.hidden =
                false;


            background.classList
                .remove(
                    "is-hidden"
                );

        }
        else {

            background.hidden =
                true;


            background.classList
                .add(
                    "is-hidden"
                );
        }
    }


    /* HAT */

    const hatSrc =
        getHatImage(
            avatar
        );


    if (hatSrc) {

        hat.src =
            hatSrc;


        hat.hidden =
            false;


        hat.classList
            .remove(
                "is-hidden"
            );


        applyHatPosition(
            hat,
            avatar.pose
        );

    }
    else {

        hat.hidden =
            true;


        hat.classList
            .add(
                "is-hidden"
            );
    }
}


/* =========================================================
   RENDER MAIN CARD
========================================================= */

function renderSavedAvatar() {

    ensureMainHatLayer();


    renderAvatarCanvas(
        grembleCardCanvas,
        savedGrembleAvatar
    );


    if (grembleRoleValue) {

        grembleRoleValue.textContent =
            savedGrembleAvatar.role
                .toUpperCase();
    }


    if (grembleEnergyValue) {

        grembleEnergyValue.textContent =
            savedGrembleAvatar.energy
                .toUpperCase();
    }


    if (grembleHereForValue) {

        grembleHereForValue.textContent =
            savedGrembleAvatar.here_for
                .toUpperCase();
    }


    if (grembleMessageValue) {

        grembleMessageValue.textContent =
            savedGrembleAvatar.message ||
            "No message yet.";
    }
}


/* =========================================================
   EDITOR HTML
========================================================= */

function createGrembleEditor() {

    if (
        !myGremblePage ||
        document.getElementById(
            "myGrembleEditor"
        )
    ) {

        return;
    }


    const editor =
        document.createElement(
            "div"
        );


    editor.className =
        "my-gremble-editor";


    editor.id =
        "myGrembleEditor";


    editor.innerHTML = `

        <div class="my-gremble-editor-grid">


            <!-- ==========================================
                 LIVE PREVIEW
            =========================================== -->

            <div class="gremble-editor-preview">

                <div class="gremble-editor-preview-card">

                    <div
                        class="gremble-card-canvas"
                        id="grembleEditorCanvas"
                    >

                        <img
                            src="wall-1.png"
                            alt=""
                            class="gremble-card-background"
                            id="grembleEditorBackground"
                        >

                        <img
                            src="pose-01.png"
                            alt="Gremble preview"
                            class="gremble-card-character"
                            id="grembleEditorCharacter"
                        >

                        <img
                            src=""
                            alt=""
                            class="gremble-card-hat"
                            id="grembleEditorHat"
                            hidden
                        >

                        <div class="gremble-card-brand">

                            <span>
                                MY GREMBLE
                            </span>

                            <strong>
                                #GREMBLE
                            </strong>

                        </div>

                    </div>

                </div>

            </div>


            <!-- ==========================================
                 CONTROLS
            =========================================== -->

            <div class="gremble-editor-panel">


                <div class="gremble-editor-heading">

                    <small>
                        CUSTOMIZE
                    </small>

                    <h3>
                        BUILD YOUR GREMBLE.
                    </h3>

                    <p>
                        Choose your pose, outfit,
                        cap and background.
                    </p>

                </div>


                <!-- POSE -->

                <div class="gremble-editor-section">

                    <div class="gremble-editor-section-title">

                        <strong>
                            POSE
                        </strong>

                        <small>
                            CHOOSE 1
                        </small>

                    </div>

                    <div
                        class="gremble-option-grid gremble-pose-grid"
                        id="gremblePoseOptions"
                    >

                        ${GREMBLE_POSES.map(
                            (
                                pose,
                                index
                            ) => `

                            <button
                                type="button"
                                class="gremble-option-button"
                                data-avatar-type="pose"
                                data-avatar-value="${pose}"
                            >

                                <img
                                    src="${pose}.png"
                                    alt="Pose ${index + 1}"
                                >

                                <span>
                                    POSE ${index + 1}
                                </span>

                            </button>

                        `
                        ).join("")}

                    </div>

                </div>


                <!-- OUTFIT -->

                <div class="gremble-editor-section">

                    <div class="gremble-editor-section-title">

                        <strong>
                            OUTFIT
                        </strong>

                        <small>
                            CHOOSE 1
                        </small>

                    </div>

                    <div
                        class="gremble-option-grid gremble-outfit-grid"
                    >

                        <button
                            type="button"
                            class="gremble-option-button"
                            data-avatar-type="outfit"
                            data-avatar-value="streetwear"
                        >

                            <img
                                src="Streetwear.png"
                                alt="Streetwear"
                            >

                            <span>
                                STREETWEAR
                            </span>

                        </button>


                        <button
                            type="button"
                            class="gremble-option-button"
                            data-avatar-type="outfit"
                            data-avatar-value="suit"
                        >

                            <img
                                src="suit.png"
                                alt="Suit"
                            >

                            <span>
                                SUIT
                            </span>

                        </button>

                    </div>

                </div>


                <!-- HAT -->

                <div class="gremble-editor-section">

                    <div class="gremble-editor-section-title">

                        <strong>
                            CAP
                        </strong>

                        <small>
                            OPTIONAL
                        </small>

                    </div>


                    <div
                        class="gremble-option-grid gremble-hat-grid"
                    >

                        <button
                            type="button"
                            class="gremble-option-button gremble-none-option"
                            data-avatar-type="hat"
                            data-avatar-value="none"
                        >

                            <strong>
                                NONE
                            </strong>

                        </button>


                        ${[
                            "cap-1",
                            "cap-2",
                            "cap-3",
                            "cap-4",
                            "cap-5"
                        ].map(
                            (
                                cap,
                                index
                            ) => `

                            <button
                                type="button"
                                class="gremble-option-button"
                                data-avatar-type="hat"
                                data-avatar-value="${cap}"
                            >

                                <img
                                    src="${cap}.png"
                                    alt="Cap ${index + 1}"
                                >

                                <span>
                                    CAP ${index + 1}
                                </span>

                            </button>

                        `
                        ).join("")}

                    </div>

                </div>


                <!-- BACKGROUND -->

                <div class="gremble-editor-section">

                    <div class="gremble-editor-section-title">

                        <strong>
                            BACKGROUND
                        </strong>

                        <small>
                            OPTIONAL
                        </small>

                    </div>


                    <div
                        class="gremble-option-grid gremble-background-grid"
                    >

                        <button
                            type="button"
                            class="gremble-option-button gremble-none-option"
                            data-avatar-type="background"
                            data-avatar-value="none"
                        >

                            <strong>
                                NONE
                            </strong>

                        </button>


                        ${[
                            "wall-1",
                            "wall-2",
                            "wall-3"
                        ].map(
                            (
                                wall,
                                index
                            ) => `

                            <button
                                type="button"
                                class="gremble-option-button"
                                data-avatar-type="background"
                                data-avatar-value="${wall}"
                            >

                                <img
                                    src="${wall}.png"
                                    alt="Wall ${index + 1}"
                                >

                                <span>
                                    WALL ${index + 1}
                                </span>

                            </button>

                        `
                        ).join("")}


                        <label
                            class="gremble-background-upload"
                            id="grembleBackgroundUpload"
                        >

                            <strong>
                                ↑
                            </strong>

                            <span>
                                UPLOAD YOUR OWN
                            </span>

                            <input
                                type="file"
                                id="grembleCustomBackgroundInput"
                                accept="image/png,image/jpeg,image/webp"
                            >

                        </label>

                    </div>

                </div>


                <!-- ROLE -->

                <div class="gremble-editor-section">

                    <div class="gremble-editor-section-title">

                        <strong>
                            WHAT KIND OF GREMBLE ARE YOU?
                        </strong>

                    </div>


                    <div class="gremble-editor-section-title">

                        <small>
                            ROLE
                        </small>

                    </div>


                    <div class="gremble-select-grid">

                        ${GREMBLE_ROLES.map(
                            value => `

                            <button
                                type="button"
                                class="gremble-select-button"
                                data-avatar-type="role"
                                data-avatar-value="${value}"
                            >

                                ${value.toUpperCase()}

                            </button>

                        `
                        ).join("")}

                    </div>

                </div>


                <!-- ENERGY -->

                <div class="gremble-editor-section">

                    <div class="gremble-editor-section-title">

                        <small>
                            ENERGY
                        </small>

                    </div>


                    <div class="gremble-select-grid">

                        ${GREMBLE_ENERGIES.map(
                            value => `

                            <button
                                type="button"
                                class="gremble-select-button"
                                data-avatar-type="energy"
                                data-avatar-value="${value}"
                            >

                                ${value.toUpperCase()}

                            </button>

                        `
                        ).join("")}

                    </div>

                </div>


                <!-- HERE FOR -->

                <div class="gremble-editor-section">

                    <div class="gremble-editor-section-title">

                        <small>
                            HERE FOR
                        </small>

                    </div>


                    <div class="gremble-select-grid">

                        ${GREMBLE_HERE_FOR.map(
                            value => `

                            <button
                                type="button"
                                class="gremble-select-button"
                                data-avatar-type="here_for"
                                data-avatar-value="${value}"
                            >

                                ${value.toUpperCase()}

                            </button>

                        `
                        ).join("")}

                    </div>

                </div>


                <!-- MESSAGE -->

                <div class="gremble-editor-section">

                    <div class="gremble-editor-section-title">

                        <strong>
                            YOUR MESSAGE
                        </strong>

                        <small id="grembleMessageCounter">
                            0 / 200
                        </small>

                    </div>


                    <textarea
                        class="gremble-message-input"
                        id="grembleMessageInput"
                        maxlength="200"
                        placeholder="Write something about your Gremble..."
                    ></textarea>

                </div>


                <!-- STATUS -->

                <div
                    id="grembleAvatarStatus"
                    aria-live="polite"
                    style="
                        min-height: 22px;
                        margin-top: 18px;
                        color: rgba(255,255,255,.55);
                        font-size: 9px;
                        font-weight: 800;
                        letter-spacing: .8px;
                    "
                ></div>


                <!-- SAVE / CANCEL -->

                <div class="gremble-editor-actions">

                    <button
                        type="button"
                        class="gremble-save-button"
                        id="saveMyGrembleButton"
                    >
                        SAVE MY GREMBLE
                    </button>


                    <button
                        type="button"
                        class="gremble-cancel-button"
                        id="cancelMyGrembleButton"
                    >
                        CANCEL
                    </button>

                </div>


            </div>

        </div>
    `;


    /*
        Insert editor after normal card actions.
    */

    const cardActions =
        myGremblePage
            .querySelector(
                ".gremble-card-actions"
            );


    if (cardActions) {

        cardActions
            .insertAdjacentElement(
                "afterend",
                editor
            );

    }
    else {

        myGremblePage
            .appendChild(
                editor
            );
    }


    setupEditorEvents();
}


/* =========================================================
   EDITOR ELEMENTS
========================================================= */

function getEditorElements() {

    return {

        editor:
            document.getElementById(
                "myGrembleEditor"
            ),

        canvas:
            document.getElementById(
                "grembleEditorCanvas"
            ),

        message:
            document.getElementById(
                "grembleMessageInput"
            ),

        counter:
            document.getElementById(
                "grembleMessageCounter"
            ),

        saveButton:
            document.getElementById(
                "saveMyGrembleButton"
            ),

        cancelButton:
            document.getElementById(
                "cancelMyGrembleButton"
            ),

        uploadInput:
            document.getElementById(
                "grembleCustomBackgroundInput"
            ),

        status:
            document.getElementById(
                "grembleAvatarStatus"
            )
    };
}


/* =========================================================
   EDITOR STATUS
========================================================= */

function setAvatarStatus(
    text = "",
    type = ""
) {

    const {
        status
    } =
        getEditorElements();


    if (!status) {

        return;
    }


    status.textContent =
        text;


    if (
        type ===
        "error"
    ) {

        status.style.color =
            "#ff7777";
    }

    else if (
        type ===
        "success"
    ) {

        status.style.color =
            "#69ff83";
    }

    else {

        status.style.color =
            "rgba(255,255,255,.55)";
    }
}


/* =========================================================
   ACTIVE OPTION STATES
========================================================= */

function updateEditorActiveStates() {

    document
        .querySelectorAll(
            "[data-avatar-type][data-avatar-value]"
        )
        .forEach(
            button => {

                const type =
                    button.dataset
                        .avatarType;


                const value =
                    button.dataset
                        .avatarValue;


                if (
                    !type ||
                    !value
                ) {

                    return;
                }


                const active =
                    editingGrembleAvatar[
                        type
                    ] === value;


                button.classList.toggle(
                    "active",
                    active
                );
            }
        );
}


/* =========================================================
   MESSAGE COUNTER
========================================================= */

function updateMessageCounter() {

    const {
        message,
        counter
    } =
        getEditorElements();


    if (
        !message ||
        !counter
    ) {

        return;
    }


    counter.textContent =
        `${message.value.length} / 200`;
}


/* =========================================================
   RENDER EDITOR
========================================================= */

function renderEditorAvatar() {

    const {
        canvas,
        message
    } =
        getEditorElements();


    renderAvatarCanvas(
        canvas,
        editingGrembleAvatar
    );


    if (
        message &&
        document.activeElement !==
            message
    ) {

        message.value =
            editingGrembleAvatar.message;
    }


    updateMessageCounter();

    updateEditorActiveStates();
}


/* =========================================================
   OPEN EDITOR
========================================================= */

function openGrembleEditor() {

    const token =
        getGrembleAvatarSessionToken();


    if (!token) {

        alert(
            "Connect Telegram first to edit your Gremble."
        );

        return;
    }


    editingGrembleAvatar = {
        ...savedGrembleAvatar
    };


    customBackgroundPreviewUrl =
        savedGrembleAvatar
            .custom_background_url ||
        "";


    myGremblePage
        ?.classList
        .add(
            "editing"
        );


    renderEditorAvatar();


    setAvatarStatus(
        ""
    );


    document
        .getElementById(
            "myGrembleEditor"
        )
        ?.scrollIntoView({
            behavior:
                "smooth",

            block:
                "start"
        });
}


/* =========================================================
   CLOSE EDITOR
========================================================= */

function closeGrembleEditor() {

    myGremblePage
        ?.classList
        .remove(
            "editing"
        );


    editingGrembleAvatar = {
        ...savedGrembleAvatar
    };


    customBackgroundPreviewUrl =
        savedGrembleAvatar
            .custom_background_url ||
        "";


    renderEditorAvatar();


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================================
   OPTION CLICK
========================================================= */

function selectAvatarOption(
    type,
    value
) {

    if (
        !type ||
        value === undefined
    ) {

        return;
    }


    if (
        type === "pose" &&
        !GREMBLE_POSES.includes(
            value
        )
    ) {

        return;
    }


    if (
        type === "outfit" &&
        !GREMBLE_OUTFITS.includes(
            value
        )
    ) {

        return;
    }


    if (
        type === "hat" &&
        !GREMBLE_HATS.includes(
            value
        )
    ) {

        return;
    }


    if (
        type === "background" &&
        !GREMBLE_BACKGROUNDS.includes(
            value
        )
    ) {

        return;
    }


    if (
        type === "role" &&
        !GREMBLE_ROLES.includes(
            value
        )
    ) {

        return;
    }


    if (
        type === "energy" &&
        !GREMBLE_ENERGIES.includes(
            value
        )
    ) {

        return;
    }


    if (
        type === "here_for" &&
        !GREMBLE_HERE_FOR.includes(
            value
        )
    ) {

        return;
    }


    editingGrembleAvatar[
        type
    ] = value;


    renderEditorAvatar();
}


/* =========================================================
   CUSTOM BACKGROUND
========================================================= */

async function handleCustomBackground(
    file
) {

    if (!file) {

        return;
    }


    const allowedTypes =
        [
            "image/png",
            "image/jpeg",
            "image/webp"
        ];


    if (
        !allowedTypes.includes(
            file.type
        )
    ) {

        setAvatarStatus(
            "ONLY PNG, JPG OR WEBP IS ALLOWED.",
            "error"
        );

        return;
    }


    if (
        file.size >
        5 * 1024 * 1024
    ) {

        setAvatarStatus(
            "IMAGE MUST BE SMALLER THAN 5 MB.",
            "error"
        );

        return;
    }


    const token =
        getGrembleAvatarSessionToken();


    if (!token) {

        setAvatarStatus(
            "CONNECT TELEGRAM FIRST.",
            "error"
        );

        return;
    }


    /*
        Local preview appears immediately.
    */

    if (
        customBackgroundPreviewUrl &&
        customBackgroundPreviewUrl
            .startsWith(
                "blob:"
            )
    ) {

        URL.revokeObjectURL(
            customBackgroundPreviewUrl
        );
    }


    customBackgroundPreviewUrl =
        URL.createObjectURL(
            file
        );


    editingGrembleAvatar.background =
        "custom";


    editingGrembleAvatar
        .custom_background_url =
            customBackgroundPreviewUrl;


    renderEditorAvatar();


    setAvatarStatus(
        "UPLOADING BACKGROUND..."
    );


    try {

        const formData =
            new FormData();


        formData.append(
            "file",
            file
        );


        const response =
            await fetch(
                GREMBLE_AVATAR_ENDPOINT,
                {
                    method:
                        "POST",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    },

                    body:
                        formData
                }
            );


        const result =
            await response.json();


        if (
            !response.ok ||
            !result?.success
        ) {

            throw new Error(
                result?.error ||
                "Could not upload background."
            );
        }


        editingGrembleAvatar =
            normalizeAvatar(
                result.avatar,
                result.custom_background_url
            );


        customBackgroundPreviewUrl =
            result
                .custom_background_url ||
            "";


        renderEditorAvatar();


        setAvatarStatus(
            "BACKGROUND UPLOADED.",
            "success"
        );

    }
    catch (error) {

        console.error(
            "Custom background upload error:",
            error
        );


        setAvatarStatus(
            error?.message ||
            "COULD NOT UPLOAD BACKGROUND.",
            "error"
        );
    }
}


/* =========================================================
   SETUP EDITOR EVENTS
========================================================= */

function setupEditorEvents() {

    const {
        message,
        saveButton,
        cancelButton,
        uploadInput
    } =
        getEditorElements();


    document
        .getElementById(
            "myGrembleEditor"
        )
        ?.addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest(
                        "[data-avatar-type][data-avatar-value]"
                    );


                if (!button) {

                    return;
                }


                selectAvatarOption(
                    button.dataset
                        .avatarType,

                    button.dataset
                        .avatarValue
                );
            }
        );


    if (message) {

        message.addEventListener(
            "input",
            () => {

                editingGrembleAvatar
                    .message =
                        message.value
                            .slice(
                                0,
                                200
                            );


                updateMessageCounter();
            }
        );
    }


    if (uploadInput) {

        uploadInput.addEventListener(
            "change",
            () => {

                const file =
                    uploadInput
                        .files?.[0];


                if (file) {

                    handleCustomBackground(
                        file
                    );
                }
            }
        );
    }


    saveButton
        ?.addEventListener(
            "click",
            saveMyGremble
        );


    cancelButton
        ?.addEventListener(
            "click",
            closeGrembleEditor
        );
}


/* =========================================================
   API REQUEST
========================================================= */

async function avatarRequest(
    method = "GET",
    body = null
) {

    const token =
        getGrembleAvatarSessionToken();


    if (!token) {

        throw new Error(
            "Connect Telegram first."
        );
    }


    const options = {

        method,

        headers: {

            "Authorization":
                `Bearer ${token}`,

            "Content-Type":
                "application/json"
        }
    };


    if (
        body !== null
    ) {

        options.body =
            JSON.stringify(
                body
            );
    }


    const response =
        await fetch(
            GREMBLE_AVATAR_ENDPOINT,
            options
        );


    let result;


    try {

        result =
            await response.json();

    }
    catch {

        throw new Error(
            "Invalid server response."
        );
    }


    if (
        !response.ok ||
        !result?.success
    ) {

        throw new Error(
            result?.error ||
            "Avatar request failed."
        );
    }


    return result;
}


/* =========================================================
   LOAD AVATAR FROM SUPABASE
========================================================= */

async function loadMyGremble(
    force = false
) {

    const token =
        getGrembleAvatarSessionToken();


    /*
        Not logged in.
    */

    if (!token) {

        avatarLoadedForSession =
            false;


        lastAvatarSessionToken =
            "";


        const cached =
            loadAvatarCache();


        savedGrembleAvatar =
            normalizeAvatar(
                cached ||
                DEFAULT_GREMBLE_AVATAR
            );


        editingGrembleAvatar = {
            ...savedGrembleAvatar
        };


        renderSavedAvatar();

        renderEditorAvatar();

        return;
    }


    if (
        !force &&
        avatarLoadedForSession &&
        lastAvatarSessionToken ===
            token
    ) {

        return;
    }


    /*
        Render local cache first
        so the card appears immediately.
    */

    const cached =
        loadAvatarCache();


    if (cached) {

        savedGrembleAvatar =
            normalizeAvatar(
                cached
            );


        editingGrembleAvatar = {
            ...savedGrembleAvatar
        };


        renderSavedAvatar();
    }


    try {

        const result =
            await avatarRequest(
                "GET"
            );


        savedGrembleAvatar =
            normalizeAvatar(
                result.avatar,

                result
                    .custom_background_url
            );


        editingGrembleAvatar = {
            ...savedGrembleAvatar
        };


        customBackgroundPreviewUrl =
            savedGrembleAvatar
                .custom_background_url ||
            "";


        saveAvatarCache(
            savedGrembleAvatar
        );


        avatarLoadedForSession =
            true;


        lastAvatarSessionToken =
            token;


        renderSavedAvatar();

        renderEditorAvatar();

    }
    catch (error) {

        console.error(
            "Could not load My Gremble:",
            error
        );
    }
}


/* =========================================================
   SAVE AVATAR
========================================================= */

async function saveMyGremble() {

    const {
        saveButton,
        message
    } =
        getEditorElements();


    if (message) {

        editingGrembleAvatar
            .message =
                message.value
                    .trim()
                    .slice(
                        0,
                        200
                    );
    }


    if (
        saveButton
    ) {

        saveButton.disabled =
            true;


        saveButton.textContent =
            "SAVING...";
    }


    setAvatarStatus(
        "SAVING YOUR GREMBLE..."
    );


    try {

        const result =
            await avatarRequest(
                "POST",
                {
                    pose:
                        editingGrembleAvatar.pose,

                    outfit:
                        editingGrembleAvatar.outfit,

                    hat:
                        editingGrembleAvatar.hat,

                    background:
                        editingGrembleAvatar.background,

                    role:
                        editingGrembleAvatar.role,

                    energy:
                        editingGrembleAvatar.energy,

                    here_for:
                        editingGrembleAvatar.here_for,

                    message:
                        editingGrembleAvatar.message
                }
            );


        savedGrembleAvatar =
            normalizeAvatar(
                result.avatar,

                result
                    .custom_background_url
            );


        editingGrembleAvatar = {
            ...savedGrembleAvatar
        };


        customBackgroundPreviewUrl =
            savedGrembleAvatar
                .custom_background_url ||
            "";


        saveAvatarCache(
            savedGrembleAvatar
        );


        renderSavedAvatar();


        setAvatarStatus(
            "YOUR GREMBLE IS SAVED.",
            "success"
        );


        setTimeout(
            () => {

                closeGrembleEditor();

            },
            450
        );

    }
    catch (error) {

        console.error(
            "Save My Gremble error:",
            error
        );


        setAvatarStatus(
            error?.message ||
            "COULD NOT SAVE YOUR GREMBLE.",
            "error"
        );

    }
    finally {

        if (
            saveButton
        ) {

            saveButton.disabled =
                false;


            saveButton.textContent =
                "SAVE MY GREMBLE";
        }
    }
}


/* =========================================================
   LOAD IMAGE FOR EXPORT
========================================================= */

function loadExportImage(
    src
) {

    return new Promise(
        (
            resolve,
            reject
        ) => {

            if (!src) {

                resolve(
                    null
                );

                return;
            }


            const image =
                new Image();


            image.crossOrigin =
                "anonymous";


            image.onload =
                () => resolve(
                    image
                );


            image.onerror =
                () => reject(
                    new Error(
                        `Could not load ${src}`
                    )
                );


            image.src =
                src;
        }
    );
}


/* =========================================================
   CONTAIN IMAGE
========================================================= */

function drawContain(
    context,
    image,
    x,
    y,
    width,
    height
) {

    if (!image) {

        return;
    }


    const ratio =
        Math.min(
            width /
                image.width,

            height /
                image.height
        );


    const drawWidth =
        image.width *
        ratio;


    const drawHeight =
        image.height *
        ratio;


    const drawX =
        x +
        (
            width -
            drawWidth
        ) / 2;


    const drawY =
        y +
        (
            height -
            drawHeight
        ) / 2;


    context.drawImage(
        image,
        drawX,
        drawY,
        drawWidth,
        drawHeight
    );
}


/* =========================================================
   COVER IMAGE
========================================================= */

function drawCover(
    context,
    image,
    width,
    height
) {

    if (!image) {

        return;
    }


    const ratio =
        Math.max(
            width /
                image.width,

            height /
                image.height
        );


    const drawWidth =
        image.width *
        ratio;


    const drawHeight =
        image.height *
        ratio;


    const drawX =
        (
            width -
            drawWidth
        ) / 2;


    const drawY =
        (
            height -
            drawHeight
        ) / 2;


    context.drawImage(
        image,
        drawX,
        drawY,
        drawWidth,
        drawHeight
    );
}


/* =========================================================
   EXPORT GREMBLE CARD
========================================================= */

async function createGrembleCardBlob() {

    const WIDTH =
        1200;


    const HEIGHT =
        1200;


    const canvas =
        document.createElement(
            "canvas"
        );


    canvas.width =
        WIDTH;


    canvas.height =
        HEIGHT;


    const context =
        canvas.getContext(
            "2d"
        );


    if (!context) {

        throw new Error(
            "Canvas is not supported."
        );
    }


    /*
        Base
    */

    context.fillStyle =
        "#03110b";


    context.fillRect(
        0,
        0,
        WIDTH,
        HEIGHT
    );


    const backgroundSrc =
        getBackgroundImage(
            savedGrembleAvatar
        );


    const characterSrc =
        getCharacterImage(
            savedGrembleAvatar
        );


    const hatSrc =
        getHatImage(
            savedGrembleAvatar
        );


    const [
        backgroundImage,
        characterImage,
        hatImage
    ] =
        await Promise.all([

            loadExportImage(
                backgroundSrc
            ),

            loadExportImage(
                characterSrc
            ),

            loadExportImage(
                hatSrc
            )
        ]);


    /*
        Background
    */

    if (backgroundImage) {

        drawCover(
            context,
            backgroundImage,
            WIDTH,
            HEIGHT
        );

    }
    else {

        const gradient =
            context.createRadialGradient(
                WIDTH / 2,
                HEIGHT / 2,
                100,
                WIDTH / 2,
                HEIGHT / 2,
                800
            );


        gradient.addColorStop(
            0,
            "#0a3a25"
        );


        gradient.addColorStop(
            1,
            "#020906"
        );


        context.fillStyle =
            gradient;


        context.fillRect(
            0,
            0,
            WIDTH,
            HEIGHT
        );
    }


    /*
        Dark overlay
    */

    const overlay =
        context.createLinearGradient(
            0,
            0,
            0,
            HEIGHT
        );


    overlay.addColorStop(
        0,
        "rgba(0,0,0,0.02)"
    );


    overlay.addColorStop(
        0.62,
        "rgba(0,0,0,0.04)"
    );


    overlay.addColorStop(
        1,
        "rgba(0,8,5,0.78)"
    );


    context.fillStyle =
        overlay;


    context.fillRect(
        0,
        0,
        WIDTH,
        HEIGHT
    );


    /*
        Character
    */

    if (characterImage) {

        drawContain(
            context,
            characterImage,

            130,
            90,

            940,
            930
        );
    }


    /*
        Hat
    */

    if (hatImage) {

        const config =
            GREMBLE_HAT_POSITIONS[
                savedGrembleAvatar.pose
            ] ||
            GREMBLE_HAT_POSITIONS[
                "pose-01"
            ];


        const baseHatWidth =
            WIDTH *
            (
                parseFloat(
                    config.width
                ) / 100
            );


        /*
            The real PNG ratio is used here.
            This makes downloaded cards use the same
            cap proportions as the live website preview.
        */

        const intrinsicRatio =
            hatImage.height /
            hatImage.width;


        const baseHatHeight =
            baseHatWidth *
            intrinsicRatio;


        const centerX =
            WIDTH *
            (
                parseFloat(
                    config.left
                ) / 100
            );


        const topY =
            HEIGHT *
            (
                parseFloat(
                    config.top
                ) / 100
            );


        const rotation =
            parseFloat(
                config.rotate
            ) *
            Math.PI /
            180;


        context.save();


        context.translate(
            centerX,
            topY +
            baseHatHeight / 2
        );


        context.rotate(
            rotation
        );


        context.scale(
            Number(
                config.scaleX
            ) || 1,
            Number(
                config.scaleY
            ) || 1
        );


        context.drawImage(
            hatImage,

            -baseHatWidth / 2,
            -baseHatHeight / 2,

            baseHatWidth,
            baseHatHeight
        );


        context.restore();
    }


    /*
        Bottom gradient
    */

    const bottomGradient =
        context.createLinearGradient(
            0,
            HEIGHT * 0.70,
            0,
            HEIGHT
        );


    bottomGradient.addColorStop(
        0,
        "rgba(0,0,0,0)"
    );


    bottomGradient.addColorStop(
        1,
        "rgba(0,8,5,0.88)"
    );


    context.fillStyle =
        bottomGradient;


    context.fillRect(
        0,
        HEIGHT * 0.70,
        WIDTH,
        HEIGHT * 0.30
    );


    /*
        Brand
    */

    context.textAlign =
        "left";


    context.fillStyle =
        "#69ff83";


    context.font =
        "900 30px Arial";


    context.fillText(
        "MY GREMBLE",
        70,
        1040
    );


    context.fillStyle =
        "#ffffff";


    context.font =
        "900 46px Arial";


    context.fillText(
        savedGrembleAvatar.role
            .toUpperCase(),
        70,
        1100
    );


    /*
        Message
    */

    const message =
        savedGrembleAvatar
            .message
            .trim();


    if (message) {

        context.fillStyle =
            "rgba(255,255,255,.78)";


        context.font =
            "600 25px Arial";


        const maxTextWidth =
            750;


        let displayMessage =
            message;


        while (
            context.measureText(
                displayMessage
            ).width >
                maxTextWidth &&
            displayMessage.length >
                3
        ) {

            displayMessage =
                displayMessage.slice(
                    0,
                    -1
                );
        }


        if (
            displayMessage !==
            message
        ) {

            displayMessage =
                displayMessage
                    .slice(
                        0,
                        -3
                    ) +
                "...";
        }


        context.fillText(
            displayMessage,
            70,
            1145
        );
    }


    /*
        Hashtag
    */

    context.textAlign =
        "right";


    context.fillStyle =
        "#69ff83";


    context.font =
        "900 28px Arial";


    context.fillText(
        "#GREMBLE",
        WIDTH - 70,
        1110
    );


    return await new Promise(
        resolve => {

            canvas.toBlob(
                resolve,
                "image/png",
                1
            );
        }
    );
}


/* =========================================================
   DOWNLOAD
========================================================= */

async function downloadMyGremble() {

    if (
        downloadMyGrembleButton
    ) {

        downloadMyGrembleButton
            .disabled =
                true;
    }


    try {

        const blob =
            await createGrembleCardBlob();


        if (!blob) {

            throw new Error(
                "Could not create image."
            );
        }


        const url =
            URL.createObjectURL(
                blob
            );


        const anchor =
            document.createElement(
                "a"
            );


        anchor.href =
            url;


        anchor.download =
            "my-gremble.png";


        document.body
            .appendChild(
                anchor
            );


        anchor.click();


        anchor.remove();


        setTimeout(
            () => {

                URL.revokeObjectURL(
                    url
                );

            },
            2000
        );

    }
    catch (error) {

        console.error(
            "Download My Gremble error:",
            error
        );


        alert(
            "Could not download your Gremble."
        );

    }
    finally {

        if (
            downloadMyGrembleButton
        ) {

            downloadMyGrembleButton
                .disabled =
                    false;
        }
    }
}


/* =========================================================
   SHARE
========================================================= */

async function shareMyGremble() {

    if (
        shareMyGrembleButton
    ) {

        shareMyGrembleButton
            .disabled =
                true;
    }


    try {

        const blob =
            await createGrembleCardBlob();


        if (!blob) {

            throw new Error(
                "Could not create image."
            );
        }


        const file =
            new File(
                [
                    blob
                ],
                "my-gremble.png",
                {
                    type:
                        "image/png"
                }
            );


        const shareText =
            savedGrembleAvatar
                .message
                .trim()
                ? `${savedGrembleAvatar.message} #GREMBLE`
                : "This is my Gremble. #GREMBLE";


        /*
            Mobile / supported browsers:
            Native share includes image file.
        */

        if (
            navigator.share &&
            navigator.canShare &&
            navigator.canShare({
                files: [
                    file
                ]
            })
        ) {

            await navigator.share({

                files: [
                    file
                ],

                text:
                    shareText,

                title:
                    "My Gremble"
            });


            return;
        }


        /*
            Desktop fallback:
            download image and open X composer.
        */

        const objectUrl =
            URL.createObjectURL(
                blob
            );


        const anchor =
            document.createElement(
                "a"
            );


        anchor.href =
            objectUrl;


        anchor.download =
            "my-gremble.png";


        document.body
            .appendChild(
                anchor
            );


        anchor.click();


        anchor.remove();


        setTimeout(
            () => {

                URL.revokeObjectURL(
                    objectUrl
                );

            },
            2000
        );


        const xUrl =
            "https://x.com/intent/post?text=" +
            encodeURIComponent(
                shareText
            );


        window.open(
            xUrl,
            "_blank",
            "noopener,noreferrer"
        );

    }
    catch (error) {

        if (
            error?.name ===
            "AbortError"
        ) {

            return;
        }


        console.error(
            "Share My Gremble error:",
            error
        );


        alert(
            "Could not share your Gremble."
        );

    }
    finally {

        if (
            shareMyGrembleButton
        ) {

            shareMyGrembleButton
                .disabled =
                    false;
        }
    }
}


/* =========================================================
   SESSION WATCH

   Telegram login can happen after avatar.js loads.
========================================================= */

async function watchAvatarSession() {

    const currentToken =
        getGrembleAvatarSessionToken();


    if (
        currentToken !==
        lastAvatarSessionToken
    ) {

        avatarLoadedForSession =
            false;


        if (currentToken) {

            await loadMyGremble(
                true
            );

        }
        else {

            lastAvatarSessionToken =
                "";


            const cached =
                loadAvatarCache();


            savedGrembleAvatar =
                normalizeAvatar(
                    cached ||
                    DEFAULT_GREMBLE_AVATAR
                );


            editingGrembleAvatar = {
                ...savedGrembleAvatar
            };


            renderSavedAvatar();

            renderEditorAvatar();
        }
    }
}


/* =========================================================
   MAIN BUTTON EVENTS
========================================================= */

editMyGrembleButton
    ?.addEventListener(
        "click",
        openGrembleEditor
    );


downloadMyGrembleButton
    ?.addEventListener(
        "click",
        downloadMyGremble
    );


shareMyGrembleButton
    ?.addEventListener(
        "click",
        shareMyGremble
    );


/* =========================================================
   INITIALIZE
========================================================= */

function initializeMyGremble() {

    if (!myGremblePage) {

        return;
    }


    ensureMainHatLayer();


    createGrembleEditor();


    /*
        Show cached/default card immediately.
    */

    const cached =
        loadAvatarCache();


    savedGrembleAvatar =
        normalizeAvatar(
            cached ||
            DEFAULT_GREMBLE_AVATAR
        );


    editingGrembleAvatar = {
        ...savedGrembleAvatar
    };


    renderSavedAvatar();

    renderEditorAvatar();


    /*
        Then replace with Supabase version.
    */

    loadMyGremble(
        true
    );


    /*
        Watch Telegram login/logout.
    */

    setInterval(
        watchAvatarSession,
        1000
    );
}


/* =========================================================
   START
========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeMyGremble
    );

}
else {

    initializeMyGremble();
}