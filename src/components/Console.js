import "./Console.css"
import {useState} from "react";

export default function Console({output, onInput, onClear}) {

    const [input, setInput] = useState("");

    const handleInput = () => {
        if (onInput)
            onInput(input);
        setInput("");
    }
    return (
        <div className="console">
            <button onClick={onClear} className="clear-button">clear</button>
            <pre className="output">
                {output}
            </pre>
            <div className="console-control-container">
                <input type="text" className="console-input" value={input}
                       onChange={e => setInput(e.target.value)}
                       onKeyDown={e => {
                           if (e.key === "Enter")
                               handleInput()
                       }}
                />
                <button className="send-console-input" onClick={handleInput}>Send</button>
            </div>
        </div>
    );
}