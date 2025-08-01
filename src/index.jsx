import { createRoot } from 'react-dom/client'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/700.css'
import './index.scss'
import App from './App.jsx'
import reportWebVitals from './reportWebVitals.js'
import { CookiesProvider } from 'react-cookie'
import { Provider } from 'react-redux'
import { store } from './store/index.js'

// React 18 以降では ReactDOM.render は非推奨のため
// createRoot に置換
const container = document.getElementById('root')
const root = createRoot(container)
root.render(
  <Provider store={store}>
    <CookiesProvider>
      <App />
    </CookiesProvider>
  </Provider>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
