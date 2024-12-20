import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const fetchArticles = createAsyncThunk(
  'article/fetchArticles',
  async function (page = 1) {
    const token = localStorage.getItem('token')
    const headers = {
      'Content-Type': 'application/json',
    }
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
    const response = await fetch(
      `https://blog-platform.kata.academy/api/articles?limit=5&offset=${(page - 1) * 5}`,
      {
        method: 'GET',
        headers,
      },
    )
    if (!response.ok) {
      throw new Error('Failed to fetch articles')
    }
    const data = await response.json()
    return {
      articles: data.articles,
      total: data.articlesCount,
    }
  },
)

export const deleteArticle = createAsyncThunk(
  'article/deleteArticle',
  async (slug, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `https://blog-platform.kata.academy/api/articles/${slug}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.errors)
      }

      return slug
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const createArticle = createAsyncThunk(
  'articles/create',
  async (articleData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token')

      const requestBody = JSON.stringify({
        article: {
          title: articleData.title,
          description: articleData.description,
          body: articleData.body,
          tagList: articleData.tagList,
        },
      })

      const response = await fetch(
        'https://blog-platform.kata.academy/api/articles',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: requestBody,
        },
      )

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.errors)
      }

      const data = await response.json()
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const updateArticle = createAsyncThunk(
  'articles/update',
  async ({ slug, article: updatedArticleData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `https://blog-platform.kata.academy/api/articles/${slug}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ article: updatedArticleData }),
        },
      )

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.errors)
      }

      const data = await response.json()
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const fetchArticleDetail = createAsyncThunk(
  'article/fetchArticleDetail',
  async function (slug) {
    const token = localStorage.getItem('token')
    const response = await fetch(
      `https://blog-platform.kata.academy/api/articles/${slug}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    )
    if (!response.ok) {
      throw new Error('Failed to fetch article details')
    }
    const data = await response.json()
    return data.article
  },
)
export const likeArticle = createAsyncThunk(
  'article/likeArticle',
  async (slug, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `https://blog-platform.kata.academy/api/articles/${slug}/favorite`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.errors)
      }

      const data = await response.json()
      return data.article
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const unlikeArticle = createAsyncThunk(
  'article/unlikeArticle',
  async (slug, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `https://blog-platform.kata.academy/api/articles/${slug}/favorite`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.errors)
      }

      const data = await response.json()
      return data.article
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)
const artSlice = createSlice({
  name: 'artic',
  initialState: {
    art: [],
    total: 0,
    loading: false,
    error: null,
    article: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.loading = false
        state.art = action.payload.articles
        state.total = action.payload.total
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Something went wrong'
      })

    builder
      .addCase(fetchArticleDetail.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchArticleDetail.fulfilled, (state, action) => {
        state.loading = false
        state.article = action.payload
      })
      .addCase(fetchArticleDetail.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Something went wrong'
      })

    builder
      .addCase(createArticle.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createArticle.fulfilled, (state, action) => {
        state.loading = false
        state.art.push(action.payload.article)
      })
      .addCase(createArticle.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Something went wrong'
      })

    builder
      .addCase(updateArticle.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateArticle.fulfilled, (state, action) => {
        state.loading = false
        state.article = action.payload.article
      })
      .addCase(updateArticle.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Something went wrong'
      })

    builder.addCase(deleteArticle.fulfilled, (state, action) => {
      state.art = state.art.filter((article) => article.slug !== action.payload)
      state.article = null
    })
    builder
      .addCase(likeArticle.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(likeArticle.fulfilled, (state, action) => {
        state.loading = false
        state.art = state.art.map((article) =>
          article.slug === action.payload.slug ? action.payload : article,
        )
        if (state.article && state.article.slug === action.payload.slug) {
          state.article = action.payload
        }
      })
      .addCase(likeArticle.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Something went wrong'
      })
    builder
      .addCase(unlikeArticle.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(unlikeArticle.fulfilled, (state, action) => {
        state.loading = false
        state.art = state.art.map((article) =>
          article.slug === action.payload.slug ? action.payload : article,
        )
        if (state.article && state.article.slug === action.payload.slug) {
          state.article = action.payload
        }
      })
      .addCase(unlikeArticle.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Something went wrong'
      })
  },
})

export default artSlice.reducer
