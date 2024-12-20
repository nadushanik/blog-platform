import { format } from 'date-fns'

export const formatDate = (dateString) => {
  return format(new Date(dateString), 'MMMM d, yyyy')
}

export const filterTags = (tagList) => {
  if (!Array.isArray(tagList)) return []
  return tagList.filter(
    (tag) => tag !== null && tag !== undefined && tag.trim() !== '',
  )
}

export const limitTags = (tagList, limit = 3) => {
  return tagList.slice(0, limit)
}

export const getImageUrl = (image) => {
  return image
    ? image
    : 'https://cdn1.flamp.ru/2e3480dd87d639bba0ee3a01b63dbb2c.jpg'
}
