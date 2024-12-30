import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export const client = createClient({
  projectId: process.env.REACT_APP_SHAREME_PROJECT_ID,
  dataset: "production",
  apiVersion: "2024-04-07",
  useCdn: true,
  token: process.env.REACT_APP_SHAREME_PROJECT_TOKEN,
  ignoreBrowserTokenWarning: true,
});

const builder = imageUrlBuilder(client);

export const urlFor = (source) => builder.image(source);
