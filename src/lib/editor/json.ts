const validateJson = (text: string) => {
  try {
    JSON.parse(text);
    return true;
  } catch (error) {
    return false;
  }
};

export { validateJson };
