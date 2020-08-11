import React, { useState, useCallback, useEffect } from "react";
import { Playlist } from "../../interfaces/Playlist";
import { Video } from "../../interfaces/Video";
import { getPlaylistVideos } from "../../services/playlist";
import CircularProgress from "@material-ui/core/CircularProgress";
import WatchVideo from "./WatchVideo";

type Props = {
  playlistId: string;
};

const PlayPlaylist: React.FC<Props> = ({ playlistId }) => {
  const [playlist, setPlaylist] = useState<null | Playlist>(null);
  const [videos, setVideos] = useState<null | Video[]>(null);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const loadPlaylist = useCallback(async () => {
    const data = await getPlaylistVideos(playlistId);
    setPlaylist(data.playlist);
    setVideos(data.videos);
    if (data.videos.length > 0) {
      setSelectedVideo(data.videos[0][0]);
    }
  }, [playlistId]);

  useEffect(() => {
    if (!loaded && videos === null && playlist === null) {
      loadPlaylist();
      setLoaded(true);
    }
  }, [loaded, videos, playlist, loadPlaylist]);

  return (
    <div>
      {!loaded ? (
        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <CircularProgress />
        </div>
      ) : (
        <div>
          {playlist !== null && videos !== null && selectedVideo !== null && (
            <div>
              <WatchVideo
                id={selectedVideo.id}
                playlistMode
                playlistVideos={videos}
                setSelectedVideo={setSelectedVideo}
                selectedVideo={selectedVideo}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlayPlaylist;
