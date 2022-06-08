import {useEffect, useState} from "react";
import useSupportedLangs from "../hooks/useSupportedLangs";
import "./CodeEditor.css"
import Console from "./Console";
import BulbService from "../services/bulbService";
import Editor from "@monaco-editor/react";
import Resizeable from "./ui/Resizeable";

export default function CodeEditor(
    {
        snippet, onChange,
        editable = true, runnable = true
    }
) {
    const supportedLangs = useSupportedLangs();
    const [consoleOutput, setConsoleOutput] = useState("");
    const [running, setRunning] = useState(false);
    const [sandbox, setSandbox] = useState(null);
    const service = new BulbService()
    const updateVer = (event) => {
        onChange({language_version: event.target.value});
    }
    const updateLang = (event) => {
        const newLang = event.target.value;
        onChange({language: newLang, language_version: getLangVersions(newLang)[0]});
    }
    const getLangVersions = (language) => {
        return supportedLangs[language] ?? [];
    }
    console.log(supportedLangs);

    const onConsoleInput = (input) => {
        if (running) {
            sandbox.sendInput(input + '\n').then(() => {
                setConsoleOutput(out => `${out}${input}\n`);
            })
        } else {
            alert("Sandbox is not running");
        }
    }

    const createSandbox = async () => {
        setConsoleOutput(() => "");
        let sandbox = await service.runCode(snippet.language, snippet.code, snippet.language_version);
        setSandbox(sandbox);
        setRunning(true);

        const handleMessage = async (message) => {
            setConsoleOutput(out => out + message.data);
        }

        const handleFinish = async (message) => {
            setRunning(false);
            setSandbox(null);
        }

        sandbox.onOutputMessage = handleMessage;
        sandbox.onFinishMessage = handleFinish;
        sandbox.onErrorMessage = async (message) => {
            if (message.error_type === "build_failed")
                setConsoleOutput(() => message.logs.join(''));
            await handleFinish(message)
        };
    }

    const killSandbox = async () => {
        await sandbox.terminate();
    }

    const setEditorTheme = (monaco) => {
        monaco.editor.defineTheme("one-dark", {
            base: "vs-dark",
            inherit: true,
            rules: [],
            colors: {
                "editor.background": '#10131a',
            },
        });
        console.log('before mount')
    }

    return (
        <div className="editor rounded container">
            <div className={`header ${!runnable ? 'hidden' : ''}`}>
                <select name="lang" id="lang" value={snippet.language} onChange={updateLang} className="select">
                    {Object.keys(supportedLangs).map((language) =>
                        <option key={language}
                                value={language}
                        >
                            {language}
                        </option>
                    )}
                </select>
                <select name="lang-ver" id="lang-ver" value={snippet.language_version} onChange={updateVer} className="select">
                    {getLangVersions(snippet.language).map((ver) =>
                        <option key={ver} value={ver}>{ver}</option>
                    )}
                </select>
                {
                    running ?
                        <button className="reset bg-failed rounded  px-15 py-7 bolder fg-accent"
                                onClick={killSandbox}>Kill</button>
                        :
                        <button className="reset bg-success rounded px-15 py-7 bolder fg-accent" onClick={createSandbox}
                                disabled={!runnable}>Run</button>
                }
            </div>
            <div className="main-content">
                <Resizeable initialWidth={700}>
                    <Editor value={(snippet ?? {}).code}
                            onChange={(newCode) => onChange({code: newCode})}
                            editable={editable}
                            language={(snippet ?? {}).language}
                            beforeMount={setEditorTheme}
                            width={"100%"}
                            height={"calc(100vh - 170px)"}
                            theme={"one-dark"}
                            options={{
                                minimap: {
                                    enabled: false,
                                },
                                fontFamily: "Cascadia Code",
                                fontSize: "16px",
                            }}

                    />
                </Resizeable>
                <Console
                    output={consoleOutput}
                    onInput={onConsoleInput}
                    onClear={() => {
                        setConsoleOutput("");
                    }}
                />
            </div>
        </div>
    )
}
