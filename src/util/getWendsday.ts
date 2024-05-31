function previousWednesday(currentDate: Date) {
  const dayOfWeek = currentDate.getDay(); // 현재 요일 (0: 일요일, 1: 월요일, ..., 6: 토요일)
  const diff = (dayOfWeek + 7 - 3) % 7; // 현재 요일로부터 수요일까지의 날짜 차이 (3: 수요일)
  
  const previousWednesday = new Date(currentDate);
  previousWednesday.setDate(currentDate.getDate() - diff);
  
  return `${previousWednesday.getFullYear()}-${previousWednesday.getMonth()+1}-${previousWednesday.getDate()}`;
}

function nextWednesday(currentDate: Date) {
  const dayOfWeek = currentDate.getDay(); // 현재 요일 (0: 일요일, 1: 월요일, ..., 6: 토요일)
  let diff;
  if (dayOfWeek === 3) { // 현재 요일이 수요일인 경우 다음 수요일을 구하기 위해 7일을 더합니다.
    diff = 7;
  } else {
    diff = (3 - dayOfWeek + 7) % 7; // 현재 요일로부터 다음 수요일까지의 날짜 차이 (3: 수요일)
  }
  
  const nextWednesday = new Date(currentDate);
  nextWednesday.setDate(currentDate.getDate() + diff);
  
  return `${nextWednesday.getFullYear()}-${nextWednesday.getMonth()+1}-${nextWednesday.getDate()}`;
}

const getWednesday = {nextWednesday,previousWednesday}

export default getWednesday;