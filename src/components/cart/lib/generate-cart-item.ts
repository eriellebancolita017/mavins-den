export function generateCartItem(item: any) {
  return {
    id: item.id,
    name: item.name,
    slug: item.slug,
    unit: item.unit,
    image: item.image?.thumbnail,
    stock: item.quantity,
    price: Number(item.sale_price ? item.sale_price : item.price),
    shop: {
      slug: item.shop.slug,
      name: item.shop.name,
    },
  };
}
