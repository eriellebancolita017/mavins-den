import { Item } from './cart.utils';

export function generateCartItem(item: any) {
  return {
    item_id: item.item_id || item.cover_photo,
    item_name: item.title,
    item_cover_photo: item.cover_photo,
    stock: item.quantity,
    price: Number(item.sale_price ? item.sale_price : item.price),
    restaurant_id: item.restaurant_id,
    item_options: item.item_options || [],
  };
}
