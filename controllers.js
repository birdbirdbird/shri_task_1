const { exec } = require('child_process')

module.exports = {
  get: {
    listRepos (req, res, next) {
      exec(`bash ${__dirname}/scripts/listRepos.sh`, {
        cwd: process.argv[2]
      }, (err, out) => {
        if (err) {
          next(err)
        } else {
          res.json(out.slice(0, -1).split('\n'))
        }
      })
    },
    listCommits (req, res, next) {
      const { repositoryId, commitHash } = req.params
      exec(`git log ${commitHash} --pretty="%H %ct"`, {
        cwd: `${process.argv[2]}/${repositoryId}`
      }, (err, out) => {
        if (err) {
          next(err)
        } else {
          const commits = out.slice(0, -1).split('\n').map(x => {
            return {
              commitHash: x.split(' ')[0],
              date: x.split(' ')[1]
            }
          })
          res.json(commits)
        }
      })
    },
    diff (req, res, next) {
      const { repositoryId, commitHash } = req.params
      exec(`git show --pretty="format:%b" ${commitHash}`, {
        cwd: `${process.argv[2]}/${repositoryId}`
      }, (err, out) => {
        if (err) {
          next(err)
        } else {
          res.json({ diff: out })
        }
      })
    },
    ls (req, res, next) {
      const { repositoryId } = req.params
      exec('git ls-tree master --name-only', {
        cwd: `${process.argv[2]}/${repositoryId}`
      }, (err, out) => {
        if (err) {
          next(err)
        } else {
          res.json(out.slice(0, -1).split('\n'))
        }
      })
    },
    tree (req, res, next) {
      let { repositoryId, commitHash, path } = req.params
      if (!path) path = ''
      exec(`git ls-tree ${commitHash}:${path} --name-only `, {
        cwd: `${process.argv[2]}/${repositoryId}/`
      }, (err, out) => {
        if (err) {
          next(err)
        } else {
          res.json(out.slice(0, -1).split('\n'))
        }
      })
    },
    blob (req, res, next) {
      const { repositoryId, commitHash } = req.params
      const pathToFile = req.params['0']
      exec(`git show ${commitHash}:${pathToFile}`, {
        cwd: `${process.argv[2]}/${repositoryId}`
      }, (err, out) => {
        if (err) {
          next(err)
        } else {
          res.json({ data: out })
        }
      })
    }
  },
  delete: {
    deleteRepo (req, res, next) {
      const { repositoryId } = req.params
      exec(`rm -rf ${process.argv[2]}/${repositoryId}`, (err, out) => {
        if (err) {
          next(err)
        } else {
          res.json({ message: 'success' })
        }
      })
    }
  },
  post: {
    downloadRepo (req, res, next) {
      const { repositoryId } = req.params
      const { url } = req.body
      console.log('download started')
      exec(`git clone ${url} ${repositoryId}`, {
        cwd: `${process.argv[2]}`
      }, (err, out) => {
        if (err) {
          next(err)
        } else {
          console.log('success')
          res.json({ message: 'success' })
        }
      })
    }
  }
}
