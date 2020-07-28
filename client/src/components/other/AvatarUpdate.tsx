import React, { ChangeEvent, useState } from "react";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import { setAvatar as uploadNewAvatar } from "../../services/user";

export const AvatarUpdate: React.FC = () => {
  const [avatar, setAvatar] = useState<any>(null);

  const handleFileChange = (event: any) => {
    if (event.target.files[0] !== null) {
      setAvatar(event.target.files[0]);
    }
  };

  const handleAvatarSubmit = async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("avatar", avatar);

    await uploadNewAvatar(formData);
  };

  return (
    <Container>
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
    </Container>
  );
};
