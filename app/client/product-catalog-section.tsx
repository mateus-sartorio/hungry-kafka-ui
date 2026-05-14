"use client";

import { ProductCard } from "./components/product-card";
import { FeaturedProductCard } from "./components/featured-product-card";
import type { CatalogItem } from "./home-data";

type ProductCatalogSectionProps = {
  products: CatalogItem[];
  onAddProduct: (product: CatalogItem) => void;
};

export function ProductCatalogSection({ products, onAddProduct }: ProductCatalogSectionProps) {
  if (!products || products.length === 0) {
    return null;
  }

  const featuredProduct = products[0];
  const regularProducts = products.slice(1);

  return (
    <section>
      <h2 className="text-4xl font-black tracking-tighter">The Catalog</h2>
      <p className="mb-6 mt-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#705a4f]">
        Curated Daily Selection
      </p>

      {featuredProduct && (
        <FeaturedProductCard
          product={featuredProduct}
          detailHref={`/client/products/${featuredProduct.id}`}
          onAdd={() => onAddProduct(featuredProduct)}
        />
      )}

      {regularProducts.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {regularProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              detailHref={`/client/products/${product.id}`}
              onAdd={() => onAddProduct(product)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
