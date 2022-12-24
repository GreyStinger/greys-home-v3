import Link from "next/link";
import styles from "../styles/Header.module.css";

export default function Header() {
  return (
    <div className={styles.header}>
      <Link href="/">
        <a className={styles["header-link"]}>Home</a>
      </Link>
      <Link href="/share">
        <a className={styles["header-link"]}>Temporary File Share</a>
      </Link>
    </div>
  );
}
