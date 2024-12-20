import request from './request'

const { 
  REACT_APP_ENV,
} = process.env;

export default function() {
  return request<any>('/api/user/logon/account', {
    method: 'POST',
    data: { 
      env: REACT_APP_ENV || 'dev',
      mobile: process.env.MOCK_USER_MOBILE,
      password: process.env.MOCK_USER_PASSWORD,
      email: process.env.MOCK_USER_EMAIL
    },
    mis: false,
  });
}