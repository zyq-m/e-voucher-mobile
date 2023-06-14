import instanceAxios from "../instanceAxios";

export const getTransactionsByDate = async (student, id, from, to) => {
  const res = await instanceAxios.get(
    `/api/transactions/${
      student ? `students` : `cafe`
    }/range/${id}/${from}/${to}`
  );

  return await res.data;
};
