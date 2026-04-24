import Image from "next/image";
import { FaPlus } from "react-icons/fa";

type ProductCardProps = {
  name: string;
  price: string;
  image: string;
};

export function ProductCard({ name, price, image }: ProductCardProps) {
  return (
    <article className="flex flex-col rounded-xl border border-[#c3caac]/20 bg-white p-4 shadow-sm md:col-span-6 lg:col-span-4">
      <Image
        src={image}
        alt={name}
        width={800}
        height={800}
        unoptimized
        className="mb-3 aspect-square w-full rounded-xl object-cover"
      />
      <h4 className="mb-2 text-xl font-bold">{name}</h4>
      <div className="mt-auto flex items-center justify-between pt-2">
        <span className="text-lg font-bold">{price}</span>
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f1f4f2] text-[#4c6700] hover:bg-[#e6e9e7]">
          <FaPlus className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}