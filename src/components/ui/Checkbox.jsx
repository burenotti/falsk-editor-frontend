import styles from './Checkbox.module.css'

export default function Checkbox({name, checked, onChange}) {
    const wrappedOnChange = (e) => {
        onChange({
            checked: e.target.checked,
            name: name,
        })
    }

    return (
        <label className={`${styles.checkbox} ${checked ? styles.checked : ""}`}>
            <input type="checkbox" name={name} className={"hidden"} onChange={wrappedOnChange}/>
        </label>
    )
}