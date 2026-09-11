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

    /*
        Hats are currently disabled.
        We keep this property because the existing
        database already contains the hat column.
    */
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


        /*
            Hats are disabled.

            Even if an old account previously saved
            cap-1 / cap-2 / etc., the website now
            treats it as no hat.
        */
        hat:
            "none",


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
   REMOVE OLD HAT LAYERS
========================================================= */

function removeOldHatLayers(
    canvas
) {

    if (!canvas) {

        return;
    }


    canvas
        .querySelectorAll(
            ".gremble-card-hat"
        )
        .forEach(
            element => {

                element.remove();
            }
        );
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


    /*
        Remove old cap layers from previous
        versions of My Gremble.
    */

    removeOldHatLayers(
        canvas
    );


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
}


/* =========================================================
   RENDER MAIN CARD
========================================================= */

function renderSavedAvatar() {

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


                <div
                    class="gremble-editor-status"
                    id="grembleEditorStatus"
                    aria-live="polite"
                ></div>

            </div>


            <!-- ==========================================
                 CONTROLS
            =========================================== -->

            <div class="gremble-editor-panel">


                <!-- POSE -->

                <div class="gremble-editor-section">

                    <div class="gremble-editor-section-heading">

                        <h3>
                            POSE
                        </h3>

                        <small>
                            CHOOSE YOUR GREMBLE
                        </small>

                    </div>


                    <div
                        class="gremble-option-grid gremble-pose-grid"
                        id="gremblePoseOptions"
                    ></div>

                </div>


                <!-- OUTFIT -->

                <div class="gremble-editor-section">

                    <div class="gremble-editor-section-heading">

                        <h3>
                            OUTFIT
                        </h3>

                        <small>
                            PICK YOUR STYLE
                        </small>

                    </div>


                    <div
                        class="gremble-option-grid gremble-outfit-grid"
                        id="grembleOutfitOptions"
                    ></div>

                </div>


                <!-- BACKGROUND -->

                <div class="gremble-editor-section">

                    <div class="gremble-editor-section-heading">

                        <h3>
                            BACKGROUND
                        </h3>

                        <small>
                            CHOOSE YOUR WORLD
                        </small>

                    </div>


                    <div
                        class="gremble-option-grid gremble-background-grid"
                        id="grembleBackgroundOptions"
                    ></div>


                    <div class="gremble-custom-background">

                        <label
                            for="grembleCustomBackgroundInput"
                            class="gremble-upload-background-button"
                        >
                            UPLOAD YOUR OWN BACKGROUND
                        </label>


                        <input
                            type="file"
                            id="grembleCustomBackgroundInput"
                            accept="image/png,image/jpeg,image/webp"
                            hidden
                        >


                        <small>
                            PNG, JPG OR WEBP · MAX 5 MB
                        </small>

                    </div>

                </div>


                <!-- PERSONALITY -->

                <div class="gremble-editor-section">

                    <div class="gremble-editor-section-heading">

                        <h3>
                            WHAT KIND OF GREMBLE ARE YOU?
                        </h3>

                        <small>
                            CHOOSE YOUR PERSONALITY
                        </small>

                    </div>


                    <div class="gremble-personality-editor">


                        <div class="gremble-personality-editor-group">

                            <span>
                                ROLE
                            </span>

                            <div
                                class="gremble-personality-options"
                                id="grembleRoleOptions"
                            ></div>

                        </div>


                        <div class="gremble-personality-editor-group">

                            <span>
                                ENERGY
                            </span>

                            <div
                                class="gremble-personality-options"
                                id="grembleEnergyOptions"
                            ></div>

                        </div>


                        <div class="gremble-personality-editor-group">

                            <span>
                                HERE FOR
                            </span>

                            <div
                                class="gremble-personality-options"
                                id="grembleHereForOptions"
                            ></div>

                        </div>


                    </div>

                </div>


                <!-- MESSAGE -->

                <div class="gremble-editor-section">

                    <div class="gremble-editor-section-heading">

                        <h3>
                            YOUR MESSAGE
                        </h3>

                        <small>
                            MAX 200 CHARACTERS
                        </small>

                    </div>


                    <textarea
                        id="grembleMessageInput"
                        class="gremble-message-input"
                        maxlength="200"
                        rows="4"
                        placeholder="Write something about your Gremble..."
                    ></textarea>


                    <div class="gremble-message-counter">

                        <span id="grembleMessageCounter">
                            0
                        </span>

                        <span>
                            / 200
                        </span>

                    </div>

                </div>


                <!-- ACTIONS -->

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


    myGremblePage.appendChild(
        editor
    );


    bindEditorEvents();
}


