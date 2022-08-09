import type {
  AuthResponse,
  CategoryPaginator,
  CategoryQueryOptions,
  ForgetPasswordInput,
  LoginUserInput,
  Order,
  OrderedFilePaginator,
  OrderPaginator,
  OrderQueryOptions,
  PasswordChangeResponse,
  Product,
  ProductPaginator,
  ProductQueryOptions,
  RegisterUserInput,
  ResetPasswordInput,
  Settings,
  Shop,
  ShopPaginator,
  ShopQueryOptions,
  Tag,
  TagPaginator,
  UpdateProfileInput,
  User,
  QueryOptions,
  CreateContactUsInput,
  VerifyForgetPasswordTokenInput,
  ChangePasswordInput,
  PopularProductsQueryOptions,
  CreateOrderInput,
  CheckoutVerificationInput,
  VerifiedCheckoutResponse,
  TopShopQueryOptions,
  Attachment,
  BundleQueryOptions,
  Bundles,
  Preppers,
  Prepper,
  Bundle,
} from '@/types';
import { API_ENDPOINTS } from './endpoints';
import { HttpClient } from './http-client';

class Client {
  // template
  products = {
    all: ({
      categories,
      tags,
      name,
      shop_id,
      price,
      ...query
    }: Partial<ProductQueryOptions> = {}) =>
      HttpClient.get<ProductPaginator>(API_ENDPOINTS.PRODUCTS, {
        searchJoin: 'and',
        with: 'shop',
        orderBy: 'updated_at',
        sortedBy: 'ASC',
        ...query,
        search: HttpClient.formatSearchParams({
          categories,
          tags,
          name,
          shop_id,
          price,
          status: 'publish',
        }),
      }),
    popular: (params: Partial<PopularProductsQueryOptions>) =>
      HttpClient.get<Product[]>(API_ENDPOINTS.PRODUCTS_POPULAR, {
        with: 'shop',
        withCount: 'orders',
        ...params,
      }),
    get: (slug: string) =>
      HttpClient.get<Product>(`${API_ENDPOINTS.PRODUCTS}/${slug}`, {
        with: 'shop;tags;type',
        withCount: 'orders',
      }),
    download: (input: { product_id: string }) =>
      HttpClient.post<string>(API_ENDPOINTS.PRODUCTS_FREE_DOWNLOAD, input),
  };
  categories = {
    all: (query?: CategoryQueryOptions) =>
      HttpClient.get<CategoryPaginator>(API_ENDPOINTS.CATEGORIES, query),
  };
  tags = {
    all: (query?: QueryOptions) =>
      HttpClient.get<TagPaginator>(API_ENDPOINTS.TAGS, query),
    get: (slug: string) => HttpClient.get<Tag>(`${API_ENDPOINTS.TAGS}/${slug}`),
  };
  shops = {
    all: (query?: ShopQueryOptions) =>
      HttpClient.get<ShopPaginator>(API_ENDPOINTS.SHOPS, query),
    top: ({ name, ...query }: Partial<TopShopQueryOptions> = {}) =>
      HttpClient.get<ShopPaginator>(API_ENDPOINTS.TOP_SHOPS, {
        searchJoin: 'and',
        withCount: 'products',
        ...query,
        search: HttpClient.formatSearchParams({
          name,
          is_active: 1,
        }),
      }),
    get: (slug: string) =>
      HttpClient.get<Shop>(`${API_ENDPOINTS.SHOPS}/${slug}`),
  };
  orders = {
    all: (query?: OrderQueryOptions) =>
      HttpClient.get<OrderPaginator>(API_ENDPOINTS.GET_ORDER_LIST, query),
    get: (tracking_number: string) =>
      HttpClient.get<Order>(`${API_ENDPOINTS.ORDERS}/${tracking_number}`),
    downloadable: (query?: OrderQueryOptions) =>
      HttpClient.get<OrderedFilePaginator>(
        API_ENDPOINTS.ORDERS_DOWNLOADS,
        query
      ),
    generateDownloadLink: (digital_file_id: string) =>
      HttpClient.post<string>(
        API_ENDPOINTS.GENERATE_DOWNLOADABLE_PRODUCT_LINK,
        {
          digital_file_id,
        }
      ),
    verify: (data: CheckoutVerificationInput) =>
      HttpClient.post<VerifiedCheckoutResponse>(
        API_ENDPOINTS.ORDERS_CHECKOUT_VERIFY,
        data
      ),
    create: (data: CreateOrderInput) =>
      HttpClient.post<Order>(API_ENDPOINTS.ORDERS, data),

    verifyCoupon: (data: any) =>
      HttpClient.post<any>(API_ENDPOINTS.VERIFY_COUPON, data),
  };
  users = {
    me: () => HttpClient.get<User>(API_ENDPOINTS.USERS_ME),
    update: (user: any) =>
      HttpClient.post<any>(API_ENDPOINTS.UPDATE_PROFILE, user),
    login: (input: LoginUserInput) =>
      HttpClient.post<AuthResponse>(API_ENDPOINTS.USERS_LOGIN, input),
    register: (input: RegisterUserInput) =>
      HttpClient.post<AuthResponse>(API_ENDPOINTS.USERS_REGISTER, input),
    forgotPassword: (input: ForgetPasswordInput) =>
      HttpClient.post<PasswordChangeResponse>(
        API_ENDPOINTS.USERS_FORGOT_PASSWORD,
        input
      ),
    verifyForgotPasswordToken: (input: VerifyForgetPasswordTokenInput) =>
      HttpClient.post<PasswordChangeResponse>(
        API_ENDPOINTS.USERS_VERIFY_FORGOT_PASSWORD_TOKEN,
        input
      ),
    resetPassword: (input: any) =>
      HttpClient.post<any>(API_ENDPOINTS.USERS_RESET_PASSWORD, input),
    changePassword: (input: ChangePasswordInput) =>
      HttpClient.post<PasswordChangeResponse>(
        API_ENDPOINTS.USERS_CHANGE_PASSWORD,
        input
      ),
    logout: (payload: any) =>
      HttpClient.post<boolean>(API_ENDPOINTS.USERS_LOGOUT, payload),

    getOpt: (payload: any) =>
      HttpClient.post<any>(API_ENDPOINTS.GET_OPT, payload),

    verifyOpt: (payload: any) =>
      HttpClient.post<any>(API_ENDPOINTS.VERIFY_OPT, payload),

    verifyEmailOpt: (payload: any) =>
      HttpClient.post<any>(API_ENDPOINTS.VERIFY_EMAIL_OPT, payload),

    getProfile: (payload: any) =>
      HttpClient.get<any>(API_ENDPOINTS.GET_PROFILE, payload),
  };
  settings = {
    all: () => HttpClient.get<Settings>(API_ENDPOINTS.SETTINGS),
    contactUs: (input: CreateContactUsInput) =>
      HttpClient.post<any>(API_ENDPOINTS.SETTINGS_CONTACT_US, input),
    upload: (input: File[]) => {
      let formData = new FormData();
      input.forEach((attachment) => {
        formData.append('attachment[]', attachment);
      });
      return HttpClient.post<Attachment[]>(API_ENDPOINTS.UPLOADS, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
  };

  bundles = {
    get: (query: BundleQueryOptions) =>
      HttpClient.get<{ payload: Bundles[] }>(
        API_ENDPOINTS.EXPLORE_MEAL_BUNDLES,
        query
      ),

    getDetails: (query: BundleQueryOptions) =>
      HttpClient.get<{ payload: Bundle }>(API_ENDPOINTS.ITEM_DETAILS, query),
  };

  preppers = {
    get: (query: BundleQueryOptions) =>
      HttpClient.get<{ payload: Preppers[] }>(
        API_ENDPOINTS.EXPLORE_MEAL_PREPPERS,
        query
      ),

    getDetails: (query: BundleQueryOptions) =>
      HttpClient.get<{ payload: Prepper }>(
        API_ENDPOINTS.PREPPER_DETAILS,
        query
      ),
  };

  cart = {
    addItemToCart: (query: any) => {
      let formData = new FormData();
      Object.keys(query).forEach((key: any) => {
        if (key === 'item_options') {
          formData.append(key, JSON.stringify(query[key]));
        } else formData.append(key, query[key]);
      });
      return HttpClient.post<any>(
        `${API_ENDPOINTS.ADD_TO_CART}${
          query.consumer_id ? 'consumer' : 'guest'
        }`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
    },
    getAllInCart: (user_code: string) => {
      return HttpClient.get(`${API_ENDPOINTS.GET_ALL_IN_CART}${user_code}`);
    },
    removeFromCart: (user_cart_code: string) => {
      return HttpClient.delete(
        `${API_ENDPOINTS.DELETE_FROM_CART}${user_cart_code}`
      );
    },
    removeAllFromCart: (user_code: string) => {
      return HttpClient.delete(
        `${API_ENDPOINTS.DELETE_ALL_FROM_CART}${user_code}`
      );
    },
  };

  address = {
    manageAddress: (query: any) => {
      return HttpClient.post<any>(API_ENDPOINTS.MANAGE_ADDRESS, query);
    },
  };
}

export default new Client();
