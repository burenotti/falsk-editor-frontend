import {useState} from "react";
import useSupportedLangs from "../hooks/useSupportedLangs";
import "./CodeEditor.css"
import Console from "./Console";
import BulbService from "../services/bulbService";
import SignInButton from "./ui/SignInButton";
import UserCard from "./ui/UserCard";
import useCurrentUser from "../hooks/useCurrentUser";
import CodeEdit from "./ui/CodeEdit";

export default function CodeEditor({language, sourceCode, version = null, editable = true, runnable = true}) {
    const [user,] = useCurrentUser();
    const supportedLangs = useSupportedLangs();
    const [lang, setLang] = useState({
        language: language,
        version: version,
    })
    const [code, setCode] = useState(sourceCode);
    const [consoleOutput, setConsoleOutput] = useState("");
    const [running, setRunning] = useState(false);
    const [sandbox, setSandbox] = useState(null);
    const service = new BulbService()
    const updateVer = (event) => {
        setLang({language: lang.language, version: event.target.value});
    }
    const updateLang = (event) => {
        const newLang = event.target.value;
        setLang({language: newLang, version: getLangVersions(newLang)[0]});
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
        let sandbox = await service.runCode(lang.language, code, lang.version);
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
                    {getLangVersions(lang.language).map((ver) =>
                        <option key={lang.language} value={ver}>{ver}</option>
                    )}
                </select>
                {
                    running ?
                        <button className="run-button running" onClick={killSandbox}>Kill</button>
                        :
                        <button className="run-button" onClick={createSandbox} disabled={!runnable}>Run</button>
                }
                <span style={{marginLeft: "auto"}}>
                {user.isAuthorized ?
                    <UserCard user={user}/>
                    :
                    <SignInButton/>
                }
                </span>
            </div>
            <div className="main-content">
                <CodeEdit value={code} onChange={setCode} editable={editable}/>
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
