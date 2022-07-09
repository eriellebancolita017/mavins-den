import type { NextPage } from 'next';
import type { ReactElement, ReactNode } from 'react';
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
  id: string;
  name: string;
  profile: {
    id: string;
    bio: string;
    contact: string;
    avatar: Attachment;
  };
  role: string;
  created_at: string;
  updated_at: string;
}
export interface UpdateProfileInput {
  id: string;
  name: string;
  profile: {
    id: string;
    bio?: string;
    contact?: string;
    avatar?: Attachment | null;
  };
}
export interface ChangePasswordInput {
  oldPassword: string;
  newPassword: string;
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
}
export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
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
  token: string;
  permissions: string[];
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
  amount: number;
  total: number;
  paid_total: number;
  customer_contact: string;
  products: ConnectProductOrderPivot[];
  status: string;
  sales_tax: number;
  billing_address: any;
  payment_gateway: string;
  token?: string;
  use_wallet_points: boolean;
}
export interface CheckoutVerificationInput {
  amount: number;
  products: ConnectProductOrderPivot[];
}
export interface VerifiedCheckoutResponse {
  total_tax: number;
  shipping_charge: number;
  unavailable_products: string[];
  wallet_currency: number;
  wallet_amount: number;
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
  id: string;
  tracking_number: string;
  total: number;
  status: string;
  products: Product[];
  created_at: string;
  updated_at: string;
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
