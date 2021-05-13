function createCanvas(id) {
  const el = document.getElementById(id)
  const ctx = el.getContext('2d')

  // Sets fillStyle
  const fill = function (...color) {
    let c

    if (color.length === 1) {
      c = `rgb(${color[0]}, ${color[0]}, ${color[0]})`
    } else if (color.length === 3) {
      c = `rgb(${color[0]}, ${color[1]}, ${color[2]})`
    } else if (color.length === 2) {
      c = `rgba(${color[0]}, ${color[0]}, ${color[0]}, ${color[1]})`
    } else if (color.length === 4) {
      c = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`
    } else {
      //error
    }

    if (c) {
      ctx.fillStyle = c
    }
  }

  // Sets fillStyle and draws a rect
  const background = function (...color) {
    fill(...color)
    ctx.fillRect(0, 0, el.width, el.height)
  }

  // Draws a rect
  const rect = function (x, y, w, h) {
    ctx.fillRect(x, y, w, h)
  }

  // Draws an ellipse
  const ellipse = function (x, y, w, h) {
    ctx.beginPath()
    ctx.ellipse(x + this.trans[0], y + this.trans[1], w, h, 0, 0, 2 * Math.PI)
    ctx.fill()
  }

  const translate = function (x, y) {
    this.trans[0] += x
    this.trans[1] += y
  }

  const setTranslate = function (x, y) {
    this.trans = [x, y]
  }

  return {
    el: el,
    ctx: ctx,
    trans: [0, 0],
    fill: fill,
    bg: background,
    rect: rect,
    ellipse: ellipse,
    translate: translate,
    setTranslate: setTranslate,
    mouseX: 0,
    mouseY: 0,
  }
}

function map(val, min1, max1, min2, max2) {
  return ((val - min1) / (max1 - min1)) * (max2 - min2) + min2
}

let canvas,
  color_scheme = 'dark'
function setupParticleCanvas() {
  // Check initial color scheme
  if (matchMedia('(prefers-color-scheme: light)').matches) {
    color_scheme = 'light'
  }
  // Add listeners for color scheme
  window.matchMedia('(prefers-color-scheme: light)').addListener((e) => {
    if (e.matches) color_scheme = 'light'
  })

  window.matchMedia('(prefers-color-scheme: dark)').addListener((e) => {
    if (e.matches) color_scheme = 'dark'
  })

  window.matchMedia('(prefers-color-scheme: no-preference)').addListener((e) => {
    if (e.matches) color_scheme = 'dark'
  })

  // Init canvas
  canvas = createCanvas('canvas')

  // Set canvas full screen
  let resizeTimer
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(function () {
      canvas.el.width = window.innerWidth
      canvas.el.height = window.innerHeight
    }, 200)
  })
  canvas.el.width = window.innerWidth
  canvas.el.height = window.innerHeight

  // Translate on mouse move
  document.addEventListener('mousemove', function (e) {
    canvas.mouseX = e.clientX
    canvas.mouseY = e.clientY
  })
  document.addEventListener('mouseenter', function (e) {
    canvas.mouseX = e.clientX
    canvas.mouseY = e.clientY
  })
  canvas.mouseX = window.innerWidth / 2
  canvas.mouseY = window.innerHeight / 2

  // Add initial stars
  addStars(20, 30, 0.2)

  // Start animation
  requestAnimationFrame(drawParticleCanvas)
}

let stars = []
function drawParticleCanvas() {
  color_scheme === 'dark' ? canvas.bg(7, 11, 32) : canvas.bg(245, 245, 245)

  // Update translation -> parallax
  canvas.setTranslate(
    (300 * canvas.mouseX) / canvas.el.width,
    (300 * canvas.mouseY) / canvas.el.height
  )

  // Update stars and delete if needed (if lifespan overlived)
  for (let i = stars.length - 1; i > -1; i--) {
    color_scheme === 'dark' ? stars[i].render(canvas, 255) : stars[i].render(canvas, 0)

    stars[i].update()
    if (stars[i].life >= stars[i].lifespan) {
      stars.splice(i, 1)
    }
  }

  // Add more stars
  addStars(0, 3, 0.05)
  addShootingStars(0, 3, 0.05)

  requestAnimationFrame(draw)
}

function addStars(min, max, p) {
  let a = min
  for (let i = min; i < max; i++) {
    const r = Math.random()
    if (r < p) a++
  }

  for (let i = 0; i < a; i++) {
    const x = Math.random() * canvas.el.width - canvas.trans[0]
    const y = Math.random() * canvas.el.height - canvas.trans[1]
    const l = Math.random() * 500 + 100
    stars.push(new Star(x, y, l, 15))
  }
}

function addShootingStars(min, max, p) {
  let a = min
  for (let i = min; i < max; i++) {
    const r = Math.random()
    if (r < p) a++
  }

  for (let i = 0; i < a; i++) {
    const x = Math.random() * canvas.el.width - canvas.trans[0]
    const y = Math.random() * canvas.el.height - canvas.trans[1]
    const l = Math.random() * 25 + 15
    stars.push(new ShootingStar(x, y, l, 15))
  }
}
