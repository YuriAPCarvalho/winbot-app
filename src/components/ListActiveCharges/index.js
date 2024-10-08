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
  const [isSubChange, setIsSubChange] = useState(false);

  useEffect(() => {
    if (props.Invoice?.detail != props?.plan?.name) {
      setIsSubChange(true);
    }
  }, []);

  function GetPrice() {
    let planValue = props?.plan?.value;
    let actualPlanValue = props.Invoice.value;
    if (planValue > actualPlanValue) {
      let avgPlanValue = planValue / 30;

      let willPay =
        Math.flloor(
          (new Date(props.Invoice.dueDate) - new Date()) / (1000 * 60 * 60 * 24)
        ) * avgPlanValue;

      return willPay;
    } else {
      return planValue;
    }
  }

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
                {!isSubChange && (
                  <ConfirmUnsubscribe onConfirm={onConfirm}>
                    Cancelar Plano
                  </ConfirmUnsubscribe>
                )}
              </Button>

              {isSubChange && (
                <div>
                  <Typography>
                    Efetuar mudança para {props?.plan?.detail}
                  </Typography>
                  <Typography>{GetPrice()}</Typography>
                  <Button>Efetuar mudança de plano</Button>
                </div>
              )}
            </Box>
          </ListItem>
        </List>
      </Box>
    </>
  );
};

export default ListActiveCharges;
