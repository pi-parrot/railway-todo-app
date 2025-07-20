import React, { useCallback, useState } from 'react'
import { Redirect, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useLogin } from '~/hooks/useLogin'
import { useId } from '~/hooks/useId'
import { Button } from '~/components/Button'
import { TextField } from '~/components/TextField'
import './index.css'

const SignIn = () => {
  const auth = useSelector((state) => state.auth.token !== null)
  const { login } = useLogin()

  const id = useId()
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmit = useCallback(
    (event) => {
      event.preventDefault()

      setIsSubmitting(true)

      login({ email, password })
        .catch((err) => {
          setErrorMessage(err.message)
        })
        .finally(() => {
          setIsSubmitting(false)
        })
    },
    [email, password]
  )

  if (auth) {
    return <Redirect to="/" />
  }

  return (
    <main className="signin">
      <h2 className="signin__title">Login</h2>
      <p className="signin__error">{errorMessage}</p>
      <form className="signin__form" onSubmit={onSubmit}>
        <TextField
          id={`${id}-email`}
          type="email"
          label="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <TextField
          id={`${id}-password`}
          type="password"
          label="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <div className="signin__form_actions">
          <Link className="app_button" data-variant="secondary" to="/signup">
            Register
          </Link>
          <div className="signin__form_actions_spacer"></div>
          <Button type="submit" disabled={isSubmitting}>
            Login
          </Button>
        </div>
      </form>
    </main>
  )
}

export default SignIn
