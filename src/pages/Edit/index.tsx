import { Form, Button, Space, Toast, Modal } from 'antd-mobile';
import { useCallback, useEffect, useState } from 'react';
import { history } from 'umi';
import dayjs from 'dayjs';
import { useUpdate } from 'ahooks';
import {
  deleteCurrentMenu,
  putCurrentMenu,
  postCurrentMenu,
  getCurrentMenuDetail,
} from '@/services/base';
import BackButton from '@/components/BackButton'
import FormContent from './components/Form';
import { getDefaultDate } from '../Home/utils';
import styles from './index.less';

const Edit = () => {
  const { value, type, menu_type, date } = (history.location.state ||
    {}) as any;

  const update = useUpdate();

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
          const { date, menu_type } = values;
          return (pageValue ? putCurrentMenu : postCurrentMenu)({
            ...values,
            date: dayjs(date).format('YYYY-MM-DD'),
            _id: pageValue || '',
            menu_type: menu_type?.[0] || '',
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
          menu_type: [data.menu_type],
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
      <FormContent
        editable={editable}
        formProps={{
          onValuesChange: (changeValues) => {
            if (changeValues.menu_type) {
              form.setFieldsValue({
                classify: undefined,
              });
              update();
            }
          },
          onFinish,
          form,
          footer: (
            <Space block align="center" className={styles['edit-footer']}>
              <BackButton />
              {!!pageValue && (
                <Button
                  block
                  color="primary"
                  fill="outline"
                  onClick={handleCopy}
                >
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
          ),
        }}
      />
    </div>
  );
};

export default Edit;
