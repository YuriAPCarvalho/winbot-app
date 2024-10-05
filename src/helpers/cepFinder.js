import { toast } from "react-toastify";
import axios from "axios";

export const handleZipcodeChange = async (cep) => {
  console.log(cep.length);

  if (cep.length === 8) {
    try {
      const response = await axios.get(`http://viacep.com.br/ws/${cep}/json/`);
      if (response.data.erro) {
        toast.error("Invalid Zipcode");
        return {
          city: "",
          state: "",
          street: "",
          neighborhood: "",
        };
      } else {
        return {
          city: response.data.localidade,
          state: response.data.uf,
          street: response.data.logradouro,
          neighborhood: response.data.bairro,
        };
      }
    } catch (error) {
      toast.error("Erro ao encontrar CEP!");
      alert("Error fetching address");
      return Promise.reject();
    }
  }
};
