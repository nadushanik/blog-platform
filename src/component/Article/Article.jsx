import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import {
  formatDate,
  filterTags,
  limitTags,
  getImageUrl,
} from '../../utilit/util'
import { likeArticle, unlikeArticle } from '../../store/articlesSlice'

import styles from './Article.module.scss'

function Article({
  title,
  description,
  favoritesCount,
  author,
  createdAt,
  tagList,
  slug,
  favorited,
}) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const currentUser = useSelector((state) => state.auth.user)

  const formattedDate = formatDate(createdAt)
  const filteredTags = filterTags(tagList)
  const limitedTags = limitTags(filteredTags, 3)
  const imageUrl = getImageUrl(author.image)

  const handleClick = () => {
    navigate(`/article/${slug}`)
  }

  const handleLike = () => {
    if (!currentUser) {
      navigate('/sign-up')
      return
    }

    if (favorited) {
      dispatch(unlikeArticle(slug))
    } else {
      dispatch(likeArticle(slug))
    }
  }

  return (
    <div className={styles.article} onClick={handleClick}>
      <div className={styles.left}>
        <div className={styles.left2}>
          <div className={styles.title}>{title}</div>
          <div className={styles.likeContainer}>
            <span
              className={`${styles.like} ${favorited ? styles.liked : ''}`}
              onClick={(e) => {
                e.stopPropagation()
                handleLike()
              }}
            >
              ♡
            </span>
            <span className={styles.likes}>{favoritesCount}</span>
          </div>
        </div>
        <div className={styles.tags}>
          {limitedTags.map((tag, index) => (
            <span key={index} className={styles.tag}>
              {tag.length > 20 ? `${tag.slice(0, 20)}...` : tag}
            </span>
          ))}
        </div>
        <div className={styles.description}>{description}</div>
      </div>
      <div className={styles.right}>
        <div className={styles.blok}>
          <div className={styles.username}>{author.username}</div>
          <div className={styles.data}>{formattedDate}</div>
        </div>
        <img src={imageUrl} className={styles.avatar} alt={author.username} />
      </div>
    </div>
  )
}

export default Article
