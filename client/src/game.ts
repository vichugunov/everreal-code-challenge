import { getGameSetup, getBaseSettings, solveAi, getGameHistory, makeMove } from './api'
import Pickr from '@simonwep/pickr'
import { drawRectange } from './helpers/drawRectangle'
import { IGameMove, IGameSetup, GameBoard } from './interfaces'

let userChosenColor = ''

const initializePicker = (colors: string[]): void => {
  // Simple example, see optional options for more configuration.
  userChosenColor = colors[0]

  const pickr = Pickr.create({
    el: '.color-picker',
    theme: 'nano', // or 'monolith', or 'nano'
    swatches: colors,
    default: colors[0],

    components: {
        // Main components
        preview: true,

        // Input / output Options
        interaction: {
            save: true
        }
    }
  })

  pickr.on('save', (newColor, instance) => {
    const colorIdx = instance._swatchColors
                    .map(swatches => swatches.color)
                    .findIndex(swatchColor => {
                      return swatchColor.toRGBA().every((colorPiece, i) => {
                        return newColor.toRGBA()[i] === colorPiece
                      })
                    })

    userChosenColor = colors[colorIdx]
  })
}

const queryString = window.location.search
const queryParams = new URLSearchParams(queryString.slice(1))
const gameId = queryParams.get('id') as string

if (!queryParams.get('id')) {
  console.error('game id is not present in a query string')
}

const initialCanvasSetup = (gameSetup: IGameSetup, boardSize: number): void => {
  const canvasBeforeSelectors: string[] = ['#user-before-canvas', '#ai-before-canvas']
  canvasBeforeSelectors.forEach(selector => {
    drawRectange({
      board: gameSetup.board,
      boardSize: boardSize,
      selector: selector,
      connectedVertices: gameSetup.connectedVertices
    })
  })
}

type moveItemClick = (prefix: string, initialBoard: GameBoard, history: IGameMove[], boardSize: number, idx: number) => void

const onMoveItemClick: moveItemClick = (prefix: string, initialBoard: GameBoard, history: IGameMove[], boardSize: number, idx: number): void => {
  const move = history[idx]

  drawRectange({
    board: idx === 0 ? initialBoard: history[idx - 1].result,
    boardSize: boardSize,
    selector: `#${prefix}-before-canvas`,
    connectedVertices: move.connectedBeforeApply
  })

  drawRectange({
    board: move.result,
    boardSize: boardSize,
    selector: `#${prefix}-after-canvas`,
    connectedVertices: move.connectedAfterApply
  })
}

const whichChild = (elem: ChildNode | null): number =>  {
  let  i = 0
  while (( elem = (elem as ChildNode).previousSibling) != null) ++i
  return i
}

const fillMovesList = (selector: string, itemClickHandler: moveItemClick, initialBoard: GameBoard, history: IGameMove[], boardSize: number): void => {
  const aiMovesList = document.querySelector(selector) as HTMLElement
  history.forEach((move, idx) => {
    const liItem = document.createElement('li')
    liItem.setAttribute('class', 'list-group-item move-item-list')

    const spanItem = document.createElement('span')
    spanItem.innerText = `#${idx}`

    liItem.appendChild(spanItem)

    const colorDiv = document.createElement('div')
    colorDiv.setAttribute('style', `display: inline; background: ${move.color}; font-size: 3em;`)
    colorDiv.setAttribute('id', `ai-id-${idx}`)
    colorDiv.innerHTML = '&nbsp;'

    liItem.appendChild(colorDiv)
    aiMovesList.appendChild(liItem)

    liItem.addEventListener('click', itemClickHandler.bind(null, initialBoard, history, boardSize, idx))
  })
}

const onSolveGameClick = (initialBoard: GameBoard, boardSize: number): void => {
  solveAi(gameId)
    .then((history) => {
      fillMovesList('#ai-moves-list', onMoveItemClick.bind(null, 'ai'), initialBoard, history, boardSize)
    })
}

const cleanAllMoves = (selector) => {
  const parent = document.querySelector(`${selector}`) as HTMLElement
  const items = Array.prototype.slice.call(document.querySelectorAll(`${selector} li`), 0)
  items.forEach(item => {
    parent.removeChild(item)
  })
}

const onSubmitMove =  (initialBoard: GameBoard, history: IGameMove[], boardSize: number): void => {
  makeMove(gameId, userChosenColor)
    .then((move) => {
      cleanAllMoves('#user-moves-list')
      const historyUpdated = [...history, move]
      fillMovesList('#user-moves-list', onMoveItemClick.bind(null, 'user'), initialBoard, historyUpdated, boardSize)
    })
}

const initializeListeners = (initialBoard: GameBoard, history: IGameMove[], boardSize: number): void => {
  const tabs = Array.prototype.slice.call(document.querySelectorAll('.nav a'), 0)
  const aiTab = tabs.find(tab => ((tab as HTMLElement).getAttribute('href') as string).indexOf('ai') >= 0)
  const userTab = tabs.find(tab => ((tab as HTMLElement).getAttribute('href') as string).indexOf('ai') == -1)

  const solveGameBtn = document.querySelector('#solve-game-btn') as HTMLButtonElement
  solveGameBtn.addEventListener('click', onSolveGameClick.bind(null, initialBoard, boardSize))

  const submitMoveBtn = document.querySelector('#submit-move-btn') as HTMLButtonElement

  userTab.addEventListener('click', cleanAllMoves('#user-moves-list'))
  aiTab.addEventListener('click', cleanAllMoves('#ai-moves-list'))
  submitMoveBtn.addEventListener('click', onSubmitMove.bind(null, initialBoard, history, boardSize))
}

Promise.all([
  getGameSetup(gameId),
  getGameHistory(gameId),
  getBaseSettings()
])
.then(([gameSetup, gameHistory, settings]) => {
  initializePicker(settings.colors)
  initialCanvasSetup(gameSetup, settings.boardSize)
  initializeListeners(gameSetup.board, gameHistory, settings.boardSize)

  fillMovesList('#user-moves-list', onMoveItemClick.bind(null, 'user'), gameSetup.board, gameHistory, settings.boardSize)
})


// setNewBtnListener()