/* =========================================================
   CREATE OPTION BUTTON
========================================================= */

function createAvatarOptionButton({
    value,
    label,
    image,
    selected,
    className = ""
}) {

    const button =
        document.createElement(
            "button"
        );


    button.type =
        "button";


    button.className =
        `gremble-option-button ${className}`;


    button.dataset.value =
        value;


    if (selected) {

        button.classList.add(
            "selected"
        );
    }


    if (image) {

        const imageElement =
            document.createElement(
                "img"
            );


        imageElement.src =
            image;


        imageElement.alt =
            label;


        button.appendChild(
            imageElement
        );
    }


    const labelElement =
        document.createElement(
            "span"
        );


    labelElement.textContent =
        label;


    button.appendChild(
        labelElement
    );


    return button;
}


/* =========================================================
   POSE OPTIONS
========================================================= */

function renderPoseOptions() {

    const container =
        document.getElementById(
            "gremblePoseOptions"
        );


    if (!container) {

        return;
    }


    container.innerHTML =
        "";


    GREMBLE_POSES.forEach(
        (
            pose,
            index
        ) => {

            const previewAvatar = {

                ...editingGrembleAvatar,

                pose
            };


            const button =
                createAvatarOptionButton({

                    value:
                        pose,

                    label:
                        `POSE ${index + 1}`,

                    image:
                        getCharacterImage(
                            previewAvatar
                        ),

                    selected:
                        editingGrembleAvatar.pose ===
                        pose,

                    className:
                        "gremble-pose-option"
                });


            button.addEventListener(
                "click",
                () => {

                    editingGrembleAvatar.pose =
                        pose;


                    renderEditorControls();

                    renderEditorPreview();
                }
            );


            container.appendChild(
                button
            );
        }
    );
}


/* =========================================================
   OUTFIT OPTIONS
========================================================= */

function renderOutfitOptions() {

    const container =
        document.getElementById(
            "grembleOutfitOptions"
        );


    if (!container) {

        return;
    }


    container.innerHTML =
        "";


    const outfits = [

        {
            value:
                "streetwear",

            label:
                "STREETWEAR",

            image:
                "Streetwear.png"
        },

        {
            value:
                "suit",

            label:
                "SUIT",

            image:
                "suit.png"
        }
    ];


    outfits.forEach(
        outfit => {

            const button =
                createAvatarOptionButton({

                    value:
                        outfit.value,

                    label:
                        outfit.label,

                    image:
                        outfit.image,

                    selected:
                        editingGrembleAvatar.outfit ===
                        outfit.value,

                    className:
                        "gremble-outfit-option"
                });


            button.addEventListener(
                "click",
                () => {

                    editingGrembleAvatar.outfit =
                        outfit.value;


                    renderEditorControls();

                    renderEditorPreview();
                }
            );


            container.appendChild(
                button
            );
        }
    );
}


/* =========================================================
   BACKGROUND OPTIONS
========================================================= */

function renderBackgroundOptions() {

    const container =
        document.getElementById(
            "grembleBackgroundOptions"
        );


    if (!container) {

        return;
    }


    container.innerHTML =
        "";


    const backgrounds = [

        {
            value:
                "none",

            label:
                "NONE",

            image:
                null
        },

        {
            value:
                "wall-1",

            label:
                "WORLD 1",

            image:
                "wall-1.png"
        },

        {
            value:
                "wall-2",

            label:
                "WORLD 2",

            image:
                "wall-2.png"
        },

        {
            value:
                "wall-3",

            label:
                "WORLD 3",

            image:
                "wall-3.png"
        }
    ];


    backgrounds.forEach(
        background => {

            const button =
                createAvatarOptionButton({

                    value:
                        background.value,

                    label:
                        background.label,

                    image:
                        background.image,

                    selected:
                        editingGrembleAvatar.background ===
                        background.value,

                    className:
                        "gremble-background-option"
                });


            button.addEventListener(
                "click",
                () => {

                    editingGrembleAvatar.background =
                        background.value;


                    renderEditorControls();

                    renderEditorPreview();
                }
            );


            container.appendChild(
                button
            );
        }
    );


    if (
        editingGrembleAvatar.background ===
        "custom"
    ) {

        const customButton =
            createAvatarOptionButton({

                value:
                    "custom",

                label:
                    "CUSTOM",

                image:
                    customBackgroundPreviewUrl ||
                    editingGrembleAvatar
                        .custom_background_url,

                selected:
                    true,

                className:
                    "gremble-background-option"
            });


        customButton.addEventListener(
            "click",
            () => {

                editingGrembleAvatar.background =
                    "custom";


                renderEditorPreview();
            }
        );


        container.appendChild(
            customButton
        );
    }
}


