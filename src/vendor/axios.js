import axios from 'axios'

/*
 * axiosに対してbaseURLおよびトークン無効時のリダイレクト処理を追加
 */
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_RAILWAY_TODO_API_URL,
})

// リクエストインターセプター：認証トークンをヘッダーに追加
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('railway-todo-app__token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  (response) => response,
  (err) => {
    // 401を返す場合はトークンを飛ばしてログイン画面に遷移
    if (err && err.response && err.response.status === 401) {
      localStorage.removeItem('railway-todo-app__token')

      // NOTE: React Router経由ではなく、直接遷移させている。
      if (location.pathname !== '/signin') {
        location.href = '/signin'
      }
    }

    return Promise.reject(err)
  }
)

/*
 * axiosからのexportではなく、こちらを使用する
 */
export default axiosInstance
