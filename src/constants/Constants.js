export const ACCESS_TOKEN = 'token';

export const ACTION_ADD = 'ADD';
export const ACTION_EDIT = 'EDIT';

export const ROLES = {
  ROLE_USER: 'USER',
  ROLE_ADMIN: 'ADMIN',
  ROLE_STORE_MANAGER: 'STORE_MANAGER',
  ROLE_BOOK_MANAGER: 'BOOK_MANAGER'
};

export const MENU_ITEMS = [
  {
    name: 'Home',
    path: '/',
    key: 'home',
    level: 1,
    enabled: true,
    subItems: null
  },
  {
    name: 'Song',
    path: '/song',
    key: 'song',
    level: 1,
    enabled: true,
    subItems: null
  },
  {
    name: 'About',
    path: '/about',
    key: 'about',
    level: 1,
    enabled: true,
    subItems: null
  }
];

// Những URL nào ko có trong này là public URL, role nào cũng access được
export const ROLE_TABLE = {
  '/book': [ROLES.ROLE_USER],
  '/staff': [ROLES.ROLE_STORE_MANAGER],
  '/fetch-demo': [ROLES.ROLE_USER]
};

export const STAFF_ALIVE = 1;
export const STAFF_DEAD = 0;

export const GENDERS = {
  MALE: 'male',
  FEMALE: 'female',
  GAY: 'gay',
  LESBIAN: 'lesbian',
  UNKNOWN: 'unknown'
};
