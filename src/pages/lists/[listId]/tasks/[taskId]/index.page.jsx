import { useCallback, useState, useEffect } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { BackButton } from '~/components/BackButton'
import { TextField } from '~/components/TextField'
import { Button } from '~/components/Button'
import {
  getRemainingTime,
  formatDateTimeLocal,
  formatToISO,
} from '~/utils/getRemainingTime'
import './index.css'
import { setCurrentList } from '~/store/list'
import { fetchTasks, updateTask, deleteTask } from '~/store/task'
import { useId } from '~/hooks/useId'

const EditTask = () => {
  const id = useId()

  const { listId, taskId } = useParams()
  const history = useHistory()
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

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDetail(task.detail)
      setDone(task.done)
      setLimit(formatDateTimeLocal(task.limit))
    }
  }, [task])

  useEffect(() => {
    void dispatch(setCurrentList(listId))
    void dispatch(fetchTasks())
  }, [listId])

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
          history.push(`/lists/${listId}`)
        })
        .catch((err) => {
          setErrorMessage(err.message)
        })
        .finally(() => {
          setIsSubmitting(false)
        })
    },
    [title, taskId, listId, detail, done, limit]
  )

  const handleDelete = useCallback(() => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return
    }

    setIsSubmitting(true)

    void dispatch(deleteTask({ id: taskId }))
      .unwrap()
      .then(() => {
        history.push(`/`)
      })
      .catch((err) => {
        setErrorMessage(err.message)
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }, [taskId])

  return (
    <main className="edit_task">
      <BackButton />
      <h2 className="edit_task__title">Edit Task</h2>
      <p className="edit_task__error">{errorMessage}</p>
      <form className="edit_task__form" onSubmit={onSubmit}>
        <TextField
          id={`${id}-title`}
          label="Title"
          placeholder="Buy some milk"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />
        <fieldset className="edit_task__form_field">
          <label htmlFor={`${id}-detail`} className="edit_task__form_label">
            Description
          </label>
          <textarea
            id={`${id}-detail`}
            className="app_input"
            placeholder="Blah blah blah"
            value={detail}
            onChange={(event) => setDetail(event.target.value)}
          />
        </fieldset>
        <fieldset className="edit_task__form_field">
          <label htmlFor={`${id}-limit`} className="edit_task__form_label">
            Deadline
          </label>
          <input
            id={`${id}-limit`}
            type="datetime-local"
            className="app_input"
            value={limit}
            onChange={(event) => setLimit(event.target.value)}
          />
          {limit && (
            <div className="edit_task__remaining_time">
              残り時間: {getRemainingTime(limit)}
            </div>
          )}
        </fieldset>
        <fieldset className="edit_task__form_field">
          <label htmlFor={`${id}-done`} className="edit_task__form_label">
            Is Done
          </label>
          <div>
            <input
              id={`${id}-done`}
              type="checkbox"
              checked={done}
              onChange={(event) => setDone(event.target.checked)}
            />
          </div>
        </fieldset>
        <div className="edit_task__form_actions">
          <Link to="/" data-variant="secondary" className="app_button">
            Cancel
          </Link>
          <div className="edit_list__form_actions_spacer"></div>
          <Button
            type="button"
            variant="delete"
            disabled={isSubmitting}
            onClick={handleDelete}
          >
            Delete
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            Update
          </Button>
        </div>
      </form>
    </main>
  )
}

export default EditTask
