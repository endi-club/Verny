/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { disableStyle, enableStyle } from "@api/Styles";
import { Devs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";

import styles from "./style.css?managed";

const settings = definePluginSettings({
    hoverToView: {
        type: OptionType.BOOLEAN,
        description: "When hovering over a message, show the contents.",
        default: false,
        restartNeeded: false,
        onChange: () => {
            hoverToViewRegister();
        },
    },
    keybind: {
        type: OptionType.STRING,
        description: "The keybind to show the contents of a message.",
        default: "Insert",
        restartNeeded: false,
    },
    enableForStream: {
        type: OptionType.BOOLEAN,
        description: "Blur all messages in streamer mode.",
        default: false,
        restartNeeded: false,
        onChange: () => {
            enableForStreamRegister();
        },
    },
});

export default definePlugin({
    name: "Don't Leak! - Verny Exclusive",
    description: "Hide all message contents and attachments when you're streaming or sharing your screen.",
    authors: [Devs.Perny],
    settings,
    start() {
        document.addEventListener("keyup", keyUpHandler);
        document.addEventListener("keydown", keyDownHandler);
        hoverToViewRegister();
        enableForStreamRegister();
        enableStyle(styles);
    },
    stop() {
        document.removeEventListener("keyup", keyUpHandler);
        document.removeEventListener("keydown", keyDownHandler);
        disableStyle(styles);
    },
});

function hoverToViewRegister() {
    if (settings.store.hoverToView) {
        document.body.classList.add("hoverToView");
        return;
    }
    document.body.classList.remove("hoverToView");
}

function enableForStreamRegister() {
    if (settings.store.enableForStream) {
        document.body.classList.add("hideinstreamermode");
        return;
    }
    document.body.classList.remove("hideinstreamermode");
}

function keyUpHandler(e: KeyboardEvent) {
    if (e.key !== settings.store.keybind) return;
    document.body.classList.remove("youcanleaknow");
}

function keyDownHandler(e: KeyboardEvent) {
    if (e.key !== settings.store.keybind) return;
    document.body.classList.add("youcanleaknow");
}
