import { ProductCard } from "./components/product-card";
import type { ClientHomeData } from "./home-data";

type ProductCatalogSectionProps = {
  products: ClientHomeData["products"];
};

export function ProductCatalogSection({ products }: ProductCatalogSectionProps) {
  return (
    <section>
      <h2 className="text-4xl font-black tracking-tighter">The Catalog</h2>
      <p className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#705a4f]">
        Curated Daily Selection
      </p>

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-12">
        {products.map((product) => (
          <ProductCard key={product.name} {...product} />
        ))}
      </div>
    </section>
  );
}