/* =========================================================
   PERSONALITY OPTION
========================================================= */

function createPersonalityButton(
    value,
    currentValue,
    onSelect
) {

    const button =
        document.createElement(
            "button"
        );


    button.type =
        "button";


    button.className =
        "gremble-select-button";


    button.textContent =
        value.toUpperCase();


    if (
        value ===
        currentValue
    ) {

        button.classList.add(
            "active"
        );
    }


    button.addEventListener(
        "click",
        () => {

            onSelect(
                value
            );
        }
    );


    return button;
}


/* =========================================================
   PERSONALITY OPTIONS
========================================================= */

function renderPersonalityOptions() {

    const roleContainer =
        document.getElementById(
            "grembleRoleOptions"
        );


    const energyContainer =
        document.getElementById(
            "grembleEnergyOptions"
        );


    const hereForContainer =
        document.getElementById(
            "grembleHereForOptions"
        );


    if (roleContainer) {

        roleContainer.innerHTML =
            "";


        GREMBLE_ROLES.forEach(
            value => {

                roleContainer.appendChild(

                    createPersonalityButton(

                        value,

                        editingGrembleAvatar.role,

                        selectedValue => {

                            editingGrembleAvatar.role =
                                selectedValue;


                            renderPersonalityOptions();
                        }
                    )
                );
            }
        );
    }


    if (energyContainer) {

        energyContainer.innerHTML =
            "";


        GREMBLE_ENERGIES.forEach(
            value => {

                energyContainer.appendChild(

                    createPersonalityButton(

                        value,

                        editingGrembleAvatar.energy,

                        selectedValue => {

                            editingGrembleAvatar.energy =
                                selectedValue;


                            renderPersonalityOptions();
                        }
                    )
                );
            }
        );
    }


    if (hereForContainer) {

        hereForContainer.innerHTML =
            "";


        GREMBLE_HERE_FOR.forEach(
            value => {

                hereForContainer.appendChild(

                    createPersonalityButton(

                        value,

                        editingGrembleAvatar.here_for,

                        selectedValue => {

                            editingGrembleAvatar.here_for =
                                selectedValue;


                            renderPersonalityOptions();
                        }
                    )
                );
            }
        );
    }
}


/* =========================================================
   MESSAGE
========================================================= */

function updateMessageCounter() {

    const input =
        document.getElementById(
            "grembleMessageInput"
        );


    const counter =
        document.getElementById(
            "grembleMessageCounter"
        );


    if (
        !input ||
        !counter
    ) {

        return;
    }


    counter.textContent =
        String(
            input.value.length
        );
}


/* =========================================================
   RENDER EDITOR CONTROLS
========================================================= */

function renderEditorControls() {

    renderPoseOptions();

    renderOutfitOptions();

    renderBackgroundOptions();

    renderPersonalityOptions();


    const messageInput =
        document.getElementById(
            "grembleMessageInput"
        );


    if (messageInput) {

        if (
            messageInput.value !==
            editingGrembleAvatar.message
        ) {

            messageInput.value =
                editingGrembleAvatar.message;
        }


        updateMessageCounter();
    }
}


/* =========================================================
   RENDER EDITOR PREVIEW
========================================================= */

function renderEditorPreview() {

    const canvas =
        document.getElementById(
            "grembleEditorCanvas"
        );


    renderAvatarCanvas(
        canvas,
        editingGrembleAvatar
    );
}


/* =========================================================
   STATUS
========================================================= */

