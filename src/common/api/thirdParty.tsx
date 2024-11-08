import axios from "axios";
import { ThirdParty } from "../types";

export const getAllThirdParties = async (): Promise<ThirdParty[]> => {
  try {
    const serviceUri =
      "https://backendfacturacion-dot-chat-socialcog.ue.r.appspot.com/ThirdParties/";
    const response = await axios.get(serviceUri);
    if (response.status === 200 || response.status === 201) {
      const data = response.data as ThirdParty[];
      return data;
    }
    return [];
  } catch (error) {
    console.error("Unexpected error " + error);
    return [];
  }
};
