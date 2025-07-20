import styles from './TextField.module.scss'

export const TextField = ({
  type = 'text',
  value,
  onChange,
  placeholder = '',
  name,
  required = false,
  disabled = false,
  label,
  id,
}) => {
  const inputId = id || name || undefined
  return (
    <div className={styles.textFieldWrapper}>
      {label && (
        <label className={styles.label} htmlFor={inputId}>
          {label}
        </label>
      )}
      <input
        className={styles.input}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        name={name}
        required={required}
        disabled={disabled}
        id={inputId}
      />
    </div>
  )
}
