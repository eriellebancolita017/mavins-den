export const API_ENDPOINTS = {
  // template
  PRODUCTS: '/products',
  PRODUCTS_POPULAR: '/popular-products',
  PRODUCTS_FREE_DOWNLOAD: '/free-downloads/digital-file',
  CATEGORIES: '/categories',
  TAGS: '/tags',
  SHOPS: '/shops',
  TOP_SHOPS: '/top-shops',
  ORDERS: '/orders',
  ORDERS_CHECKOUT_VERIFY: 'orders/checkout/verify',
  ORDERS_DOWNLOADS: '/downloads',
  GENERATE_DOWNLOADABLE_PRODUCT_LINK: '/downloads/digital-file',
  USERS: '/users',
  USERS_ME: '/me',

  SETTINGS: '/settings',
  SETTINGS_CONTACT_US: '/contact-us',
  UPLOADS: '/attachments',

  // @Explore meal bundles
  EXPLORE_MEAL_BUNDLES: 'explore/search',

  // @Explore meal preppers
  EXPLORE_MEAL_PREPPERS: 'explore/get-explore-data',

  // get prepper details
  PREPPER_DETAILS: 'restaurant/restaurant',

  // get item details
  ITEM_DETAILS: 'item/get-item-details',

  // auth
  USERS_LOGIN: 'auth/consumer/sign-in',
  USERS_REGISTER: 'auth/consumer/sign-up',
  USERS_FORGOT_PASSWORD: '/forget-password',
  USERS_VERIFY_FORGOT_PASSWORD_TOKEN: '/verify-forget-password-token',
  USERS_RESET_PASSWORD: '/reset-password',
  USERS_CHANGE_PASSWORD: '/change-password',
  USERS_LOGOUT: 'auth/consumer-logout',

  GET_PROFILE: 'account/display-profile',

  GET_OPT: 'auth/send-otp',
};
