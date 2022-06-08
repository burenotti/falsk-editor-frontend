import styles from "./SignInButton.module.css"

export default function SignInButton({className}) {
    const authorizeUrl = new URL(process.env.REACT_APP_AUTHORIZATION_URL);
    const redirectURI = new URL('/authorize', process.env.REACT_APP_ORIGIN_URL)

    authorizeUrl.searchParams.append('redirect_uri', redirectURI.toString());
    return (
        <a href={authorizeUrl.toString()} className={`${styles["sign-in"]} ${className}`}>Sign In</a>
    )
}