import { initializeApp } from 'firebase/app';
import { Analytics, getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyAw0oIds5udlHFUcuCaoRs92kzrQJ-6NVY',
  authDomain: 'marvinsden-web.firebaseapp.com',
  projectId: 'marvinsden-web',
  storageBucket: 'marvinsden-web.appspot.com',
  messagingSenderId: '272602882553',
  appId: '1:272602882553:web:2fc933ada3babd32479d28',
  measurementId: 'G-PG9QYS4K1L',
};

let analytics: Analytics;
const app = initializeApp(firebaseConfig);

if (app.name && typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { analytics };
