
export const MENU_MAP = [
  { 
    label: '早餐', 
    value: 'BREAKFAST',
    status: 'primary',
    color: '#00d86a',
  },
  { 
    label: '午餐', 
    value: 'LUNCH',
    status: 'success',
    color: '#00b578',
  },
  { 
    label: '晚餐', 
    value: 'DINNER',
    status: 'warning',
    color: '#ff8f1f', 
  },
  { 
    label: '夜宵', 
    value: 'NIGHT_SNACK',
    status: 'danger',
    color: '#ff3141',
  },
]

export const MENU_LABEL_MAP = MENU_MAP.reduce<{
  [value: string]: string
}>((acc, cur) => {
  const { label, value } = cur 
  acc[value] = label 
  return acc 
}, {})