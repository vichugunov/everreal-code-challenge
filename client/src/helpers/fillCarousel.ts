import { IGameStat } from './../interfaces'

export const getCanvasId = (stat: IGameStat): string => {
  return `canvas-${stat.gameId}`
}

export const getOpenBtnId = (stat: IGameStat): string => {
  return `btn-${stat.gameId}`
}

export const fillCarousel = (stats: IGameStat[]): void => {
  const placeholderDiv = document.querySelector('#noGamesPlaceholder') as HTMLDivElement
  const carouselDiv = document.querySelector('#carousel') as HTMLDivElement

  if (stats.length === 0 ) {
    placeholderDiv.style.display = 'block'
    carouselDiv.style.display = 'none'
  } else {
    placeholderDiv.style.display = 'none'
  }
  // fill indicators

  const indicators = document.querySelector('.carousel-indicators') as HTMLElement
  stats.forEach((stat, idx) => {
    const elem = document.createElement('li')
    elem.setAttribute('data-target', '#carousel')
    elem.setAttribute('data-slide-to', idx + '')
    if (idx === 0 ) {
      elem.setAttribute('class', 'active')
    }

    indicators.appendChild(elem)
  })

  // fill inner carousel
  const innerCarousel = document.querySelector('.carousel-inner') as HTMLElement
  stats.forEach((stat, idx) => {
    const elem = document.createElement('div')
    const classes = idx == 0 ? 'carousel-item active h-100': 'carousel-item h-100'
    elem.setAttribute('class', classes)

    const innerDiv = document.createElement('div')
    innerDiv.setAttribute('class', 'd-flex h-100 justify-content-center align-items-center')

    const gameInfoDiv = document.createElement('div')
    gameInfoDiv.setAttribute('class', 'd-flex flex-column mr-5 align-items-start')

    if (stat.name) {
      const gameNameSpan = document.createElement('span')
      gameNameSpan.innerText = `Game name: ${stat.name}`
      gameInfoDiv.appendChild(gameNameSpan)
    }

    const gameIdSpan = document.createElement('span')
    gameIdSpan.innerText = `Game id: ${stat.gameId}`
    gameInfoDiv.appendChild(gameIdSpan)

    const lastChangedSpan = document.createElement('span')
    lastChangedSpan.innerText = `Last Changed: ${new Date(stat.lastChangeAtMs).toLocaleString()}`
    gameInfoDiv.appendChild(lastChangedSpan)


    innerDiv.appendChild(gameInfoDiv)


    const canvas = document.createElement('canvas')
    canvas.setAttribute('id', getCanvasId(stat))
    canvas.setAttribute('width', '300')
    canvas.setAttribute('height', '300')

    innerDiv.appendChild(canvas)

    const captionDiv = document.createElement('div')
    captionDiv.setAttribute('class', 'carousel-caption d-none d-md-block')

    const openGameBtn = document.createElement('button')
    openGameBtn.setAttribute('type', 'button')
    openGameBtn.setAttribute('class', 'btn btn-light')
    openGameBtn.setAttribute('id', getOpenBtnId(stat))
    openGameBtn.innerText = 'Open Game'

    captionDiv.appendChild(openGameBtn)

    innerDiv.appendChild(captionDiv)

    elem.appendChild(innerDiv)

    innerCarousel.appendChild(elem)
  })
}
