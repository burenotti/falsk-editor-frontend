import {NavLink} from "react-router-dom";
import styles from "./SnippetsPopup.module.css"
import {useEffect, useState} from "react";
import BulbService from "../services/bulbService";
import useCurrentUser from "../hooks/useCurrentUser";

export default function SnippetsPopup({username, onClose}) {

    const [snippets, setSnippets] = useState([]);
    const [user,] = useCurrentUser();
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (!user) return;
        const service = new BulbService();
        service.getSnippetsList(username, user.accessToken).then(setSnippets);

    }, [user, username])

    const filtered = snippets.filter((s) => s.name.startsWith(searchQuery))
    return (
        <div className={`dark-bg rounded ${styles.popup}`}>
            <div className="flex">
                <input type="text" placeholder="Search..."
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                       className={`reset ${styles.searchBar} monospaced rounded darker-bg`}/>
                <button className={"reset monospaced"} onClick={() => onClose()}
                        style={{background: "none", color: "var(--main-border)"}}>x</button>
            </div>
            <ul>
                {filtered.map((snippet) => (
                        <li>
                            <span className={"monospaced main-fg"} style={{marginRight: 10}}>/</span>
                            <NavLink className={"monospaced main-fg"} to={`/@${snippet.creator_username}/${snippet.name}`}>
                                {snippet.name}
                            </NavLink>
                        </li>
                    )
                )}
            </ul>
        </div>
    )
}