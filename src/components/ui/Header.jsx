import useCurrentUser from "../../hooks/useCurrentUser";
import styles from './Header.module.css'
import {useMemo, useState} from "react";
import UserCard from "./UserCard";
import Checkbox from "./Checkbox";
import SignInButton from "./SignInButton";

export default function Header({snippet, updateSnippet, onUsernameClick, onShare, onRename}) {
    const [user,] = useCurrentUser();
    const editable = useMemo(
        () => (snippet ?? {}).creator_username === (user ?? {}).username,
        [snippet, user]
    )
    const [editing, setEditing] = useState(false);
    const username = snippet ? snippet.creator_username ?? (user ?? {}).username : null;
    return (
        <header className={`rounded bg-dark flex ${styles.mainHeader}`}>
            <div className={`${styles.snippet} monospaced fg-main`}>
                <span>@</span>
                {username ?
                    <span onClick={() => onUsernameClick(username)}>
                            {username}
                    </span>
                    :
                    <span>anonymous</span>
                }
                <span style={{margin: "0 10px"}}>/</span>
                {editing ?
                    <input type="text" value={snippet.name}
                           autoFocus={true}
                           onChange={
                               (e) => onRename({name: e.target.value})
                           }
                           onInput={
                               () => setEditing(false)
                           }
                    />
                : !snippet || !snippet.name ?
                    <button className={`reset td-u monospaced fg-link bg-tr ${styles.snippetName}`}
                            onClick={onShare}>
                        Share
                    </button>
                :
                    <span onClick={() => setEditing(editable)}>{snippet.name}</span>
                }
            </div>

            {editable &&
                <Checkbox
                    checked={snippet.public}
                    onChange={(e) => updateSnippet({public: e.checked})}
                />
            }


            {user && user.isAuthorized ?
                <UserCard user={user} showPopup={onUsernameClick} className={'ml-auto'}/>
                :
                <SignInButton className='ml-auto'/>}
        </header>
    )
}