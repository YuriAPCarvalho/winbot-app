import React, { useContext, useEffect, useState } from "react";
import { Box, List, ListItem, Radio, Typography } from "@material-ui/core";
import { toast } from "react-toastify";
import { RadioButtonChecked } from "@material-ui/icons";
import { AuthContext } from "../../context/Auth/AuthContext";
import useChargeInfo from "../../hooks/useChargeInfo";
import cardBrands from "../../helpers/cardBrands";
import ConfirmUnsubscribe from "../ConfirmUnsubscribe";
import { Button } from "@mui/material";
import { ArrowBack } from "@material-ui/icons";
import useCheckout from "../../hooks/useCheckout";

const ListActiveCharges = (props) => {
  const { user } = useContext(AuthContext);
  const { unsubscribe } = useCheckout();

  async function onConfirm() {
    unsubscribe(user?.id)
      .then((resp) => {
        console.log(resp);
        toast.success("Cancelamento Realizado com sucesso!");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Erro ao efetuar cancelamento!");
      });
  }

  return (
    <>
      <Box>
        <Box>
          <Button onClick={() => props.selectPlan(null)}>
            <ArrowBack></ArrowBack>
            <Typography>Planos</Typography>
          </Button>
        </Box>
        <List>
          <ListItem>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <RadioButtonChecked />

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
              <Button>
                <ConfirmUnsubscribe onConfirm={onConfirm}>
                  Cancelar
                </ConfirmUnsubscribe>
              </Button>
            </Box>
          </ListItem>
        </List>
      </Box>
    </>
  );
};

export default ListActiveCharges;
