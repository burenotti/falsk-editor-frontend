import styles from "./UserCard.module.css"

export default function UserCard({user, showPopup, className = ''}) {
    return (
        <div className={`${styles.userCard} ${className}`}>
            <img src={user.avatarURL} alt="avatar" className={styles.avatar}/>
            <span className={styles.username}
                  onClick={() => showPopup(user.username)}>
                {user.username}
            </span>
        </div>
    )
}