const fs = require('fs')
const _ = require('highland')
const distance = require('gps-distance')
const lodash = require('lodash')

const defaultLocation = [43.078390, -87.897862]

_(fs.createReadStream('data.csv', 'utf8'))
  .split()
  .map(x => x.split(','))
  .filter(x => x[6] === '5')
  .filter(x => (
    distance(...defaultLocation, x[4], x[5]) < 1 // less than 1K
  ))
  .map(x => ({
    district: x[6],
    lat: x[4],
    lon: x[5],
    type: x[7],
    time: x[1],
    street: x[2],
    city: x[3]
  }))
  .reduce({}, (acc, x) => {
    if (lodash.get(acc, x.type)) {
      acc[x.type].count++
      acc[x.type].arr.push(x)
    } else {
      lodash.set(acc, `[${x.type}].count`, 1)
      lodash.set(acc, `[${x.type}].arr`, [x])
    }

    return acc
  })
  .toArray(x => {
    console.log(JSON.stringify(x, undefined, 2))
  })
