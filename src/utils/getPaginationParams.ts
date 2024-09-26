export const getPaginationParams = (query: {
  page?: string;
  limit?: string;
}) => {
  const { page, limit } = query;
  const pageInt = page ? (parseInt(page) < 1 ? 1 : parseInt(page)) : 1;
  const limitInt = limit ? parseInt(limit) : 10;

  const skip = (pageInt - 1) * limitInt;
  const take = limitInt || 10;

  return { skip, take, page: pageInt, limit };
};
