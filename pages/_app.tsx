import { AppProps } from "next/app";
import "../styles.css";

export default function ReadingNotes({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
