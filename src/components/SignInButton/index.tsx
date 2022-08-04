import { FaGithub } from "react-icons/fa";// yarn add react-icons
import { FiX } from "react-icons/fi";
import { signIn, signOut, useSession } from "next-auth/react";
import styles from "./styles.module.scss";

export function SignInButton() {
  const { data: session } = useSession();
  
  // retorna expires e user (email, image, name)
  console.log(session);

  return session ? (
    <button
      type="button"
      className={styles.signInButton}
      onClick={() => signOut()}
    >
      <FaGithub color="#04d361" />
        {session.user.name}
        <FiX color="#737380" className={styles.closeIcon} />
      </button>
    ) : (
      <button
      type="button"
      className={styles.signInButton}
      onClick={() => signIn("github")}
    >
        <FaGithub color="#eba417" />
        Sign in with Github
      </button>
    );
  }