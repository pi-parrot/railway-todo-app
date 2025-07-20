// 残り日時を計算して表示する関数
export function getRemainingTime(limit) {
  const now = new Date()
  const end = new Date(limit)
  const diff = end.getTime() - now.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  let result = ''
  if (!limit) return ''
  if (diff <= 0) return '期限切れ'
  if (days > 0) result += `${days}日`
  if (hours > 0) result += `${hours}時間`
  if (minutes > 0) result += `${minutes}分`
  if (!result) result = '1分未満'
  return result
}

// ISO文字列を datetime-local input用の形式に変換
export function formatDateTimeLocal(isoString) {
  if (!isoString) return ''
  const d = new Date(isoString)
  if (Number.isNaN(d.getTime())) return ''
  return d.toISOString().slice(0, 16)
}

// datetime-local input の値をISO文字列に変換
export function formatToISO(dateTimeLocal) {
  if (!dateTimeLocal) return null
  const date = new Date(dateTimeLocal)
  if (Number.isNaN(date.getTime())) return null
  return date.toISOString()
}
