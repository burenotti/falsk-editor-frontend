import styles from "./SignInButton.module.css"

export default function SignInButton() {
    const authorizeUrl = new URL(process.env.REACT_APP_AUTHORIZATION_URL);
    const redirectURI = new URL('/authorize', process.env.REACT_APP_ORIGIN_URL)

    authorizeUrl.searchParams.append('redirect_uri', redirectURI.toString());
    console.log(authorizeUrl);
    return (
        <a href={authorizeUrl.toString()} className={styles["sign-in"]}>Sign In</a>
    )
}