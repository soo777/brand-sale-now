import { Brand } from "@/types/type";

export default function BrandCard({ brand }: { brand: Brand }) {
  return (
    <div>
      <h3 className="text-lg font-bold">{brand.name}</h3>
      <p className="text-sm text-gray-600">{brand.description}</p>
    </div>
  );
}
