import { connect } from "videodb";

const apiKey = process.env.VIDEO_DB_API_KEY || "";

let conn: ReturnType<typeof connect> | null = null;
let cachedCollection: any = null;

function getConnection() {
  if (conn) return conn;
  if (!apiKey) throw new Error("VIDEO_DB_API_KEY not set");
  conn = connect(apiKey);
  return conn;
}

export async function getOrCreateCollection(name = "bhagavad-gita") {
  if (cachedCollection) return cachedCollection;
  const connection = getConnection();
  const collections = await connection.getCollections();
  let coll = collections.find((c: any) => c.name === name);
  if (!coll) {
    coll = await connection.createCollection(name, "Bhagavad Gita sloka audio/video references", false);
  }
  cachedCollection = coll;
  return coll;
}

export async function uploadYouTubeVideo(youtubeUrl: string, name?: string) {
  const collection = await getOrCreateCollection();
  return collection.uploadURL({ url: youtubeUrl, name: name || "YouTube Reference" });
}

export async function searchInCollection(query: string) {
  const collection = await getOrCreateCollection();
  return collection.search(query);
}

export async function getTranscript(videoId: string) {
  const collection = await getOrCreateCollection();
  const video = await collection.getVideo(videoId);
  return video.getTranscript();
}

export async function getTranscriptText(videoId: string) {
  const collection = await getOrCreateCollection();
  const video = await collection.getVideo(videoId);
  return video.getTranscriptText();
}

export async function getStreamUrl(videoId: string) {
  const collection = await getOrCreateCollection();
  const video = await collection.getVideo(videoId);
  const stream = await video.generateStream();
  return stream;
}

export async function getAllVideos() {
  const collection = await getOrCreateCollection();
  return collection.getVideos();
}
