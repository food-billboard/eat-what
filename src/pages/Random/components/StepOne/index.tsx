import {
  Form,
  Space,
  Button,
  Input,
  Toast
} from 'antd-mobile';
import type { ToastHandler } from 'antd-mobile/es/components/toast'
import { useCallback, useRef } from 'react';
import { history } from 'umi';
import { getRandomMenu } from '@/services/base'
import styles from './index.less';

const INITIAL_MENU_COUNT: {
  [key: string]: number
} = {
  breakfast: 1,
  lunch_meat: 1,
  lunch_vegetable: 1,
  dinner_meat: 1,
  dinner_vegetable: 2,
  night_snack: 1
}

const StepOne = (props: {
  onFinish: (values: any) => void 
}) => {

  const { onFinish: propsOnFinish } = props 

  const [form] = Form.useForm();

  const loading = useRef(false)
  const handler = useRef<ToastHandler>()

  const onFinish = useCallback(async () => {
    if(loading.current) return 
    loading.current = true 
    handler.current = Toast.show({
      icon: 'loading',
      content: '菜单生成中',
      duration: 0
    })
    const { lunch_meat, lunch_vegetable, dinner_meat, dinner_vegetable, ...nextValues } = form.getFieldsValue()
    return getRandomMenu({
      ...nextValues,
      lunch: `${lunch_meat},${lunch_vegetable}`,
      dinner: `${dinner_meat},${dinner_vegetable}`
    })
    .then((value: any) => {
      propsOnFinish(value)
      handler.current?.close()
    })
    .catch(() => {
      handler.current?.close()
      Toast.show({
        icon: 'fail',
        content: '生成失败，请重试~',
      })
    })
    .then(() => {
      loading.current = true 
    })
  }, [form, propsOnFinish])

  return (
    <div className={styles['edit']}>
      <Form
        form={form}
        onFinish={onFinish}
        footer={
          <Space block align="center" className={styles['edit-footer']}>
            <Button
              onClick={() => history.go(-1)}
              block
              color="primary"
              fill="outline"
            >
              取消
            </Button>
            <Button type="submit" block color="primary">
              确认
            </Button>
          </Space>
        }
      >
        {
          [
            {
              name: 'breakfast',
              label: '早餐菜单数量',
              placeholder: '请输入菜单数量'
            },
            {
              name: 'lunch_meat',
              label: '午餐荤菜数量',
              placeholder: '请输入菜单数量'
            },
            {
              name: 'lunch_vegetable',
              label: '午餐素菜数量',
              placeholder: '请输入菜单数量'
            },
            {
              name: 'dinner_meat',
              label: '晚餐荤菜数量',
              placeholder: '请输入菜单数量'
            },
            {
              name: 'dinner_vegetable',
              label: '晚餐素菜数量',
              placeholder: '请输入菜单数量'
            },
            {
              name: 'night_snack',
              label: '夜宵菜单数量',
              placeholder: '请输入菜单数量'
            },
          ].map(item => {
            const { name, label, placeholder,  } = item 
            return (
              <Form.Item key={name} label={label} name={name} initialValue={INITIAL_MENU_COUNT[name]}>
                <Input type="number" placeholder={placeholder} />
              </Form.Item>
            )
          })
        }
      </Form>
    </div>
  );
};

export default StepOne;