function setAvatarStatus(
    message,
    type = ""
) {

    const status =
        document.getElementById(
            "grembleEditorStatus"
        );


    if (!status) {

        return;
    }


    status.textContent =
        message || "";


    status.classList.remove(
        "success",
        "error",
        "loading"
    );


    if (type) {

        status.classList.add(
            type
        );
    }
}


/* =========================================================
   CUSTOM BACKGROUND
========================================================= */

async function handleCustomBackground(
    event
) {

    const input =
        event.target;


    const file =
        input.files &&
        input.files[0];


    if (!file) {

        return;
    }


    const allowedTypes = [

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
            "PLEASE USE PNG, JPG OR WEBP.",
            "error"
        );


        input.value =
            "";


        return;
    }


    const MAX_SIZE =
        5 *
        1024 *
        1024;


    if (
        file.size >
        MAX_SIZE
    ) {

        setAvatarStatus(
            "BACKGROUND MUST BE UNDER 5 MB.",
            "error"
        );


        input.value =
            "";


        return;
    }


    if (
        customBackgroundPreviewUrl &&
        customBackgroundPreviewUrl.startsWith(
            "blob:"
        )
    ) {

        try {

            URL.revokeObjectURL(
                customBackgroundPreviewUrl
            );

        }
        catch {}
    }


    customBackgroundPreviewUrl =
        URL.createObjectURL(
            file
        );


    editingGrembleAvatar.background =
        "custom";


    editingGrembleAvatar
        .custom_background_file =
            file;


    renderBackgroundOptions();

    renderEditorPreview();


    setAvatarStatus(
        "CUSTOM BACKGROUND READY. SAVE YOUR GREMBLE TO KEEP IT.",
        "success"
    );
}


/* =========================================================
   EDITOR EVENTS
========================================================= */

function bindEditorEvents() {

    const customBackgroundInput =
        document.getElementById(
            "grembleCustomBackgroundInput"
        );


    const messageInput =
        document.getElementById(
            "grembleMessageInput"
        );


    const saveButton =
        document.getElementById(
            "saveMyGrembleButton"
        );


    const cancelButton =
        document.getElementById(
            "cancelMyGrembleButton"
        );


    if (customBackgroundInput) {

        customBackgroundInput
            .addEventListener(
                "change",
                handleCustomBackground
            );
    }


    if (messageInput) {

        messageInput
            .addEventListener(
                "input",
                () => {

                    editingGrembleAvatar.message =
                        messageInput.value
                            .slice(
                                0,
                                200
                            );


                    updateMessageCounter();
                }
            );
    }


    if (saveButton) {

        saveButton
            .addEventListener(
                "click",
                saveMyGremble
            );
    }


    if (cancelButton) {

        cancelButton
            .addEventListener(
                "click",
                closeGrembleEditor
            );
    }
}


/* =========================================================
   OPEN EDITOR
========================================================= */

function openGrembleEditor() {

    createGrembleEditor();


    editingGrembleAvatar = {

        ...savedGrembleAvatar,

        /*
            Hats are disabled.
        */
        hat:
            "none"
    };


    delete editingGrembleAvatar
        .custom_background_file;


    customBackgroundPreviewUrl =
        savedGrembleAvatar
            .custom_background_url ||
        "";


    if (myGremblePage) {

        myGremblePage
            .classList
            .add(
                "editing"
            );
    }


    const cardLayout =
        myGremblePage
            ?.querySelector(
                ".gremble-card-layout"
            );


    const cardActions =
        myGremblePage
            ?.querySelector(
                ".gremble-card-actions"
            );


    if (cardLayout) {

        cardLayout.hidden =
            true;
    }


    if (cardActions) {

        cardActions.hidden =
            true;
    }


    renderEditorControls();

    renderEditorPreview();


    setAvatarStatus(
        ""
    );


    window.scrollTo({
        top:
            myGremblePage
                ?.offsetTop ||
            0,

        behavior:
            "smooth"
    });
}


/* =========================================================
   CLOSE EDITOR
========================================================= */

