import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import './Modal.css'

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium', // 'small', 'medium', 'large'
}) => {
  const modalRef = useRef(null)
  const previousActiveElement = useRef(null)
  // 背景要素のaria-hiddenを管理する関数
  const setBackgroundAriaHidden = (hidden) => {
    const appRoot = document.getElementById('root')
    if (appRoot) {
      const children = Array.from(appRoot.children)
      children.forEach((child) => {
        if (hidden) {
          child.setAttribute('aria-hidden', 'true')
        } else {
          child.removeAttribute('aria-hidden')
        }
      })
    }
  }

  // フォーカス可能な要素を取得する関数
  const getFocusableElements = (container) => {
    const focusableElementsString =
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    return container.querySelectorAll(focusableElementsString)
  }

  // フォーカストラップを設定するuseEffect
  useEffect(() => {
    if (!isOpen || !modalRef.current) return

    const modal = modalRef.current
    const focusableElements = getFocusableElements(modal)
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    // モーダルが開いたときに最初の要素にフォーカスを設定
    if (firstElement) {
      firstElement.focus()
    }

    // 現在のアクティブ要素を保存
    previousActiveElement.current = document.activeElement

    const handleTabKeyPress = (event) => {
      if (event.key !== 'Tab') return

      // Shift + Tab の場合
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement?.focus()
        }
      } else {
        // Tabのみの場合
        if (document.activeElement === lastElement) {
          event.preventDefault()
          firstElement?.focus()
        }
      }
    }

    modal.addEventListener('keydown', handleTabKeyPress)

    return () => {
      modal.removeEventListener('keydown', handleTabKeyPress)
      // モーダルが閉じたときに元の要素にフォーカスを戻す
      if (previousActiveElement.current) {
        previousActiveElement.current.focus()
      }
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      // モーダルが開いているときはボディのスクロールを無効にする
      document.body.style.overflow = 'hidden'
      // 背景要素をスクリーンリーダーから隠す
      setBackgroundAriaHidden(true)
    } else {
      document.body.style.overflow = 'unset'
      // 背景要素をスクリーンリーダーから戻す
      setBackgroundAriaHidden(false)
    }

    return () => {
      document.body.style.overflow = 'unset'
      setBackgroundAriaHidden(false)
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
        ref={modalRef}
        className={`modal_content modal_content--${size}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal_header">
          <h2 id="modal-title" className="modal_title">
            {title}
          </h2>
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
