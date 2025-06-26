# Whisper Audio Converter

Audio conversion service optimized for Whisper AI.

## Description

REST API that converts any audio format to standardized MP3 (128kbps) for optimal Whisper compatibility.

## Supported Formats

**Input:** All audio formats (webm, aac, wav, ogg, etc.)  
**Output:** MP3 (128kbps, libmp3lame)  
**Limit:** 25MB per file

## Installation

```bash
npm install
npm run build
```

## Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Docker
```bash
docker-compose up
```

## API

**POST /convert**
- Content-Type: `audio/*`
- Body: Raw audio buffer
- Response: MP3 audio buffer

### Example
```bash
curl -X POST http://localhost:4000/convert \
  -H "Content-Type: audio/webm" \
  --data-binary @audio.webm \
  -o converted.mp3
```

## Configuration

- `PORT`: Server port (default: 4000)
- `NEXT_PUBLIC_APP_URL`: Allowed CORS origin (default: http://localhost:3000)

## Dependencies

- Express.js
- FFmpeg (fluent-ffmpeg)
- TypeScript