import React, { useContext, useEffect, useState } from "react";
import { Box, List, ListItem, Radio, Typography } from "@material-ui/core";
import { RadioButtonChecked } from "@material-ui/icons";
import { AuthContext } from "../../context/Auth/AuthContext";
import useChargeInfo from "../../hooks/useChargeInfo";
import cardBrands from "../../helpers/cardBrands";
import { Button } from "@mui/material";

const ListActiveCharges = (props) => {
  return (
    <>
      <Box>
        <List>
          <ListItem>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <img
                src={cardBrands(props.charges[0].cardFlag)}
                style={{ height: 20 }}
              />
              <Typography>
                {props?.charges[0]?.cardNumber
                  .slice(-4)
                  .padStart(props?.charges[0]?.cardNumber?.length, "*")}
              </Typography>
              <Typography color="textPrimary">Ativo</Typography>
              <RadioButtonChecked />
              <Button>
                <Typography color="error">Cancelar</Typography>
              </Button>
            </Box>
          </ListItem>
        </List>
      </Box>
    </>
  );
};

export default ListActiveCharges;
