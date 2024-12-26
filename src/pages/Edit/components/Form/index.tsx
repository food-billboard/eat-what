
import {
  Picker,
  Form,
  TextArea,
  DatePicker,
  FormProps
} from 'antd-mobile';
import { RefObject, useCallback } from 'react';
import dayjs from 'dayjs';
import type { DatePickerRef } from 'antd-mobile/es/components/date-picker';
import ClassifyPicker from '../ClassifyPicker';
import { getDefaultDate, getDefaultMenuType } from '../../../Home/utils';
import { MENU_MAP } from '../../../Home/constants'

const Edit = (props: {
  formProps?: Partial<FormProps>
  editable?: boolean | string[]
}) => {
  const { formProps, editable=true } = props

  const { form } = formProps || {}

  const isEditable = useCallback((name: string) => {
    return typeof editable === 'boolean' ? editable : editable.includes(name)
  }, [editable])

  return (
    <div>
      <Form
        {...formProps}
      >
        <Form.Item
          name="menu_type"
          label="餐别类型"
          trigger="onConfirm"
          onClick={(e, pickerRef: RefObject<DatePickerRef>) => {
            if (isEditable('menu_type')) pickerRef.current?.open();
          }}
          rules={[{ required: true }]}
          initialValue={[getDefaultMenuType()]}
        >
          <Picker columns={[MENU_MAP]}>{(value) => value?.[0]?.label}</Picker>
        </Form.Item>
        <Form.Item label="描述" name="description">
          <TextArea readOnly={!isEditable('description')} placeholder="请输入描述" />
        </Form.Item>
        <Form.Item
          name="date"
          label="餐别时间"
          trigger="onConfirm"
          onClick={(e, datePickerRef: RefObject<DatePickerRef>) => {
            if (isEditable('date')) datePickerRef.current?.open();
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
          <ClassifyPicker disabled={!isEditable('classify')} menu_type={form?.getFieldValue('menu_type') || [getDefaultMenuType()]} />
        </Form.Item>
      </Form>
    </div>
  );
};

export default Edit;
