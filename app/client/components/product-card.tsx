"use client";

import Image from "next/image";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";
import type { CatalogItem } from "../home-data";

type ProductCardProps = {
  product: CatalogItem;
  detailHref: string;
  onAdd: () => void;
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export function ProductCard({ product, detailHref, onAdd }: ProductCardProps) {
  return (
    <article className="flex flex-col rounded-lg border border-[#c3caac]/20 bg-white p-3 shadow-sm md:col-span-1">
      <Link
        href={detailHref}
        className="group block shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4c6700] focus-visible:ring-offset-2"
      >
        <div className="relative mb-2 aspect-square w-full max-h-28 overflow-hidden rounded-lg sm:max-h-32">
          <Image
            src={product.photoUrl}
            alt={product.name}
            fill
            unoptimized
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"
            className="object-cover transition-transform duration-200 group-hover:scale-[1.02]"
          />
        </div>
        <div className="mb-1.5 flex items-center gap-2">
          <span className="rounded-full bg-[#f1f4f2] px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#4c6700]">
            {product.category.name}
          </span>
        </div>
        <h4 className="line-clamp-2 text-sm font-bold leading-snug text-[#181c1b] group-hover:text-[#4c6700]">
          {product.name}
        </h4>
      </Link>
      <div className="mt-3 flex items-center justify-between gap-2 border-t border-[#c3caac]/10 pt-2">
        <span className="text-sm font-bold tabular-nums">{formatPrice(product.price)}</span>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAdd();
          }}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f1f4f2] text-[#4c6700] transition hover:bg-[#e6e9e7]"
          aria-label={`Add ${product.name} to cart`}
        >
          <FaPlus className="h-3.5 w-3.5" />
        </button>
      </div>
    </article>
  );
}
