import UserCard from "./UserCard";
import SignInButton from "./SignInButton";
import useCurrentUser from "../../hooks/useCurrentUser";
import styles from './Header.module.css'
import {useState} from "react";
import Checkbox from "./Checkbox";

export default function Header({snippet, updateSnippet}) {
    const [user,] = useCurrentUser();
    const [editing, setEditing] = useState(false);
    return (
        <header className={`rounded dark-bg flex ${styles.mainHeader}`}>
            {snippet ?
                <>
                    <div className={`${styles.snippet} monospaced main-fg`}>
                        <span>@</span>
                        <span className={styles.snippetAuthor}>{snippet.creator_username}</span>
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
                                  onClick={() => setEditing(true)}>
                            {snippet.name}</span>
                        }
                    </div>
                    <Checkbox
                        checked={snippet.public}
                        onChange={(e) => updateSnippet({public: e.checked})}
                    />
                </>
                : ""
            }

            <span style={{marginLeft: "auto"}}>
                {user && user.isAuthorized ?
                    <UserCard user={user}/>
                    :
                    <SignInButton/>}
            </span>
        </header>
    )
}