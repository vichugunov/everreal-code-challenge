import { IConstants } from '../interfaces'

const constants: IConstants = {
  colors: [ 'red', 'green', 'blue' ],
  boardSize: 10
}

export const getConstants = (): IConstants => {
  return constants
}