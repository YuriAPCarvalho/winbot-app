import React, { useEffect, useState, useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import PixSVG from "../../assets/pixSvg.js";
import * as Yup from "yup";
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Card,
  CardContent,
  InputAdornment,
  Link,
} from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";

import {
  ArrowForward,
  CreditCard,
  Security,
  ArrowBack,
  Pix,
} from "@material-ui/icons";
import SvgIcon from "@mui/material/SvgIcon";
import useCheckout from "../../hooks/useCheckout";
import ChargeForm from "../ChargeForm";
import api from "../../services/api";
import useAuth from "../../hooks/useAuth.js";
import useCompanies from "../../hooks/useCompanies";

// SVG ilustrativo do cartão de crédito
const CreditCardIllustration = ({ cardNumber, cardName, cardExpiry }) => (
  <SvgIcon viewBox="0 0 500 300" sx={{ width: "100%", height: "auto" }}>
    <rect x="0" y="0" width="500" height="300" rx="20" ry="20" fill="#000000" />
    <text x="30" y="50" fill="#fff" fontSize="24" fontWeight="bold">
      Fí Bank
    </text>
    <text x="30" y="150" fill="#fff" fontSize="22">
      {formatNumCard(cardNumber) || "**** **** **** ****"}
    </text>
    <text x="30" y="200" fill="#fff" fontSize="18">
      {cardName || "Seu Nome Aqui"}
    </text>
    <text x="380" y="200" fill="#fff" fontSize="18">
      {cardExpiry || "MM/AA"}
    </text>
    <rect x="30" y="230" width="440" height="30" fill="#fff" rx="5" ry="5" />
  </SvgIcon>
);

function formatNumCard(cardNumber) {
  if (cardNumber) {
    return `${cardNumber.substring(0, 4)} ${cardNumber.substring(
      4,
      8
    )} ${cardNumber.substring(8, 12)} ${cardNumber.substring(12, 16)}`;
  }
}

// Validação com Yup
const validationSchema = Yup.object({
  cardNumber: Yup.string()
    .required("Número do cartão é obrigatório")
    .matches(/^[0-9]{16}$/, "Deve ter 16 dígitos"),
  cardName: Yup.string().required("Nome no cartão é obrigatório"),
  cardExpiry: Yup.string()
    .required("Data de validade é obrigatória")
    .matches(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, "Data inválida"),
  cardCvv: Yup.string()
    .required("CVV é obrigatório")
    .matches(/^[0-9]{3,4}$/, "Deve ter 3 ou 4 dígitos"),
});

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  cardPreview: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minWidth: "400px",
    maxWidth: "45%",
  },
  formCard: {
    paddingTop: "20px",
    maxWidth: "500px",
  },
  footer: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
  pixButton: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
  },
  chargeArea: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
  },
  chargeInfoForm: {
    width: "45%",
    backgroundColor: "#c1c1c1",
  },
}));

const CreditCardForm = (props) => {
  const classes = useStyles();
  const { generatePaymentToken } = useCheckout();
  const [chargeInfo, setChargeInfo] = useState(null);

  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
  });

  const handleCardInputChange = (field, value) => {
    setCardInfo((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  useEffect(() => {
    Promise.all([generatePaymentToken()]);
  }, []);

  return (
    <Box
      sx={{ padding: 4, maxWidth: 1000, margin: "0 auto" }}
      className={classes.root}
    >
      <Box className={classes.pixButton}>
        <Button onClick={() => props.selectPlan(null)}>
          <ArrowBack></ArrowBack>
          <Typography>Planos</Typography>
        </Button>
        <Button onClick={() => props.methodPix(true)}>
          <PixSVG />
          <Typography>Pagar com pix</Typography>
          <ArrowForward></ArrowForward>
        </Button>
      </Box>
      <Box className={classes.chargeArea}>
        <Card className={classes.chargeInfoForm} elevation={0}>
          <ChargeForm plan={props?.plan} setChargeInfo={setChargeInfo} />
        </Card>
        <Card className={classes.cardPreview} elevation={0}>
          <CardContent>
            <CreditCardIllustration
              cardNumber={cardInfo.cardNumber}
              cardName={cardInfo.cardName}
              cardExpiry={cardInfo.cardExpiry}
            />
            <Formik
              initialValues={{
                cardNumber: "",
                cardName: "",
                cardExpiry: "",
                cardCvv: "",
              }}
              validationSchema={validationSchema}
              onSubmit={(values, { setSubmitting }) => {
                setSubmitting(true);
                console.log("Enviando dados:", values);
                setTimeout(() => {
                  setSubmitting(false);
                  alert("Pagamento realizado com sucesso!");
                }, 2000);
              }}
            >
              {({ isSubmitting, handleChange, handleBlur }) => (
                <Form noValidate className={classes.formCard}>
                  <Grid container spacing={3}>
                    {/* Número do Cartão */}
                    <Grid item xs={12}>
                      <Field
                        name="cardNumber"
                        as={TextField}
                        label="Número do Cartão"
                        fullWidth
                        onChange={(e) => {
                          handleChange(e);
                          handleCardInputChange("cardNumber", e.target.value);
                        }}
                        onBlur={handleBlur}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <CreditCard />
                            </InputAdornment>
                          ),
                        }}
                        helperText={<ErrorMessage name="cardNumber" />}
                        error={<ErrorMessage name="cardNumber" />}
                      />
                    </Grid>

                    {/* Nome no Cartão */}
                    <Grid item xs={12}>
                      <Field
                        name="cardName"
                        as={TextField}
                        label="Nome no Cartão"
                        fullWidth
                        onChange={(e) => {
                          handleChange(e);
                          handleCardInputChange("cardName", e.target.value);
                        }}
                        onBlur={handleBlur}
                        helperText={<ErrorMessage name="cardName" />}
                        error={<ErrorMessage name="cardName" />}
                      />
                    </Grid>

                    {/* Data de Expiração */}
                    <Grid item xs={6}>
                      <Field
                        name="cardExpiry"
                        as={TextField}
                        label="Data de Expiração (MM/AA)"
                        fullWidth
                        onChange={(e) => {
                          handleChange(e);
                          handleCardInputChange("cardExpiry", e.target.value);
                        }}
                        onBlur={handleBlur}
                        helperText={<ErrorMessage name="cardExpiry" />}
                        error={<ErrorMessage name="cardExpiry" />}
                      />
                    </Grid>

                    {/* CVV */}
                    <Grid item xs={6}>
                      <Field
                        name="cardCvv"
                        as={TextField}
                        label="CVV"
                        fullWidth
                        onBlur={handleBlur}
                        helperText={<ErrorMessage name="cardCvv" />}
                        error={<ErrorMessage name="cardCvv" />}
                      />
                    </Grid>

                    {/* Botão de Submissão */}
                    <Grid item xs={12}>
                      <Button
                        sx={{ backgroundColor: "black" }}
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={chargeInfo == null}
                      >
                        {isSubmitting ? "Processando..." : "Pagar"}
                      </Button>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default CreditCardForm;
