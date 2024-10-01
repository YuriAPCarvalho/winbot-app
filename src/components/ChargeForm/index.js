import React, { useState, useEffect, useContext } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { AuthContext } from "../../context/Auth/AuthContext";
import { makeStyles } from "@material-ui/core/styles";
import { Security } from "@material-ui/icons";
import api from "../../services/api";
import useAuth from "../../hooks/useAuth.js";
import useCompanies from "../../hooks/useCompanies";
import axios from "axios";
import {
  Button,
  TextField,
  Grid,
  Container,
  Typography,
  Box,
} from "@mui/material";

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  //   name: Yup.string().required("Name is required"),
  //   email: Yup.string().email("Invalid email").required("Email is required"),
  cpf: Yup.string().required("CPF is required"),
  dataNascimento: Yup.date().required("Birth date is required"),
  //   phone_number: Yup.string().required("Phone number is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  street: Yup.string().required("Street is required"),
  //   number: Yup.string().required("Number is required"),
  neighborhood: Yup.string().required("Neighborhood is required"),
  cep: Yup.string()
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
  const [address, setAddress] = useState({
    city: "",
    state: "",
    street: "",
    neighborhood: "",
  });
  const classes = useStyles();
  const { getCurrentUserInfo } = useAuth();
  const { find } = useCompanies();
  const { user } = useContext(AuthContext);
  const [company, setCompany] = useState();

  useEffect(() => {
    Promise.all([
      getCurrentUserInfo().then((res) => {
        console.log(res);
      }),
      console.log(user),
      find(user?.companyId).then((res) => {
        if (res) {
          setCompany(res);
        }
      }),
    ]);
  }, []);

  const handleZipcodeChange = async (e, setFieldValue) => {
    const zipcode = e.target.value;

    if (zipcode.length === 8) {
      try {
        const response = await axios.get(
          `http://viacep.com.br/ws/${zipcode}/json/`
        );
        if (response.data.erro) {
          setFieldValue("cep", "");
          alert("Invalid Zipcode");
        } else {
          setFieldValue("city", response.data.localidade);
          setFieldValue("state", response.data.estado);
          setFieldValue("street", response.data.logradouro);
          setFieldValue("neighborhood", response.data.bairro);
          setAddress({
            city: response.data.localidade,
            state: response.data.estado,
            street: response.data.logradouro,
            neighborhood: response.data.bairro,
          });
          console.log(response);
        }
      } catch (error) {
        console.error("Error fetching address:", error);
        alert("Error fetching address");
      }
    }
  };

  const handleSubmit = (values) => {
    console.log("Form Data", [
      values,
      { name: company.name, phone_number: company.phone },
      address,
    ]);

    props.setChargeInfo(values);
    // Submit form data
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
          initialValues={{
            name: "",
            email: "",
            cpf: "",
            dataNascimento: "",
            phone_number: "",
            city: address.city,
            state: address.state,
            street: address.street,
            number: "",
            neighborhood: address.neighborhood,
            cep: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            handleChange,
            setFieldValue,
            errors,
            touched,
            setSubmitting,
          }) => (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="CPF"
                    name="cpf"
                    value={values.cpf}
                    onChange={handleChange}
                    error={touched.cpf && Boolean(errors.cpf)}
                    helperText={touched.cpf && errors.cpf}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Data de Nascimento"
                    name="dataNascimento"
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
                    name="cep"
                    value={values.zipcode}
                    onChange={(e) => {
                      handleChange(e);
                      handleZipcodeChange(e, setFieldValue);
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
                    value={values.number}
                    onChange={handleChange}
                    error={touched.number && Boolean(errors.number)}
                    helperText={touched.number && errors.number}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    sx={{ backgroundColor: "black" }}
                    variant="contained"
                    color="primary"
                    type="submit"
                    fullWidth
                  >
                    SALVAR
                  </Button>
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
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Visa.svg/1200px-Visa.svg.png"
              alt="Visa"
              style={{ height: 20 }}
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1200px-Mastercard-logo.svg.png"
              alt="Mastercard"
              style={{ height: 20 }}
            />
            <img
              src="https://cdn.icon-icons.com/icons2/1178/PNG/512/amex-inverted_82041.png"
              alt="Amex"
              style={{ height: 20 }}
            />
            <img
              src="https://www.svgrepo.com/show/328105/elo.svg"
              alt="Elo"
              style={{ height: 20 }}
            />
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default ChargeForm;
