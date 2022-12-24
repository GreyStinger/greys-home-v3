import styles from "../styles/Layout.module.css";
import Link from "next/link";

export default function MainLayout({ children }) {
    return (
        <div>
            <div className={styles.header}>
                <Link href="/">
                    <a className={styles["header-link"]}>Home</a>
                </Link>
                <Link href="/share">
                    <a className={styles["header-link"]}>
                        Temporary File Share
                    </a>
                </Link>
            </div>
            {children}
        </div>
    );
}
