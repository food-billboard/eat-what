import { DatePicker as AntDatePicker, Button } from 'antd-mobile';
import dayjs from 'dayjs'
import { useState } from 'react';
import { useControllableValue } from 'ahooks'

const DatePicker = (props: {
  value?: dayjs.Dayjs
  onChange?: (value: dayjs.Dayjs) => void 
}) => {

  const [value, setValue] = useControllableValue(props, {
    defaultValue: dayjs(),
  })

  const [visible, setVisible] = useState(false)

  return (
    <>
      <Button color='primary' fill="outline" onClick={() => setVisible(true)}>
        {value.format('YYYY-MM-DD')} 
      </Button>
      <AntDatePicker
        title='时间选择'
        visible={visible}
        onClose={() => {
          setVisible(false)
        }}
        onConfirm={val => {
          setValue(dayjs(val))
        }}
      />
    </>
  )

};

export default DatePicker;
