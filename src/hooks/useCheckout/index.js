import EfiPay from "payment-token-efi";

const useCheckout = () => {
  async function identifyBrand(cardNumber) {
    try {
      const brand = await EfiPay.CreditCard.setCardNumber(
        cardNumber
      ).verifyCardBrand();

      console.log("Bandeira: ", brand);
    } catch (error) {
      console.log("Código: ", error.code);
      console.log("Nome: ", error.error);
      console.log("Mensagem: ", error.error_description);
    }
  }

  async function listInstallments() {
    try {
      const installments = await EfiPay.CreditCard.setAccount(
        "Identificador_de_conta_aqui"
      )
        .setEnvironment("production") // 'production' or 'sandbox'
        .setBrand("visa")
        .setTotal(28990)
        .getInstallments();

      console.log("Parcelas", installments);
    } catch (error) {
      console.log("Código: ", error.code);
      console.log("Nome: ", error.error);
      console.log("Mensagem: ", error.error_description);
    }
  }

  async function generatePaymentToken() {
    try {
      const result = await EfiPay.CreditCard.setAccount(
        "3add04ec035570accb5cb720b299406e"
      )
        .setEnvironment("sandbox") // 'production' or 'sandbox'
        .setCreditCardData({
          brand: "mastercard",
          number: "5502091689523612",
          cvv: "630",
          expirationMonth: "09",
          expirationYear: "2032",
          reuse: false,
        })
        .getPaymentToken();

      const payment_token = result.payment_token;
      const card_mask = result.card_mask;

      console.log("payment_token", payment_token);
      console.log("card_mask", card_mask);
    } catch (error) {
      console.log("Código: ", error.code);
      console.log("Nome: ", error.error);
      console.log("Mensagem: ", error.error_description);
    }
  }

  return {
    identifyBrand,
    listInstallments,
    generatePaymentToken,
  };
};

export default useCheckout;
