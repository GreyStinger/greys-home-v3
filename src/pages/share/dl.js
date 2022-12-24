import styles from "../../styles/Share.module.css";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Download() {
    const router = useRouter();
    const homeUrl = "https://greyshome.co.za";
    var url = null;

    async function sleep(timeInMillis) {
        return new Promise((resolve) => {
            setTimeout(resolve, timeInMillis);
        });
    }

    const _ = (el) => {
        return document.getElementById(el);
    };

    function init() {
        var fileName = router.query["fileName"];
        var uuid = router.query["uuid"];

        _("fileName").innerText = fileName;
        url = `/fetch/${uuid}/${fileName}`;
        _("manualCopyLink").innerText = homeUrl + url;
    }

    function selectAllLink() {
        const range = document.createRange();
        const currentSelection = document.getSelection();
        const element = _("manualCopyLink");
        range.selectNodeContents(element);
        currentSelection.removeAllRanges();
        currentSelection.addRange(range);
    }

    async function copyToClipboard() {
        const linkBtn = _("copyLinkBtn");
        const origText = linkBtn.innerText;
        if (window.isSecureContext) {
            navigator.clipboard.writeText(homeUrl + url);
            linkBtn.innerText = "Copy Success";
            linkBtn.style.color = "green";
        } else {
            linkBtn.innerText = "Copy Fail";
            linkBtn.style.color = "red";
        }
        await sleep(2000);
        linkBtn.innerText = origText;
        linkBtn.style.color = "white";
    }

    function reNavigate() {
        router.push(url);
    }

    useEffect(() => {
        init();
    });

    return (
        <div className={styles["upload-container"]}>
            <div className={styles["dl-container"]}>
                <p id="fileName" className={styles["dl-file-name"]}>
                    Test
                </p>
                <div className={styles["dl-button-container"]}>
                    <div className={styles["vert-centre"]}>
                        <button
                            id="copyLinkBtn"
                            className={styles["dl-button"]}
                            onClick={copyToClipboard}
                        >
                            Copy Link
                        </button>
                    </div>
                    <div className={styles["vert-centre"]}>
                        <button
                            id="dlBtn"
                            className={styles["dl-button"]}
                            onClick={reNavigate}
                        >
                            Download
                        </button>
                    </div>
                </div>
                <h2 className={styles.manualCopyHead}>Manual Copy</h2>
                <pre className={styles.manualCopy}>
                    <code id="manualCopyLink" onClick={selectAllLink}></code>
                </pre>
            </div>
        </div>
    );
}
