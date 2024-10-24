import React, { useEffect, useState, useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import PixSVG from "../../assets/pixSvg.js";
import * as Yup from "yup";
import cardBrands from "../../helpers/cardBrands.js";
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
  CircularProgress,
} from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";

import {
  ArrowForward,
  CreditCard,
  Security,
  ArrowBack,
  Pix,
  CardGiftcardOutlined,
} from "@material-ui/icons";
import SvgIcon from "@mui/material/SvgIcon";
import useCheckout from "../../hooks/useCheckout";
import ChargeForm from "../ChargeForm";
import api from "../../services/api";
import useAuth from "../../hooks/useAuth.js";
import useCompanies from "../../hooks/useCompanies";
import { AuthContext } from "../../context/Auth/AuthContext.js";
import { useHistory } from "react-router-dom/cjs/react-router-dom.js";
import justNumber from "../../helpers/justNumbers.js";
import { toast } from "react-toastify";

// SVG ilustrativo do cartão de crédito
const CreditCardIllustration = ({ cardNumber, cardName, cardDate, brand }) => (
  <SvgIcon viewBox="0 0 500 300" sx={{ width: "100%", height: "auto" }}>
    <rect x="0" y="0" width="500" height="300" rx="20" ry="20" fill="#000000" />
    <text x="30" y="50" fill="#fff" fontSize="24" fontWeight="bold">
      Bank
    </text>
    <text x="30" y="150" fill="#fff" fontSize="22">
      {formatNumCard(cardNumber) || "**** **** **** ****"}
    </text>
    <text x="30" y="200" fill="#fff" fontSize="18">
      {/* {cardName || "Seu Nome Aqui"} */}
    </text>
    <text x="380" y="200" fill="#fff" fontSize="18">
      {/* {cardDate || "MM/AA"} */}
    </text>
    {brand != "" && (
      <image href={brand} x="340" y="20" width="200" height="50" />
    )}

    <rect x="80" y="230" width="200" height="30" fill="#fff" rx="5" ry="5" />
  </SvgIcon>
);

function formatNumCard(cardNumber) {
  cardNumber = cardNumber?.replace(/\s+/g, "");
  if (cardNumber) {
    return `${cardNumber.substring(0, 4)} ${cardNumber.substring(
      4,
      8
    )} ${cardNumber.substring(8, 12)} ${cardNumber.substring(12, 16)}`;
  }
}

// Validação com Yup
const validationSchema = Yup.object({
  cardNumber: Yup.string().required("Número do cartão é obrigatório"),
  cardName: Yup.string().required("Nome no cartão é obrigatório"),
  cardDate: Yup.string().required("Data de validade é obrigatória"),
  cardCvv: Yup.string()
    .required("CVV é obrigatório")
    .matches(/^[0-9]{3,6}$/, "Deve ter 3 ou 4 dígitos"),
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
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  chargeInfoForm: {
    width: "45%",
    backgroundColor: "#c1c1c1",
  },
}));

