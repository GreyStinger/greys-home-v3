import { useEffect } from "react";
import styles from "../styles/Tempfile.module.css";

export default function PostScreen() {
  let addedEventListener = false;

  function addPara(text, element) {
    var p = document.createElement("p");
    p.textContent = text;
    p.setAttribute('id', "warningPara");
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
        var input = document.getElementById("uploadFile");
        var fileName = document.getElementById("fileName");
        fileName.textContent = input.files[0].name;
        if (fileName.textContent.length > 20) {
          fileName.textContent = fileName.textContent.charAt(0).toUpperCase() + fileName.textContent.slice(1).toLowerCase().substring(0, 20) + "...";
          fileName.style.fontSize = "26px";
        } else {
          fileName.style.fontSize = "30px";
        }

        let warn_para = document.getElementById("warningPara");

        if (input.files[0].size > 1073741824) {
          if (!warn_para) {
            addPara("File size is too large must be under 1 GiB", document.getElementById("uploadFileContainerGlobal"));
          }          
        } else {
          if (warn_para) {
            warn_para.remove();
          }
        }
      });

    addedEventListener = true;
  }

  useEffect(() => {
    addFileUploadListener();
  });

  return (
    <div className={styles["upload-container"]}>
      <form
        className={styles["upload-form"]}
        action="/api/temp"
        method="post"
        encType="multipart/form-data"
        onSubmit="return false;"
      >
        <div className={styles["upload-file-container-global"]} id="uploadFileContainerGlobal">
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
            <br />
          </div>
        </div>
        <input type="text" defaultValue="u10" name="time" />
        <br />
        <input type="text" defaultValue="u5" name="size" />
        <br />
        <input type="button" /* type="submit" */ id="btnSubmit" value="Load" />
      </form>
    </div>
  );
}
