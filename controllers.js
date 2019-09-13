const { exec } = require('child_process')
const fs = require('fs')

module.exports = {
  get: {
    async listRepos (req, res, next) {
      await exec(`bash ${__dirname}/scripts/listRepos.sh`, {
        cwd: process.argv[2]
      }, (err, out) => {
        if (err) {
          next(err)
        } else {
          res.json(out.slice(0, -1).split('\n'))
        }
      })
    },
    async listCommits (req, res, next) {
      const { repositoryId, commitHash } = req.params
      await exec(`git checkout ${commitHash}; git log --pretty="format:%H %ct"`, {
        cwd: `${process.argv[2]}/${repositoryId}`
      }, (err, out) => {
        if (err) {
          next(err)
        } else {
          console.log(out)
          const commits = out.split('\n').map(x => {
            return {
              commitHash: x.split(' ')[0],
              date: x.split(' ')[1]
            }
          })
          res.json(commits)
        }
      })
    },
    async diff (req, res, next) {
      const { repositoryId, commitHash } = req.params
      await exec(`git show --pretty="format:%b" ${commitHash}`, {
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
      exec('git checkout master; ls', {
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
      const { repositoryId, commitHash, path } = req.params
      exec(`git checkout ${commitHash}; ls ${path}`, {
        cwd: `${process.argv[2]}/${repositoryId}`
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
      exec(`git checkout ${commitHash}`, {
        cwd: `${process.argv[2]}/${repositoryId}`
      }, (err, out) => {
        if (err) {
          next(err)
        } else {
          console.log(pathToFile)
          fs.readFile(`${process.argv[2]}/${repositoryId}/${pathToFile}`, { encoding: 'utf-8' }, (err, data) => {
            if (err) {
              next(err)
            } else {
              res.json({ data: data })
            }
          })
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
          console.log(out)
          res.json({ message: 'success' })
        }
      })
    }
  },
  post: {
    downloadRepo (req, res, next) {
      const { repositoryId } = req.params
      const { url } = req.body
      exec(`git clone ${url} ${repositoryId}`, {
        cwd: `${process.argv[2]}`
      }, (err, out) => {
        if (err) {
          next(err)
        } else {
          console.log(out)
          res.json({ message: 'success' })
        }
      })
    }
  }
}
