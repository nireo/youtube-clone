import React, { useState, ChangeEvent } from "react";
import { setBanner as uploadNewBanner } from "../../services/user";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";

export const BannerUpdate: React.FC = () => {
  const [banner, setBanner] = useState<any>(null);

  const handleFileChange = (event: any) => {
    if (event.target.files[0] !== null) {
      setBanner(event.target.files[0]);
    }
  };

  const handleAvatarSubmit = async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("banner", banner);

    await uploadNewBanner(formData);
  };

  return (
    <Container>
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
            Upload Avatar
          </Button>
        </label>
      </form>
    </Container>
  );
};
