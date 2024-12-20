import React from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'

import { fetchUserUpdate } from '../../store/userSlice'

import styles from './EditProfil.module.scss'

function EditProfil() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'all',
    defaultValues: {
      username: user?.username || '',
      email: user?.email || '',
      password: '',
      image: user?.image || '',
    },
  })

  const onSubmit = (data) => {
    const userData = {
      user: {
        username: data.username,
        email: data.email,
        password: data.password,
        image: data.image,
      },
    }
    const jsonString = JSON.stringify(userData)
    dispatch(fetchUserUpdate(jsonString))
  }

  return (
    <div className={styles.block}>
      <div className={styles.title}>Edit Profile</div>
      <div className={styles.form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formcontrol}>
            <label>Username</label>
            <input
              className={styles.input}
              type="text"
              placeholder="Username"
              {...register('username', { required: 'Username is required' })}
              autoComplete="off"
            />
            {errors.username && (
              <p className={styles.error}>{errors.username.message}</p>
            )}
          </div>
          <div className={styles.formcontrol}>
            <label>Email address</label>
            <input
              className={styles.input}
              type="text"
              placeholder="Email address"
              autoComplete="off"
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
            <label>New password</label>
            <input
              className={styles.input}
              type="password"
              placeholder="Password"
              autoComplete="off"
              {...register('password', {
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
                maxLength: {
                  value: 40,
                  message: 'Password must be at most 40 characters',
                },
              })}
            />
            {errors.password && (
              <p className={styles.error}>{errors.password.message}</p>
            )}
          </div>
          <div className={styles.formcontrol}>
            <label>Avatar image (url)</label>
            <input
              className={styles.input}
              type="text"
              placeholder="Avatar image"
              autoComplete="off"
              {...register('image', {
                pattern: {
                  value: /^(ftp|http|https):\/\/[^ "]+$/,
                  message: 'Invalid URL',
                },
              })}
            />
            {errors.image && (
              <p className={styles.error}>{errors.image.message}</p>
            )}
          </div>
          <button type="submit" className={styles.but}>
            Save
          </button>
        </form>
      </div>
    </div>
  )
}

export default EditProfil
