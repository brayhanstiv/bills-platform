// Packages
import axios from "axios";

// Types
import { Invoice } from "../types";

export const getInvoices = async (): Promise<Invoice[]> => {
  try {
    const serviceUri =
      "https://backendfacturacion-dot-chat-socialcog.ue.r.appspot.com/Invoices/";
    const response = await axios.get(serviceUri);
    if (response.status === 200 || response.status === 201) {
      const data = response.data as Invoice[];
      return data;
    }
    return [];
  } catch (error) {
    console.error("Unexpected error " + error);
    return [];
  }
};

export const uploadInvoices = async (formData: FormData): Promise<boolean> => {
  try {
    const serviceUri =
      "https://backendfacturacion-dot-chat-socialcog.ue.r.appspot.com/Invoices/";
    const response = await axios.post(serviceUri, formData, {
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        "Access-Control-Allow-Origin": "*",
      },
    });
    console.log(response);
    if (response.status === 200 || response.status === 201) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Unexpected error " + error);
    return false;
  }
};
