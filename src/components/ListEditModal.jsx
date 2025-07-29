import { useCallback, useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Modal } from './Modal'
import { TextField } from './TextField'
import { Button } from './Button'
import { fetchLists, updateList, deleteList } from '~/store/list'
import { useId } from '~/hooks/useId'
import './ListEditModal.css'

export const ListEditModal = ({ isOpen, onClose, listId }) => {
  const id = useId()
  const history = useHistory()
  const dispatch = useDispatch()

  const [title, setTitle] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const list = useSelector((state) =>
    state.list.lists?.find((list) => list.id === listId)
  )

  const resetForm = useCallback(() => {
    setTitle('')
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
      void dispatch(fetchLists())
    }
  }, [isOpen, listId, dispatch])

  useEffect(() => {
    // モーダルが開いたときにリストデータをフォームにセット
    if (isOpen && list && listId === list.id) {
      setTitle(list.title || '')
      setErrorMessage('') // エラーメッセージもクリア
    }
  }, [isOpen, list, listId])

  const onSubmit = useCallback(
    (event) => {
      event.preventDefault()

      setIsSubmitting(true)

      void dispatch(updateList({ id: listId, title }))
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
    [title, listId, dispatch, resetForm, onClose]
  )

  const handleDelete = useCallback(() => {
    if (!window.confirm('Are you sure you want to delete this list?')) {
      return
    }

    setIsSubmitting(true)

    void dispatch(deleteList({ id: listId }))
      .unwrap()
      .then(() => {
        // 削除成功時はモーダルを閉じてホームに遷移
        setErrorMessage('')
        onClose()
        history.push(`/`)
      })
      .catch((err) => {
        setErrorMessage(err.message)
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }, [listId, dispatch, onClose, history])

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit List" size="small">
      <div className="list_edit_modal">
        {errorMessage && (
          <p className="list_edit_modal__error">{errorMessage}</p>
        )}
        <form className="list_edit_modal__form" onSubmit={onSubmit}>
          <TextField
            id={`${id}-title`}
            label="Name"
            placeholder="Family"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            disabled={isSubmitting}
          />
          <div className="list_edit_modal__form_actions">
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
