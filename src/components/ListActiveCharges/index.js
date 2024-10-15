import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  List,
  ListItem,
  Radio,
  Typography,
} from "@material-ui/core";
import { toast } from "react-toastify";
import { RadioButtonChecked } from "@material-ui/icons";
import { AuthContext } from "../../context/Auth/AuthContext";
import useChargeInfo from "../../hooks/useChargeInfo";
import cardBrands from "../../helpers/cardBrands";
import ConfirmUnsubscribe from "../ConfirmUnsubscribe";
import { Button } from "@mui/material";
import { ArrowBack } from "@material-ui/icons";
import useCheckout from "../../hooks/useCheckout";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

const ListActiveCharges = (props) => {
  const { user } = useContext(AuthContext);
  const { unsubscribe, updateSubscription } = useCheckout();
  const [isSubChange, setIsSubChange] = useState(false);
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    if (props.Invoice?.detail != props?.plan?.name) {
      setIsSubChange(true);
      setPrice(GetPrice());
    }
  }, []);

  function GetPrice() {
    let planValue = props?.plan?.value;
    let actualPlanValue = props.Invoice.value;
    if (planValue > actualPlanValue) {
      let avgPlanValue = planValue / 30;

      let willPay =
        Math.floor(
          (new Date(props.Invoice.dueDate) - new Date()) / (1000 * 60 * 60 * 24)
        ) * avgPlanValue;

      return willPay.toFixed(2);
    } else {
      return planValue;
    }
  }

  async function updatePlan() {
    setLoading(true);

    const { bankPlanID, name, id } = props.plan;
    const { companyId, dueDate } = props.Invoice;

    await updateSubscription({
      companyId,
      bankPlanID,
      planId: id,
      planName: name,
      dueDate,
      planValue: price,
    })
      .then((resp) => {
        if (resp.status == 200) {
          toast.success("Plano atualizado com sucesso!");
          history.push("/financeiro");
        }
      })
      .catch(() => toast.error("Não foi possível efetuar a mudança de plano!"))
      .finally(() => setLoading(false));
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
          <ListItem style={{ padding: "50px" }}>
            {isSubChange && (
              <Box
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "50px",
                }}
              >
                <Typography variant="h5">
                  Efetuar mudança para {props?.plan?.name}
                </Typography>
                <Typography variant="h6">R${price}</Typography>
                <Button
                  variant="contained"
                  disabled={loading}
                  style={{ backgroundColor: "black" }}
                  onClick={() => updatePlan()}
                >
                  {loading ? (
                    <CircularProgress color="secondary" />
                  ) : (
                    "Efetuar mudança de plano"
                  )}
                </Button>
              </Box>
            )}
          </ListItem>
          <ListItem></ListItem>
        </List>
      </Box>
    </>
  );
};

export default ListActiveCharges;
