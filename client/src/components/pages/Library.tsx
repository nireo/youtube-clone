import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../store';
import Container from '@material-ui/core/Container';
import { User } from '../../interfaces/User';
import { Redirect } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { Video } from '../../interfaces/Video';
import { getLibraryData } from '../../services/user';
import { Helmet } from 'react-helmet';
import { VideoEntrySmall } from '../other/VideoEntrySmall';
import Divider from '@material-ui/core/Divider';

type Props = {
  user: User | null;
};

const Library: React.FC<Props> = ({ user }) => {
  const [historyVideos, setHistoryVideos] = useState<Video[]>([]);
  const [watchLaterVideos, setWatchLaterVideos] = useState<Video[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [liked, setLiked] = useState<Video[]>([]);

  const loadLibraryData = useCallback(async () => {
    const data = await getLibraryData();
    setHistoryVideos(data.history);
    setWatchLaterVideos(data.watchLater);
    setLiked(data.liked);
  }, []);

  useEffect(() => {
    if (!loaded && user !== null) {
      loadLibraryData();
      setLoaded(true);
    }
  }, [loaded, user, loadLibraryData]);

  if (!user) {
    return <Redirect to="/" />;
  }

  return (
    <Container>
      <Helmet>
        <title>Library - TypeTube</title>
        <meta charSet="utf-8" />
      </Helmet>
      <Typography
        style={{ marginTop: '2rem', fontSize: '1.1rem', marginBottom: '1rem' }}
      >
        <strong>History</strong>
      </Typography>
      {historyVideos.length === 0 ? (
        <div>
          <Typography variant="body2" color="textSecondary">
            The videos you watch will display here.
          </Typography>
        </div>
      ) : (
        <div>
          {historyVideos.map((video: Video) => (
            <VideoEntrySmall key={`history-${video.id}`} video={video} />
          ))}
        </div>
      )}
      <Divider style={{ marginTop: '3rem', marginBottom: '1rem' }} />
      <Typography
        style={{
          marginTop: '2rem',
          fontSize: '1.1rem',
        }}
        variant="body1"
      >
        <strong>Watch later</strong>
      </Typography>
      {watchLaterVideos.length === 0 ? (
        <div>
          <Typography color="textSecondary" variant="body2">
            You can add videos to your watch later list from the video watch
            page.
          </Typography>
        </div>
      ) : (
        <div>
          {watchLaterVideos.map((video: Video) => (
            <VideoEntrySmall key={`watchLater-${video.id}`} video={video} />
          ))}
        </div>
      )}
      <Divider style={{ marginTop: '1rem', marginBottom: '1rem' }} />
      <Typography
        style={{
          fontSize: '1.1rem',
        }}
        variant="body1"
      >
        <strong>Liked videos</strong>
      </Typography>
      {liked.length === 0 ? (
        <div>
          <Typography color="textSecondary" variant="body2">
            You haven't liked any videos. This can be done on the video watch
            page!
          </Typography>
        </div>
      ) : (
        <div>
          {liked.map((video: Video) => (
            <VideoEntrySmall key={`watchLater-${video.id}`} video={video} />
          ))}
        </div>
      )}
    </Container>
  );
};

const mapStateToProps = (state: AppState) => ({
  user: state.user,
});

export default connect(mapStateToProps)(Library);
