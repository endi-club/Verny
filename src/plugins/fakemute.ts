/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Devs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";

export default definePlugin({
    name: "WeSendVoice - Verny Exclusive",
    description: "Don't stop sending voice data when you mute or deafen yourself. ",
    authors: [Devs.Perny],
    patches: [
        {
            find: "e.setSelfMute(n)",
            replacement: [{
                // prevent client-side mute
                match: /e\.setSelfMute\(n\),/g,
                replace: 'e.setSelfMute(Vencord.Settings.plugins["WeSendVoice - Verny Exclusive"].fakeMute?false:n),'
            },
            {
                // prevent client-side deafen
                match: /e\.setSelfDeaf\(t\.deaf\)/g,
                replace: 'e.setSelfDeaf(Vencord.Settings.plugins["WeSendVoice - Verny Exclusive"].fakeDeafen?false:t.deaf)'
            },
            {
                // bypass guild mute
                match: /e\.setMute\(n\)/g,
                replace: 'e.setMute(Vencord.Settings.plugins["WeSendVoice - Verny Exclusive"].noGuildMute?false:n)'
            },
            {
                // bypass guild deafen
                match: /e\.setDeaf\(t\.deaf\)/g,
                replace: 'e.setDeaf(Vencord.Settings.plugins["WeSendVoice - Verny Exclusive"].noGuildDeafen?false:t.deaf)'
            },
            {
                // disable speaking indicator
                match: /h\.SpeakingFlags\.VOICE/g,
                replace: "h.SpeakingFlags.NONE"
            }

            ]
        }
    ],
    options: {
        fakeMute: {
            description: "Keep sending voice data when you mute yourself",
            type: OptionType.BOOLEAN,
            default: false,
        },
        fakeDeafen: {
            description: "Don't mute incoming voice data when you deafen yourself",
            type: OptionType.BOOLEAN,
            default: false,
        },
        noGuildMute: {
            description: "Discord, please fucking fix this! Bypass guild mute.",
            type: OptionType.BOOLEAN,
            default: false,
        },
        noGuildDeafen: {
            description: "Discord, please fucking fix this! Bypass guild deafen.",
            type: OptionType.BOOLEAN,
            default: false,
        },
        dontSpeak: {
            description: "Disables the green speaking indicator",
            type: OptionType.BOOLEAN,
            default: false,
        },
    },
});
