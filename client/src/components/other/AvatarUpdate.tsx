import React, { ChangeEvent, useState } from "react";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import {
  setAvatar as uploadNewAvatar,
  setDefaultAvatar
} from "../../services/user";
import { connect } from "react-redux";
import { AppState } from "../../store";
import { User } from "../../interfaces/User";
import Typography from "@material-ui/core/Typography";

type Props = {
  user: User | null;
};

const AvatarUpdate: React.FC<Props> = ({ user }) => {
  const [avatar, setAvatar] = useState<any>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("");

  const handleFileChange = (event: any) => {
    if (event.target.files[0] !== null) {
      setAvatar(event.target.files[0]);
      let reader: any = new FileReader();

      reader.onloadend = () => {
        setImagePreviewUrl(reader.result);
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const handleAvatarSubmit = async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("avatar", avatar);

    await uploadNewAvatar(formData);
  };

  const resetAvatar = async () => {
    await setDefaultAvatar();
  };

  return (
    <Container>
      <div style={{ display: "flex" }}>
        <form onSubmit={handleAvatarSubmit}>
          <input
            placeholder="Avatar file"
            id="avatar-file"
            type="file"
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleFileChange}
          />
          <label htmlFor="avatar-file">
            <Button
              variant="contained"
              component="span"
              color="secondary"
              style={{ marginRight: "1rem" }}
            >
              Upload Avatar
            </Button>
          </label>
        </form>
        {user !== null && user.avatar !== null && (
          <Button
            onClick={() => resetAvatar()}
            variant="contained"
            color="secondary"
          >
            Set default avatar
          </Button>
        )}
      </div>

      {imagePreviewUrl && (
        <div style={{ marginTop: "2rem" }}>
          <Typography variant="body1">Preview</Typography>
          <img
            alt="avatar-preview"
            src={imagePreviewUrl}
            width="200"
            style={{ marginTop: "0.5rem" }}
          />
        </div>
      )}
    </Container>
  );
};

const mapStateToProps = (state: AppState) => ({
  user: state.user
});

export default connect(mapStateToProps)(AvatarUpdate);
