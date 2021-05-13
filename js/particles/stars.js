class Particle {
  constructor(x, y, w, h, a, f) {
    this.x = x || 0
    this.y = y || 0
    this.w = w || 1
    this.h = h || 1

    this.a = a || 0
    this.f = f || 2.3
  }

  coords() {
    return [this.x, this.y]
  }

  size() {
    return [this.w, this.h]
  }

  update(coords) {
    if (!coords) {
      const newX = this.x + this.f * Math.cos(this.a)
      const newY = this.y + this.f * Math.sin(this.a)

      this.x = newX
      this.y = newY
    } else {
      this.x = coords[0]
      this.y = coords[1]
    }
  }

  render(canvas, ...color) {
    if (color) canvas.fill(...color)
    canvas.ellipse(this.x, this.y, this.w, this.h)
  }
}

class Star {
  constructor(x, y, lifespan) {
    this.lifespan = lifespan
    this.life = 0

    const s = Math.random() * 2 + 1
    const a = Math.random() * 2 * Math.PI
    const f = Math.random() * 0.5 + 0.5

    this.particle = new Particle(x, y, s, s, a, f)
  }

  update() {
    if (this.life >= this.lifespan) return

    this.particle.update()
    this.life += 1
  }

  render(canvas, ...color) {
    const lived = this.life / this.lifespan
    const alpha = map(lived, 0, 1, 1, 0)

    this.particle.render(canvas, ...color, alpha)
  }
}

class ShootingStar {
  constructor(x, y, lifespan, n) {
    this.lifespan = lifespan
    this.life = 0
    this.particles = []

    let a = (Math.PI * 6) / 8

    const maxS = 2
    const minS = 0.1

    for (let i = 0; i < n; i++) {
      this.particles.push(new Particle(x, y, map(i, 0, n, maxS, minS), map(i, 0, n, maxS, minS), a))
    }
  }

  update() {
    if (this.life >= this.lifespan) return

    for (let i = this.particles.length - 1; i > -1; i--) {
      if (i === 0) {
        this.particles[i].update()
      } else if (this.life + this.particles.length >= this.lifespan) {
        this.particles.pop()
      } else {
        if (this.life >= i) this.particles[i].update()
      }
    }

    this.life += 1
  }

  render(canvas, ...color) {
    for (let i = this.particles.length - 1; i > -1; i--) {
      const lived = this.life / this.lifespan

      const alpha = map(i, 0, this.particles.length, 1, 0)

      this.particles[i].render(canvas, ...color, alpha * (1 - lived))
    }
  }
}
