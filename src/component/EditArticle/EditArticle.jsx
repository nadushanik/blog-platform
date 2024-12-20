import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'

import { fetchArticleDetail, updateArticle } from '../../store/articlesSlice'

import styles from './EditArticle.module.scss'

export default function EditArticle() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [body, setBody] = useState('')
  const [tags, setTags] = useState([])

  const article = useSelector((state) => state.artic.article)

  useEffect(() => {
    dispatch(fetchArticleDetail(slug))
  }, [dispatch, slug])

  useEffect(() => {
    if (article) {
      setTitle(article.title)
      setDescription(article.description)
      setBody(article.body)
      setTags(article.tagList.map((tag) => ({ id: uuidv4(), value: tag })))
    }
  }, [article])

  const addTag = () => {
    setTags([...tags, { id: uuidv4(), value: '' }])
  }

  const removeTag = (id) => {
    setTags(tags.filter((tag) => tag.id !== id))
  }

  const updateTag = (id, value) => {
    setTags(tags.map((tag) => (tag.id === id ? { ...tag, value } : tag)))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const updatedArticleData = {
      title,
      description,
      body,
      tagList: tags.map((tag) => tag.value).filter((tag) => tag.trim() !== ''),
    }

    dispatch(updateArticle({ slug, article: updatedArticleData }))
      .unwrap()
      .then(() => {
        navigate('/')
      })
      .catch((error) => {
        console.error('Failed to update article:', error)
      })
  }

  return (
    <div className={styles.block}>
      <div className={styles.title}>Edit Article</div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formcontrol}>
          <label>Title</label>
          <input
            className={styles.input}
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className={styles.formcontrol}>
          <label>Short description</label>
          <input
            className={styles.input}
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className={styles.formcontrol}>
          <label>Text</label>
          <textarea
            className={styles.textarea}
            placeholder="Text"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>

        <div className={styles.formcontrol}>
          <label>Tags</label>
          {tags.map((tag, index) => (
            <div key={tag.id} className={styles.tagForm}>
              <input
                className={`${styles.input} ${styles.tag}`}
                type="text"
                placeholder="Tag"
                value={tag.value}
                onChange={(e) => updateTag(tag.id, e.target.value)}
              />
              <button
                type="button"
                className={styles.removeTagButton}
                onClick={() => removeTag(tag.id)}
              >
                Delete
              </button>
              {index === tags.length - 1 && (
                <button
                  type="button"
                  className={styles.addTagButton}
                  onClick={addTag}
                >
                  Add tag
                </button>
              )}
            </div>
          ))}
        </div>

        <button type="submit" className={styles.but}>
          Update
        </button>
      </form>
    </div>
  )
}
