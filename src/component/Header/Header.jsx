import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { logout } from '../../store/userSlice'
import { getImageUrl } from '../../utilit/util'

import styles from './Header.module.scss'

function Header() {
  const dispatch = useDispatch()
  const token = useSelector((state) => state.auth.token)
  const user = useSelector((state) => state.auth.user)

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <div className={styles.header}>
      <Link to="/" className={styles.title}>
        Realworld Blog
      </Link>
      <div className={styles.but}>
        {token ? (
          <div className={styles.rigth}>
            <Link to="/new-article" className={styles.createart}>
              Create article
            </Link>
            <Link to="/profile" className={styles.avatarContainer}>
              <span className={styles.username}>{user?.username}</span>
              <img
                src={getImageUrl(user?.image)}
                className={styles.avatar}
                alt={user?.username || 'User'}
              />
            </Link>
            <button onClick={handleLogout} className={styles.buttonLogout}>
              Logout
            </button>
          </div>
        ) : (
          <div className={styles.buttoms}>
            <Link to="/sign-in" className={styles.buttonIn}>
              Sign In
            </Link>
            <Link to="/sign-up" className={styles.buttonUp}>
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Header
