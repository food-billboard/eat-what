import {
  Picker,
  Form,
  TextArea,
  DatePicker,
  Button,
  Space,
  Toast,
  Modal,
} from 'antd-mobile';
import { RefObject, useCallback, useEffect, useState } from 'react';
import { history } from 'umi';
import dayjs from 'dayjs';
import { useUpdate } from 'ahooks'
import type { DatePickerRef } from 'antd-mobile/es/components/date-picker';
import {
  deleteCurrentMenu,
  putCurrentMenu,
  postCurrentMenu,
  getCurrentMenuDetail,
} from '@/services/base';
import ClassifyPicker from './components/ClassifyPicker';
import { getDefaultDate, getDefaultMenuType } from '../Home/utils';
import { MENU_MAP } from '../Home/constants'
import styles from './index.less';

const Edit = () => {
  const { value, type, menu_type, date } = (history.location.state ||
    {}) as any;

  const update = useUpdate()

  const [pageValue, setPageValue] = useState(value || '');
  const [pageType, setPageType] = useState<'detail' | 'copy' | 'edit'>(type);
  const [editable, setEditable] = useState(type !== 'detail');

  const [form] = Form.useForm();

  const onFinish = useCallback(async () => {
    if (!editable) {
      setEditable(true);
    } else {
      await form
        .validateFields()
        .then((values) => {
          const { date } = values;
          return (pageValue ? putCurrentMenu : postCurrentMenu)({
            ...values,
            date: dayjs(date).format('YYYY-MM-DD'),
            _id: pageValue || '',
            menu_type,
          });
        })
        .then(() => {
          Toast.show({
            afterClose: () => {
              history.go(-1);
            },
            content: '操作成功~',
          });
        })
        .catch((err) => {});
    }
  }, [editable, pageValue]);

  const handleDelete = useCallback(() => {
    Modal.confirm({
      title: '提示',
      content: '是否确认删除？',
      onConfirm() {
        deleteCurrentMenu({
          _id: pageValue,
        }).then(() => {
          Toast.show({
            maskClickable: false,
            content: '删除成功',
            afterClose() {
              history.replace('/');
            },
          });
        });
      },
    });
  }, [pageValue]);

  const handleCopy = useCallback(() => {
    setPageType('copy');
  }, []);

  useEffect(() => {
    function fetchData() {
      getCurrentMenuDetail({
        _id: pageValue,
      }).then((data) => {
        form.setFieldsValue({
          ...data,
          date: getDefaultDate().toDate(),
          menu_type: [data.menu_type]
        });
        setPageValue(pageType === 'copy' ? '' : data._id);
      });
    }

    // 新增
    if (!pageValue) {
      form.setFieldsValue({
        date: date ? dayjs(date).toDate() : dayjs().toDate(),
      });
      return;
    }
    fetchData();
    if (pageType !== 'detail') {
      setEditable(true);
    }
  }, [pageValue, pageType]);

  return (
    <div className={styles['edit']}>
      <Form
        form={form}
        onFinish={onFinish}
        onValuesChange={changeValues => {
          if(changeValues.menu_type) {
            form.setFieldsValue({
              classify: undefined
            })
            update()
          }
        }}
        footer={
          <Space block align="center" className={styles['edit-footer']}>
            {!!pageValue && (
              <Button block color="primary" fill="outline" onClick={handleCopy}>
                复制
              </Button>
            )}
            <Button type="submit" block color="primary">
              {editable ? '保存' : '编辑'}
            </Button>
            {!!pageValue && (
              <Button block color="danger" onClick={handleDelete}>
                删除
              </Button>
            )}
          </Space>
        }
      >
        <Form.Item
          name="menu_type"
          label="餐别类型"
          trigger="onConfirm"
          onClick={(e, pickerRef: RefObject<DatePickerRef>) => {
            if (editable) pickerRef.current?.open();
          }}
          rules={[{ required: true }]}
          initialValue={[getDefaultMenuType()]}
        >
          <Picker columns={[MENU_MAP]}>{(value) => value?.[0]?.label}</Picker>
        </Form.Item>
        <Form.Item label="描述" name="description">
          <TextArea readOnly={!editable} placeholder="请输入描述" />
        </Form.Item>
        <Form.Item
          name="date"
          label="餐别时间"
          trigger="onConfirm"
          onClick={(e, datePickerRef: RefObject<DatePickerRef>) => {
            if (editable) datePickerRef.current?.open();
          }}
          rules={[{ required: true }]}
          initialValue={getDefaultDate().toDate()}
        >
          <DatePicker>
            {(value) =>
              value ? dayjs(value).format('YYYY-MM-DD') : '请选择餐别时间'
            }
          </DatePicker>
        </Form.Item>
        <Form.Item
          name="classify"
          label="菜单"
          rules={[{ required: true }]}
        >
          <ClassifyPicker disabled={!editable} menu_type={form.getFieldValue('menu_type')} />
        </Form.Item>
      </Form>
    </div>
  );
};

export default Edit;
