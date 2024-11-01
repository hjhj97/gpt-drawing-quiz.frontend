import { api } from "./config";

export const sendMessage = async (imageData: string) => {
  const response = await api.post("/chat", { imageData });
  return response.data;
};
