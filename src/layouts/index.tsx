import { Outlet } from 'umi';
import { Toast } from 'antd-mobile'
import { useEffect } from 'react';
import mockLogin from '../utils/mockLogin'
import styles from './index.less';

export default function Layout() {

  useEffect(() => {
    // 上传需要登录，这里用一个默认账号来登录
    mockLogin()
  }, [])

  useEffect(() => {
    Toast.config({ duration: 500 })
  }, [])

  return (
    <div>
      <Outlet />
    </div>
  );
}
