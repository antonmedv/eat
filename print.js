import chalk from 'chalk'

export default function print(v, level = 1, visited = new Set()) {
  if (v === null) {
    return chalk.grey.bold('null')
  }
  if (v && v.isLosslessNumber) {
    return chalk.cyan.bold(v.value)
  }
  if (typeof v === 'number' && Number.isFinite(v)) {
    return chalk.cyan.bold(JSON.stringify(v))
  }
  if (typeof v === 'boolean') {
    return chalk.yellow.bold(JSON.stringify(v))
  }
  if (typeof v === 'string') {
    return chalk.green.bold(JSON.stringify(v))
  }
  if (Array.isArray(v)) {
    if (visited.has(v)) return '[]'
    visited.add(v)
    let output = '[\n'
    const len = v.length
    let i = 0
    for (let item of v) {
      if (typeof item === 'undefined') {
        output += '  '.repeat(level) + chalk.grey.bold('null') // JSON.stringify compatibility
      } else {
        output += '  '.repeat(level) + print(item, level + 1, visited)
      }
      output += i++ < len - 1 ? ',\n' : '\n'
    }
    return output + '  '.repeat(level - 1) + ']'
  }
  if (isObject(v)) {
    if (visited.has(v)) return '{}'
    visited.add(v)
    let output = '{\n'
    const entries = Object.entries(v).filter(notUndefined) // JSON.stringify compatibility
    const len = entries.length
    let i = 0
    for (let [key, value] of entries) {
      output += '  '.repeat(level) + chalk.blue.bold(JSON.stringify(key)) + ': ' + print(value, level + 1, visited)
      output += i++ < len - 1 ? ',\n' : '\n'
    }
    return output + '  '.repeat(level - 1) + '}'
  }
  return JSON.stringify(v, null, 2)
}

export function isObject(x) {
  return typeof x === 'object' && !Array.isArray(x) && x !== null
}

function notUndefined([_, value]) {
  return typeof value !== 'undefined'
}
