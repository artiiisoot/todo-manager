export function formatDate(dbDate) {
  // const date = dbDate.toDate(); // Firebase Timestamp 객체를 JavaScript Date 객체로 변환
  const year = dbDate.getFullYear(); // 연도 추출
  const month = String(dbDate.getMonth() + 1).padStart(2, "0"); // 월 추출 (0부터 시작하므로 1을 더하고, 2자리로 포맷)
  const day = String(dbDate.getDate()).padStart(2, "0"); // 일 추출 (2자리로 포맷)

  return `${year}-${month}-${day}`; // yyyy-mm-dd 형식으로 반환
}