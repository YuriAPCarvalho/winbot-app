import React, { useEffect, useState } from "react";
import { AuthContext } from "../../context/Auth/AuthContext";
import { useContext } from "react";
import CheckCircle from "@material-ui/icons/CheckCircle.js";
import Cancel from "@material-ui/icons/Cancel.js";

import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Grid,
  Box,
} from "@mui/material";

import useAuth from "../../hooks/useAuth.js";
import usePlans from "../../hooks/usePlans/index.js";
import { List, ListItem } from "@material-ui/core";
import { clockClasses } from "@mui/x-date-pickers";
import BackdropLoading from "../BackdropLoading";

const PlanList = (props) => {
  const { list } = usePlans();
  const [plans, setPlans] = useState();
  const [loading, setLoading] = useState();
  useEffect(() => {
    setLoading(true);
    list().then((result) => {
      console.log(result);
      setLoading(false);
      setPlans(result.reverse());
    });
  }, []);

  const CheckIcon = () => {
    return <CheckCircle color="primary" />;
  };

  const CancelIcon = () => {
    return <Cancel color="error" />;
  };
  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      {loading && <BackdropLoading />}
      <Typography variant="h4" gutterBottom align="center">
        Nossos Planos de Assinatura
      </Typography>
      <Grid container spacing={4} sx={{ justifyContent: "center" }}>
        {plans?.map((plan, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                  {plan.name}
                </Typography>
                <List>
                  <Grid container spacing={0}>
                    <Grid item xs={12} md={12}>
                      <Typography variant="body1" color="text.secondary">
                        <CheckIcon /> {plan.users} Usuários
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <Typography variant="body1" color="text.secondary">
                        <CheckIcon /> {plan.connections} Conexões
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <Typography variant="body1" color="text.secondary">
                        <CheckIcon /> {plan.queues} Filas
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <Typography variant="body1" color="text.secondary">
                        {plan.useCampaigns ? <CheckIcon /> : <CancelIcon />}{" "}
                        Campanhas
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <Typography variant="body1" color="text.secondary">
                        {plan.useExternalApi ? <CheckIcon /> : <CancelIcon />}{" "}
                        API Externa
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <Typography variant="body1" color="text.secondary">
                        {plan.useIntegrations ? <CheckIcon /> : <CancelIcon />}{" "}
                        Integrações
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <Typography variant="body1" color="text.secondary">
                        {plan.useInternalChat ? <CheckIcon /> : <CancelIcon />}{" "}
                        Chat Interno
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <Typography variant="body1" color="text.secondary">
                        {plan.useKanban ? <CheckIcon /> : <CancelIcon />} Kanban
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <Typography variant="body1" color="text.secondary">
                        {plan.useOpenAi ? <CheckIcon /> : <CancelIcon />} I.A
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <Typography variant="body1" color="text.secondary">
                        {plan.useSchedules ? <CheckIcon /> : <CancelIcon />}{" "}
                        Agendamentos{" "}
                      </Typography>
                    </Grid>
                  </Grid>
                </List>

                <Typography
                  variant="h6"
                  component="div"
                  align="center"
                  sx={{ marginTop: 2 }}
                >
                  R${plan.value},00/mês
                </Typography>
              </CardContent>
              <CardActions sx={{ marginTop: "auto" }}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ backgroundColor: "black" }}
                  fullWidth
                  onClick={() => props.selectPlan(plan)}
                >
                  {props.Invoice?.detail == plan.name
                    ? "Pagar plano atual"
                    : "Contratar Plano"}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PlanList;
