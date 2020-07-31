import React, { useState, useEffect, useCallback } from "react";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import { connect } from "react-redux";
import { AppState } from "../../store";
import { User } from "../../interfaces/User";
import { Community } from "../../interfaces/Community";
import { getCommunityPostWithId } from "../../services/community";
import { CommunityPost as CommunityPostEntry } from "../other/CommunityPost";

type Props = {
  id: string;
  user: User | null;
};

const CommunityPost: React.FC<Props> = ({ id, user }) => {
  const [post, setPost] = useState<Community | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const loadPostData = useCallback(async () => {
    const data = await getCommunityPostWithId(id);
    setPost(data);
  }, [id]);

  useEffect(() => {
    if (!loading && post === null) {
      setLoading(true);
      loadPostData();
      setLoading(false);
    }
  }, [loading, post, loadPostData]);

  return (
    <Container style={{ marginTop: "2rem" }}>
      {post !== null && <CommunityPostEntry page post={post} />}
    </Container>
  );
};

const mapStateToProps = (state: AppState) => ({
  user: state.user
});

export default connect(mapStateToProps)(CommunityPost);
