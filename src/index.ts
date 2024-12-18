import cors from "cors";
import express, { RequestHandler } from "express";
import { conversionService } from "./services/conversion.service";
import { AUDIO_MIME_TYPES, AudioServiceError } from "./types/audio.types";

const app = express();
const port = process.env.PORT || 4000;

app.use(
  cors({
    origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    methods: ["POST"],
    credentials: true,
  })
);

app.use(
  express.raw({
    type: ["audio/webm", "audio/aac", "audio/*"],
    limit: "25mb",
  })
);

const convertHandler: RequestHandler = async (req, res) => {
  try {
    if (!Buffer.isBuffer(req.body)) {
      res.status(400).json({
        error: "Invalid input: expected audio buffer",
      });
      return;
    }

    const convertedBuffer = await conversionService.convertToCompatibleFormat(
      req.body
    );

    res.set({
      "Content-Type": AUDIO_MIME_TYPES.MP3,
      "Content-Length": convertedBuffer.length,
    });

    res.send(convertedBuffer);
  } catch (error) {
    if (error instanceof AudioServiceError) {
      res.status(400).json({
        error: error.message,
        code: error.code,
      });
      return;
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

app.post("/convert", convertHandler);

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

server.timeout = 60000;
