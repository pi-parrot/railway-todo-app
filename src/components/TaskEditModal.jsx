import { useCallback, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Modal } from './Modal'
import { TextField } from './TextField'
import { Button } from './Button'
import {
  getRemainingTime,
  formatDateTimeLocal,
  formatToISO,
} from '~/utils/getRemainingTime'
import { fetchTasks, updateTask, deleteTask } from '~/store/task'
import { useId } from '~/hooks/useId'
import './TaskEditModal.css'

export const TaskEditModal = ({ isOpen, onClose, taskId, listId }) => {
  const id = useId()
  const dispatch = useDispatch()

  const [title, setTitle] = useState('')
  const [detail, setDetail] = useState('')
  const [done, setDone] = useState(false)
  const [limit, setLimit] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const task = useSelector((state) =>
    state.task.tasks?.find((task) => task.id === taskId)
  )

  const resetForm = useCallback(() => {
    setTitle('')
    setDetail('')
    setDone(false)
    setLimit('')
    setErrorMessage('')
    setIsSubmitting(false)
  }, [])

  const handleClose = useCallback(() => {
    if (!isSubmitting) {
      // フォームのリセットは行わず、エラーメッセージのみクリア
      setErrorMessage('')
      setIsSubmitting(false)
      onClose()
    }
  }, [isSubmitting, onClose])

  useEffect(() => {
    if (isOpen && listId) {
      void dispatch(fetchTasks())
    }
  }, [isOpen, listId, dispatch])

  useEffect(() => {
    // モーダルが開いたときにタスクデータをフォームにセット
    if (isOpen && task && taskId === task.id) {
      setTitle(task.title || '')
      setDetail(task.detail || '')
      setDone(task.done || false)
      setLimit(formatDateTimeLocal(task.limit) || '')
      setErrorMessage('') // エラーメッセージもクリア
    }
  }, [isOpen, task, taskId])

  const onSubmit = useCallback(
    (event) => {
      event.preventDefault()

      setIsSubmitting(true)

      const formattedLimit = formatToISO(limit)

      void dispatch(
        updateTask({ id: taskId, title, detail, done, limit: formattedLimit })
      )
        .unwrap()
        .then(() => {
          // 成功時はフォームをリセットせず、モーダルを閉じるだけ
          setErrorMessage('')
          onClose()
        })
        .catch((err) => {
          setErrorMessage(err.message)
        })
        .finally(() => {
          setIsSubmitting(false)
        })
    },
    [title, taskId, detail, done, limit, dispatch, resetForm, onClose]
  )

  const handleDelete = useCallback(() => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return
    }

    setIsSubmitting(true)

    void dispatch(deleteTask({ id: taskId }))
      .unwrap()
      .then(() => {
        // 削除成功時はモーダルを閉じるだけ
        setErrorMessage('')
        onClose()
      })
      .catch((err) => {
        setErrorMessage(err.message)
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }, [taskId, dispatch, resetForm, onClose])

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Task"
      size="medium"
    >
      <div className="task_edit_modal">
        {errorMessage && (
          <p className="task_edit_modal__error">{errorMessage}</p>
        )}
        <form className="task_edit_modal__form" onSubmit={onSubmit}>
          <TextField
            id={`${id}-title`}
            label="Title"
            placeholder="Buy some milk"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            disabled={isSubmitting}
          />

          <div className="task_edit_modal__form_field">
            <label
              htmlFor={`${id}-detail`}
              className="task_edit_modal__form_label"
            >
              Description
            </label>
            <textarea
              id={`${id}-detail`}
              className="app_input task_edit_modal__textarea"
              placeholder="Blah blah blah"
              value={detail}
              onChange={(event) => setDetail(event.target.value)}
              disabled={isSubmitting}
              rows={3}
            />
          </div>

          <div className="task_edit_modal__form_field">
            <label
              htmlFor={`${id}-limit`}
              className="task_edit_modal__form_label"
            >
              Deadline
            </label>
            <input
              id={`${id}-limit`}
              type="datetime-local"
              className="app_input"
              value={limit}
              onChange={(event) => setLimit(event.target.value)}
              disabled={isSubmitting}
            />
            {limit && (
              <div className="task_edit_modal__remaining_time">
                残り時間: {getRemainingTime(limit)}
              </div>
            )}
          </div>

          <div className="task_edit_modal__form_field">
            <label className="task_edit_modal__checkbox_label">
              <input
                id={`${id}-done`}
                type="checkbox"
                checked={done}
                onChange={(event) => setDone(event.target.checked)}
                disabled={isSubmitting}
                className="task_edit_modal__checkbox"
              />
              <span className="task_edit_modal__checkbox_text">
                Mark as completed
              </span>
            </label>
          </div>

          <div className="task_edit_modal__form_actions">
            <button
              type="button"
              data-variant="secondary"
              className="app_button"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <Button
              type="button"
              variant="delete"
              disabled={isSubmitting}
              onClick={handleDelete}
            >
              {isSubmitting ? 'Deleting...' : 'Delete'}
            </Button>
            <Button type="submit" disabled={isSubmitting || !title.trim()}>
              {isSubmitting ? 'Updating...' : 'Update'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
