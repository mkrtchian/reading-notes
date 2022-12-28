import Image from "next/image";

export function Logo() {
  return (
    <Image
      src="/logo.png"
      alt="Reading notes homepage"
      width={30}
      height={30}
    />
  );
}
