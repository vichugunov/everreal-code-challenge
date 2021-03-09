export function expectFlatArraysEqual<T> (arrayA: Array<T>, arrayB: Array<T>) {
  expect(arrayA).toEqual(expect.arrayContaining(arrayB))
  expect(arrayB).toEqual(expect.arrayContaining(arrayA))
}
export function expectArrayOfArraysEqual<T> (arrayA: Array<Array<T>>, arrayB: Array<Array<T>>) {
  expect(arrayA.length).toEqual(arrayB.length)

  for (let i = 0; i < arrayA.length; i += 1 ) {
    expect(arrayA[i]).toEqual(expect.arrayContaining(arrayB[i]))
    expect(arrayB[i]).toEqual(expect.arrayContaining(arrayA[i]))
  }
}