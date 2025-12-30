export const validateEthioPhone = (_: any, value: string) => {
  value = value?.trim();  
  if (!value) {
    return Promise.reject(new Error("Phone number required"));
  }
  const regex = /^(\+251|0)[9]\d{8}$/;
  if (regex.test(value)) {
    return Promise.resolve();
  }
  return Promise.reject(new Error("Enter a valid Ethiopian number (09... or +2519...)"));
};