import { useRouter } from "next/router";
import { useEffect } from "react";
import styles from "../styles/Share.module.css";

import MainLayout from "../components/layout";

export default function PostScreen() {
    let addedEventListener = false;
    const router = useRouter();

    function _(el) {
        return document.getElementById(el);
    }

    function addPara(text, element) {
        var p = document.createElement("p");
        p.textContent = text;
        p.setAttribute("id", "warningPara");
        p.style.marginTop = "16px";
        p.style.marginBottom = "0px";
        p.style.paddingBottom = "0px";
        element.appendChild(p);
    }

    function addFileUploadListener() {
        if (addedEventListener) return;

        _("uploadFile").addEventListener("change", function showFileName() {
            var fileName = _("fileName");
            var input = _("uploadFile");

            fileName.textContent = input.files[0].name;
            if (fileName.textContent.length > 24) {
                fileName.textContent =
                    fileName.textContent.charAt(0).toUpperCase() +
                    fileName.textContent
                        .slice(1)
                        .toLowerCase()
                        .substring(0, 24) +
                    "...";
            }

            checkFileSize(input);
        });

        addedEventListener = true;
    }

    function checkFileSize(input) {
        // TODO: Add system for uncapped file size acceptance

        let warn_para = _("warningPara");

        if (input.files[0].size > 1073741824) {
            if (!warn_para) {
                addPara(
                    "File size is too large must be under 1 GiB",
                    _("uploadFileContainerGlobal")
                );
            }
            _("btnSubmit").disabled = true;

            return false;
        } else {
            if (warn_para) {
                warn_para.remove();
            }
            _("btnSubmit").disabled = false;
        }

        return true;
    }

    // TODO: Add small bottom corner pop-out for each progress state capture
    var progressHandler = (event) => {
        var percentLoaded = Math.round((event.loaded / event.total) * 100);
        _("progress-percent").style.width = percentLoaded + "%";
    };

    var completionHandler = (event) => {
        _("popup-container").style.visibility = "hidden";
    };

    var errorHandler = (event) => {
        _("popup-container").style.visibility = "hidden";
    };

    var abortHandler = (event) => {
        _("popup-container").style.visibility = "hidden";
    };

    async function uploadFile(event) {
        event.preventDefault();

        var input = _("uploadFile");

        var fileSizeCheck = await checkFileSize(input);
        if (!fileSizeCheck) {
            return;
        }

        var scan = _("virusScan");
        var file = input.files[0];

        _("popup-container").style.visibility = "visible";

        var formData = new FormData();
        formData.append("file", file);
        formData.append("fileSize", file.size);
        formData.append("scan", scan.checked);

        var ajax = new XMLHttpRequest();

        ajax.upload.addEventListener("progress", progressHandler, false);
        ajax.addEventListener("load", completionHandler, false);
        ajax.addEventListener("error", errorHandler, false);
        ajax.addEventListener("abort", abortHandler, false);

        ajax.onreadystatechange = async () => {
            if (ajax.readyState == XMLHttpRequest.DONE) {
                var response = JSON.parse(ajax.responseText);
                const url = `/share/dl?uuid=${response["uuid"]}&fileName=${_(
                    "uploadFile"
                ).files[0].name.replace(/ /g, "-")}`;

                router.push(url);
            }
        };

        ajax.open("POST", "/api/upload");
        await ajax.send(formData);
    }

    useEffect(() => {
        addFileUploadListener();
    });

    return (
        <MainLayout>
            <div className={styles["warning-header"]}>
                <p>
                    <b>Warning</b> - The uploaded file will be deleted after 12
                    hours.
                </p>
            </div>
            <div className={styles["upload-container"]}>
                <form
                    className={styles["upload-form"]}
                    target="_blank"
                    action="/api/upload"
                    method="post"
                    encType="multipart/form-data"
                >
                    <div
                        className={styles["upload-file-container-global"]}
                        id="uploadFileContainerGlobal"
                    >
                        <div className={styles["upload-file-container"]}>
                            <label
                                className={styles["file-name"]}
                                id="fileName"
                                htmlFor="uploadFile"
                            >
                                No File
                            </label>
                            <input
                                className={styles["upload-file-selector"]}
                                type="file"
                                name="uploadFile"
                                id="uploadFile"
                            />
                        </div>
                    </div>
                    <div
                        className={styles["checkbox-container"]}
                        style={{ paddingTop: "16px", paddingBottom: "4px" }}
                    >
                        <label>Encrypted </label>
                        <input type="checkbox" disabled />
                    </div>
                    <div
                        className={styles["checkbox-container"]}
                        style={{ paddingTop: "4px", paddingBottom: "22px" }}
                    >
                        <label htmlFor="virusScan">Virus Scan On Upload </label>
                        <input
                            type="checkbox"
                            defaultValue="u10"
                            name="scan"
                            id="virusScan"
                            disabled
                        />
                    </div>
                    <br />
                    <button
                        className={styles["btn-submit"]}
                        id="btnSubmit"
                        onClick={uploadFile}
                    >
                        Upload and Get Link
                    </button>
                </form>
                <div className={styles["popup-container"]} id="popup-container">
                    <div className={styles["popup-label-container"]}>
                        <div className={styles["popup-label-bg"]}>
                            <p
                                className={styles["popup-label"]}
                                id="popup-label"
                            >
                                Uploading
                            </p>
                        </div>
                    </div>
                    <div className={styles["progress-bar"]}>
                        <span className={styles["bar"]}>
                            <span
                                className={styles["progress"]}
                                id="progress-percent"
                            ></span>
                        </span>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
