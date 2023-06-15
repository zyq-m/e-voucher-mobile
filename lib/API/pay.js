import instanceAxios from "../instanceAxios";

export const pay = async ({ id, data }) => {
  const response = await instanceAxios.post(
    `/api/transactions/cafe/${id}`,
    data
  );

  return response.data;
};
