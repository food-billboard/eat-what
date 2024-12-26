import { Button, Form, TextArea } from 'antd-mobile';
import { useEffect } from 'react';
import RichEditor from '@/components/Editor';

const FormItem = (props: {
  value?: API_BASE.GetEatMenuClassifyListData;
  onChange?: (
    changeValues: any,
    value: API_BASE.GetEatMenuClassifyListData,
  ) => void;
}) => {
  const { value, onChange } = props;

  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      ...value,
      menu_type: Array.isArray(value?.menu_type)
        ? value?.menu_type
        : value?.menu_type
        ? [value?.menu_type]
        : [],
    });
  }, []);

  return (
    <Form
      form={form}
      onValuesChange={onChange}
    >
      <Form.Item label="描述" name="description">
        <TextArea placeholder="请输入描述" />
      </Form.Item>
      <Form.Item name="content" label="菜单内容" initialValue={''}>
        <RichEditor toolbarVisible={false} disabled />
      </Form.Item>
    </Form>
  );
};

export default FormItem;
