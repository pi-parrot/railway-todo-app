import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { Button } from "../components/Button";
import axios from "axios";
import { useCookies } from "react-cookie";
import { url } from "../const";
import { useHistory, useParams } from "react-router-dom";
import "./editTask.scss";

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

export const EditTask = () => {
  const history = useHistory();
  const { listId, taskId } = useParams();
  const [cookies] = useCookies();
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [limit, setLimit] = useState("");
  const [isDone, setIsDone] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleDetailChange = (e) => setDetail(e.target.value);
  const handleLimitChange = (e) => setLimit(e.target.value);
  const handleIsDoneChange = (e) => setIsDone(e.target.value === "done");
  const onUpdateTask = () => {
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
      done: isDone,
      limit: formattedLimit,
    };

    axios
      .put(`${url}/lists/${listId}/tasks/${taskId}`, data, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        history.push("/");
      })
      .catch((err) => {
        setErrorMessage(`更新に失敗しました。${err}`);
      });
  };

  const onDeleteTask = () => {
    axios
      .delete(`${url}/lists/${listId}/tasks/${taskId}`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then(() => {
        history.push("/");
      })
      .catch((err) => {
        setErrorMessage(`削除に失敗しました。${err}`);
      });
  };

  useEffect(() => {
    axios
      .get(`${url}/lists/${listId}/tasks/${taskId}`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        const task = res.data;
        let inputLimit = "";
        setTitle(task.title);
        setDetail(task.detail);
        // 期限が設定されている場合は入力欄で扱える形式に変換する
        if (task.limit) {
          const d = new Date(task.limit);
          if (!Number.isNaN(d.getTime())) {
            inputLimit = d.toISOString().slice(0, 16);
          }
        }
        setLimit(inputLimit);
        setIsDone(task.done);
      })
      .catch((err) => {
        setErrorMessage(`タスク情報の取得に失敗しました。${err}`);
      });
  }, [listId, taskId, cookies.token]);

  return (
    <div>
      <Header />
      <main className="edit-task">
        <h2>タスク編集</h2>
        <p className="error-message">{errorMessage}</p>
        <form className="edit-task-form">
          <label>
            タイトル
            <br />
            <input
              type="text"
              onChange={handleTitleChange}
              className="edit-task-title"
              value={title}
            />
            <br />
          </label>
          <label>
            詳細
            <br />
            <textarea
              type="text"
              onChange={handleDetailChange}
              className="edit-task-detail"
              value={detail}
            />
            <br />
          </label>
          <label>
            期限
            <br />
            <input
              type="datetime-local"
              className="edit-task-limit"
              value={limit}
              onChange={handleLimitChange}
            />
          </label>
          {limit ? `残り日時：${getRemainingTime(limit)}` : ""}
          <br />
          <div>
            <input
              type="radio"
              id="todo"
              name="status"
              value="todo"
              onChange={handleIsDoneChange}
              checked={isDone === false ? "checked" : ""}
            />
            未完了
            <input
              type="radio"
              id="done"
              name="status"
              value="done"
              onChange={handleIsDoneChange}
              checked={isDone === true ? "checked" : ""}
            />
            完了
          </div>
          <Button type="button" onClick={onDeleteTask} variant="delete">
            削除
          </Button>
          <Button type="button" onClick={onUpdateTask}>
            更新
          </Button>
        </form>
      </main>
    </div>
  );
};
