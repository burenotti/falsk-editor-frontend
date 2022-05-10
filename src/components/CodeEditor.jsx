import {useEffect, useState} from "react";
import useSupportedLangs from "../hooks/useSupportedLangs";
import "./CodeEditor.css"
import Console from "./Console";
import BulbService from "../services/bulbService";

export default function CodeEditor({language, sourceCode, version = null, editable = true, runnable = true}) {
    const supportedLangs = useSupportedLangs();
    const [lang, setLang] = useState({
        language: language,
        version: version,
    })
    const [code, setCode] = useState(sourceCode);
    const [showConsole, setShowConsole] = useState(false);
    const [consoleOutput, setConsoleOutput] = useState("");
    const [running, setRunning] = useState(false);
    const [sandbox, setSandbox] = useState(null);
    const service = new BulbService("http://localhost:8000")

    const updateVer = (event) => {
        setLang({language: lang.language, version: event.target.value});
    }
    const updateLang = (event) => {
        const newLang = event.target.value;
        console.log(newLang);
        setLang({language: newLang, version: getLangVersions(newLang)[0]});
    }
    const getLangVersions = (language) =>
        (supportedLangs.find((l) => l.language === language) ?? {}).versions ?? [];


    const onConsoleInput = (input) => {
        if (running) {
            sandbox.sendInput(input + '\n').then(() => {
                setConsoleOutput(`${consoleOutput}${input}\n`)
            })
        } else {
            alert("Sandbox is not running");
        }
    }

    const createSandbox = async () => {
        setShowConsole(true);
        let sandbox = await service.runCode(lang.language, code, lang.version);
        setSandbox(sandbox);
        setRunning(true);

        const handleMessage = async (message) => {
            setConsoleOutput(consoleOutput + message.data);
        }

        const handleFinish = async (message) => {
            setRunning(false);
            setSandbox(null);
        }

        sandbox.onOutputMessage = handleMessage;
        sandbox.onFinishMessage = handleFinish;
        sandbox.onErrorMessage = async (message) => {
            if (message.error_type === "build_failed")
                setConsoleOutput(message.logs.join(''))
            await handleFinish(message)
        };
    }

    console.log(lang);
    return (
        <div className="editor" style={{width: "700px"}}>
            <div className={`header ${!runnable ? 'hidden' : ''}`}>
                <select name="lang" id="lang" defaultValue={lang.language} onChange={updateLang}>
                    {supportedLangs.map((language) =>
                        <option key={language.language}
                                value={language.language}
                        >
                            {language.language}
                        </option>
                    )}
                </select>
                <select name="lang-ver" id="lang-ver" onChange={updateVer}>
                    {getLangVersions(lang.language).map((ver) =>
                        <option key={lang.language} value={ver}>{ver}</option>
                    )}
                </select>
                {
                    running ?
                        <button className="run-button running" disabled>Kill</button>
                        :
                        <button className="run-button" onClick={createSandbox} disabled={!runnable}>Run</button>
                }
            </div>

            <textarea name="code" id="code" value={code} disabled={!editable}
                      onChange={(e) => setCode(e.target.value)}>
            </textarea>
            {
                showConsole ?
                    <Console
                        output={consoleOutput}
                        onInput={onConsoleInput}
                        onClear={() => {
                            setConsoleOutput("");
                            setShowConsole(false);
                        }}
                    />
                    :
                    ''
            }
        </div>
    )
}
