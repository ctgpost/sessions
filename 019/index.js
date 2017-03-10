const regl = require('../common/regl')({
  extensions: ['OES_texture_float'],
  onDone: (err, regl) => {
    if (err) {
      console.log(err)
      return
    }
    const setupScene = require('./scene')(regl)
    const clear = { depth: 1.0, color: [0, 0, 0, 1] }
    const resl = require('resl')
    const drawBackground = require('./background')(regl)
    const drawDust = require('./dust')(regl)
    const drawBoids = require('./boids')(regl)
    const drawSphere = require('./sphere')(regl)

    const center = [0, 0, 0]
    const sphereProps = {center}

    const frameLoop = regl.frame(() => {
      try {
        regl.clear(clear)
        setupScene(({tick}) => {
          drawSphere(sphereProps)
          drawBoids(updateTarget(center, tick))
          drawBackground()
          drawDust()
        })
        window.frameDone()
      } catch (error) {
        console.error(error)
        frameLoop.cancel()
      }
    })
  }
})

const target = [0, 0, 0]
const targetProps = {target}
const radius = 5
function updateTarget (center, tick) {
  const theta = tick * 0.01
  target[0] = center[0] + Math.cos(theta) * radius
  target[1] = center[1]
  target[2] = center[2] + Math.sin(theta) * radius
  return targetProps
}
