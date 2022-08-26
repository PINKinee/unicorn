import requires from './require'

export const register = (params) => requires({
    url: '/register',
    data: params,
    method: 'post'
});

export const login = (params) => requires({
    url: '/login',
    data: params,
    method: 'post'
});