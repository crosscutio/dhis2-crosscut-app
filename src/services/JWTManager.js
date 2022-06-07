let inMemory = null;
let userMemory = null;

export const getToken = () => inMemory;

export const setToken = (token) => {
  inMemory = token;
  return true;
};

export const deleteToken = () => {
  inMemory = null;
  return true;
};

export const getUser = () => userMemory;

export const setUser = (user) => {
  userMemory = user;
  return true;
};
