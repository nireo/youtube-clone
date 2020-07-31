import React, { useState, useEffect, useCallback, ChangeEvent } from "react";
import { connect } from "react-redux";
import { AppState } from "../../store";
import { User } from "../../interfaces/User";
import Container from "@material-ui/core/Container";
import { Community } from "../../interfaces/Community";
import {
  getUserCommunityPosts,
  createCommunityPost
} from "../../services/community";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import { CommunityPost } from "../other/CommunityPost";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";

type Props = {
  user: User | null;
  id: string;
};

const UserCommunity: React.FC<Props> = ({ id, user }) => {
  const [posts, setPosts] = useState<Community[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [newPost, setNewPost] = useState<string>("");

  const loadCommunityPosts = useCallback(async () => {
    const data = await getUserCommunityPosts(id);
    if (!data) {
      setPosts([]);
    }
    setPosts(data.reverse());
  }, [id]);

  useEffect(() => {
    if (!loading && posts === null) {
      setLoading(true);
      loadCommunityPosts();
      setLoading(false);
    }
  }, [loading, posts, loadCommunityPosts]);

  const handlePostCreation = async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    let posted: any = await createCommunityPost(newPost);
    posted.User = user;

    if (posts === null) {
      setPosts([posted]);
    } else {
      setPosts(posts.concat(posted));
    }
  };

  return (
    <Container>
      {loading ? (
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <CircularProgress />
        </div>
      ) : (
        <div>
          {user && user.id === id && (
            <form
              onSubmit={handlePostCreation}
              style={{ marginBottom: "2rem" }}
            >
              <TextField
                value={newPost}
                onChange={({ target }) => setNewPost(target.value)}
                label="New post"
                placeholder="New post"
                rows={3}
                multiline
                fullWidth
                color="secondary"
                variant="outlined"
              />
              <Button
                style={{ marginTop: "1rem" }}
                variant="contained"
                color="secondary"
                type="submit"
              >
                Create new post
              </Button>
              <Divider style={{ marginTop: "1rem" }} />
            </form>
          )}
          {posts !== null && posts.length === 0 && user && user.id !== id && (
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
