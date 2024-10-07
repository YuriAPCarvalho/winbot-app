import React, { useState } from "react";
import { Popover, Button, Typography } from "@mui/material";

const ConfirmUnsubscribe = ({ onConfirm, onCancel, children }) => {
  const [anchorEl, setAnchorEl] = useState();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <>
      <Button
        variant="contained"
        style={{ backgroundColor: "black" }}
        onClick={handleClick}
      >
        {children}
      </Button>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <div style={{ padding: "16px" }}>
          <Typography>Tem certeza que deseja cancelar a assinatura?</Typography>
          <div
            style={{
              marginTop: "8px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button
              variant="contained"
              style={{ backgroundColor: "black" }}
              onClick={() => {
                onConfirm();
                handleClose();
              }}
            >
              SIM
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => {
                handleClose();
              }}
            >
              NÃO
            </Button>
          </div>
        </div>
      </Popover>
    </>
  );
};

export default ConfirmUnsubscribe;
