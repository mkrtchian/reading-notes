import { generateStaticParamsFor, importPage } from "nextra/pages";
import { useMDXComponents as getMDXComponents } from "../../mdx-components";

export const generateStaticParams = generateStaticParamsFor("mdxPath");

export async function generateMetadata(props: PageProps) {
  const params = await props.params;
  const { metadata } = await importPage(params.mdxPath);
  // Home page: keep the bare site name instead of "Reading notes – Reading notes".
  if (!params.mdxPath?.length) {
    return { ...metadata, title: { absolute: "Reading notes" } };
  }
  return metadata;
}

type PageProps = {
  params: Promise<{ mdxPath?: string[] }>;
};

const Wrapper = getMDXComponents().wrapper!;

export default async function Page(props: PageProps) {
  const params = await props.params;
  const result = await importPage(params.mdxPath);
  const { default: MDXContent, toc, metadata, sourceCode } = result;
  return (
    <Wrapper toc={toc} metadata={metadata} sourceCode={sourceCode}>
      <MDXContent {...props} params={params} />
    </Wrapper>
  );
}
