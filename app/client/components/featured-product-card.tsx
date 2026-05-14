"use client";

import Image from "next/image";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";
import type { CatalogItem } from "../home-data";

type FeaturedProductCardProps = {
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

export function FeaturedProductCard({ product, detailHref, onAdd }: FeaturedProductCardProps) {
  return (
    <article className="mb-8 flex flex-col sm:flex-row overflow-hidden rounded-2xl border border-[#c3caac]/20 bg-white shadow-md md:col-span-full">
      <Link
        href={detailHref}
        className="group relative block aspect-[4/3] w-full shrink-0 overflow-hidden sm:aspect-square sm:w-1/2 md:w-3/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4c6700]"
      >
        <Image
          src={product.photoUrl}
          alt={product.name}
          fill
          unoptimized
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 60vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-col justify-between p-6 sm:w-1/2 md:w-2/5">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full bg-[#4c6700] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">
              Featured
            </span>
            <span className="rounded-full bg-[#f1f4f2] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#4c6700]">
              {product.category.name}
            </span>
          </div>
          <Link
            href={detailHref}
            className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4c6700] focus-visible:ring-offset-2"
          >
            <h3 className="line-clamp-2 text-2xl font-black leading-tight text-[#181c1b] group-hover:text-[#4c6700] md:text-3xl">
              {product.name}
            </h3>
            {product.description && (
              <p className="mt-3 line-clamp-3 text-sm font-medium text-[#737a61] md:text-base">
                {product.description}
              </p>
            )}
          </Link>
        </div>
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-[#c3caac]/20 pt-4">
          <span className="text-3xl font-black tabular-nums">{formatPrice(product.price)}</span>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAdd();
            }}
            className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#4c6700] px-6 text-sm font-bold text-white transition hover:bg-[#3d5200] active:scale-95"
            aria-label={`Add ${product.name} to cart`}
          >
            <FaPlus className="h-4 w-4" />
            Add to Order
          </button>
        </div>
      </div>
    </article>
  );
}
