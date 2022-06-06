import styles from "../styles/Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <a className={styles["header-link"]}>Temporary File Share</a>
    </header>
  );
}
