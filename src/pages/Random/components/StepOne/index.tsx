import {
  Form,
  Space,
  Button,
  Input
} from 'antd-mobile';
import { useCallback } from 'react';
import { history } from 'umi';
import { getRandomMenu } from '@/services/base'
import styles from './index.less';

const INITIAL_MENU_COUNT: {
  [key: string]: number
} = {
  breakfast: 1,
  lunch: 2,
  dinner: 3,
  night_snack: 1
}

const StepOne = (props: {
  onFinish: (values: any) => void 
}) => {

  const { onFinish: propsOnFinish } = props 

  const [form] = Form.useForm();

  const onFinish = useCallback(() => {
    const values = form.getFieldsValue()
    return getRandomMenu(values)
    .then((value: any) => {
      propsOnFinish(value)
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
              name: 'lunch',
              label: '午餐菜单数量',
              placeholder: '请输入菜单数量'
            },
            {
              name: 'dinner',
              label: '晚餐菜单数量',
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
