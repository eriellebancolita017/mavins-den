export function generateCartItem(item: any) {
  return {
    id: item.item_id || item.cover_photo,
    name: item.title,
    slug: item.item_id || item.cover_photo,
    unit: item.unit || '',
    image: item.cover_photo,
    stock: item.quantity,
    price: Number(item.sale_price ? item.sale_price : item.price),
    shop: {
      slug: item.restaurant_id,
      name: item.restaurant_name,
    },
  };
}
