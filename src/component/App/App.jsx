import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import { setUserFromToken } from '../../store/userSlice'
import Header from '../Header/Header'
import ArticlesList from '../ArticlesList/ArticlesList'
import SingUp from '../SingUp/SingUp'
import SingIn from '../SingIn/SingIn'
import ArticleFull from '../ArticleFull/ArticleFull'
import CreateArt from '../CreateArt/CreateArt'
import EditProfil from '../EditProfil/EditProfil'
import EditArticle from '../EditArticle/EditArticle'

import styles from './App.module.scss'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      fetch('https://blog-platform.kata.academy/api/user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.user) {
            dispatch(setUserFromToken({ user: data.user, token }))
          } else {
            localStorage.removeItem('token')
          }
        })
        .catch((error) => {
          console.error('Error validating token:', error)
          localStorage.removeItem('token')
        })
    }
  }, [dispatch])

  return (
    <Router>
      <div className={styles.app}>
        <Header />
        <Routes>
          <Route path="/" element={<ArticlesList />} />
          <Route path="/article/:slug" element={<ArticleFull />} />
          <Route path="/sign-up" element={<SingUp />} />
          <Route path="/sign-in" element={<SingIn />} />
          <Route path="/new-article" element={<CreateArt />} />
          <Route path="/profile" element={<EditProfil />} />
          <Route path="/articles/edit/:slug" element={<EditArticle />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
