import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { TaskItem } from '~/components/TaskItem'
import { TaskCreateForm } from '~/components/TaskCreateForm'
import { ListEditModal } from '~/components/ListEditModal'
import { setCurrentList } from '~/store/list'
import { fetchTasks } from '~/store/task'
import './index.css'

const ListIndex = () => {
  const dispatch = useDispatch()
  const { listId } = useParams()

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const isLoading = useSelector(
    (state) => state.task.isLoading || state.list.isLoading
  )

  const tasks = useSelector((state) => state.task.tasks)
  const listName = useSelector((state) => {
    const currentId = state.list.current
    const list = state.list.lists?.find((list) => list.id === currentId)
    return list?.title
  })
  const incompleteTasksCount = useSelector((state) => {
    return state.task.tasks?.filter((task) => !task.done).length
  })

  useEffect(() => {
    dispatch(setCurrentList(listId))
    dispatch(fetchTasks()).unwrap()
  }, [listId])

  if (isLoading) {
    return <div></div>
  }

  return (
    <div className="tasks_list">
      <div className="tasks_list__title">
        {listName}
        {incompleteTasksCount > 0 && (
          <span className="tasks_list__title__count">
            {incompleteTasksCount}
          </span>
        )}
        <div className="tasks_list__title_spacer"></div>
        <button onClick={() => setIsEditModalOpen(true)} className="app_button">
          Edit...
        </button>
      </div>
      <div className="tasks_list__items">
        <TaskCreateForm />
        {tasks?.map((task) => {
          return <TaskItem key={task.id} task={task} />
        })}
        {tasks?.length === 0 && (
          <div className="tasks_list__items__empty">No tasks yet!</div>
        )}
      </div>
      <ListEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        listId={listId}
      />
    </div>
  )
}

export default ListIndex
