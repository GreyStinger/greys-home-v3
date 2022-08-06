import styles from "../../styles/Share.module.css";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Download() {
  const router = useRouter();
  
  function init() {
    console.log(router.query);
  }

  useEffect(() => {
    init()
  })
  
  return (
    <div className={styles["upload-container"]}>
      <p>
        Test
      </p>
    </div>
  )
}