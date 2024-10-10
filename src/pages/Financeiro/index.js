import React, { useState, useEffect, useReducer, useContext } from "react";
import { toast } from "react-toastify";

import { makeStyles } from "@material-ui/core/styles";

import {
  Typography,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Button,
  Table,
  Box,
} from "@material-ui/core";

import PlanList from "../../components/PlanList";

import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import Title from "../../components/Title";
import SubscriptionModal from "../../components/SubscriptionModal";
import api from "../../services/api";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import toastError from "../../errors/toastError";
import CreditCardForm from "../../components/CreditCardForm";

import moment from "moment";
import CheckoutPage from "../../components/CheckoutPage";
import ListActiveCharges from "../../components/ListActiveCharges";
import useChargeInfo from "../../hooks/useChargeInfo";
import { AuthContext } from "../../context/Auth/AuthContext";
import { RadioButtonChecked } from "@material-ui/icons";
import cardBrands from "../../helpers/cardBrands";
import useCheckout from "../../hooks/useCheckout";

const reducer = (state, action) => {
  if (action.type === "LOAD_INVOICES") {
    const invoices = action.payload;
    const newUsers = [];

    invoices.forEach((user) => {
      const userIndex = state.findIndex((u) => u.id === user.id);
      if (userIndex !== -1) {
        state[userIndex] = user;
      } else {
        newUsers.push(user);
      }
    });

    return [...state, ...newUsers];
  }

  if (action.type === "UPDATE_USERS") {
    const user = action.payload;
    const userIndex = state.findIndex((u) => u.id === user.id);

    if (userIndex !== -1) {
      state[userIndex] = user;
      return [...state];
    } else {
      return [user, ...state];
    }
  }

  if (action.type === "DELETE_USER") {
    const userId = action.payload;

    const userIndex = state.findIndex((u) => u.id === userId);
    if (userIndex !== -1) {
      state.splice(userIndex, 1);
    }
    return [...state];
  }

  if (action.type === "RESET") {
    return [];
  }
};

const useStyles = makeStyles((theme) => ({
  mainPaper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(1),
    marginBottom: "14px",
    ...theme.scrollbarStyles,
  },
  container: {
    overflowY: "scroll",
    ...theme.scrollbarStyles,
  },
}));

