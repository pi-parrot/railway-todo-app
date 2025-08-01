import { useCallback, useEffect, useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import './TaskCreateForm.css'
import { CheckIcon } from '~/icons/CheckIcon'
import { createTask } from '~/store/task'
import { getRemainingTime, formatToISO } from '~/utils/getRemainingTime'

export const TaskCreateForm = () => {
  const dispatch = useDispatch()

  const refForm = useRef(null)
  const [elemTextarea, setElemTextarea] = useState(null)

  const [formState, setFormState] = useState('initial')

  const [title, setTitle] = useState('')
  const [detail, setDetail] = useState('')
  const [done, setDone] = useState(false)
  const [limit, setLimit] = useState('')

  const handleToggle = useCallback(() => {
    setDone((prev) => !prev)
  }, [])

  const handleFocus = useCallback(() => {
    setFormState('focused')
  }, [])

  const handleBlur = useCallback(() => {
    if (title || detail || limit) {
      return
    }

    setTimeout(() => {
      // フォーム内の要素がフォーカスされている場合は何もしない
      const formElement = refForm.current
      if (formElement && formElement.contains(document.activeElement)) {
        return
      }

      setFormState('initial')
      setDone(false)
    }, 100)
  }, [title, detail, limit])

  const handleDiscard = useCallback(() => {
    setTitle('')
    setDetail('')
    setLimit('')
    setFormState('initial')
    setDone(false)
  }, [])

  const onSubmit = useCallback(
    (event) => {
      event.preventDefault()

      setFormState('submitting')

      const formattedLimit = formatToISO(limit)

      void dispatch(createTask({ title, detail, done, limit: formattedLimit }))
        .unwrap()
        .then(() => {
          handleDiscard()
        })
        .catch((err) => {
          alert(err.message)
          setFormState('focused')
        })
    },
    [title, detail, done, limit]
  )

  useEffect(() => {
    if (!elemTextarea) {
      return
    }

    const recalcHeight = () => {
      elemTextarea.style.height = 'auto'
      elemTextarea.style.height = `${elemTextarea.scrollHeight}px`
    }

    elemTextarea.addEventListener('input', recalcHeight)
    recalcHeight()

    return () => {
      elemTextarea.removeEventListener('input', recalcHeight)
    }
  }, [elemTextarea])

  return (
    <form
      ref={refForm}
      className="task_create_form"
      onSubmit={onSubmit}
      data-state={formState}
    >
      <div className="task_create_form__title_container">
        <button
          type="button"
          onClick={handleToggle}
          className="task_create_form__mark_button"
          onFocus={handleFocus}
          onBlur={handleBlur}
        >
          {done ? (
            <div
              className="task_create_form__mark____complete"
              aria-label="Completed"
            >
              <CheckIcon className="task_create_form__mark____complete_check" />
            </div>
          ) : (
            <div
              className="task_create_form__mark____incomplete"
              aria-label="Incomplete"
            ></div>
          )}
        </button>
        <input
          type="text"
          className="task_create_form__title"
          placeholder="Add a new task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={formState === 'submitting'}
        />
      </div>
      {formState !== 'initial' && (
        <div>
          <textarea
            ref={setElemTextarea}
            rows={1}
            className="task_create_form__detail"
            placeholder="Add a description here..."
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            onBlur={handleBlur}
            disabled={formState === 'submitting'}
          />
          <input
            type="datetime-local"
            className="task_create_form__limit"
            placeholder="Set deadline..."
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            onBlur={handleBlur}
            disabled={formState === 'submitting'}
          />
          {limit && (
            <div className="task_create_form__remaining_time">
              残り時間: {getRemainingTime(limit)}
            </div>
          )}
          <div className="task_create_form__actions">
            <button
              type="button"
              className="app_button"
              data-variant="secondary"
              onBlur={handleBlur}
              onClick={handleDiscard}
              disabled={
                (!title && !detail && !limit) || formState === 'submitting'
              }
            >
              Discard
            </button>
            <div className="task_create_form__spacer"></div>
            <button
              type="submit"
              className="app_button"
              onBlur={handleBlur}
              disabled={!title || !detail || formState === 'submitting'}
            >
              Add
            </button>
          </div>
        </div>
      )}
    </form>
  )
}
