import { NextSeoProps } from "next-seo";
import { useRouter } from "next/router";
import { description } from "./constants";

export function useNextSeoProps() {
  const { route } = useRouter();
  const result: NextSeoProps = {
    description,
  };
  if (route !== "/") {
    result.titleTemplate = "%s – Reading notes";
  } else {
    result.titleTemplate = "%s";
  }
  return result;
}
