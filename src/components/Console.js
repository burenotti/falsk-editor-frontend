import "./Console.css"
import {useEffect, useRef, useState} from "react";

export default function Console({output, onInput, onClear}) {

    const [input, setInput] = useState("");
    const outputRef = useRef(null);

    const handleInput = () => {
        if (onInput)
            onInput(input);
        setInput("");
    }

    useEffect(()=> {
        outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }, [output]);
    return (
        <div className="console">
            <button onClick={onClear} className="reset fg-main hv-light bg-tr clear-button">clear</button>
            <pre className="output fg-main monospaced" ref={outputRef}>
                {output}
            </pre>
            <div className="console-control-container">
                <input type="text" className="console-input fg-main monospaced" value={input}
                       onChange={e => setInput(e.target.value)}
                       onKeyDown={e => {
                           if (e.key === "Enter")
                               handleInput()
                       }}
                />
                <button className="reset px-15 py-7 monospaced bg-tr fg-main hv-light" onClick={handleInput}>Send</button>
            </div>
        </div>
    );
}