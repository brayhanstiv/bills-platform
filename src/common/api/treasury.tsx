// Packages
import axios from "axios";

// Types
import { Treasury } from "../types";

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

export const getTreasuryById = async (id: string): Promise<Treasury | null> => {
  try {
    const serviceUri = `https://backendfacturacion-dot-chat-socialcog.ue.r.appspot.com/Treasuries/${id}`;
    const response = await axios.get(serviceUri);
    if (response.status === 200 || response.status === 201) {
      const data = response.data as Treasury;
      return data;
    }
    return null;
  } catch (error) {
    console.error("Unexpected error " + error);
    return null;
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
