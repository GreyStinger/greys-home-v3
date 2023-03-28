import * as fs from "fs";
import * as path from "path";
import Busboy from "busboy";
import { NextApiRequest, NextApiResponse } from "next";
import { pipeline } from "stream";
import { randomUUID } from "crypto";
import { sanitizeString } from "../../utils/stringUtils";

/**
 * Configuration options for the imageUploadHandler API route.
 *
 * @typedef {Object} uploadConfig
 * @property {Object} api - Configuration options for the Next.js API.
 * @property {boolean} api.bodyParser - Indicates whether to parse the request body. Set to false.
 * @property {number} api.timeout - The timeout limit for the API in milliseconds. Set to 360000ms (6 minutes).
 */
export const config = {
    api: {
        bodyParser: false,
        timeout: 360000,
    },
};

/**
 * Handles an HTTP POST request for uploading an image.
 *
 * @param {NextApiRequest} req - The HTTP request object containing the uploaded file.
 * @param {NextApiResponse} res - The HTTP response object to send back to the client.
 * @returns {Promise<void>} A Promise that resolves when the file has been saved to disk and the response has been sent.
 */
export default async function imageUploadHandler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        return res.status(405).end();
    }

    const uuid = randomUUID();

    await saveFileToDisk(req, uuid);

    console.log(`Sending ok as true and uuid: ${uuid}`);

    res.status(200).json({ ok: true, uuid });
}

/**
 * Adds a file path to a timeout queue for deletion after a specified time.
 * 
 * @param {string} uniquePath - The file path to add to the queue for deletion.
 * @returns {void}
 */
function addToDelete(uniquePath: string) {
    setTimeout(() => {
        fs.rmSync(uniquePath, { recursive: true, force: true });
    }, 12 * 60 * 60 * 1000); // 12 hours in milliseconds
}

/**
 * Saves an uploaded file to disk.
 *
 * @param req - The HTTP request object containing the uploaded file.
 * @param uuid - The unique identifier to use for the uploaded file.
 * @returns A Promise that resolves when the file has been saved to disk.
 */
async function saveFileToDisk(req: any, uuid: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const busboy = Busboy({ headers: req.headers });

        busboy.on(
            "file",
            (
                fieldname: string,
                file: fs.ReadStream,
                filename: Busboy.FileInfo
            ) => {
                const sanitizedFilename = sanitizeString(filename.filename);

                const writePath = path.join(
                    __dirname,
                    "..",
                    "..",
                    "..",
                    "..",
                    "public",
                    "temp",
                    uuid
                );

                fs.mkdirSync(writePath, { recursive: true });

                console.log(`Writing ${sanitizedFilename} to ${writePath}`);

                addToDelete(writePath);

                const fileStream = fs.createWriteStream(
                    path.join(writePath, sanitizedFilename)
                );

                pipeline(file, fileStream, (err) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        console.log(
                            `Upload of ${sanitizedFilename} is complete.`
                        );
                        resolve();
                    }
                });
            }
        );

        busboy.on("field", (name, val, info) => {
            console.log(`Field [${name}]: value: %j`, val);
        });

        req.pipe(busboy);
    });
}
