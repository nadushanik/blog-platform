import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Spin } from 'antd'
import ReactMarkdown from 'react-markdown'

import {
  deleteArticle,
  fetchArticleDetail,
  likeArticle,
  unlikeArticle,
} from '../../store/articlesSlice'
import {
  formatDate,
  filterTags,
  limitTags,
  getImageUrl,
} from '../../utilit/util'

import styles from './ArticleFull.module.scss'

function ArticleFull() {
  const { slug } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { article, status, error } = useSelector((state) => state.artic)
  const currentUser = useSelector((state) => state.auth.user)

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    dispatch(fetchArticleDetail(slug))
      .unwrap()
      .then(() => {
        setIsLoading(false)
      })
      .catch(() => {
        setIsLoading(false)
      })
  }, [dispatch, slug])

  const handleDelete = () => {
    dispatch(deleteArticle(article.slug))
      .unwrap()
      .then(() => {
        navigate('/')
      })
      .catch((error) => {
        console.error('Failed to delete article:', error)
      })
  }

  const handleLike = () => {
    if (!currentUser) {
      navigate('/sign-up')
      return
    }

    if (article.favorited) {
      dispatch(unlikeArticle(slug))
    } else {
      dispatch(likeArticle(slug))
    }
  }

  if (isLoading) {
    return <Spin />
  }

  if (status === 'rejected') {
    return <div>Error: {error}</div>
  }

  if (!article) {
    return <div>Article not found</div>
  }

  const formattedDate = formatDate(article.createdAt)
  const imageUrl = getImageUrl(article.author.image)
  const filteredTags = filterTags(article.tagList)
  const limitedTags = limitTags(filteredTags, 3)

  const isMyArticle =
    currentUser && currentUser.username === article.author.username

  return (
    <div className={styles.article}>
      <div className={styles.short}>
        <div className={styles.left}>
          <div className={styles.left2}>
            <div className={styles.title}>{article.title}</div>
            <div className={styles.likeContainer}>
              <span
                className={`${styles.like} ${article.favorited ? styles.liked : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  handleLike()
                }}
              >
                ♡
              </span>
              <span className={styles.likes}>{article.favoritesCount}</span>
            </div>
          </div>
          <div className={styles.tags}>
            {limitedTags.map((tag, index) => (
              <span key={index} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
          <div className={styles.description}>{article.description}</div>
        </div>
        <div className={styles.right}>
          <div className={styles.user}>
            <div className={styles.blok}>
              <div className={styles.username}>{article.author.username}</div>
              <div className={styles.data}>{formattedDate}</div>
            </div>
            <img
              src={imageUrl}
              className={styles.avatar}
              alt={article.author.username}
            />
          </div>
          <div className={styles.buttoms}>
            {isMyArticle && (
              <div className={styles.actions}>
                <Link
                  to={`/articles/edit/${slug}`}
                  className={styles.editButton}
                >
                  Edit
                </Link>
                <button className={styles.deleteButton} onClick={handleDelete}>
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={styles.long}>
        <ReactMarkdown>{article.body}</ReactMarkdown>
      </div>
    </div>
  )
}

export default ArticleFull
