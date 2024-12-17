import { Readable } from "stream";

export const AUDIO_MIME_TYPES = {
  WEBM: "audio/webm",
  AAC: "audio/aac",
  MP3: "audio/mpeg",
} as const;

export const WHISPER_SUPPORTED_FORMATS = [
  "audio/webm",
  "audio/mpeg",
  "audio/wav",
  "audio/ogg",
] as const;

export type AudioMimeType =
  (typeof AUDIO_MIME_TYPES)[keyof typeof AUDIO_MIME_TYPES];
export type WhisperFormat = (typeof WHISPER_SUPPORTED_FORMATS)[number];

export class AudioServiceError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = "AudioServiceError";
  }
}

export const createReadStream = (buffer: Buffer): Readable => {
  return new Readable({
    read() {
      this.push(buffer);
      this.push(null);
    },
  });
};
