import React from "react";
import { usePlans } from "../../hooks/usePlans";

const PlanCard = () => {
  const { list } = usePlans();

  return <div>PlanCard</div>;
};

export default PlanCard;
