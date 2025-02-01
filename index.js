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
 * TODOの編集処理
 * @param {string} id TODOを特定するユニークID
 */
function editTodo(id) {
  // 既存のTODO取得
  const todo = todos.find((todo) => todo.id === id)
  if (todo === undefined) {
    alert('対象のTODOは見つかりません')
    return
  }

  // 既存のTODOのli要素とその関連要素を取得
  const todoItem = document.getElementById(id)
  const checkbox = todoItem.querySelector('.todo-checkbox')
  const todoTextSpan = todoItem.querySelector('.todo-text')
  const editButton = todoItem.querySelector('.todo-edit-button')
  if (checkbox === null || todoTextSpan === null || editButton === null) {
    return
  }

  // 編集用のinput要素作成
  const editTodoInput = document.createElement('input')
  editTodoInput.value = todo.text
  editTodoInput.classList.add('edit-todo-input')

  // 編集ボタン -> 保存ボタンに変更
  editButton.textContent = '保存'
  editButton.classList.remove('todo-edit-button')
  editButton.classList.add('todo-save-button')

  /**
   * 保存ボタン押下時のイベントリスナー
   * MEMO: 参照したい変数が多かったためeditTodo関数内部に関数定義しています
   */
  function saveTodo() {
    // 入力値取得
    const editTodoText = editTodoInput.value.trim()
    if (!editTodoText) {
      alert('タスクを入力してください')
      return
    }

    // 既存のTODO更新
    todo.text = editTodoText
    todoTextSpan.textContent = editTodoText

    // DOMを元の状態に戻す
    editTodoInput.replaceWith(todoTextSpan)
    editButton.textContent = '編集'
    editButton.classList.remove('todo-save-button')
    editButton.classList.add('todo-edit-button')
    editButton.removeEventListener('click', saveTodo)
    editButton.addEventListener('click', () => editTodo(id))
  }

  // 編集イベントリスナー削除と保存イベントリスナー登録
  editButton.removeEventListener('click', () => editTodo(id))
  editButton.addEventListener('click', saveTodo)

  // span要素をinput要素に置き換え
  todoTextSpan.replaceWith(editTodoInput)
  editTodoInput.focus()
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
  editButton.addEventListener('click', () => editTodo(id))

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
