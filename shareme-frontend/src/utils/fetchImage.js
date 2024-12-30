export const fetchImageFromUnsplash = async () => {
  let imageUrl = "";
  const accessKey = process.env.REACT_APP_UNSPLASHACCESS_KEY;
  const query = "earth technology space";
  try {
    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=${query}&client_id=${accessKey}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    imageUrl = data.urls.regular;
  } catch (error) {
    console.error("Error fetching random image:", error.message);
    return "";
  }
  return imageUrl;
};
