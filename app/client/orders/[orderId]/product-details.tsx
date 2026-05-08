import Image from "next/image";

type ProductDetailsProps = {
  name: string;
  price: string;
  image: string;
};

export function ProductDetails({ name, price, image }: ProductDetailsProps) {
  return (
    <article className="group flex items-center justify-between bg-white p-4 shadow-sm outline outline-1 outline-[#c3caac]/20 transition-colors hover:bg-[#f1f4f2]">
      <div className="flex items-center gap-4">
        <Image
          src={image}
          alt={name}
          width={64}
          height={64}
          unoptimized
          className="h-16 w-16 object-cover outline outline-1 outline-[#c3caac]/20"
        />
        <h3 className="text-lg font-bold transition-all group-hover:italic">{name}</h3>
      </div>
      <span className="text-lg font-medium">{price}</span>
    </article>
  );
}
