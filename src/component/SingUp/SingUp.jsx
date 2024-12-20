import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { fetchUserAuth } from '../../store/userSlice'

import styles from './SingUp.module.scss'

function SingUp() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const token = useSelector((state) => state.auth.token)
  const error = useSelector((state) => state.auth.error)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    mode: 'all',
  })

  const onSubmit = (valuesFromForm) => {
    const formData = {
      user: {
        username: valuesFromForm.username,
        email: valuesFromForm.email,
        password: valuesFromForm.password,
      },
    }
    const userData = JSON.stringify(formData)

    dispatch(fetchUserAuth(userData))
  }

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token, navigate])

  const passwordValue = watch('password')

  return (
    <div className={styles.block}>
      <div className={styles.title}>Create new account</div>
      <div className={styles.form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formcontrol}>
            <label>Username</label>
            <input
              className={styles.input}
              type="text"
              placeholder="Username"
              {...register('username', { required: 'Username is required' })}
            />
            {errors.username && (
              <p className={styles.error}>{errors.username.message}</p>
            )}
            {error?.username && (
              <p className={styles.error}>Username: {error.username}</p>
            )}
          </div>
          <div className={styles.formcontrol}>
            <label>Email address</label>
            <input
              className={styles.input}
              type="email"
              placeholder="Email address"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
            />
            {errors.email && (
              <p className={styles.error}>{errors.email.message}</p>
            )}
            {error?.email && (
              <p className={styles.error}>Email: {error.email}</p>
            )}
          </div>
          <div className={styles.formcontrol}>
            <label>Password</label>
            <input
              className={styles.input}
              type="password"
              placeholder="Password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />
            {errors.password && (
              <p className={styles.error}>{errors.password.message}</p>
            )}
          </div>
          <div className={styles.formcontrol}>
            <label>Repeat Password</label>
            <input
              className={styles.input}
              type="password"
              placeholder="Password"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) =>
                  value === passwordValue || 'The passwords do not match',
              })}
            />
            {errors.confirmPassword && (
              <p className={styles.error}>{errors.confirmPassword.message}</p>
            )}
          </div>
          <div className={styles.line}>
            <input
              type="checkbox"
              id="subscribeNews"
              name="subscribe"
              value="newsletter"
              className={styles.checkbox}
              {...register('subscribe', {
                required:
                  'You must agree to the processing of personal information',
              })}
            />
            <label htmlFor="subscribeNews" className={styles.label}>
              I agree to the processing of my personal information
            </label>
            {errors.subscribe && (
              <p className={styles.error}>{errors.subscribe.message}</p>
            )}
          </div>
          <button type="submit" className={styles.but}>
            Create
          </button>
        </form>
      </div>

      <span className={styles.acc}>
        Already have an account?{' '}
        <Link to="/sign-in" className={styles.sing}>
          Sign In
        </Link>
      </span>
    </div>
  )
}

export default SingUp
