export default function CodeEdit({value, onChange, editable = true}) {

    const handleKeyDown = (e) => {
        if (e.code === 'Tab') {
            e.preventDefault();
            const textArea = e.target;
            const caretPos = textArea.selectionStart;
            const newCode = value.slice(0, caretPos) + '\t' + value.slice(caretPos,);
            onChange(newCode);
        }
    }

    return (
        <textarea
            name="code"
            id="code"
            spellCheck="false"
            value={value}
            disabled={!editable}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}>
        </textarea>
    )
}
