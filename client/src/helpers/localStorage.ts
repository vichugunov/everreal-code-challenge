import { IConstants, IGameStat } from './../interfaces'

const keys = {
  settings: 'settings'
}

export const getLsSettings = (): IConstants | null => {
  const item = localStorage.getItem(keys.settings)
  if (item == null) {
    return null
  }
  return JSON.parse(item)
}

export const setLsSettings = (settings: IConstants): void => {
  return localStorage.setItem(keys.settings, JSON.stringify(settings))
}