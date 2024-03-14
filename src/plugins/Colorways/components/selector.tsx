/*
 * Vencord, a Discord client mod
 * Copyright (c) 2023 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

/* eslint-disable arrow-parens */

import * as DataStore from "@api/DataStore";
import { CloseIcon, SearchIcon } from "@components/Icons";
import { SettingsTab } from "@components/VencordSettings/shared";
import { openModal } from "@utils/modal";
import { findByCode } from "@webpack";
import {
    Forms,
    Select,
    TextInput,
    Tooltip,
    useCallback,
    useEffect,
    useState,
} from "@webpack/common";

import { ColorwayCSS, LazySwatchLoaded } from "..";
import { fallbackColorways } from "../constants";
import { Colorway } from "../types";
import extractAndRequireModuleIds from "../util/requireModule";
import { ColorPickerModal } from "./colorPicker";
import CreatorModal from "./creatorModal";
import ColorwayInfoModal from "./infoModal";

export default function Selector({
    visibleTabProps = "all",
}: {
    visibleTabProps?: string;
}): JSX.Element | any {
    const [currentColorway, setCurrentColorway] = useState<string>("");
    const [colorways, setColorways] = useState<Colorway[]>([]);
    const [customColorways, setCustomColorways] = useState<Colorway[]>([]);
    const [searchBarVisibility, setSearchBarVisibility] = useState<boolean>(false);
    const [searchString, setSearchString] = useState<string>("");
    const [loaderHeight, setLoaderHeight] = useState<string>("2px");
    const [visibility, setVisibility] = useState<string>(visibleTabProps);
    let visibleColorwayArray: Colorway[];

    switch (visibility) {
        case "all":
            visibleColorwayArray = [...colorways, ...customColorways];
            break;
        case "official":
            visibleColorwayArray = [...colorways];
            break;
        case "custom":
            visibleColorwayArray = [...customColorways];
            break;
        default:
            visibleColorwayArray = [...colorways, ...customColorways];
            break;
    }

    async function loadUI() {
        const colorwaySourceFiles = await DataStore.get(
            "colorwaySourceFiles"
        );
        const responses: Response[] = await Promise.all(
            colorwaySourceFiles.map((url: string) =>
                fetch(url)
            )
        );
        const data = await Promise.all(
            responses.map((res: Response) =>
                res.json().catch(() => { return { colorways: [] }; })
            ));
        const colorways = data.flatMap((json) => json.colorways);
        const baseData = await DataStore.getMany([
            "customColorways",
            "actveColorwayID",
        ]);
        setColorways(colorways || fallbackColorways);
        setCustomColorways(baseData[0]);
        setCurrentColorway(baseData[1]);
    }

    const cached_loadUI = useCallback(loadUI, [setColorways, setCustomColorways, setCurrentColorway]);

    async function searchColorways(e: string) {
        if (!e) {
            cached_loadUI();
            return;
        }
        const colorwaySourceFiles = await DataStore.get("colorwaySourceFiles");
        const data = await Promise.all(
            colorwaySourceFiles.map((url: string) =>
                fetch(url).then((res) => res.json().catch(() => { return { colorways: [] }; }))
            )
        );
        const colorways = data.flatMap((json) => json.colorways);
        const baseData = await DataStore.get("customColorways");
        var results: Colorway[] = [];
        (colorways || fallbackColorways).find((Colorway: Colorway) => {
            if (Colorway.name.toLowerCase().includes(e.toLowerCase()))
                results.push(Colorway);
        });
        var customResults: Colorway[] = [];
        baseData.find((Colorway: Colorway) => {
            if (Colorway.name.toLowerCase().includes(e.toLowerCase()))
                customResults.push(Colorway);
        });
        setColorways(results);
        setCustomColorways(customResults);
    }

    useEffect(() => {
        if (!searchString) {
            cached_loadUI();
        }
        setLoaderHeight("0px");
    }, [searchString]);

    return (
        <SettingsTab title="Colors">
            <div className="colorwaysSettingsSelector-wrapper">
                <div className="colorwaySelector-doublePillBar">
                    {searchBarVisibility === true ? (
                        <TextInput
                            inputClassName="colorwaySelector-searchInput"
                            className="colorwaySelector-search"
                            placeholder="Search for Colorways..."
                            value={searchString}
                            onChange={(e: string) => {
                                searchColorways(e);
                                setSearchString(e);
                            }}
                        />
                    ) : (
                        <div className="colorwaySelector-pillWrapper">
                            <Forms.FormTitle style={{ marginBottom: 0 }}>Show:</Forms.FormTitle>
                            <Select look={1} optionClassName="colorwaySelector-pillOption" className="colorwaySelector-pill" popoutClassName="colorwaySelector-pillPopout" options={[{
                                value: "all",
                                label: "All"
                            },
                            {
                                value: "official",
                                label: "Official"
                            },
                            {
                                value: "custom",
                                label: "Custom"
                            }]} select={value => {
                                setVisibility(value);
                                DataStore.set("colorwaysBtnPos", value);
                            }} isSelected={value => visibility === value} serialize={String} />
                        </div>
                    )}
                    <div className="colorwaySelector-pillSeparator" />
                    <div className="colorwaySelector-pillWrapper">
                        <Tooltip text="Refresh Colorways...">
                            {({ onMouseEnter, onMouseLeave }) => {
                                return (
                                    <div
                                        className="colorwaySelector-pill"
                                        id="colorway-refreshcolorway"
                                        onMouseEnter={onMouseEnter}
                                        onMouseLeave={onMouseLeave}
                                        onClick={() => {
                                            setLoaderHeight("2px");
                                            cached_loadUI().then(() => {
                                                setLoaderHeight("0px");
                                            });
                                        }}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            x="0px"
                                            y="0px"
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                        >
                                            <g id="Frame_-_24px">
                                                <rect
                                                    y="0"
                                                    fill="none"
                                                    width="24"
                                                    height="24"
                                                ></rect>
                                            </g>
                                            <g id="Filled_Icons">
                                                <g>
                                                    <path d="M6.351,6.351C7.824,4.871,9.828,4,12,4c4.411,0,8,3.589,8,8h2c0-5.515-4.486-10-10-10 C9.285,2,6.779,3.089,4.938,4.938L3,3v6h6L6.351,6.351z"></path>
                                                    <path d="M17.649,17.649C16.176,19.129,14.173,20,12,20c-4.411,0-8-3.589-8-8H2c0,5.515,4.486,10,10,10 c2.716,0,5.221-1.089,7.062-2.938L21,21v-6h-6L17.649,17.649z"></path>
                                                </g>
                                            </g>
                                        </svg>
                                    </div>
                                );
                            }}
                        </Tooltip>
                        <Tooltip text="Create Colorway...">
                            {({ onMouseEnter, onMouseLeave }) => {
                                return (
                                    <div
                                        className="colorwaySelector-pill"
                                        onMouseEnter={onMouseEnter}
                                        onMouseLeave={onMouseLeave}
                                        onClick={() => {
                                            if (!LazySwatchLoaded) {
                                                extractAndRequireModuleIds(
                                                    findByCode(
                                                        "Promise.all",
                                                        "openModalLazy",
                                                        "location_page"
                                                    )
                                                );
                                            }
                                            openModal((props) => (
                                                <CreatorModal
                                                    modalProps={props}
                                                    loadUIProps={cached_loadUI}
                                                />
                                            ));
                                        }}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            aria-hidden="true"
                                            role="img"
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                fill="currentColor"
                                                d="M20 11.1111H12.8889V4H11.1111V11.1111H4V12.8889H11.1111V20H12.8889V12.8889H20V11.1111Z"
                                            />
                                        </svg>
                                    </div>
                                );
                            }}
                        </Tooltip>
                        <Tooltip text="Open Color Stealer">
                            {({ onMouseEnter, onMouseLeave }) => {
                                return (
                                    <div
                                        className="colorwaySelector-pill"
                                        id="colorway-opencolorstealer"
                                        onMouseEnter={onMouseEnter}
                                        onMouseLeave={onMouseLeave}
                                        onClick={() => {
                                            openModal((props) => <ColorPickerModal modalProps={props} />);
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M12.433 10.07C14.133 10.585 16 11.15 16 8a8 8 0 1 0-8 8c1.996 0 1.826-1.504 1.649-3.08-.124-1.101-.252-2.237.351-2.92.465-.527 1.42-.237 2.433.07zM8 5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm4.5 3a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM5 6.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm.5 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                                        </svg>
                                    </div>
                                );
                            }}
                        </Tooltip>
                        {searchBarVisibility === false ? (
                            <Tooltip text="Search...">
                                {({ onMouseEnter, onMouseLeave }) => {
                                    return (
                                        <div
                                            className="colorwaySelector-pill"
                                            onMouseEnter={onMouseEnter}
                                            onMouseLeave={onMouseLeave}
                                            onClick={() =>
                                                setSearchBarVisibility(true)
                                            }
                                        >
                                            <SearchIcon
                                                width={14}
                                                height={14}
                                            />
                                        </div>
                                    );
                                }}
                            </Tooltip>
                        ) : (
                            <Tooltip text="Close Search">
                                {({ onMouseEnter, onMouseLeave }) => {
                                    return (
                                        <div
                                            className="colorwaySelector-pill"
                                            onMouseEnter={onMouseEnter}
                                            onMouseLeave={onMouseLeave}
                                            onClick={() => {
                                                searchColorways("");
                                                setSearchString("");
                                                setSearchBarVisibility(false);
                                            }}
                                        >
                                            <CloseIcon width={14} height={14} />
                                        </div>
                                    );
                                }}
                            </Tooltip>
                        )}
                    </div>
                </div>
                <div className="colorwaysLoader-barContainer"><div className="colorwaysLoader-bar" style={{ height: loaderHeight }}></div></div>
                <div className="ColorwaySelectorWrapper">
                    {visibleColorwayArray.length === 0 ? (
                        <>
                            <Forms.FormTitle
                                style={{
                                    marginBottom: 0,
                                    width: "100%",
                                    textAlign: "center",
                                }}
                            >
                                No colorways...
                            </Forms.FormTitle>
                        </>
                    ) : (
                        <></>
                    )}
                    {visibleColorwayArray.map((color, ind) => {
                        var colors: Array<string> = color.colors || [
                            "accent",
                            "primary",
                            "secondary",
                            "tertiary",
                        ];
                        return (
                            <Tooltip text={color.name}>
                                {({ onMouseEnter, onMouseLeave }) => {
                                    return (
                                        <div
                                            className={"discordColorway" + (currentColorway === color.name ? " active" : "")}
                                            id={"colorway-" + color.name}
                                            data-last-official={
                                                ind + 1 === colorways.length
                                            }
                                            onMouseEnter={onMouseEnter}
                                            onMouseLeave={onMouseLeave}
                                        >
                                            <div
                                                className="colorwayInfoIconContainer"
                                                onClick={() => {
                                                    openModal((props) => (
                                                        <ColorwayInfoModal
                                                            modalProps={
                                                                props
                                                            }
                                                            colorwayProps={
                                                                color
                                                            }
                                                            discrimProps={customColorways.includes(
                                                                color
                                                            )}
                                                            loadUIProps={cached_loadUI}
                                                        />
                                                    ));
                                                }}
                                            >
                                                <div className="colorwayInfoIcon">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        fill="currentColor"
                                                        viewBox="0 0 16 16"
                                                    >
                                                        <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="colorwayCheckIconContainer">
                                                <div className="colorwayCheckIcon">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="20"
                                                        height="20"
                                                        fill="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <circle r="8" cx="12" cy="12" fill="var(--white-500)" />
                                                        <g fill="none" fill-rule="evenodd">
                                                            <path fill="var(--brand-500)" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                                        </g>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div
                                                className="discordColorwayPreviewColorContainer"
                                                onClick={() => {
                                                    if (
                                                        currentColorway ===
                                                        color.name
                                                    ) {
                                                        DataStore.set(
                                                            "actveColorwayID",
                                                            null
                                                        );
                                                        DataStore.set(
                                                            "actveColorway",
                                                            null
                                                        );
                                                        ColorwayCSS.remove();
                                                    } else {
                                                        DataStore.set(
                                                            "actveColorwayID",
                                                            color.name
                                                        );
                                                        DataStore.set(
                                                            "actveColorway",
                                                            color.import
                                                        );
                                                        ColorwayCSS.set(
                                                            color.import
                                                        );
                                                    }
                                                    DataStore.get(
                                                        "actveColorwayID"
                                                    ).then(
                                                        (
                                                            actveColorwayID: string
                                                        ) =>
                                                            setCurrentColorway(
                                                                actveColorwayID
                                                            )
                                                    );
                                                }}
                                            >
                                                {colors.map((colorItm) => {
                                                    return (
                                                        <div
                                                            className="discordColorwayPreviewColor"
                                                            style={{
                                                                // prettier-ignore
                                                                backgroundColor: color[colorItm],
                                                            }}
                                                        />
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                }}
                            </Tooltip>
                        );
                    })}
                </div>
            </div>
        </SettingsTab>
    );
}
