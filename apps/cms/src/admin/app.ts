import { wellnestAdminTheme } from './styles/theme';
import './styles/main.css';

export default {
  config: {
    locales: ['vi', 'en'],
    theme: wellnestAdminTheme,
    tutorials: false,
    notifications: {
      releases: false
    }
  },
  bootstrap() {}
};
