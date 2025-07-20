import { useState, useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { PencilIcon } from '~/icons/PencilIcon'
import { CheckIcon } from '~/icons/CheckIcon'
import { TaskEditModal } from './TaskEditModal'
import { updateTask } from '~/store/task'
import { getRemainingTime } from '~/utils/getRemainingTime'
import './TaskItem.css'

export const TaskItem = ({ task }) => {
  const dispatch = useDispatch()

  const { listId } = useParams()
  const { id, title, detail, done, limit } = task

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const handleToggle = useCallback(() => {
    setIsSubmitting(true)
    void dispatch(updateTask({ id, done: !done })).finally(() => {
      setIsSubmitting(false)
    })
  }, [id, done])

  return (
    <div className="task_item">
      <div className="task_item__title_container">
        <button
          type="button"
          onClick={handleToggle}
          disabled={isSubmitting}
          className="task__item__mark_button"
        >
          {done ? (
            <div className="task_item__mark____complete" aria-label="Completed">
              <CheckIcon className="task_item__mark____complete_check" />
            </div>
          ) : (
            <div
              className="task_item__mark____incomplete"
              aria-label="Incomplete"
            ></div>
          )}
        </button>
        <div className="task_item__title" data-done={done}>
          {title}
        </div>
        <div aria-hidden className="task_item__title_spacer"></div>
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="task_item__title_action"
          aria-label="Edit"
        >
          <PencilIcon />
        </button>
      </div>
      <div className="task_item__detail">{detail}</div>
      {limit && (
        <div className="task_item__limit">期限: {getRemainingTime(limit)}</div>
      )}
      <TaskEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        taskId={id}
        listId={listId}
      />
    </div>
  )
}
