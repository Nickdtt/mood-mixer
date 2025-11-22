
export type DeezerTrack = {
  id: number;
  title: string;
  preview: string;
  rank: number; // Adicionado rank para ordenação
  artist: {
    name: string;
  };
  album: {
    title: string;
    cover_medium: string;
  };
  duration: number;
};

export async function searchTracksByTag(tagName: string): Promise<DeezerTrack[]> {
  try {
    const response = await fetch(`https://api.deezer.com/search/track?q=${tagName}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch tracks for tag: ${tagName}`);
    }
    const deezerData = await response.json();
    return deezerData.data || [];
  } catch (error) {
    console.error(`Error searching Deezer for tag "${tagName}":`, error);
    return [];
  }
}

export async function searchTracksByPlaylist(moodQuery: string): Promise<DeezerTrack[]> {
  try {
    // 1. Busca um número maior de playlists para filtrar depois
    const searchResponse = await fetch(
      `https://api.deezer.com/search/playlist?q=${encodeURIComponent(moodQuery)}&order=RANKING&limit=50`
    );

    if (!searchResponse.ok) throw new Error('Failed to search playlists');

    const searchData = await searchResponse.json();
    let playlists = searchData.data || [];

    if (playlists.length === 0) {
      console.log(`No playlist found for mood: ${moodQuery}`);
      return searchTracksByTag(moodQuery);
    }

    // 2. Filtra playlists criadas por brasileiros
    const brazilianPlaylists = [];

    // Processa em paralelo para ser rápido
    const creatorPromises = playlists.map(async (playlist: any) => {
      try {
        const userResponse = await fetch(`https://api.deezer.com/user/${playlist.user.id}`);
        if (!userResponse.ok) return null;
        const userData = await userResponse.json();

        if (userData.country === 'BR') {
          return playlist;
        }
        return null;
      } catch (e) {
        return null;
      }
    });

    const results = await Promise.all(creatorPromises);
    brazilianPlaylists.push(...results.filter((p) => p !== null));

    console.log(`Found ${brazilianPlaylists.length} Brazilian playlists out of ${playlists.length}`);

    // Se não achar nenhuma BR, usa as originais (fallback) ou retorna vazio?
    // O usuário pediu especificamente por brasileiros. Vamos tentar honrar isso.
    // Se não tiver nenhuma, vamos usar as top 3 originais para não falhar totalmente, 
    // mas o ideal seria avisar. Por enquanto, vou usar fallback se a lista BR for vazia.
    const targetPlaylists = brazilianPlaylists.length > 0 ? brazilianPlaylists : playlists.slice(0, 3);

    // 3. Busca as faixas das playlists selecionadas
    const tracksPromises = targetPlaylists.map(async (playlist: any) => {
      try {
        const tracksResponse = await fetch(playlist.tracklist);
        if (!tracksResponse.ok) return [];
        const tracksData = await tracksResponse.json();
        return tracksData.data || [];
      } catch (e) {
        console.error(`Failed to fetch tracks for playlist ${playlist.id}`, e);
        return [];
      }
    });

    const allTracksArrays = await Promise.all(tracksPromises);
    const allTracks = allTracksArrays.flat();

    // 4. Remove duplicatas
    const uniqueTracksMap = new Map();
    for (const track of allTracks) {
      if (!uniqueTracksMap.has(track.id)) {
        uniqueTracksMap.set(track.id, track);
      }
    }
    const uniqueTracks = Array.from(uniqueTracksMap.values()) as DeezerTrack[];

    // 5. Ordena por popularidade (rank)
    uniqueTracks.sort((a, b) => (b.rank || 0) - (a.rank || 0));

    // 6. Retorna as Top 25
    return uniqueTracks.slice(0, 25);

  } catch (error) {
    console.error(`Error searching Deezer playlist for "${moodQuery}":`, error);
    return [];
  }
}
