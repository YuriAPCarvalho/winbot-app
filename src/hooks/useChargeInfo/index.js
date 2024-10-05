import api, { openApi } from "../../services/api";

const useChargeInfo = () => {
  const list = async (params) => {
    const { data } = await api.request({
      url: "/invoices/all",
      method: "GET",
      params,
    });
    return data;
  };

  const findChargesByCompany = async (id) => {
    const { data } = await api.request({
      url: `/chargeinfo/${id}`,
      method: "GET",
    });
    return data;
  };

  const save = async (data) => {
    const { data: responseData } = await api.request({
      url: "/chargeinfo",
      method: "POST",
      data,
    });
    return responseData;
  };

  const update = async (data) => {
    const { data: responseData } = await api.request({
      url: `/chargeinfo/`,
      method: "PUT",
      data,
    });
    return responseData;
  };

  return {
    list,
    save,
    findChargesByCompany,
    update,
  };
};

export default useChargeInfo;
