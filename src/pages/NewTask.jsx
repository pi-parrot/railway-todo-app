import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { url } from "../const";
import { Header } from "../components/Header";
import "./newTask.scss"
import { useHistory } from "react-router-dom";

// 残り日時を計算して表示する関数
function getRemainingTime(limit) {
  const now = new Date();
  const end = new Date(limit);
  const diff = end.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  let result = "";
  if (!limit) return "";
  if (diff <= 0) return "期限切れ";
  if (days > 0) result += `${days}日`;
  if (hours > 0) result += `${hours}時間`;
  if (minutes > 0) result += `${minutes}分`;
  if (!result) result = "1分未満";
  return result;
}

export const NewTask = () => {
  const [selectListId, setSelectListId] = useState();
  const [lists, setLists] = useState([]);
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [limit, setLimit] = useState("");
  const [cookies] = useCookies();
  const history = useHistory();
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleDetailChange = (e) => setDetail(e.target.value);
  const handleLimitChange = (e) => setLimit(e.target.value);
  const handleSelectList = (id) => setSelectListId(id);
  const onCreateTask = () => {
    let formattedLimit = null;
    if (limit) {
      // 入力欄はタイムゾーンを考慮しないため、
      // 送信前にAPIが受け付けるZ付きの形式(ISO 8601)に変換する
      const date = new Date(limit);
      if (!Number.isNaN(date.getTime())) {
        formattedLimit = date.toISOString();
      }
    }
    const data = {
      title: title,
      detail: detail,
      done: false,
      limit: formattedLimit,
    };

    axios.post(`${url}/lists/${selectListId}/tasks`, data, {
        headers: {
          authorization: `Bearer ${cookies.token}`
        }
    })
    .then(() => {
      history.push("/");
    })
    .catch((err) => {
      setErrorMessage(`タスクの作成に失敗しました。${err}`);
    })
  }

  useEffect(() => {
    axios.get(`${url}/lists`, {
      headers: {
        authorization: `Bearer ${cookies.token}`
      }
    })
    .then((res) => {
      setLists(res.data)
      setSelectListId(res.data[0]?.id)
    })
    .catch((err) => {
      setErrorMessage(`リストの取得に失敗しました。${err}`);
    })
  }, [cookies.token])

  return (
    <div>
      <Header />
      <main className="new-task">
        <h2>タスク新規作成</h2>
        <p className="error-message">{errorMessage}</p>
        <form className="new-task-form">
          <label>
            リスト<br />
            <select onChange={(e) => handleSelectList(e.target.value)} className="new-task-select-list">
              {lists.map((list) => (
                <option key={list.id} className="list-item" value={list.id}>
                  {list.title}
                </option>
              ))}
            </select><br />
          </label>
          <label>
            タイトル<br />
            <input type="text" onChange={handleTitleChange} className="new-task-title" /><br />
          </label>
          <label>
            詳細<br />
            <textarea type="text" onChange={handleDetailChange} className="new-task-detail" /><br />
          </label>
          <label>
            期限<br />
            <input type="datetime-local" className="new-task-limit" value={limit} onChange={handleLimitChange} />
          </label>
          {limit ? `残り日時：${getRemainingTime(limit)}` : ""}<br />
          <button type="button" className="new-task-button" onClick={onCreateTask}>作成</button>
        </form>
      </main>
    </div>
  )
}
