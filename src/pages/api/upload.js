import * as fs from "fs";
import * as path from "path";
import Busboy from "busboy";
import Meter from "stream-meter";
import { pipeline } from "stream";
import { randomUUID } from "crypto";
import { resolve } from "path";
import { XMLBuilder } from "fast-xml-parser";

export const config = {
  api: {
    bodyParser: false,
  },
};

function sanitizeString(str) {
  str = str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim, "");
  return str.trim();
}

function addToDelete(uniquePath) {
  setTimeout(() => {
    fs.rmSync(uniquePath, { recursive: true, force: true });
  }, 360 * 60000);
}

async function r(req, uuid) {
  return new Promise((resolve) => {
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

      const file_stream = fs.createWriteStream(path.join(write_path, filename));
      let meter = Meter();

      pipeline(file, meter, file_stream, (err) => {
        if (err) {
          console.log(err);
          return resolve(false);
        }

        console.log(
          `Finished writing ${filename} at ${
            meter.bytes < 1024
              ? meter.bytes + " bytes"
              : meter.bytes < 1048576
              ? Math.round((meter.bytes / 1024) * 100) / 100 + " KiB"
              : meter.bytes < 2147483648
              ? Math.round((meter.bytes / 1048576) * 100) / 100 + " MiB"
              : Math.round((meter.bytes / 1073741824) * 100) / 100 + "GiB"
          }`
        );
      });

      busboy.on("data", (data) => {
        pipeline(data, meter, file_stream, (err) => {
          if (err) {
            console.log(err);
            return resolve(false);
          }
        });
      });

      req.on("close", function (err) {
        if (!err) {
          return resolve(true);
        }
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
    res.status(405).end();
    return;
  }

  const uuid = randomUUID();

  let ok = await r(req, uuid);

  // console.log(builder.build({ ok, uuid }));
  if (!ok) {
    res.status(400).json({ ok });
  }
  res.status(200).end(JSON.stringify({ ok, uuid }));
}
