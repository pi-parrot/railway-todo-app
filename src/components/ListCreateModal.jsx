import { useCallback, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Modal } from './Modal'
import { TextField } from './TextField'
import { Button } from './Button'
import { createList, setCurrentList } from '~/store/list/index'
import { useId } from '~/hooks/useId'
import './ListCreateModal.css'

export const ListCreateModal = ({ isOpen, onClose }) => {
  const id = useId()
  const history = useHistory()
  const dispatch = useDispatch()

  const [title, setTitle] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const resetForm = useCallback(() => {
    setTitle('')
    setErrorMessage('')
    setIsSubmitting(false)
  }, [])

  const handleClose = useCallback(() => {
    if (!isSubmitting) {
      resetForm()
      onClose()
    }
  }, [isSubmitting, resetForm, onClose])

  const onSubmit = useCallback(
    (event) => {
      event.preventDefault()

      setIsSubmitting(true)

      void dispatch(createList({ title }))
        .unwrap()
        .then((listId) => {
          dispatch(setCurrentList(listId))
          resetForm()
          onClose()
          history.push(`/`)
        })
        .catch((err) => {
          setErrorMessage(err.message)
        })
        .finally(() => {
          setIsSubmitting(false)
        })
    },
    [title, dispatch, resetForm, onClose, history]
  )

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="New List" size="small">
      <div className="list_create_modal">
        {errorMessage && (
          <p className="list_create_modal__error">{errorMessage}</p>
        )}
        <form className="list_create_modal__form" onSubmit={onSubmit}>
          <TextField
            id={`${id}-title`}
            label="Name"
            placeholder="Family"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            disabled={isSubmitting}
          />
          <div className="list_create_modal__form_actions">
            <button
              type="button"
              data-variant="secondary"
              className="app_button"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <Button type="submit" disabled={isSubmitting || !title.trim()}>
              {isSubmitting ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
