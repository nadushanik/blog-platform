import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid' // Импортируем функцию для генерации UUID

import { createArticle } from '../../store/articlesSlice'

import styles from './CreateArt.module.scss'

function CreateArt() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [body, setBody] = useState('')
  const [tags, setTags] = useState([{ id: uuidv4(), value: '' }])

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

    const articleData = {
      title,
      description,
      body,
      tagList: tags.map((tag) => tag.value).filter((tag) => tag.trim() !== ''),
    }

    dispatch(createArticle(articleData))
      .unwrap()
      .then(() => {
        setTitle('')
        setDescription('')
        setBody('')
        setTags([{ id: uuidv4(), value: '' }])
        navigate('/')
      })
      .catch((error) => {
        console.error('Failed to create article:', error)
      })
  }

  return (
    <div className={styles.block}>
      <div className={styles.title}>Create New Article</div>
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
          Send
        </button>
      </form>
    </div>
  )
}

export default CreateArt
