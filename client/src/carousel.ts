import { getGameStats, getBaseSettings, createGame } from './api'
import { setLsSettings } from './helpers/localStorage'
import { GameBoard, IConstants, IGameStat, Vertex } from './interfaces'
import { fillCarousel, getCanvasId, getOpenBtnId} from './helpers/fillCarousel'

const onError = () => {
  window.location.href = '/'
}

const getSettings = (): Promise<IConstants> => {
  return new Promise((resolve) => {
    const settings = getBaseSettings()
    if (settings != null) {
      return resolve(settings)
    }
    getBaseSettings()
      .then(settings => {
        setLsSettings(settings)
        resolve(settings)
      })
      .catch(onError)

  })
}

interface IRectangeProps {
  board: GameBoard
  connectedVertices: Array<Vertex>
  boardSize: number
  canvasSize: number
  selector: string
}

const drawRectange = ({ board, connectedVertices, boardSize, canvasSize, selector }: IRectangeProps): void => {
  const canvasSelector = selector
  const canvas = document.querySelector(canvasSelector)
  const margin = 1
  const ordinaryStrokeColor = 'lightgray'
  const borderStrokeColor = 'black'

  if (canvas == null) {
    console.error('canvas not found', selector)
    return
  }

  const ctx = (canvas as HTMLCanvasElement).getContext("2d")
  if (!ctx) {
    console.error('no canvas context', selector)
    return
  }

  const cellSize = Math.floor(canvasSize / boardSize)
  // Red rectangle
  board.forEach((boardRow, i) => {
    // const connectedVerticesLine = connectedVertices.filter(vertex => vertex[0] === i)
    // connectedVerticesLine.sort((vertexA, vertexB) => vertexB[1] - vertexA[1])
    // const borderColumn = connectedVerticesLine[0] && connectedVerticesLine[0][1]

    boardRow.forEach((cellColor, j) => {
      const isVertexConnected = connectedVertices.find(vertex => vertex[0] === i && vertex[1] === j) != null

      ctx.beginPath()
      ctx.fillStyle = cellColor
      ctx.fillRect(Math.max(j * cellSize, 0), Math.max(i * cellSize, 0), cellSize, cellSize)

      ctx.lineWidth   = margin
      ctx.strokeStyle = isVertexConnected ? borderStrokeColor : ordinaryStrokeColor
      ctx.strokeRect(j * cellSize, i * cellSize, cellSize, cellSize)
    })
  })
}

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
  getSettings()
])
.then(([stats, settings]) => {
  fillCarousel(stats)
  stats.forEach((stat) => {
    drawRectange({
      board: stat.currentBoard,
      boardSize: settings.boardSize,
      canvasSize: 300,
      selector: `canvas#${getCanvasId(stat)}`,
      connectedVertices: stat.connectedVertices
    })

    setOpenBtnListeners(stat)
  })
})

setNewBtnListener()