function closeGrembleEditor() {

    if (myGremblePage) {

        myGremblePage
            .classList
            .remove(
                "editing"
            );
    }


    const cardLayout =
        myGremblePage
            ?.querySelector(
                ".gremble-card-layout"
            );


    const cardActions =
        myGremblePage
            ?.querySelector(
                ".gremble-card-actions"
            );


    if (cardLayout) {

        cardLayout.hidden =
            false;
    }


    if (cardActions) {

        cardActions.hidden =
            false;
    }


    if (
        customBackgroundPreviewUrl &&
        customBackgroundPreviewUrl.startsWith(
            "blob:"
        )
    ) {

        try {

            URL.revokeObjectURL(
                customBackgroundPreviewUrl
            );

        }
        catch {}
    }


    customBackgroundPreviewUrl =
        savedGrembleAvatar
            .custom_background_url ||
        "";


    editingGrembleAvatar = {

        ...savedGrembleAvatar
    };


    renderSavedAvatar();
}


/* =========================================================
   API REQUEST
========================================================= */

async function avatarApiRequest(
    options = {}
) {

    const token =
        getGrembleAvatarSessionToken();


    if (!token) {

        throw new Error(
            "PLEASE LOG IN WITH TELEGRAM FIRST."
        );
    }


    const headers = {

        ...(options.headers || {})
    };


    headers.Authorization =
        `Bearer ${token}`;


    const response =
        await fetch(
            GREMBLE_AVATAR_ENDPOINT,
            {

                ...options,

                headers
            }
        );


    let data =
        null;


    try {

        data =
            await response.json();

    }
    catch {

        data =
            null;
    }


    if (!response.ok) {

        throw new Error(
            data?.error ||
            data?.message ||
            "MY GREMBLE REQUEST FAILED."
        );
    }


    return data;
}


/* =========================================================
   LOAD FROM SERVER
========================================================= */

async function loadMyGremble(
    force = false
) {

    const token =
        getGrembleAvatarSessionToken();


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


        renderSavedAvatar();

        return;
    }


    if (
        !force &&
        avatarLoadedForSession &&
        token ===
            lastAvatarSessionToken
    ) {

        return;
    }


    const cached =
        loadAvatarCache();


    if (cached) {

        savedGrembleAvatar =
            normalizeAvatar(
                cached
            );


        renderSavedAvatar();
    }


    try {

        const data =
            await avatarApiRequest({
                method:
                    "GET"
            });


        const avatar =
            data?.avatar ||
            data?.profile ||
            data?.data ||
            data;


        const customBackgroundUrl =
            data?.custom_background_url ||
            data?.customBackgroundUrl ||
            avatar?.custom_background_url ||
            null;


        savedGrembleAvatar =
            normalizeAvatar(
                avatar,
                customBackgroundUrl
            );


        /*
            Force hats off.
        */

        savedGrembleAvatar.hat =
            "none";


        saveAvatarCache(
            savedGrembleAvatar
        );


        avatarLoadedForSession =
            true;


        lastAvatarSessionToken =
            token;


        renderSavedAvatar();

    }
    catch (error) {

        console.error(
            "Load My Gremble error:",
            error
        );


        if (!cached) {

            savedGrembleAvatar =
                normalizeAvatar(
                    DEFAULT_GREMBLE_AVATAR
                );


            renderSavedAvatar();
        }
    }
}


/* =========================================================
   UPLOAD CUSTOM BACKGROUND
========================================================= */

async function uploadCustomBackground(
    file
) {

    if (!file) {

        return null;
    }


    const token =
        getGrembleAvatarSessionToken();


    if (!token) {

        throw new Error(
            "PLEASE LOG IN WITH TELEGRAM FIRST."
        );
    }


    const formData =
        new FormData();


    formData.append(
        "file",
        file
    );


    formData.append(
        "action",
        "upload-background"
    );


    const response =
        await fetch(
            GREMBLE_AVATAR_ENDPOINT,
            {

                method:
                    "POST",

                headers: {

                    Authorization:
                        `Bearer ${token}`
                },

                body:
                    formData
            }
        );


    let data =
        null;


    try {

        data =
            await response.json();

    }
    catch {

        data =
            null;
    }


    if (!response.ok) {

        throw new Error(
            data?.error ||
            data?.message ||
            "BACKGROUND UPLOAD FAILED."
        );
    }


    return data;
}


/* =========================================================
   SAVE MY GREMBLE
========================================================= */

