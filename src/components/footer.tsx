import styles from "../styles/Footer.module.css";

interface FooterProps {
  children: React.ReactNode;
}

export default function Footer({ children }: FooterProps): JSX.Element {
  return <footer className={styles.footer}>{children}</footer>;
}
