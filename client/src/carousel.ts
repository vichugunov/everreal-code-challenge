import { getGameStats, getBaseSettings, createGame } from './api'
import { IGameStat } from './interfaces'
import { fillCarousel, getCanvasId, getOpenBtnId} from './helpers/fillCarousel'
import { drawRectange } from './helpers/drawRectangle'

const onOpenGameClick = (gameId: string): void => {
  window.location.href = `/game-overview.html?id=${gameId}`
}

const onNewGameClick = (name?: string): void => {
  createGame(name)
    .then(gameId => {
      onOpenGameClick(gameId)
    })
}

const setOpenBtnListeners = (stat: IGameStat): void => {
  const btn = document.querySelector(`button#${getOpenBtnId(stat)}`) as HTMLButtonElement
  btn.addEventListener("click", onOpenGameClick.bind(null, stat.gameId), false);
}

const setNewBtnListener = (): void => {
  const btn = document.querySelector(`button#newGameBtn`) as HTMLButtonElement
  btn.addEventListener("click", onNewGameClick.bind(null, null), false);
}

Promise.all([
  getGameStats(),
  getBaseSettings()
])
.then(([stats, settings]) => {
  fillCarousel(stats)
  stats.forEach((stat) => {
    drawRectange({
      board: stat.currentBoard,
      boardSize: settings.boardSize,
      selector: `canvas#${getCanvasId(stat)}`,
      connectedVertices: stat.connectedVertices
    })

    setOpenBtnListeners(stat)
  })
})

setNewBtnListener()