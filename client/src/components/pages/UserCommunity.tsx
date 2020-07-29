import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import { AppState } from "../../store";
import { User } from "../../interfaces/User";
import Container from "@material-ui/core/Container";
import { Community } from "../../interfaces/Community";
import { getUserCommunityPosts } from "../../services/community";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import { CommunityPost } from "../other/CommunityPost";

type Props = {
  user: User | null;
  id: string;
};

const UserCommunity: React.FC<Props> = ({ id, user }) => {
  const [posts, setPosts] = useState<Community[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const loadCommunityPosts = useCallback(async () => {
    const data = await getUserCommunityPosts(id);
    if (!data) {
      setPosts([]);
    }
    setPosts(data);
  }, [id]);

  useEffect(() => {
    if (!loading && posts === null) {
      setLoading(true);
      loadCommunityPosts();
      setLoading(false);
    }
  }, [loading, posts, loadCommunityPosts]);

  return (
    <Container>
      {loading ? (
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <CircularProgress />
        </div>
      ) : (
        <div>
          {posts !== null && posts.length === 0 && (
            <div>
              <Typography variant="h6">404, Not found.</Typography>
              <Typography>
                This user has not posted anything to his community tab.
              </Typography>
            </div>
          )}
          {posts !== null && posts.length > 0 && (
            <div>
              {posts.map((post: Community) => (
                <CommunityPost key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      )}
    </Container>
  );
};

const mapStateToProps = (state: AppState) => ({
  user: state.user
});

export default connect(mapStateToProps)(UserCommunity);
