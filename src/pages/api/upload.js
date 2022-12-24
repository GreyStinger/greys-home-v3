import * as fs from "fs";
import * as path from "path";
import Busboy from "busboy";
import Meter from "stream-meter";
import { pipeline } from "stream";
import { randomUUID } from "crypto";

export const config = {
    api: {
        bodyParser: false,
    },
};

function sanitizeString(str) {
    str = str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim, "").trim();
    str = str.replace(/ /g, "-");
    return str;
}

function addToDelete(uniquePath) {
    setTimeout(() => {
        fs.rmSync(uniquePath, { recursive: true, force: true });
    }, 43200000);
}

function getDataSizeStringFromBytes(bytes) {
    return bytes < 1024
        ? bytes + " bytes"
        : bytes < 1048576
        ? Math.round((bytes / 1024) * 100) / 100 + " KiB"
        : bytes < 2147483648
        ? Math.round((bytes / 1048576) * 100) / 100 + " MiB"
        : Math.round((bytes / 1073741824) * 100) / 100 + "GiB";
}

async function r(req, uuid) {
    return new Promise((resolveBus, rejectBus) => {
        const busboy = Busboy({ headers: req.headers });

        busboy.on("file", (fieldname, file, filename) => {
            filename = sanitizeString(filename.filename);

            // TODO: Add system for grabbing an environment variable for DIR and selecting a default
            let write_path = path.join(
                __dirname,
                "..",
                "..",
                "..",
                "..",
                "public",
                "temp",
                uuid
            );

            fs.mkdirSync(write_path, { recursive: true });
            console.log(`Writing ${filename} too ${write_path}`);

            addToDelete(write_path);

            const file_stream = fs.createWriteStream(
                path.join(write_path, filename)
            );
            let meter = Meter();

            pipeline(file, meter, file_stream, (err) => {
                if (err) {
                    console.log(err);
                    rejectBus();
                    return;
                }

                console.log(
                    `Finished writing ${filename} at ${getDataSizeStringFromBytes(
                        meter.bytes
                    )}`
                );
            });

            // busboy.on("data", (data) => {
            //     pipeline(data, meter, file_stream, (err) => {
            //         if (err) {
            //             console.log(err);
            //             return;
            //         }
            //     });
            // });

            req.on("close", () => {
                resolveBus();
            });
        });

        busboy.on("field", (name, val, info) => {
            console.log(`Field [${name}]: value: %j`, val);
        });

        req.pipe(busboy);
    });
}

export default async function imageUploadHandler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).end();
    }

    const uuid = randomUUID();

    await r(req, uuid);
    console.log(`Sending ok as true and uuid: ${uuid}`);
    res.status(200).end(JSON.stringify({ ok: true, uuid: uuid }));
}
