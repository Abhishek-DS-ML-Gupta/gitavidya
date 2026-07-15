import { NextRequest, NextResponse } from "next/server";
import { connect, playStream } from "videodb";

const COLLECTION_NAME = "bhagavad-gita";
const VIDEODB_BASE = "https://api.videodb.io";

let connection: any = null;
let collection: any = null;

function getApiKey() {
  return process.env.VIDEO_DB_API_KEY || "";
}

async function getCollection() {
  if (collection) return collection;
  connection = connect(getApiKey());
  const collections = await connection.getCollections();
  collection = collections.find((c: any) => c.name === COLLECTION_NAME);
  if (!collection) {
    collection = await connection.createCollection(
      COLLECTION_NAME,
      "Bhagavad Gita sloka audio/video references",
      false
    );
  }
  return collection;
}

async function ensureSandbox() {
  const res = await fetch(`${VIDEODB_BASE}/sandbox`, {
    method: "POST",
    headers: { "x-access-token": getApiKey(), "Content-Type": "application/json" },
    body: JSON.stringify({ model: "OMNIVOICE", tier: "small" }),
  });
  const data = await res.json();
  return data.data;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, youtubeUrl, videoId, query, text, voiceName, voiceConfig } = body;
    const headers = { "x-access-token": getApiKey(), "Content-Type": "application/json" };

    switch (action) {
      case "upload": {
        if (!youtubeUrl) {
          return NextResponse.json({ error: "youtubeUrl required" }, { status: 400 });
        }
        const coll = await getCollection();
        const video = await coll.uploadURL({ url: youtubeUrl, name: "YouTube Reference" });
        try { await video.generateTranscript(true); } catch {}
        return NextResponse.json({ success: true, videoId: video.id, video });
      }

      case "transcript": {
        if (!videoId) {
          return NextResponse.json({ error: "videoId required" }, { status: 400 });
        }
        const coll = await getCollection();
        const video = await coll.getVideo(videoId);
        try {
          const textResult = await video.getTranscriptText();
          if (textResult) {
            return NextResponse.json({ success: true, transcript: textResult, status: "ready" });
          }
        } catch {}
        try { await video.generateTranscript(true); } catch {}
        return NextResponse.json({
          success: true, transcript: "", status: "processing",
          message: "Transcript is being generated. Try again in a few moments.",
        });
      }

      case "stream": {
        if (!videoId) {
          return NextResponse.json({ error: "videoId required" }, { status: 400 });
        }
        const coll3 = await getCollection();
        const vid2 = await coll3.getVideo(videoId);
        const streamUrl = await vid2.generateStream();
        const playerUrl = playStream(streamUrl);
        return NextResponse.json({ success: true, stream: streamUrl, playerUrl });
      }

      case "speak": {
        if (!text) {
          return NextResponse.json({ error: "text required" }, { status: 400 });
        }
        const coll4 = await getCollection();
        const audio = await coll4.generateVoice(
          text,
          voiceName || "Default",
          voiceConfig || {}
        );
        const signedUrl = audio ? await audio.generateUrl() : null;
        return NextResponse.json({ success: true, audioId: audio?.id, signedUrl });
      }

      case "clone": {
        if (!videoId) {
          return NextResponse.json({ error: "videoId required" }, { status: 400 });
        }
        // Ensure OMNIVOICE sandbox exists
        const sandbox = await ensureSandbox();
        // Create a voice design from the video's audio
        const designRes = await fetch(`${VIDEODB_BASE}/voice-design`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            video_id: videoId,
            name: voiceName || `Voice_${videoId.slice(0, 8)}`,
            model: "OMNIVOICE",
          }),
        });
        const designData = await designRes.json();
        return NextResponse.json({ success: true, sandbox, voiceDesign: designData.data || designData });
      }

      case "list_voices": {
        // Fetch voice designs from VideoDB
        const res = await fetch(`${VIDEODB_BASE}/voice-design`, { headers });
        const data = await res.json();
        const designs = data?.data?.voice_designs || data?.data || [];
        return NextResponse.json({ success: true, voices: Array.isArray(designs) ? designs : [] });
      }

      case "list_audios": {
        const coll5 = await getCollection();
        const audios = await coll5.getAudios();
        return NextResponse.json({ success: true, audios });
      }

      case "search": {
        if (!query) {
          return NextResponse.json({ error: "query required" }, { status: 400 });
        }
        const coll6 = await getCollection();
        const results = await coll6.search(query);
        return NextResponse.json({ success: true, results });
      }

      case "list": {
        const coll7 = await getCollection();
        const videos = await coll7.getVideos();
        const audios2 = await coll7.getAudios();
        return NextResponse.json({ success: true, videos, audios: audios2 });
      }

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (err: any) {
    console.error("VideoDB API error:", err);
    return NextResponse.json(
      { error: err.message || "VideoDB operation failed" },
      { status: 500 }
    );
  }
}
