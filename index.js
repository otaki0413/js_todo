// DOM要素取得
const todoInput = document.querySelector('.todo-input')
const todoList = document.querySelector('.todo-list')
const todoAllCount = document.querySelector('.todo-all-count')
const todoDoneCount = document.querySelector('.todo-done-count')
const todoUndoneCount = document.querySelector('.todo-undone-count')
const todoAddButton = document.querySelector('.todo-add-button')

// Todo格納用の配列
const todos = []
// ステータス数の初期更新
updateCounts()
// 追加ボタン押下時の処理
todoAddButton.addEventListener('click', addTodo)

/**
 * TODO追加処理
 */
function addTodo() {
  // 入力値取得
  const newTodoText = todoInput.value.trim()
  if (!newTodoText) {
    alert('タスクを入力してください')
    return
  }
  // todoを特定するユニークなID生成
  const todoId = generateUniqueId()

  // todo表示用のli要素作成
  const todoItemElement = createTodoItemElement(newTodoText, todoId)
  todoList.appendChild(todoItemElement)

  // todoをオブジェクト形式で配列に格納
  const todo = { id: todoId, text: newTodoText, completed: false }
  todos.push(todo)

  // 後処理
  updateCounts()
  todoInput.value = ''
  todoInput.focus()
}

/**
 * TODOの完了・未完了の切替処理
 * @param {string} id TODOを特定するユニークID
 */
function toggleTodo(id) {
  const todo = todos.find((todo) => todo.id === id)
  if (todo === undefined) {
    alert('対象のTODOは見つかりません')
    return
  }
  todo.completed = !todo.completed
  updateCounts()
}

/**
 * TODOリストのli要素を生成する処理
 * @param {string} todoText TODOテキスト
 * @param {string} id TODOを特定するユニークID
 * @returns TODOリストのli要素
 */
function createTodoItemElement(todoText, id) {
  const todoItem = document.createElement('li')
  todoItem.id = id
  todoItem.classList.add('todo-item')

  const checkbox = document.createElement('input')
  checkbox.type = 'checkbox'
  checkbox.classList.add('todo-checkbox')
  checkbox.addEventListener('change', () => toggleTodo(id))

  const todoTextSpan = document.createElement('span')
  todoTextSpan.classList.add('todo-text')
  todoTextSpan.textContent = todoText

  const buttonArea = document.createElement('div')
  buttonArea.classList.add('todo-button-area')

  const editButton = createButton('編集', 'todo-edit-button')
  const deleteButton = createButton('削除', 'todo-delete-button')
  buttonArea.append(editButton, deleteButton)
  todoItem.append(checkbox, todoTextSpan, buttonArea)

  return todoItem
}

/**
 * button要素を作成する関数
 * @param {string} text ボタンテキスト
 * @param {string} className CSSクラス名
 * @returns button要素
 */
function createButton(text, className) {
  const button = document.createElement('button')
  button.textContent = text
  button.classList.add('button', className)
  return button
}

/**
 * TODOリストの各ステータス数を更新する関数
 */
function updateCounts() {
  todoAllCount.textContent = todos.length
  todoDoneCount.textContent = todos.filter((todo) => todo.completed).length
  todoUndoneCount.textContent = todos.filter((todo) => !todo.completed).length
}

/**
 * TODOアイテムを特定するためのユニークなIDを生成する処理
 */
function generateUniqueId() {
  return `todo-id-${Date.now()}`
}
