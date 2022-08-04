import type { NextPage } from 'next';
import type { ReactElement, ReactNode } from 'react';

// real types
export interface BundleQueryOptions {
  latitude?: number;
  longitude?: number;
  code?: string;
  searchKeyword?: string;
  store_type?: string;
  restaurant_id?: string;
  consumer_id?: string;
  searchKey?: string;
  item_id?: string;
}

export interface Bundles {
  restaurant_name: 'Tastily';
  restaurant_id: 'RES1642268117ZOH24189';
  data: Bundle[];
}

export interface Bundle {
  price: 30;
  cover_photo: 'http://res.cloudinary.com/tiffineat/image/upload/v1642376853/marvinsden/items/16423768538468.jpg';
  status?: 'active';
  item_options?: any[];
  title: 'Taster Package - 4 Meals Bundle';
  description: "We pick 4 meals so that you can save. We'll follow your guidance, dietary reqs & preferences in the notes";
  ingredients?: 'x';
  item_id: 'ITM1642376854MMN50389';
  sort_id?: 0;
  avg_rating: 0;
  badge_count?: 0;

  preparation_time?: string;
  image?: string;
  est_weight?: string;
  restaurant_id?: string;
  restaurant_name?: string;
  location?: {
    type: string;
    coordinates: number[];
  };
  avg_rating_by_consumer?: number;
  avg_rating_by_delivery_boy?: number;
  discount_type?: string;
  discount_value?: number;
  range?: number;
  open_time?: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  close_time?: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  restaurant_longitude?: number;
  restaurant_latitude?: number;
  banner?: string[];
  availability_status?: string;
  currency?: string;
}

export interface Prepper {
  restaurant_id: string;
  store_type: string;
  availability_status: string;
  name: string;
  avg_rating: number;
  avg_rating_by_consumer: number;
  avg_rating_by_delivery_boy: number;
  address: string;
  logo: string;
  cover_photo: string;
  discount_type: string;
  discount_value: number;
  range: number;
  preparation_time: string;
  delivery_charge: number;
  _id: string;
  timing: {
    sunday: string;
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
  };
  restaurant_longitude: number;
  restaurant_latitude: number;
  distance: number;
  est_order_time: number;
  total_item: number;
  order_pickup_date: string;

  email?: string;
  mobile?: string;
  mobile_country_code?: string;
  description?: string;
  minimum_order_amount?: number;
  nick_name?: string;
  restaurant_category_id?: string[];
  is_free_delivery?: boolean;
  delivery_areas?: Area[];
  banner?: Banner[];
  couisionList?: Couision[];
  is_favorite?: boolean;
  currency?: string;
  is_mobile_update?: boolean;
  itemCategoryDetails?: ItemCategory[];
}

export interface Area {
  latitude: string;
  longitude: string;
}

export interface Banner {
  banner_id: string;
  type: string;
  url: string;
  thumbnail: string;
}

export interface Couision {
  _id: string;
  status: string;
  photo: string;
  title: string;
  description: string;
  cuisine_id: string;
  created_at: string;
  updated_at: string;
  __v: number;
}

export interface ItemCategory {
  categoryTitle: 'Mystery Meal Bundles (1-2 Day Delivery)';
  category_status: 'active';
  item_category_id: 'ITC1642372865TAU26853';
  itemList: Bundle[];
}

export interface Preppers {
  type: string;
  title: string;
  count: number;
  restaurant_type_id: string;
  currency: string;
  data: Prepper[];
}

// template types
export interface QueryOptions {
  page?: number;
  limit?: number;
}
export interface SearchParamOptions {
  [key: string]: unknown;
}
export interface ProductQueryOptions extends QueryOptions {
  shop_id: string;
  name: string;
  price: string | string[];
  categories: string | string[];
  tags: string | string[];
}
export interface PopularProductsQueryOptions {
  limit: number;
  shop_id: string;
  type_slug: string;
  range: number;
}
export interface TopShopQueryOptions {
  limit: number;
  name: string;
  range: number;
}
export interface CategoryQueryOptions extends QueryOptions {}
export interface ShopQueryOptions extends QueryOptions {}
export interface OrderQueryOptions extends QueryOptions {
  orderBy: string;
  sortedBy: string;
}
export type NextPageWithLayout<P = {}> = NextPage<P> & {
  authorization?: boolean;
  getLayout?: (page: ReactElement) => ReactNode;
};

