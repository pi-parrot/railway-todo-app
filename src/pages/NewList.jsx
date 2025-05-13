import { useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { Header } from "../components/Header";
import { Button } from "../components/Button";
import { useHistory } from "react-router-dom";
import { url } from "../const";
import "./newList.scss";

export const NewList = () => {
  const [cookies] = useCookies();
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const handleTitleChange = (e) => setTitle(e.target.value);
  const onCreateList = () => {
    const data = {
      title: title,
    };

    axios
      .post(`${url}/lists`, data, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then(() => {
        history.push("/");
      })
      .catch((err) => {
        setErrorMessage(`リストの作成に失敗しました。${err}`);
      });
  };

  return (
    <div>
      <Header />
      <main className="new-list">
        <h2>リスト新規作成</h2>
        <p className="error-message">{errorMessage}</p>
        <form className="new-list-form">
          <label>
            タイトル
            <br />
            <input
              type="text"
              onChange={handleTitleChange}
              className="new-list-title"
            />
          </label>
          <br />
          <Button type="button" onClick={onCreateList}>
            作成
          </Button>
        </form>
      </main>
    </div>
  );
};
