// Game UI

import { TILE_STATUSES, createBoard, markTile, revealTile, checkWin, checkLose } from "./minesweeper.js";

const BOARD_SIZE = 10
const NUMBER_OF_MINES = 2

const board = createBoard(BOARD_SIZE, NUMBER_OF_MINES)
const boardElement = document.querySelector('.board')
const minesLeft = document.querySelector('[data-mine-count]')
const message = document.querySelector('[data-mine-count]')
const messageText = document.querySelector('.subtext')

board.forEach(row => {
    row.forEach(tile=> {
        boardElement.append(tile.element)
        // listen for left clicks
        tile.element.addEventListener('click', () => {
            revealTile(board, tile)
            checkGameState()
        })
        // listen for right clicks
        tile.element.addEventListener('contextmenu', e => {
            // prevent popup menu
            e.preventDefault()
            markTile(tile)
            listMinesLeft()
        })
    })
})
boardElement.style.setProperty("--size", BOARD_SIZE)
minesLeft.textContent = NUMBER_OF_MINES

function listMinesLeft() {
    const markedTilesCount = board.reduce((count, row) => {
        // return the number of marked tiles but filtering all marked tiles and counting how many there are
        return count + row.filter(tile => tile.status === TILE_STATUSES.MARKED).length
    }, 0)

    minesLeft.textContent = NUMBER_OF_MINES - markedTilesCount
}

function checkGameState() {
    const win = checkWin(board)
    const lose = checkLose(board)

    if (win || lose) {
        boardElement.addEventListener('click', stopProp, {capture: true})
        boardElement.addEventListener('contextmenu', stopProp, {capture: true})
    }

    if (win) {
        messageText.textContent = 'You win'
    }
    if (lose) {
        messageText.textContent = 'You lose'
        board.forEach(row => {
            row.forEach(tile => {
                if (tile.status === TILE_STATUSES.MINE) markTile(tile)
                if (tile.mine) revealTile(board, tile)
            })
        })
    }
}

function stopProp(e) {
    e.stopImmediatePropagation()
}