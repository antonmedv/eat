#!/usr/bin/env node
import fs from 'node:fs'
import eat from './index.js'
import print from './print.js'

void async function main() {
  let text = ''
  if (!process.stdin.isTTY) {
    process.stdin.setEncoding('utf8')
    for await (const chunk of process.stdin) {
      text += chunk
    }
  }

  let apples = [...process.argv.slice(2).map(file => fs.readFileSync(file).toString())]
  if (text !== '') {
    apples.unshift(text)
  }

  if (apples.length === 0) {
    console.log(`usage: eat [file...]`)
    return
  }

  let oranges = apples.map(eat)
  if (oranges.length === 1) {
    oranges = oranges[0]
  }

  console.log(print(oranges))
}().catch(console.error)