const CreditCardForm = (props) => {
  const classes = useStyles();
  const { generatePaymentToken, identifyBrand, subscribe } = useCheckout();
  const { handleLogout } = useContext(AuthContext);
  const [chargeInfo, setChargeInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewCheckout, setViewCheckout] = useState(false);
  const history = useHistory();

  const [brand, setBrand] = useState();

  useEffect(() => {}, []);

  async function showBrand(cardNumber) {
    setLoading(true);
    identifyBrand(cardNumber)
      .then((res) => {
        if (res) {
          setChargeInfo({
            ...chargeInfo,
            ...{ cardFlag: res, cardNumber: cardNumber },
          });
          setBrand(cardBrands(res));
        }
      })
      .finally(() => setLoading(false));
  }

  const formatExpiryDate = (value, setFieldValue) => {
    const rawValue = value?.replace(/\D/g, ""); // Remove caracteres não numéricos

    if (rawValue.length <= 2) {
      // Apenas o mês, sem formatação
      setFieldValue("cardDate", rawValue);
    }

    if (rawValue.length > 2) {
      const month = rawValue?.slice(0, 2);
      const year = rawValue?.slice(2, 4); // Apenas os dois últimos dígitos do ano
      setFieldValue("cardDate", `${month}/${year}`);
    }
  };

  const onSubmit = async (values) => {
    try {
      setLoading(true);

      var expirationMonth = values.cardDate.split("/")[0];

      var expirationYear = values.cardDate.split("/")[1];

      values = {
        ...values,
        ...{
          expirationMonth,
          expirationYear: `20${expirationYear}`,
          brand: chargeInfo?.cardFlag,
        },
      };

      var { payment_token } = await generatePaymentToken(values);

      setChargeInfo({
        ...chargeInfo,
        ...{
          payment_token,
          bankPlanID: props.plan?.bankPlanID,
          planID: props.plan?.id,
          planName: props.plan?.name,
          planValue: props.plan?.value,
          cardNumber: values?.cardNumber?.replace(/\s+/g, ""),
        },
      });

      await subscribe({
        ...chargeInfo,
        ...{
          payment_token,
          bankPlanID: props.plan?.bankPlanID,
          planId: props.plan?.id,
          planName: props.plan?.name,
          planValue: props.plan?.value,
          cardNumber: values?.cardNumber?.replace(/\s+/g, ""),
          cardName: values?.cardName,
        },
      })
        .then((res) => {
          toast.success("Operação efetuada com sucesso!");
          setLoading(false);

          window.location.reload();
        })
        .catch((err) => {
          console.log(err);

          setLoading(false);

          toast.error(
            "Não foi possível completar a operação, confira os dados!"
          );
        });
    } catch (err) {
      setLoading(false);
    }
  };
  return (
    <Box
      sx={{ padding: 4, maxWidth: 1000, margin: "0 auto" }}
      className={classes.root}
    >
      <Box className={classes.pixButton}>
        {!viewCheckout ? (
          <Button onClick={() => props.selectPlan(null)}>
            <ArrowBack></ArrowBack>
            <Typography>Planos</Typography>
          </Button>
        ) : (
          <Button onClick={() => setViewCheckout(false)}>
            <ArrowBack></ArrowBack>
            <Typography>Dados de Cobrança</Typography>
          </Button>
        )}
        {/* <Button onClick={() => props.methodPix(true)}>
          <PixSVG />
          <Typography>Pagar com pix</Typography>
          <ArrowForward></ArrowForward>
        </Button> */}
      </Box>
      <Box className={classes.chargeArea}>
        {!viewCheckout ? (
          <Card className={classes.chargeInfoForm} elevation={0}>
            <ChargeForm
              plan={props?.plan}
              setChargeInfo={setChargeInfo}
              showCheckout={setViewCheckout}
            />
          </Card>
        ) : (
          <Card className={classes.cardPreview} elevation={0}>
            <CardContent>
              <CreditCardIllustration
                cardNumber={chargeInfo?.cardNumber}
                cardName={chargeInfo?.cardName}
                cardDate={chargeInfo?.cardDate}
                brand={brand}
              />
              <Formik
                initialValues={{
                  cardNumber: "",
                  cardName: "",
                  cardDate: "",
                  cardCvv: "",
                }}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
              >
                {({
                  isSubmitting,
                  handleChange,
                  setFieldValue,
                  handleBlur,
                  resetForm,
                  errors,
                  touched,
                }) => (
                  <Form className={classes.formCard}>
                    <Grid container spacing={3}>
                      {/* Número do Cartão */}
                      <Grid item xs={12}>
                        <Field
                          name="cardNumber"
                          as={TextField}
                          label="Número do Cartão"
                          inputProps={{
                            maxLength: 16,
                            pattern: "[0-9]*",
                          }}
                          fullWidth
                          disabled={chargeInfo == null}
                          onChange={(e) =>
                            setFieldValue(
                              "cardNumber",
                              justNumber(e.target.value)
                            )
                          }
                          onBlur={(e) => {
                            showBrand(e.target.value);
                          }}
                          helperText={<ErrorMessage name="cardNumber" />}
                          error={
                            touched.cardNumber && Boolean(errors.cardNumber)
                          }
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Field
                          name="cardName"
                          as={TextField}
                          label="Nome no Cartão"
                          fullWidth
                          disabled={chargeInfo == null}
                          onBlur={handleBlur}
                          helperText={<ErrorMessage name="cardName" />}
                          error={touched.cardName && Boolean(errors.cardName)}
                        />
                      </Grid>

                      <Grid item xs={6}>
                        <Field
                          name="cardDate"
                          as={TextField}
                          label="Data de Expiração (MM/AAAA)"
                          placeholder="00/00"
                          fullWidth
                          disabled={chargeInfo == null}
                          onChange={(e) =>
                            formatExpiryDate(e.target.value, setFieldValue)
                          }
                          onBlur={handleBlur}
                          helperText={<ErrorMessage name="cardExpiry" />}
                          error={touched.cardDate && Boolean(errors.cardDate)}
                        />
                      </Grid>

                      <Grid item xs={6}>
                        <Field
                          name="cardCvv"
                          as={TextField}
                          label="CVV"
                          inputProps={{ maxLength: 3, pattern: "[0-9]*" }}
                          fullWidth
                          onChange={(e) =>
                            setFieldValue("cardCvv", justNumber(e.target.value))
                          }
                          disabled={chargeInfo == null}
                          onBlur={handleBlur}
                          helperText={<ErrorMessage name="cardCvv" />}
                          error={touched.cardCvv && Boolean(errors.cardCvv)}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        {!loading ? (
                          <Button
                            sx={{ backgroundColor: "black" }}
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            disabled={chargeInfo == null || loading}
                          >
                            Pagar
                          </Button>
                        ) : (
                          <CircularProgress />
                        )}
                      </Grid>
                    </Grid>
                  </Form>
                )}
              </Formik>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
};

export default CreditCardForm;
