import styles from "../../styles/Share.module.css";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Download() {
  const router = useRouter();
  var url = null;

  function init() {
    var fileName = router.query["fileName"];
    var uuid = router.query["uuid"];

    document.getElementById("fileName").innerText = fileName;
    url = `/temp/${uuid}/${fileName}`;
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(url);
    alert("Link Copied To Clipboard");
  }

  function reNavigate() {
    window.location.replace(url);
  }

  useEffect(() => {
    init();
  });

  return (
    <div className={styles["upload-container"]}>
        <div className={styles["warning-header"]}>
          <p>
            <b>Warning</b> - The uploaded file will be deleted after 6 hours.
          </p>
        </div>
      <div className={styles["dl-container"]}>
        <p className={styles["dl-file-name"]} id="fileName">
          Test
        </p>
        <div className={styles["dl-button-container"]}>
          <button className={styles["dl-button"]} onClick={copyToClipboard}>
            Copy Link
          </button>
          <button className={styles["dl-button"]} onClick={reNavigate}>
            Download
          </button>
        </div>
      </div>
    </div>
  );
}
