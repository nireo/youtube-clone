export interface Playlist {
  id: string;
  title: string;
  description: string;
  videos: string[];
  videoThumbnail: string;
  userId: string;
}

export interface UpdatePlaylist {
  title?: string;
  description?: string;
  videoThumbnail?: string;
}

export interface CreatePlaylist {
  title: string;
}
