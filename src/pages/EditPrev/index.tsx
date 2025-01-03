import { 
  Picker, 
  Form, 
  Input,
  TextArea,
  DatePicker,
  Button,
  Space,
  Toast,
  Modal
} from 'antd-mobile';
import { RefObject, useCallback, useEffect, useState } from 'react'
import { history } from 'umi'
import dayjs from 'dayjs'
import type { DatePickerRef } from 'antd-mobile/es/components/date-picker'
import Editor from '@/components/Editor'
import {  
  deleteCurrentMenu,
  putCurrentMenu,
  postCurrentMenu,
  getCurrentMenuDetail
} from '@/services/base'
import { getDefaultDate, getDefaultMenuType } from '../Home/utils'
import { MENU_MAP } from '../../pages/Home/constants'
import styles from './index.less';

const Edit = () => {

  const { value, type, menu_type, date } = (history.location.state || {}) as any

  const [ pageValue, setPageValue ] = useState(value || '')
  const [ pageType, setPageType ] = useState<'detail' | 'copy' | 'edit'>(type)
  const [ editable, setEditable ] = useState(type !== 'detail')

  const [form] = Form.useForm()

  const onFinish = useCallback(async () => {
    if(!editable) {
      setEditable(true)
    }else {
      await form.validateFields()
      .then((values) => {
        const { date, menu_type } = values 
        return (pageValue ? putCurrentMenu : postCurrentMenu)({
          ...values,
          date: dayjs(date).format('YYYY-MM-DD'),
          menu_type: menu_type?.[0] || 'BREAKFAST',
          _id: pageValue || ''
        })
      })
      .then(() => {
        Toast.show({
          afterClose: () => {
            history.go(-1)
          },
          content: '操作成功~'
        })
      })
      .catch(err => {})
      
    }
  }, [editable, pageValue])

  const handleDelete = useCallback(() => {
    Modal.confirm({
      title: '提示',
      content: '是否确认删除？',
      onConfirm() {
        deleteCurrentMenu({
          _id: pageValue
        })
        .then(() => {
          Toast.show({
            maskClickable: false,
            content: '删除成功',
            afterClose() {
              history.replace('/')
            },
          })
        })
      },
    })
  }, [pageValue])

  const handleCopy = useCallback(() => {
    setPageType('copy')
  }, [])

  useEffect(() => {
    function fetchData() {
      getCurrentMenuDetail({ 
        _id: pageValue
      })
      .then((data) => {
        form.setFieldsValue({
          ...data,
          date: getDefaultDate().toDate(),
          menu_type: [getDefaultMenuType()]
        })
        setPageValue(pageType === 'copy' ? '' : data._id)
      })
    }

    // 新增
    if(!pageValue) {
      form.setFieldsValue({
        menu_type: [menu_type || 'BREAKFAST'], 
        date: date ? dayjs(date).toDate() : dayjs().toDate()
      })
      return 
    } 
    fetchData()
    if(pageType !== 'detail') {
      setEditable(true)
    }
  }, [pageValue, pageType])

  return (
    <div className={styles['edit']}>
      <Form 
        form={form}
        onFinish={onFinish}
        footer={
          <Space block align='center' className={styles['edit-footer']}>
            {
              !!pageValue && (
                <Button block color='primary' fill='outline' onClick={handleCopy}>
                  复制
                </Button>
              )
            }
            <Button type="submit" block color='primary'>
              {editable ? '保存' : '编辑'}
            </Button>
            {
              !!pageValue && (
                <Button block color="danger" onClick={handleDelete}>
                  删除
                </Button>
              )
            }
          </Space>
        }
      >
        <Form.Item label="标题" name="title" rules={[{ required: true }]}>
          <Input readOnly={!editable} placeholder="请输入标题" clearable />
        </Form.Item>
        <Form.Item label="描述" name="description">
          <TextArea readOnly={!editable} placeholder="请输入描述" />
        </Form.Item>
        <Form.Item
          name='date'
          label='餐别时间'
          trigger='onConfirm'
          onClick={(e, datePickerRef: RefObject<DatePickerRef>) => {
            if(editable) datePickerRef.current?.open()
          }}
          rules={[{ required: true }]}
          initialValue={getDefaultDate().toDate()}
        >
          <DatePicker>
            {value =>
              value ? dayjs(value).format('YYYY-MM-DD') : '请选择餐别时间'
            }
          </DatePicker>
        </Form.Item>
        <Form.Item
          name='menu_type'
          label='餐别类型'
          trigger='onConfirm'
          onClick={(e, pickerRef: RefObject<DatePickerRef>) => {
            if(editable) pickerRef.current?.open()
          }}
          rules={[{ required: true }]}
          initialValue={[getDefaultMenuType()]}
        >
          <Picker columns={[MENU_MAP]}>
            {value => value?.[0]?.label}
          </Picker>
        </Form.Item>
        <Form.Item
          name='content'
          label='内容'
          initialValue={''}
        >
          <Editor 
            defaultConfig={{
              placeholder: '请输入内容'
            }}
            disabled={!editable}
          />
        </Form.Item>
      </Form>
    </div>
  );
};

export default Edit;
