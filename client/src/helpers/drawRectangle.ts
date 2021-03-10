import { GameBoard, Vertex } from '../interfaces'

export interface IRectangeProps {
  board: GameBoard
  connectedVertices: Array<Vertex>
  boardSize: number
  canvasSize?: number
  selector: string
}

const defaultCanvasSize = 300

export const drawRectange = ({ board, connectedVertices, boardSize, canvasSize, selector }: IRectangeProps): void => {
  const canvasSelector = selector
  const canvas = document.querySelector(canvasSelector)
  const margin = 1
  const ordinaryStrokeColor = 'lightgray'
  const borderStrokeColor = 'black'
  canvasSize = canvasSize || defaultCanvasSize

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