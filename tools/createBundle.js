const fs = require('fs')
const { resolve } = require('path')
const browserify = require('browserify')
const babelify = require('babelify')

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))

const MESSAGE = `/*!
 * ${pkg.name} v${pkg.version}
 * ${pkg.description}
 * Copyright (c) 2020 ${pkg.author.name}
 * ${pkg.author.url}
 */`

const PATH_BASE = resolve('public', 'static', 'js')
const NODE_ENV = process.env.NODE_ENV

const browserifyObject = browserify(resolve('src', 'App.js'), {
  debug: NODE_ENV !== 'production'
})

browserifyObject.transform(
  babelify.configure({
    presets: ['@babel/preset-env'],
    sourceMaps: false,
    comments: true,
    minified: false,
    env: {
      production: {
        comments: false,
        minified: true
      }
    }
  })
)

browserifyObject.bundle((err, buffer) => {
  if (err) console.error('ERROR-BUNDLE ->', err.message)
  else {
    const code = NODE_ENV !== 'production' ? buffer : `${MESSAGE}\n${buffer}`

    fs.mkdir(
      PATH_BASE,
      {
        recursive: true
      },
      err => {
        if (err) console.error('ERROR-BUNDLE ->', err.message)
        else {
          fs.writeFile(resolve(PATH_BASE, 'main.js'), code, { encoding: 'utf8' }, err => {
            if (err) console.error('ERROR-BUNDLE ->', err.message)
            else console.log(`Bundle created in ${PATH_BASE}`)
          })
        }
      }
    )
  }
})
