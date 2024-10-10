import React, { useState, useEffect, useContext, useRef } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { AuthContext } from "../../context/Auth/AuthContext";
import { makeStyles } from "@material-ui/core/styles";
import { Security } from "@material-ui/icons";
import useChargeInfo from "../../hooks/useChargeInfo";
import useAuth from "../../hooks/useAuth.js";
import useCompanies from "../../hooks/useCompanies";
import { isValidCPF } from "../../helpers/cpfValidator.js";
import {
  Button,
  TextField,
  Grid,
  Container,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify";
import toastError from "../../errors/toastError.js";
import ListActiveCharges from "../ListActiveCharges/index.js";
import { handleZipcodeChange } from "../../helpers/cepFinder.js";
import cardBrands from "../../helpers/cardBrands.js";
import justNumber from "../../helpers/justNumbers.js";

const validationSchema = Yup.object().shape({
  cpf: Yup.string()
    .required("CPF is required")
    .test("is-cpf", "CPF inválido", (value) => isValidCPF(value)),
  birth: Yup.date().required("Birth date is required"),

  zipcode: Yup.string()
    .required("Zipcode is required")
    .length(8, "Zipcode must be 8 digits"),
});

const useStyles = makeStyles((theme) => ({
  footer: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
}));

const ChargeForm = (props) => {
  const formikRef = useRef(null);
  const [initialValues, setInitialValues] = useState({
    name: "",
    email: "",
    phone_number: "",
    city: "",
    state: "",
    street: "",
    number: "",
    neighborhood: "",
    companyID: "",
  });

  const [loading, setLoading] = useState();
  const classes = useStyles();
  const { getCurrentUserInfo } = useAuth();
  const { find } = useCompanies();
  const { user } = useContext(AuthContext);
  const { save, findChargesByCompany, update } = useChargeInfo();
  const [companyCharges, setCompanyCharges] = useState();
  const [hasActiveCharges, setHasActiveCharges] = useState();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getCurrentUserInfo().then((res) => {}),

      find(user?.companyId).then((res) => {
        setInitialValues({
          ...initialValues,
          ...{
            companyId: res.id,
            name: res.name,
            phone_number: res.phone,
            email: res.email,
          },
        });

        findChargesByCompany(res.id)
          .then((res) => {
            console.log("data charger" + res);

            if (res.length > 0) {
              if (formikRef.current) {
                formikRef.current.setFieldValue("cpf", res[0]?.cpf);
                formikRef.current.setFieldValue("birth", res[0]?.birth);
                formikRef.current.setFieldValue("zipcode", res[0]?.zipcode);
                formikRef.current.setFieldValue("number", res[0]?.number);
                setInitialValues(res[0]);
                props.setChargeInfo(res[0]);
              }
            } else {
              setHasActiveCharges(false);
            }
            setLoading(false);

            setCompanyCharges(res);
          })
          .catch(() => {
            toast.error("Falha ao buscar informações de cobrança!");
          })
          .finally(() => setLoading(false));
      }),
    ]);
  }, []);

  const handleCEPChange = async (e, setFieldValue) => {
    setLoading(true);
    var cep = e.target.value;

    await handleZipcodeChange(cep)
      .then((res) => {
        if (res.state == "" || res.city == "") {
          toast.error("CEP Inválido");
        } else {
          setInitialValues({ ...initialValues, ...res });
        }
      })
      .finally(() => setLoading(false));
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    let body = {
      ...initialValues,
      ...values,
      ...{ cpf: values?.cpf.replace(/\D/g, "") },
    };

    if (initialValues.id) {
      await update(body)
        .then((res) => {
          props.setChargeInfo(res);

          toast.success("Atualizado com sucesso");
          props.showCheckout(true);
        })
        .catch((err) => {
          toast.error(err);
        })
        .finally(() => setLoading(false));
    } else {
      await save(body)
        .then((res) => {
          if (res) {
            toast.success("Salvo com sucesso");
            props.showCheckout(true);

            props.setChargeInfo(res);
          }
        })
        .catch((err) => {
          toastError(err);
        })
        .finally(() => setLoading(false));
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom>
          {props?.plan?.name}
        </Typography>
        <Typography variant="h4" fontWeight={12} gutterBottom>
          R${props?.plan?.value},00/mês
        </Typography>
        <Typography variant="h6" gutterBottom>
          Informe os dados da cobrança
        </Typography>
        <Formik
          innerRef={formikRef}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          initialValues={{
            cpf: "",
            birth: "",
            zipcode: "",
            number: "",
          }}
        >
          {({
            values,
            handleChange,
            setFieldValue,
            setValues,
            errors,
            touched,
            setSubmitting,
          }) => (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    inputProps={{ maxLength: 11, pattern: "[0-9]*" }}
                    label="CPF"
                    name="cpf"
                    max
                    value={values.cpf}
                    onChange={(e) =>
                      setFieldValue("cpf", justNumber(e.target.value))
                    }
                    error={touched.cpf && Boolean(errors.cpf)}
                    helperText={touched.cpf && errors.cpf}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Data de Nascimento"
                    name="birth"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={values.birth}
                    onChange={handleChange}
                    error={touched.birth && Boolean(errors.birth)}
                    helperText={touched.birth && errors.birth}
                  />
                </Grid>

                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    label="CEP"
                    name="zipcode"
                    inputProps={{ maxLength: 8, pattern: "[0-9]*" }}
                    value={values.zipcode}
                    onBlur={(e) => {
                      handleCEPChange(e, setFieldValue);
                    }}
                    onChange={(e) => {
                      setFieldValue("zipcode", justNumber(e.target.value));
                    }}
                    error={touched.zipcode && Boolean(errors.zipcode)}
                    helperText={touched.zipcode && errors.zipcode}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="Numero"
                    name="number"
                    onChange={(e) =>
                      setFieldValue("number", justNumber(e.target.value))
                    }
                    value={values.number}
                    error={touched.number && Boolean(errors.number)}
                    helperText={touched.number && errors.number}
                  />
                </Grid>

                <Grid item xs={12}>
                  {loading ? (
                    <CircularProgress />
                  ) : (
                    <Button
                      sx={{ backgroundColor: "black" }}
                      variant="contained"
                      color="primary"
                      type="submit"
                      fullWidth
                    >
                      SALVAR
                    </Button>
                  )}
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="body2" color="textSecondary">
            Transação segura garantida
          </Typography>

          <Box
            className={classes.footer}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: 1,
            }}
          >
            <Security color="primary" sx={{ fontSize: 30, mr: 1 }} />
            <Typography variant="body2" color="textSecondary">
              Pagamento protegido com criptografia SSL
            </Typography>
          </Box>

          {/* Bandeiras dos Cartões */}
          <Box
            sx={{ mt: 2, display: "flex", justifyContent: "center", gap: 2 }}
          >
            {["mastercard", "visa", "amex", "elo"].map((brand, index) => {
              return (
                <>
                  <img
                    key={index}
                    src={cardBrands(brand)}
                    alt="Elo"
                    style={{ height: 20 }}
                  />
                </>
              );
            })}
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default ChargeForm;
