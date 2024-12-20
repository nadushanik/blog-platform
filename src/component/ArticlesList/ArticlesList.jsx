import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Pagination, Spin } from 'antd'

import { fetchArticles } from '../../store/articlesSlice'
import Article from '../Article/Article'

import styles from './ArticlesList.module.scss'

function ArticlesList() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { art, status, error, total } = useSelector((state) => state.artic)
  const [paramsPage] = useSearchParams()
  const pageCurrent = Number(paramsPage.get('page')) || 1

  useEffect(() => {
    dispatch(fetchArticles(pageCurrent))
  }, [dispatch, pageCurrent])

  const handlePagination = (page) => {
    navigate(`?page=${page}`)
  }

  if (status === 'loading') {
    return <Spin />
  }

  if (status === 'rejected') {
    return <div className={styles.error}>Error: {error}</div>
  }

  return (
    <div className={styles.articlelist}>
      {art.map((article) => (
        <Article key={article.slug} {...article} />
      ))}
      <Pagination
        defaultCurrent={1}
        current={pageCurrent}
        defaultPageSize={5}
        showSizeChanger={false}
        total={total}
        style={{ justifyContent: 'center' }}
        onChange={handlePagination}
      />
    </div>
  )
}

export default ArticlesList
