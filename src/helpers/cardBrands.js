import React from "react";

const cardBrands = (brand) => {
  switch (brand) {
    case "mastercard":
      return "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1200px-Mastercard-logo.svg.png";

    case "visa":
      return "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Visa.svg/1200px-Visa.svg.png";

    case "amex":
      return "https://cdn.icon-icons.com/icons2/1178/PNG/512/amex-inverted_82041.png";

    case "elo":
      return "https://www.svgrepo.com/show/328105/elo.svg";

    default:
      return <></>;
  }
};
export default cardBrands;