async function saveMyGremble() {

    const saveButton =
        document.getElementById(
            "saveMyGrembleButton"
        );


    const token =
        getGrembleAvatarSessionToken();


    if (!token) {

        setAvatarStatus(
            "PLEASE LOG IN WITH TELEGRAM FIRST.",
            "error"
        );


        return;
    }


    if (saveButton) {

        saveButton.disabled =
            true;


        saveButton.textContent =
            "SAVING...";
    }


    setAvatarStatus(
        "SAVING YOUR GREMBLE...",
        "loading"
    );


    try {

        let customBackgroundPath =
            editingGrembleAvatar
                .custom_background_path ||
            null;


        let customBackgroundUrl =
            editingGrembleAvatar
                .custom_background_url ||
            null;


        const customFile =
            editingGrembleAvatar
                .custom_background_file;


        if (customFile) {

            const uploadResult =
                await uploadCustomBackground(
                    customFile
                );


            customBackgroundPath =
                uploadResult
                    ?.custom_background_path ||
                uploadResult
                    ?.path ||
                uploadResult
                    ?.background_path ||
                customBackgroundPath;


            customBackgroundUrl =
                uploadResult
                    ?.custom_background_url ||
                uploadResult
                    ?.url ||
                uploadResult
                    ?.signed_url ||
                customBackgroundUrl;
        }


        const avatarToSave = {

            pose:
                editingGrembleAvatar.pose,

            outfit:
                editingGrembleAvatar.outfit,

            /*
                Keep database compatibility,
                but hats are disabled.
            */
            hat:
                "none",

            background:
                editingGrembleAvatar.background,

            custom_background_path:
                customBackgroundPath,

            role:
                editingGrembleAvatar.role,

            energy:
                editingGrembleAvatar.energy,

            here_for:
                editingGrembleAvatar.here_for,

            message:
                (
                    editingGrembleAvatar
                        .message ||
                    ""
                )
                    .trim()
                    .slice(
                        0,
                        200
                    )
        };


        const result =
            await avatarApiRequest({

                method:
                    "POST",

                headers: {

                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(
                        avatarToSave
                    )
            });


        const returnedAvatar =
            result?.avatar ||
            result?.profile ||
            result?.data ||
            avatarToSave;


        const returnedBackgroundUrl =
            result
                ?.custom_background_url ||
            result
                ?.customBackgroundUrl ||
            returnedAvatar
                ?.custom_background_url ||
            customBackgroundUrl;


        savedGrembleAvatar =
            normalizeAvatar(
                {

                    ...avatarToSave,

                    ...returnedAvatar,

                    custom_background_path:
                        returnedAvatar
                            ?.custom_background_path ||
                        customBackgroundPath
                },

                returnedBackgroundUrl
            );


        savedGrembleAvatar.hat =
            "none";


        saveAvatarCache(
            savedGrembleAvatar
        );


        avatarLoadedForSession =
            true;


        lastAvatarSessionToken =
            token;


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

        if (saveButton) {

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
        BASE
    */

    context.fillStyle =
        "#03110b";


    context.fillRect(
        0,
        0,
        WIDTH,
        HEIGHT
    );


    /*
        BACKGROUND
    */

    const backgroundSrc =
        getBackgroundImage(
            savedGrembleAvatar
        );


    if (backgroundSrc) {

        try {

            const background =
                await loadExportImage(
                    backgroundSrc
                );


            drawCover(
                context,
                background,
                WIDTH,
                HEIGHT
            );

        }
        catch (error) {

            console.warn(
                "Could not load background for export:",
                error
            );
        }
    }


    /*
        DARK OVERLAY
    */

    const gradient =
        context.createLinearGradient(
            0,
            0,
            0,
            HEIGHT
        );


    gradient.addColorStop(
        0,
        "rgba(0, 0, 0, 0.08)"
    );


    gradient.addColorStop(
        1,
        "rgba(0, 0, 0, 0.48)"
    );


    context.fillStyle =
        gradient;


    context.fillRect(
        0,
        0,
        WIDTH,
        HEIGHT
    );


    /*
        CHARACTER
    */

    const characterSrc =
        getCharacterImage(
            savedGrembleAvatar
        );


    const character =
        await loadExportImage(
            characterSrc
        );


    drawContain(
        context,
        character,
        70,
        80,
        WIDTH - 140,
        HEIGHT - 150
    );


    /*
        BRAND
    */

    context.textAlign =
        "left";


    context.fillStyle =
        "#ffffff";


    context.font =
        "700 34px Arial";


    context.fillText(
        "MY GREMBLE",
        55,
        70
    );


    context.fillStyle =
        "#8cff00";


    context.font =
        "900 34px Arial";


    context.textAlign =
        "right";


    context.fillText(
        "#GREMBLE",
        WIDTH - 55,
        70
    );


    /*
        PERSONALITY CARD
    */

    const panelX =
        55;


    const panelY =
        HEIGHT - 235;


    const panelWidth =
        WIDTH - 110;


    const panelHeight =
        170;


    context.fillStyle =
        "rgba(1, 17, 10, 0.86)";


    context.beginPath();


    if (
        typeof context.roundRect ===
        "function"
    ) {

        context.roundRect(
            panelX,
            panelY,
            panelWidth,
            panelHeight,
            28
        );

    }
    else {

        context.rect(
            panelX,
            panelY,
            panelWidth,
            panelHeight
        );
    }


    context.fill();


    context.strokeStyle =
        "rgba(140, 255, 0, 0.35)";


    context.lineWidth =
        2;


    context.stroke();


    /*
        LABELS
    */

    context.textAlign =
        "left";


    context.fillStyle =
        "rgba(255,255,255,0.6)";


    context.font =
        "700 18px Arial";


    context.fillText(
        "ROLE",
        90,
        panelY + 45
    );


    context.fillText(
        "ENERGY",
        350,
        panelY + 45
    );


    context.fillText(
        "HERE FOR",
        650,
        panelY + 45
    );


    /*
        VALUES
    */

    context.fillStyle =
        "#ffffff";


    context.font =
        "900 26px Arial";


    context.fillText(
        savedGrembleAvatar.role
            .toUpperCase(),
        90,
        panelY + 80
    );


    context.fillText(
        savedGrembleAvatar.energy
            .toUpperCase(),
        350,
        panelY + 80
    );


    context.fillText(
        savedGrembleAvatar.here_for
            .toUpperCase(),
        650,
        panelY + 80
    );


    /*
        MESSAGE
    */

    context.fillStyle =
        "#8cff00";


    context.font =
        "700 18px Arial";


    context.fillText(
        "MY MESSAGE",
        90,
        panelY + 120
    );


    context.fillStyle =
        "#ffffff";


    context.font =
        "500 19px Arial";


    const message =
        savedGrembleAvatar.message ||
        "";


    const maxMessageLength =
        85;


    const exportMessage =
        message.length >
        maxMessageLength
            ? (
                message.slice(
                    0,
                    maxMessageLength
                ) +
                "..."
            )
            : message;


    context.fillText(
        exportMessage,
        220,
        panelY + 120
    );


    /*
        CREATE BLOB
    */

    return new Promise(
        (
            resolve,
            reject
        ) => {

            canvas.toBlob(
                blob => {

                    if (!blob) {

                        reject(
                            new Error(
                                "Could not create Gremble image."
                            )
                        );

                        return;
                    }


                    resolve(
                        blob
                    );
                },

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

    if (downloadMyGrembleButton) {

        downloadMyGrembleButton.disabled =
            true;
    }


    try {

        const blob =
            await createGrembleCardBlob();


        const url =
            URL.createObjectURL(
                blob
            );


        const link =
            document.createElement(
                "a"
            );


        link.href =
            url;


        link.download =
            "my-gremble.png";


        document.body.appendChild(
            link
        );


        link.click();


        link.remove();


        setTimeout(
            () => {

                URL.revokeObjectURL(
                    url
                );

            },
            1500
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

        if (downloadMyGrembleButton) {

            downloadMyGrembleButton.disabled =
                false;
        }
    }
}


/* =========================================================
   SHARE ON X
========================================================= */

async function shareMyGremble() {

    if (shareMyGrembleButton) {

        shareMyGrembleButton.disabled =
            true;
    }


    try {

        const blob =
            await createGrembleCardBlob();


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


        const shareData = {

            title:
                "My Gremble",

            text:
                "Meet my Gremble 👀 #GREMBLE",

            files: [
                file
            ]
        };


        if (
            navigator.share &&
            (
                !navigator.canShare ||
                navigator.canShare(
                    shareData
                )
            )
        ) {

            await navigator.share(
                shareData
            );


            return;
        }


        /*
            Desktop fallback:
            download image first and open X composer.
        */

        const url =
            URL.createObjectURL(
                blob
            );


        const link =
            document.createElement(
                "a"
            );


        link.href =
            url;


        link.download =
            "my-gremble.png";


        document.body.appendChild(
            link
        );


        link.click();

        link.remove();


        setTimeout(
            () => {

                URL.revokeObjectURL(
                    url
                );

            },
            1500
        );


        const text =
            encodeURIComponent(
                "Meet my Gremble 👀 #GREMBLE"
            );


        window.open(
            `https://x.com/intent/post?text=${text}`,
            "_blank",
            "noopener,noreferrer"
        );

    }
    catch (error) {

        if (
            error?.name !==
            "AbortError"
        ) {

            console.error(
                "Share My Gremble error:",
                error
            );
        }

    }
    finally {

        if (shareMyGrembleButton) {

            shareMyGrembleButton.disabled =
                false;
        }
    }
}


/* =========================================================
   RESET WHEN LOGGED OUT
========================================================= */

function resetMyGrembleSession() {

    avatarLoadedForSession =
        false;


    lastAvatarSessionToken =
        "";


    savedGrembleAvatar =
        normalizeAvatar(
            loadAvatarCache() ||
            DEFAULT_GREMBLE_AVATAR
        );


    savedGrembleAvatar.hat =
        "none";


    editingGrembleAvatar = {

        ...savedGrembleAvatar
    };


    renderSavedAvatar();
}


/* =========================================================
   CHECK SESSION CHANGES
========================================================= */

function watchGrembleSession() {

    let previousToken =
        getGrembleAvatarSessionToken();


    setInterval(
        () => {

            const currentToken =
                getGrembleAvatarSessionToken();


            if (
                currentToken ===
                previousToken
            ) {

                return;
            }


            previousToken =
                currentToken;


            if (currentToken) {

                avatarLoadedForSession =
                    false;


                loadMyGremble(
                    true
                );

            }
            else {

                resetMyGrembleSession();
            }

        },
        1500
    );
}


/* =========================================================
   WATCH MY GREMBLE VIEW
========================================================= */

function watchMyGrembleView() {

    const myGrembleView =
        document.querySelector(
            '[data-site-view-name="my-gremble"]'
        );


    if (!myGrembleView) {

        return;
    }


    const observer =
        new MutationObserver(
            () => {

                if (
                    !myGrembleView.hidden
                ) {

                    loadMyGremble();
                }
            }
        );


    observer.observe(
        myGrembleView,
        {
            attributes:
                true,

            attributeFilter: [
                "hidden"
            ]
        }
    );
}


/* =========================================================
   CLEAN OLD HAT ELEMENTS FROM PAGE
========================================================= */

function cleanLegacyHatElements() {

    document
        .querySelectorAll(
            ".gremble-card-hat"
        )
        .forEach(
            element => {

                element.remove();
            }
        );
}


/* =========================================================
   BUTTON EVENTS
========================================================= */

if (editMyGrembleButton) {

    editMyGrembleButton
        .addEventListener(
            "click",
            openGrembleEditor
        );
}


if (downloadMyGrembleButton) {

    downloadMyGrembleButton
        .addEventListener(
            "click",
            downloadMyGremble
        );
}


if (shareMyGrembleButton) {

    shareMyGrembleButton
        .addEventListener(
            "click",
            shareMyGremble
        );
}


/* =========================================================
   INITIALIZE
========================================================= */

function initializeMyGremble() {

    cleanLegacyHatElements();


    const cached =
        loadAvatarCache();


    savedGrembleAvatar =
        normalizeAvatar(
            cached ||
            DEFAULT_GREMBLE_AVATAR
        );


    savedGrembleAvatar.hat =
        "none";


    editingGrembleAvatar = {

        ...savedGrembleAvatar
    };


    renderSavedAvatar();


    createGrembleEditor();


    watchGrembleSession();


    watchMyGrembleView();


    if (
        getGrembleAvatarSessionToken()
    ) {

        loadMyGremble();
    }
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