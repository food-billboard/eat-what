import dayjs from 'dayjs'

export function getDefaultDate() {
  // 如果是20点之后，显示的是第二天
  const now = dayjs();
  return now.hour() >= 19 ? now.add(1, 'day') : now;
}

export function getDefaultMenuType() {
  // 如果是8点之前，显示早饭
  // 如果是12点之前，显示中饭
  // 如果是18点之前，显示晚饭
  // 如果是20点之前，显示夜宵
  // 否则显示第二天的早饭
  const now = dayjs();
  const hour = now.hour();
  if (hour <= 7) {
    return 'BREAKFAST';
  }
  if (hour <= 11) {
    return 'LUNCH';
  }
  if (hour <= 17) {
    return 'DINNER';
  }
  if (hour <= 19) {
    return 'NIGHT_SNACK';
  }
  return 'BREAKFAST';
}