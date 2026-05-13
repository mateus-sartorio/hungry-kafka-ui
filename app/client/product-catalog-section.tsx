"use client";

import { ProductCard } from "./components/product-card";
import type { CatalogItem } from "./home-data";

type ProductCatalogSectionProps = {
  products: CatalogItem[];
  onAddProduct: (product: CatalogItem) => void;
};

export function ProductCatalogSection({ products, onAddProduct }: ProductCatalogSectionProps) {
  return (
    <section>
      <h2 className="text-4xl font-black tracking-tighter">The Catalog</h2>
      <p className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#705a4f]">
        Curated Daily Selection
      </p>

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-12">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAdd={() => onAddProduct(product)}
          />
        ))}
      </div>
    </section>
  );
}
