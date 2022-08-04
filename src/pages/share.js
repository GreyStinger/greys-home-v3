import { useEffect } from "react";
import styles from "../styles/Tempfile.module.css";

export default function PostScreen() {
  let addedEventListener = false;

  function addPara(text, element) {
    var p = document.createElement("p");
    p.textContent = text;
    p.setAttribute("id", "warningPara");
    p.style.marginTop = "16px";
    p.style.marginBottom = "0px";
    p.style.paddingBottom = "0px";
    element.appendChild(p);
  }

  function addButtonListener() {
    if (addedEventListener) return;

    document
      .getElementById("btnSubmit")
      .addEventListener("click", function showFileSize() {
        if (!window.FileReader) {
          console.log("The file API isn't supported on this browser yet.");
          return;
        }

        var input = document.getElementById("uploadFile");
        if (!input.files) {
          console.error(
            "This browser doesn't seem to support the `files` property of file inputs."
          );
        } else if (!input.files[0]) {
          addPara("Please select a file before clicking 'Load'");
        } else {
          let file = input.files[0];

          addPara(
            "File " +
              file.name +
              " is " +
              (file.size < 1024
                ? file.size + " bytes"
                : file.size < 1048576
                ? Math.round((file.size / 1024) * 100) / 100 + " KiB"
                : file.size < 2147483648
                ? Math.round((file.size / 1048576) * 100) / 100 + " MiB"
                : Math.round((file.size / 1073741824) * 100) / 100 + "GiB") +
              " in size"
          );
        }
      });

    addedEventListener = true;
  }

  function addFileUploadListener() {
    if (addedEventListener) return;

    document
      .getElementById("uploadFile")
      .addEventListener("change", function showFileName() {
        var fileName = document.getElementById("fileName");
        var input = document.getElementById("uploadFile");
        fileName.textContent = input.files[0].name;
        if (fileName.textContent.length > 24) {
          fileName.textContent =
            fileName.textContent.charAt(0).toUpperCase() +
            fileName.textContent.slice(1).toLowerCase().substring(0, 24) +
            "...";
        }
      
      checkFileSize(input);
      });

    addedEventListener = true;
  }

  function checkFileSize(input) {
    let warn_para = document.getElementById("warningPara");

    if (input.files[0].size > 1073741824) {
      if (!warn_para) {
        addPara(
          "File size is too large must be under 1 GiB",
          document.getElementById("uploadFileContainerGlobal")
        );
      }
      document.getElementById("btnSubmit").disabled = true;

      return false;
    } else {
      if (warn_para) {
        warn_para.remove();
      }
      document.getElementById("btnSubmit").disabled = false;
    }

    return true;
  }

  function smoothSwitch() {
    // window.
  }

  async function uploadFile(event) {
    event.preventDefault();

    var input = document.getElementById("uploadFile");
    var scan = document.getElementById("virusScan");
    var file = input.files[0];

    var fileSizeCheck = await checkFileSize(input);
    if (!fileSizeCheck) {
      return;
    }

    var formData = new FormData();
    formData.append("file", file);
    formData.append("scan", scan.checked);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const json = await response.json();
    console.log(json);
  }

  useEffect(() => {
    addFileUploadListener();
  });

  return (
    <div className={styles["upload-container"]}>
      <div className={styles["warning-header"]}>
        <p>
          <b>Warning</b> - The uploaded file will be deleted after 30 minutes.
        </p>
      </div>
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
          style={{ paddingTop: "20px", paddingBottom: "4px" }}
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
        {/* <input type="submit" className={styles["btn-submit"]} id="btnSubmit" value="Upload and Get Link" onClick={smoothSwitch} disabled /> */}
        <button
          className={styles["btn-submit"]}
          id="btnSubmit"
          onClick={uploadFile}
        >
          Upload and Get Link
        </button>
      </form>
    </div>
  );
}
