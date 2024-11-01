import { api } from "./config";

export const sendMessage = async (imageData: string) => {
  const apiResponse = await api.post<{ response: string }>("/chat", {
    imageData,
  });
  return apiResponse.data.response;
};
