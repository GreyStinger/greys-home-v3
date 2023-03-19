import * as fs from "fs";
import * as path from "path";
import Busboy from "busboy";
import { NextApiRequest, NextApiResponse } from "next";
import { pipeline } from "stream";
import { randomUUID } from "crypto";
import { sanitizeString } from "../../utils/stringUtils"

export const config = {
    api: {
        bodyParser: false,
    },
};

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
    const busboy = Busboy({ headers: req.headers });

    busboy.on(
        "file",
        (fieldname: string, file: fs.ReadStream, filename: string) => {
            const sanitizedFilename = sanitizeString(filename);

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
                }
            });

            req.on("close", () => {
                console.log(`Upload of ${sanitizedFilename} is complete.`);
            });
        }
    );

    busboy.on("field", (name, val, info) => {
        console.log(`Field [${name}]: value: %j`, val);
    });

    req.pipe(busboy);
}
