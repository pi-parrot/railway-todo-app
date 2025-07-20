import React from 'react'
import styles from './Button.module.scss'

export const Button = ({
  type = 'button',
  onClick,
  variant,
  children,
  disabled,
}) => {
  const className =
    variant === 'delete' ? `${styles.button} ${styles.delete}` : styles.button

  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
