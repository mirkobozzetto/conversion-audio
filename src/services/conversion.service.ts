import ffmpeg from "fluent-ffmpeg";
import { PassThrough } from "stream";
import { AudioServiceError, createReadStream } from "../types/audio.types";

export const conversionService = {
  async convertToCompatibleFormat(audioFile: Buffer): Promise<Buffer> {
    const inputStream = createReadStream(audioFile);
    const passThrough = new PassThrough();

    return new Promise<Buffer>((resolve, reject) => {
      const chunks: Uint8Array[] = [];

      ffmpeg(inputStream)
        .toFormat("mp3")
        .audioCodec("libmp3lame")
        .audioBitrate(128)
        .on("error", (err: Error) => {
          reject(
            new AudioServiceError(
              "Failed to convert audio",
              "CONVERSION_FAILED"
            )
          );
        })
        .pipe(passThrough);

      passThrough.on("data", (chunk: Uint8Array) => {
        chunks.push(chunk);
      });

      passThrough.on("end", () => {
        const convertedBuffer = Buffer.concat(chunks);
        resolve(convertedBuffer);
      });

      passThrough.on("error", () => {
        reject(
          new AudioServiceError(
            "Failed to process audio stream",
            "STREAM_ERROR"
          )
        );
      });
    });
  },
};
