const EntitySchema = require('typeorm').EntitySchema
const rminv = require('../model/RmInv').RmInv

module.exports = new EntitySchema({
  name: 'rminv',
  target: rminv,
  columns: {
    rminvid: {
      primary: true,
      type: 'integer',
      gernated: true
    },
    monthyear: {
      type: 'character'
    },
    rmtype: {
      type: 'character varying'
    },
    '1': {
      type: 'smallint'
    },
    '2': {
      type: 'smallint'
    },
    '3': {
      type: 'smallint'
    },
    '4': {
      type: 'smallint'
    },
    '5': {
      type: 'smallint'
    },
    '6': {
      type: 'smallint'
    },
    '7': {
      type: 'smallint'
    },
    '8': {
      type: 'smallint'
    },
    '9': {
      type: 'smallint'
    },
    '10': {
      type: 'smallint'
    },
    '11': {
      type: 'smallint'
    },
    '12': {
      type: 'smallint'
    },
    '13': {
      type: 'smallint'
    },
    '14': {
      type: 'smallint'
    },
    '15': {
      type: 'smallint'
    },
    '16': {
      type: 'smallint'
    },
    '17': {
      type: 'smallint'
    },
    '18': {
      type: 'smallint'
    },
    '19': {
      type: 'smallint'
    },
    '20': {
      type: 'smallint'
    },
    '21': {
      type: 'smallint'
    },
    '22': {
      type: 'smallint'
    },
    '23': {
      type: 'smallint'
    },
    '24': {
      type: 'smallint'
    },
    '25': {
      type: 'smallint'
    },
    '26': {
      type: 'smallint'
    },
    '27': {
      type: 'smallint'
    },
    '28': {
      type: 'smallint'
    },
    '29': {
      type: 'smallint'
    },
    '30': {
      type: 'smallint'
    },
    '31': {
      type: 'smallint'
    }
  }
})
