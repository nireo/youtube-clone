import React, { useState, ChangeEvent } from "react";
import {
  setBanner as uploadNewBanner,
  setDefaultBanner
} from "../../services/user";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { connect } from "react-redux";
import { AppState } from "../../store";
import { User } from "../../interfaces/User";

type Props = {
  user: User | null;
};

const BannerUpdate: React.FC<Props> = ({ user }) => {
  const [banner, setBanner] = useState<any>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("");

  const handleFileChange = (event: any) => {
    if (event.target.files[0] !== null) {
      setBanner(event.target.files[0]);
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
    formData.append("banner", banner);

    await uploadNewBanner(formData);
  };

  const resetBanner = async () => {
    await setDefaultBanner();
  };

  return (
    <Container>
      <div style={{ display: "flex" }}>
        <form onSubmit={handleAvatarSubmit}>
          <input
            placeholder="Banner file"
            id="banner-file"
            type="file"
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleFileChange}
          />
          <label htmlFor="banner-file">
            <Button
              variant="contained"
              component="span"
              color="secondary"
              style={{ marginRight: "1rem" }}
            >
              Upload banner
            </Button>
          </label>
          {banner !== null && (
            <div style={{ marginTop: "1rem" }}>
              <Button variant="contained" color="secondary" type="submit">
                Set as new banner
              </Button>
            </div>
          )}
        </form>
        {user !== null && user.avatar !== null && (
          <Button
            onClick={() => resetBanner()}
            variant="contained"
            color="secondary"
          >
            Set default banner
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

export default connect(mapStateToProps)(BannerUpdate);
