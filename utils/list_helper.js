const dummy = (blogs) => {
    return 1
}
  

const totalLikes = (blogs) => {
    const total = blogs.reduce( (f,s) => f + s.likes , 0)
    return total
}


const favoriteBlog = (blogs) => {
    const fav = blogs.reduce((max, b) => (max.likes >= b.likes ? max : b), blogs[0])
    return fav
}

const authorWithMostBlogs = (blogs) => {
    const groupedByAuthor = blogs.reduce((groups, blog) => {
        const author = blog.author
      
        if (!groups[author]) {
            groups[author] = []
        }
      
        groups[author].push(blog)
      
        return groups
    }, {})

    const authors = Object.keys(groupedByAuthor)
    const max = authors.reduce((maxAuthor, author) => 
        groupedByAuthor[author].length > groupedByAuthor[maxAuthor].length ? author : maxAuthor, authors[0]
    )
  
    return { author: max, blogs: groupedByAuthor[max].length }
}

const authorWithMostLikes = (blogs) => {
    const groupedByAuthor = blogs.reduce((groups, blog) => {
        const author = blog.author
      
        if (!groups[author]) {
            groups[author] = []
        }
      
        groups[author].push(blog)
      
        return groups
    }, {})

    const authors = Object.keys(groupedByAuthor)
    const max = authors.reduce((maxAuthor, author) => 
        totalLikes(groupedByAuthor[author]) > totalLikes(groupedByAuthor[maxAuthor]) ? author : maxAuthor, authors[0]
    )
  
    return { author: max, likes: totalLikes(groupedByAuthor[max]) }
}



module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    authorWithMostBlogs,
    authorWithMostLikes
}