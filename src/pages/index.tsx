import Head from 'next/head'
import styles from '../styles/Home.module.css'

import MainLayout from '../components/layout'

export default function Home(): JSX.Element {
  return (
    <div className={styles["global-container"]}>
      <Head>
        <title>Greys Home</title>
      </Head>

      <MainLayout>
        <main className={styles.main}>
          <h1 className={styles.title}>
            Welcome to GreysHome
          </h1>
        </main>
      </MainLayout>
    </div>
  )
}