const Invoices = () => {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const [invoices, dispatch] = useReducer(reducer, []);
  const [storagePlans, setStoragePlans] = React.useState([]);
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState();
  const [methodPix, setMethodPix] = useState(false);
  const [charges, setCharges] = useState([]);
  const { findChargesByCompany } = useChargeInfo();
  const { user } = useContext(AuthContext);

  const handleOpenContactModal = (invoices) => {
    setStoragePlans(invoices);
    setSelectedContactId(null);
    setContactModalOpen(true);
  };

  const handleCloseContactModal = () => {
    setSelectedContactId(null);
    setContactModalOpen(false);
  };

  useEffect(() => {
    findChargesByCompany(user?.companyId).then((res) => {
      setCharges(res);
      console.log(res);
    });
  }, []);

  useEffect(() => {
    dispatch({ type: "RESET" });
    setPageNumber(1);
  }, [searchParam]);

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      const fetchInvoices = async () => {
        try {
          const { data } = await api.get("/invoices/all", {
            params: { searchParam, pageNumber },
          });
          dispatch({ type: "LOAD_INVOICES", payload: data });
          setHasMore(data.hasMore);
          setLoading(false);
        } catch (err) {
          toastError(err);
        }
      };
      fetchInvoices();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchParam, pageNumber]);

  const loadMore = () => {
    setPageNumber((prevState) => prevState + 1);
  };

  const handleScroll = (e) => {
    if (!hasMore || loading) return;
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - (scrollTop + 100) < clientHeight) {
      loadMore();
    }
  };
  const rowStyle = (record) => {
    const hoje = moment(moment()).format("DD/MM/yyyy");
    const vencimento = moment(record.dueDate).format("DD/MM/yyyy");
    var diff = moment(vencimento, "DD/MM/yyyy").diff(
      moment(hoje, "DD/MM/yyyy")
    );
    var dias = moment.duration(diff).asDays();
    if (dias < 0 && record.status !== "paid") {
      return { backgroundColor: "#ffbcbc9c" };
    }
  };

  const rowStatus = (record) => {
    const hoje = moment(moment()).format("DD/MM/yyyy");
    const vencimento = moment(record.dueDate).format("DD/MM/yyyy");
    var diff = moment(vencimento, "DD/MM/yyyy").diff(
      moment(hoje, "DD/MM/yyyy")
    );
    var dias = moment.duration(diff).asDays();
    const status = record.status;
    if (status === "paid") {
      return "Pago";
    } else if (status === "canceled") {
      return "Cancelado";
    }
    if (dias < 0) {
      return "Vencido";
    } else {
      return "Em Aberto";
    }
  };

  return (
    <MainContainer>
      <Box className={classes.container}>
        <SubscriptionModal
          open={contactModalOpen}
          onClose={handleCloseContactModal}
          aria-labelledby="form-dialog-title"
          Invoice={storagePlans}
          contactId={selectedContactId}
        ></SubscriptionModal>
        <MainHeader>
          <Title>Faturas</Title>
        </MainHeader>
        <Paper
          className={classes.mainPaper}
          variant="outlined"
          onScroll={handleScroll}
        >
          {selectedPlan == null ? (
            <PlanList
              selectPlan={setSelectedPlan}
              Invoice={invoices[invoices.length - 1]}
            />
          ) : methodPix ? (
            <CheckoutPage
              Invoice={storagePlans}
              methodPix={setMethodPix}
              selectPlan={setSelectedPlan}
            />
          ) : charges.some((c) => c.cardNumber != null) ? (
            <ListActiveCharges
              selectPlan={setSelectedPlan}
              charges={charges}
              Invoice={invoices[invoices.length - 1]}
              plan={selectedPlan}
            />
          ) : (
            <CreditCardForm
              selectPlan={setSelectedPlan}
              methodPix={setMethodPix}
              plan={selectedPlan}
            />
          )}
        </Paper>
        {charges.length > 0 ? (
          <Paper style={{ marginBottom: "20px" }}>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-around",
                padding: "10px",
                alignItems: "center",
              }}
            >
              <RadioButtonChecked />

              <img
                src={cardBrands(charges[0]?.cardFlag)}
                style={{ height: 20 }}
              />
              <Typography>
                {charges[0]?.cardNumber
                  ?.slice(-4)
                  .padStart(charges[0]?.cardNumber?.length, "*")}
              </Typography>
              <Typography color="textPrimary">Ativo</Typography>
            </Box>
          </Paper>
        ) : (
          <></>
        )}
        <Paper
          className={classes.mainPaper}
          variant="outlined"
          onScroll={handleScroll}
        >
          <Box bgcolor={"black"}>
            <Typography
              variant="h6"
              gutterBottom
              align="center"
              style={{ color: "white" }}
            >
              Histórico de Faturas
            </Typography>
          </Box>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center">Id</TableCell>
                <TableCell align="center">Detalhes</TableCell>
                <TableCell align="center">Valor</TableCell>
                <TableCell align="center">Data Venc.</TableCell>
                <TableCell align="center">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <>
                {invoices
                  .sort((a, b) => b.id - a.id)
                  .map((invoices) => (
                    <TableRow style={rowStyle(invoices)} key={invoices.id}>
                      <TableCell align="center">{invoices.id}</TableCell>
                      <TableCell align="center">{invoices.detail}</TableCell>
                      <TableCell style={{ fontWeight: "bold" }} align="center">
                        {invoices.value.toLocaleString("pt-br", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </TableCell>
                      <TableCell align="center">
                        {moment(invoices.dueDate).format("DD/MM/YYYY")}
                      </TableCell>
                      <TableCell style={{ fontWeight: "bold" }} align="center">
                        {rowStatus(invoices)}
                      </TableCell>
                    </TableRow>
                  ))}
                {loading && <TableRowSkeleton columns={4} />}
              </>
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </MainContainer>
  );
};

export default Invoices;
