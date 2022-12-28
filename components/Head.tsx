import { assetPrefix, description } from "../config/constants";

export function Head() {
  const title = "Reading notes";
  return (
    <>
      <meta name="msapplication-TileColor" content="#fff" />
      <meta httpEquiv="Content-Language" content="en" />
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta name="apple-mobile-web-app-title" content={title} />
      <link
        rel="icon"
        type="image/x-icon"
        href={`${assetPrefix}/favicon.ico`}
      />
    </>
  );
}
