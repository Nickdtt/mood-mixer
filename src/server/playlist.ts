// src/server/playlist.ts
import { createServerFn } from '@tanstack/react-start'
import { getPlaylistFromMood } from './agent'



export const generatePlaylistFn = createServerFn({ method: 'POST' })
  .inputValidator((mood: string) => mood)
  .handler(async ({ data: mood }) => {
    console.log('Generating playlist for mood:', mood);

    const tracks = await getPlaylistFromMood(mood);

    const songs = tracks.map(track => ({
      id: track.id,
      title: track.title,
      artist: track.artist.name,
      album: track.album.title,
      cover: track.album.cover_medium,
      preview: track.preview,
      duration: track.duration
    }));

    return { songs };
  });
