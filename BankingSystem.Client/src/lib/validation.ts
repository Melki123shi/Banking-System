export const validateEthioPhone = (_: any, value: string) => {
  value = value?.trim();  
  if (!value) {
    return Promise.reject(new Error("Phone number required"));
  }
  const regex = /^\d{8}$/;
  if (regex.test(value)) {
    return Promise.resolve();
  }
  return Promise.reject(new Error("Enter a valid Ethiopian number (+2519...)"));
};