interface PaginatorInfo<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: any[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}
export interface SEO {
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: Attachment;
  twitterHandle: string;
  twitterCardType: string;
  metaTags: string;
  canonicalUrl: string;
}
export interface Settings {
  id: string;
  options: {
    siteTitle: string;
    siteSubtitle: string;
    currency: string;
    logo: Attachment;
    seo: SEO;
    contactDetails: ContactDetails;
  };
}
export interface ContactDetails {
  socials: [ShopSocials];
  contact: string;
  location: Location;
  website: string;
}
export interface ShopSocials {
  icon: string;
  url: string;
}
export interface Location {
  lat: number;
  lng: number;
  city: string;
  state: string;
  country: string;
  zip: string;
  formattedAddress: string;
}
export interface Attachment {
  id: string;
  original: string;
  thumbnail: string;
}
export interface Shop {
  id: string;
  name: string;
  slug: string;
  description: string;
  orders_count: number;
  products_count: number;
  logo: Attachment;
  cover_image: Attachment;
  settings: {
    socials: {
      icon: string;
      url: string;
    }[];
  };
  address: {
    street_address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  owner: {
    id: string;
    name: string;
    email: string;
  };
}
export interface User {
  id?: string;
  name: string;
  profile?: {
    id: string;
    bio: string;
    contact: string;
    avatar: Attachment;
  };
  role?: string;
  created_at?: string;
  updated_at?: string;

  consumer_id: string;
  register_type: string;
  email: string;
  mobile: string;
  mobile_country_code: string;
  password: string;
  credit: number;
  profile_photo: string;
  device_id: string | null;
  device_token: string | null;
  device_type: string | null;
  device_name: string | null;
  login_address: string;
  status: string;
}
export interface UpdateProfileInput {
  consumer_id: string;
  name: string;
  mobile?: string;
  profile_photo?: string;
}
export interface ChangePasswordInput {
  old_password: string;
  new_password: string;
  conform_password: string;
}

export interface ContactInput {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
}
export interface LoginUserInput {
  email: string;
  password: string;
  user_type?: string;
  login_latitude?: number;
  login_longitude?: number;
  login_address?: string;
}
export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;

  register_type?: string;
  mobile?: string;
  mobile_country_code?: string;
  otp?: number;
  code?: string;
  device_id?: string;
  device_token?: string;
  device_type?: string;
  device_name?: string;
  user_type?: string;
}
export interface ForgetPasswordInput {
  email: string;
}
export interface ResetPasswordInput {
  token: string;
  email: string;
  password: string;
}
export interface VerifyForgetPasswordTokenInput {
  token: string;
  email: string;
}

export interface PasswordChangeResponse {
  success: boolean;
  message: string;
}
export interface AuthResponse {
  erorr: string | null;
  payload: {
    consumer_id: string;
    register_type: string;
    name: string;
    email: string;
    mobile: string;
    mobile_country_code: string;
    password: string;
    credit: number;
    profile_photo: string;
    device_id: string | null;
    device_token: string | null;
    device_type: string | null;
    device_name: string | null;
    login_address: string;
    status: string;
  };
  status: number;
}
export interface CreateContactUsInput {
  name: string;
  email: string;
  subject: string;
  description: string;
}
interface ConnectProductOrderPivot {
  product_id: string | number;
  order_quantity: number;
  unit_price: number;
  subtotal: number;
}
export interface CreateOrderInput {
  code: string;
  place_order_json: string;
}
export interface CheckoutVerificationInput {
  amount: number;
  // products: ConnectProductOrderPivot[];
  restaurant_id: string;
  consumer_id: string;
}
export interface VerifiedCheckoutResponse {
  error: null;
  payload: {
    clientSecret: string;
    customerId: string;
    customerEphemeralKeySecret: string;
  };
  status: '200';
}
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  sale_price: number;
  orders_count: number;
  total_downloads: number;
  image: Attachment;
  gallery: Attachment[];
  shop: Shop;
  created_at: string;
  updated_at: string;
  preview_url: string;
  tags: Tag[];
  type: {
    id: string;
    name: string;
  };
}

export interface ProductPaginator extends PaginatorInfo<Product> {}
export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface CategoryPaginator extends PaginatorInfo<Category> {}
export interface ShopPaginator extends PaginatorInfo<Shop> {}
export interface Order {
  // id: string;
  // tracking_number: string;
  // total: number;
  // status: string;
  // products: Product[];
  // created_at: string;
  // updated_at: string;
  error: null;
  payload: {
    order_id: string;
    credit: number;
  };
  status: string;
}
export interface DigitalFile {
  id: string;
  fileable: Product;
}
export interface OrderedFile {
  id: string;
  purchase_key: string;
  digital_file_id: string;
  customer_id: string;
  file: DigitalFile;
  created_at: string;
  updated_at: string;
}
export interface TagPaginator extends PaginatorInfo<Tag> {}
export interface OrderPaginator extends PaginatorInfo<Order> {}
export interface OrderedFilePaginator extends PaginatorInfo<OrderedFile> {}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Address {
  city: string;
  country: string;
  state: string;
  street_address: string;
  zip: string;
}
