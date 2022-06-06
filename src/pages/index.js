import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Header from '../components/header.js'

export default function Home() {
  return (
    <div className={styles["global-container"]}>
      <Head>
        <title>Greys Home</title>
      </Head>

      <Header />

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to GreysHome
        </h1>
      </main>
    </div>
  )
}
