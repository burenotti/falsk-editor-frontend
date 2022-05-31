import UserCard from "./UserCard";
import SignInButton from "./SignInButton";
import useCurrentUser from "../../hooks/useCurrentUser";
import styles from './Header.module.css'
import {useMemo, useState} from "react";
import Checkbox from "./Checkbox";

export default function Header({snippet, updateSnippet, showPopup}) {
    const [user,] = useCurrentUser();
    const editable = useMemo(
        () => (snippet ?? {}).creator_username === (user ?? {}).username,
        [snippet, user]
    )
    const [editing, setEditing] = useState(false);
    return (
        <header className={`rounded dark-bg flex ${styles.mainHeader}`}>
            {snippet ?
                <>
                    <div className={`${styles.snippet} monospaced main-fg`}>
                        <span>@</span>
                        <span className={styles.snippetAuthor}
                              onClick={() => showPopup(snippet.creator_username)}>
                            {snippet.creator_username}</span>
                        <span style={{margin: "0 10px"}}>/</span>
                        {editing ?
                            <input type="text" value={snippet.name}
                                   autoFocus={true}
                                   onChange={
                                       (e) => updateSnippet({name: e.target.value})
                                   }
                                   onInput={
                                       () => setEditing(false)
                                   }
                            />
                            :
                            <span className={styles.snippetName}
                                  onClick={() => setEditing(editable)}>
                            {snippet.name}</span>
                        }
                    </div>

                    {editable &&
                        <Checkbox
                            checked={snippet.public}
                            onChange={(e) => updateSnippet({public: e.checked})}
                        />
                    }
                </>
                : ""
            }

            <span style={{marginLeft: "auto"}}>
                {user && user.isAuthorized ?
                    <UserCard user={user} showPopup={showPopup}/>
                    :
                    <SignInButton/>}
            </span>
        </header>
    )
}