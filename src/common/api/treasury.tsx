// Packages
import axios from "axios";

// Types
import { Treasury, Deptor } from "../types";

export const getAllTreasuries = async (): Promise<Treasury[]> => {
  try {
    const serviceUri =
      "https://backendfacturacion-dot-chat-socialcog.ue.r.appspot.com/Treasuries/";
    const response = await axios.get(serviceUri);
    if (response.status === 200 || response.status === 201) {
      const data = response.data as Treasury[];
      return data;
    }
    return [];
  } catch (error) {
    console.error("Unexpected error " + error);
    return [];
  }
};

export const getDeptors = async (id: string): Promise<Deptor[]> => {
  try {
    const serviceUri = `https://backendfacturacion-dot-chat-socialcog.ue.r.appspot.com/Treasuries/${id}`;
    const response = await axios.get(serviceUri);
    if (response.status === 200 || response.status === 201) {
      const data = response.data.Deudores as Deptor[];
      return data;
    }
    return [];
  } catch (error) {
    console.error("Unexpected error " + error);
    return [];
  }
};

export const uploadTreasury = async (formData: FormData): Promise<boolean> => {
  try {
    const serviceUri = `https://backendfacturacion-dot-chat-socialcog.ue.r.appspot.com/Treasuries/`;
    const response = await axios.post(serviceUri, formData, {
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    });
    if (response.status === 200 || response.status === 201) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Unexpected error " + error);
    return false;
  }
};
