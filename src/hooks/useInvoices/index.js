import api, { openApi } from "../../services/api";

const useInvoices = () => {
  const getLastInvoice = async (params) => {
    const { data } = await openApi.request({
      url: "/invoices/list",
      method: "GET",
      params,
    });
    console.log(data);

    return data[data.length - 1];
  };

  const listInvoice = async (params) => {
    const { data } = await api.request({
      url: "/invoices/all",
      method: "GET",
      params,
    });
    return data;
  };

  const save = async (data) => {
    const { data: responseData } = await api.request({
      url: "/invoices",
      method: "POST",
      data,
    });
    return responseData;
  };

  const show = async (data) => {
    const { data: responseData } = await api.request({
      url: "/invoices/${id}",
      method: "GET",
      data,
    });
    return responseData;
  };

  const update = async (data) => {
    const { data: responseData } = await api.request({
      url: `/invoices/${data.id}`,
      method: "PUT",
      data,
    });
    return responseData;
  };

  const remove = async (id) => {
    const { data } = await api.request({
      url: `/invoices/${id}`,
      method: "DELETE",
    });
    return data;
  };

  return {
    getLastInvoice,
    listInvoice,
    save,
    update,
    remove,
  };
};

export default useInvoices;
