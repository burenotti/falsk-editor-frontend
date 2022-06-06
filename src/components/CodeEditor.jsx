import {useState} from "react";
import useSupportedLangs from "../hooks/useSupportedLangs";
import "./CodeEditor.css"
import Console from "./Console";
import BulbService from "../services/bulbService";
import CodeEdit from "./ui/CodeEdit";

export default function CodeEditor(
    {
        language, sourceCode, snippet, onChange, version = null,
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
    const getLangVersions = (language) =>
        (supportedLangs.find((l) => l.language === language) ?? {}).versions ?? [];


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
        let sandbox = await service.runCode(snippet.language, snippet.code, snippet.version);
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


    return (
        <div className="editor">
            <div className={`header ${!runnable ? 'hidden' : ''}`}>
                <select name="lang" id="lang" defaultValue="none" onChange={updateLang}>
                    {supportedLangs.map((language) =>
                        <option key={language.language}
                                value={language.language}
                        >
                            {language.language}
                        </option>
                    )}
                    <option value="none">-</option>
                </select>
                <select name="lang-ver" id="lang-ver" onChange={updateVer}>
                    {getLangVersions((snippet ?? {}).language).map((ver) =>
                        <option key={ver} value={ver}>{ver}</option>
                    )}
                </select>
                {
                    running ?
                        <button className="run-button running" onClick={killSandbox}>Kill</button>
                        :
                        <button className="run-button" onClick={createSandbox} disabled={!runnable}>Run</button>
                }
            </div>
            <div className="main-content">
                <CodeEdit value={(snippet ?? {}).code}
                          onChange={(newCode) => onChange({code: newCode})}
                          editable={editable}
                />
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
