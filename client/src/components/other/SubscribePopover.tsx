import React, { Dispatch, SetStateAction } from "react";
import Popover from "@material-ui/core/Popover";
import Divider from "@material-ui/core/Divider";
import { useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";

type Props = {
  open: boolean;
  setAnchorEl: Dispatch<SetStateAction<HTMLButtonElement | null>>;
  anchorEl: HTMLButtonElement | null;
};

export const SubscribePopover: React.FC<Props> = ({
  open,
  setAnchorEl,
  anchorEl
}) => {
  const history = useHistory();
  const handleLoginPageRedirect = () => {
    history.push("/login");
  };

  return (
    <Popover
      open={open}
      onClose={() => setAnchorEl(null)}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center"
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center"
      }}
    >
      <div style={{ padding: "1rem" }}>
        You need to be logged in to subscribe.
        <Divider
          style={{
            marginTop: "0.5rem",
            marginBottom: "0.5rem"
          }}
        />
        <Button variant="outlined" onClick={handleLoginPageRedirect}>
          Login
        </Button>
      </div>
    </Popover>
  );
};
