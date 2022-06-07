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
  str = str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim, "");
  return str.trim();
}

async function r(req, uuid) {
  return new Promise((resolve) => {
    const busboy = Busboy({ headers: req.headers });
    let data = {};

    busboy.on("file", (fieldname, file, filename) => {
      filename = sanitizeString(filename.filename);

      let write_path = path.join(__dirname, /* ".." , "..",*/ "..", ".." ,"public", "temp", uuid);
      fs.mkdirSync(write_path, { recursive: true });
      console.log(`Writing ${filename} too ${write_path}`);

      const file_stream = fs.createWriteStream(path.join(write_path, filename));
      let meter = Meter();

      pipeline(file, meter, file_stream, (err) => {
        if (err) {
          console.log(err);
          return;
        }

        console.log(`Finished writing ${filename} at ${(meter.bytes < 1024 ? meter.bytes + " bytes" : (meter.bytes < 1048576 ? Math.round(meter.bytes / 1024 * 100) / 100 + " KiB" : (meter.bytes < 2147483648 ? Math.round(meter.bytes / 1048576 * 100) / 100 + " MiB" : Math.round(meter.bytes / 1073741824 * 100) / 100 + "GiB")))}`);
      });

      busboy.on("data", (data) => {
        pipeline(data, meter, file_stream, (err) => {
          if (err) {
            console.log(err);
            return;
          }
          console.log(`Finished writing ${filename} at ${(meter.bytes < 1024 ? meter.bytes + " bytes" : (meter.bytes < 1048576 ? Math.round(meter.bytes / 1024 * 100) / 100 + " KiB" : (meter.bytes < 2147483648 ? Math.round(meter.bytes / 1048576 * 100) / 100 + " MiB" : Math.round(meter.bytes / 1073741824 * 100) / 100 + "GiB")))}`);
        });
      })

      file.on("end", () => {
        console.log("File [" + fieldname + "] Finished");

        data["size"] = meter.bytes;
        data["filename"] = filename;
        data["uuid"] = uuid;
        data["path"] = write_path;
        data["url"] = `/temp/${uuid}/${filename}`;
      });

      file_stream.on("close", () => {
        console.log(`Upload of '${filename}' finished`);
        return resolve(data);
      });
    });

    req.pipe(busboy);
  });
}

export default async function imageUploadHandler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const uuid = randomUUID();

  let data = await r(req, uuid);
  
  res.status(200).end(JSON.stringify({ ok: true }));
}
