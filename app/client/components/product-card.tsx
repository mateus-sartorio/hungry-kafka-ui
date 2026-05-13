"use client";

import Image from "next/image";
import { FaPlus } from "react-icons/fa";
import type { CatalogItem } from "../home-data";

type ProductCardProps = {
  product: CatalogItem;
  onAdd: () => void;
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export function ProductCard({ product, onAdd }: ProductCardProps) {
  return (
    <article className="flex flex-col rounded-xl border border-[#c3caac]/20 bg-white p-4 shadow-sm md:col-span-6 lg:col-span-4">
      <Image
        src={product.photoUrl}
        alt={product.name}
        width={800}
        height={800}
        unoptimized
        className="mb-3 aspect-square w-full rounded-xl object-cover"
      />
      <div className="mb-2 flex items-center gap-2">
        <span className="rounded-full bg-[#f1f4f2] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#4c6700]">
          {product.category.name}
        </span>
      </div>
      <h4 className="mb-2 text-xl font-bold">{product.name}</h4>
      <p className="mb-4 line-clamp-2 text-sm text-[#737a61]">{product.description}</p>
      <div className="mt-auto flex items-center justify-between pt-2">
        <span className="text-lg font-bold">{formatPrice(product.price)}</span>
        <button
          type="button"
          onClick={onAdd}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f1f4f2] text-[#4c6700] hover:bg-[#e6e9e7]"
          aria-label={`Add ${product.name} to cart`}
        >
          <FaPlus className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}