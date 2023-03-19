import styles from "../../styles/Share.module.css";
import { useRouter } from "next/router";
import { useEffect } from "react";

import MainLayout from "../../components/layout";

export default function Download(): JSX.Element {
    const router = useRouter();

    const homeUrl = "https://greyshome.co.za";
    let url: string | null = null;

    async function sleep(timeInMillis: number): Promise<void> {
        return new Promise<void>((resolve) => {
            setTimeout(resolve, timeInMillis);
        });
    }

    function _(el: string): HTMLElement | null {
        return document.getElementById(el);
    }

    function init(): void {
        const fileName = router.query["fileName"] as string;
        const uuid = router.query["uuid"] as string;

        _("fileName")!.innerText = fileName;
        url = `/fetch/${uuid}/${fileName}`;
        _("manualCopyLink")!.innerText = homeUrl + url;
    }

    function selectAllLink(): void {
        const range = document.createRange();
        const currentSelection = document.getSelection();
        const element = _("manualCopyLink")!;
        range.selectNodeContents(element);
        currentSelection!.removeAllRanges();
        currentSelection!.addRange(range);
    }

    async function copyToClipboard(): Promise<void> {
        const linkBtn = _("copyLinkBtn")!;
        const origText = linkBtn.innerText;

        try {
            await navigator.clipboard.writeText(homeUrl + url!);
            linkBtn.innerText = "Copy Success";
            linkBtn.style.color = "green";
        } catch (err) {
            linkBtn.innerText = "Copy Fail";
            linkBtn.style.color = "red";

            // For iOS devices, show instructions for copying the link
            if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
                const alertText = "Press and hold the link, then tap 'Copy'.";
                window.alert(alertText);
            }
        }

        await sleep(2000);
        linkBtn.innerText = origText;
        linkBtn.style.color = "white";
    }

    function reNavigate(): void {
        router.push(url!);
    }

    useEffect(() => {
        init();
    });

    return (
        <MainLayout>
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
                        <code
                            id="manualCopyLink"
                            onClick={selectAllLink}
                        ></code>
                    </pre>
                </div>
            </div>
        </MainLayout>
    );
}
