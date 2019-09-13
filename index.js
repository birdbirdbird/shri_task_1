const express = require('express')
const controllers = require('./controllers')

const app = express()

app.use(express.json())

app.get('/api/repos', controllers.get.listRepos)
app.get('/api/repos/:repositoryId/commits/:commitHash', controllers.get.listCommits)
app.get('/api/repos/:repositoryId/commits/:commitHash/diff', controllers.get.diff)
app.get('/api/repos/:repositoryId', controllers.get.ls)
app.get('/api/repos/:repositoryId/tree/:commitHash?/:path([^/]*)?', controllers.get.tree)
app.get('/api/repos/:repositoryId/blob/:commitHash/*', controllers.get.blob)

app.delete('/api/repos/:repositoryId', controllers.delete.deleteRepo)

app.post('/api/repos/:repositoryId', controllers.post.downloadRepo)

app.use((err, req, res, next) => {
  console.log(err)
  res.json({ message: 'error :(' })
})

app.listen(3000)
