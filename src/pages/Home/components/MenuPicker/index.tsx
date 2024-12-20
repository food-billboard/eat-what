import { Picker, Button } from 'antd-mobile';
import { useMemo, useState } from 'react';
import { useControllableValue } from 'ahooks'
import { MENU_MAP } from '../../constants'

const MenuPicker = (props: {
  value?: API_BASE.MenuType 
  onChange?: (value: API_BASE.MenuType ) => void 
}) => {

  const [value, setValue] = useControllableValue<API_BASE.MenuType>(props, {
    defaultValue: 'BREAKFAST',
  })

  const [visible, setVisible] = useState(false)

  const showLabel = useMemo(() => {
    return MENU_MAP.find(item => item.value === value)?.label || '全部'
  }, [value])

  return (
    <>
      <Button color='primary' fill='outline' onClick={() => setVisible(true)}>
        {showLabel} 
      </Button>
      <Picker
        value={value ? [value] : []}
        title='餐别选择'
        visible={visible}
        onClose={() => {
          setVisible(false)
        }}
        columns={[
          [
            {
              label: '全部',
              value: '',
            },
            ...MENU_MAP
          ]
        ]}
        onConfirm={val => {
          const [pickerValue] = val
          setValue(pickerValue as API_BASE.MenuType) 
        }}
      />
    </>
  )

};

export default MenuPicker;
