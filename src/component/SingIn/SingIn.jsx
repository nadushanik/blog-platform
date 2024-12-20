import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { fetchUserLogin } from '../../store/userSlice'

import styles from './SingIn.module.scss'

function SingIn() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const token = useSelector((state) => state.auth.token)
  const error = useSelector((state) => state.auth.error)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'all' })

  const onSubmit = (data) => {
    const userData = {
      user: {
        email: data.email,
        password: data.password,
      },
    }
    const jsonString = JSON.stringify(userData)
    dispatch(fetchUserLogin(jsonString))
  }

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token, navigate])

  return (
    <div className={styles.block}>
      <div className={styles.title}>Sign In</div>
      <div className={styles.form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formcontrol}>
            <label>Email address</label>
            <input
              className={styles.input}
              type="text"
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
          {error && typeof error === 'string' && (
            <p className={styles.error}>{error}</p>
          )}
          <button type="submit" className={styles.but}>
            Login
          </button>
        </form>
      </div>
      <span className={styles.acc}>
        Don’t have an account?{' '}
        <Link to="/sign-up" className={styles.sing}>
          Sign Up
        </Link>
      </span>
    </div>
  )
}

export default SingIn
