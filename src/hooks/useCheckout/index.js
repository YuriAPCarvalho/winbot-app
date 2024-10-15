import EfiPay from "payment-token-efi";
import toastError from "../../errors/toastError";
import { toast } from "react-toastify";
import api from "../../services/api";

const useCheckout = () => {
  async function identifyBrand(cardNumber) {
    try {
      const brand = await EfiPay.CreditCard.setCardNumber(
        cardNumber
      ).verifyCardBrand();

      return brand;
    } catch (error) {
      toastError("Bandeira não identificada!");
    }
  }

  async function listInstallments() {
    try {
      const installments = await EfiPay.CreditCard.setAccount(
        "Identificador_de_conta_aqui"
      )
        .setEnvironment("sandbox") // 'production' or 'sandbox'
        .setBrand("visa")
        .setTotal(28990)
        .getInstallments();
    } catch (error) {}
  }

  async function generatePaymentToken({
    cardNumber,
    cardName,
    expirationMonth,
    expirationYear,
    cardCvv,
    brand,
  }) {
    try {
      const result = await EfiPay.CreditCard.setAccount(
        "3add04ec035570accb5cb720b299406e"
      )
        .setEnvironment(process.env.REACT_APP_CARDTOKEN) // 'production' or 'sandbox'
        .setCreditCardData({
          brand,
          number: cardNumber,
          cvv: cardCvv,
          expirationMonth,
          expirationYear,
          reuse: true,
        })
        .getPaymentToken();

      const payment_token = result.payment_token;
      const card_mask = result.card_mask;

      return { payment_token, card_mask };
    } catch (error) {
      toast.error(error.error_description);
    }
  }

  const subscribe = async (data) => {
    const { data: responseData } = await api.request({
      url: "/cardsubscription",
      method: "POST",
      data,
    });
    return responseData;
  };

  const unsubscribe = async (data) => {
    const { data: responseData } = await api.request({
      url: "/cardunsubscription",
      method: "POST",
      data,
    });
    return responseData;
  };

  const updateSubscription = async (data) => {
    const { data: responseData } = await api.request({
      url: "/upgradeSubscription",
      method: "POST",
      data,
    });
    return responseData;
  };

  return {
    identifyBrand,
    listInstallments,
    generatePaymentToken,
    subscribe,
    unsubscribe,
    updateSubscription,
  };
};

export default useCheckout;
