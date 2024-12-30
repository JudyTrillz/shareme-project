export const shortenUrl = (url) => {
  try {
    const { hostname, pathname } = new URL(url);
    return pathname.length > 1 ? `${hostname}/` : hostname;
  } catch (error) {
    console.error("Invalid URL:", error);
    return url;
  }

  return url;
};
