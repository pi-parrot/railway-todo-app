import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import './Modal.css'

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium', // 'small', 'medium', 'large'
}) => {
  useEffect(() => {
    if (isOpen) {
      // モーダルが開いているときはボディのスクロールを無効にする
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const modalContent = (
    <div className="modal_overlay" onClick={onClose}>
      <div
        className={`modal_content modal_content--${size}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal_header">
          <h2 className="modal_title">{title}</h2>
          <button
            className="modal_close_button"
            onClick={onClose}
            aria-label="閉じる"
          >
            ×
          </button>
        </div>
        <div className="modal_body">{children}</div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
