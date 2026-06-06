export const users = {
    LOGIN: '/users/login',
    REGISTER: '/users/register',
    PROFILE_UPDATE: '/users/profile',
    PROFILE_IMAGE_UPLOAD: '/users/upload',
    FORGOT_PASSWORD: '/users/forgot-password',
    RESET_PASSWORD: '/users/reset-password',
};

export const expenses = {
    CREATE: '/user-expenses/create',
    GET_ALL: '/user-expenses/list',
    UPDATE: '/user-expenses/update',
    DELETE: '/user-expenses/delete'
};

export const incomes = {
    CREATE: '/user-incomes/create',
    GET_ALL: '/user-incomes/list',
    UPDATE: '/user-incomes/update',
    DELETE: '/user-incomes/delete'
};

export const dashboard = {
    SUMMARY: '/dashboard/summary'
};

export default users;