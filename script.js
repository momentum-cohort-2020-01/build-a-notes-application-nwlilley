
const apiUrl = 'http://localhost:3000/notes/'
function print (value) {
  console.log(value)
  return value
}

function q (selector) {
  return document.querySelector(selector)
}

function getAllNotes () {
  return fetch(apiUrl,
    { method: 'GET' })
    .then(response => response.json())
}

function createNotesHTML (notes) {
  let notesStr = '<ul id= "notes-list">'
  for (const note of notes) {
    notesStr += createNoteHTML(note)
  }
  notesStr += '</ul>'
  return notesStr
}

function createNoteHTML (note) {
  return `<li data-note-id="${note.id}"><p class='note-content'>${note.note}</p><div class='date'>Created on ${note.created}</div><button class='delete'>Delete</button> <button class='edit'>Edit</button></li>`
}

function postNewNote (noteText) {
  return fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ note: noteText, done: false, created: moment().format('ddd, MMM Do h:mm A') })
  })
    .then(response => response.json())
}

function renderNotesList (notes) {
  const notesHTML = createNotesHTML(notes)
  const notesSection = q('#notes')
  notesSection.innerHTML = notesHTML
}

// WHAT IS THIS DOING?
function renderNewNote (note) {
  const noteHTML = createNoteHTML(note)
  const notesList = q('#notes-list')
  notesList.insertAdjacentHTML('beforeend', noteHTML)
}

getAllNotes().then(renderNotesList)

q('#new-note-form').addEventListener('submit', event => {
  // event.preventDefault()
  const noteTextField = q('#note-text')
  const noteText = noteTextField.value
  noteTextField.value = ''
  postNewNote(noteText).then(renderNewNote)
})

q('#notes').addEventListener('click', event => {
  if (event.target.matches('.delete')) {
    print('delete ' + event.target.parentElement.dataset.noteId)
    return fetch((apiUrl + event.target.parentElement.dataset.noteId),
      { method: 'DELETE' })
  }
})

function addSubmitEditButton (note) {
  const submitEditButton = document.createElement('button')
  const editButton = note.querySelector('.edit')
  submitEditButton.classList.add('submit-edit')
  submitEditButton.innerText = 'Submit Edit'
  editButton.parentNode.replaceChild(submitEditButton, editButton)
}

function replaceEditButton (note) {
  const newEditButton = document.createElement('button')
  const submitEditButton = note.querySelector('.submit-edit')
  newEditButton.classList.add('edit')
  newEditButton.innerText = 'Edit'

  submitEditButton.parentNode.replaceChild(newEditButton, submitEditButton)
}

// function addEditDate () {
//   const editDateField = document.createElement('div')
//   const createdDateField = event.target.parentElement.querySelector('.date')
//   editDateField.classList.add('edited')
//   editDateField.innerHTML = `<em>Edited on ${moment().format('ddd, MMM Do h:mm A')}</em>`
//   createdDateField.appendChild(editDateField)
// }

q('#notes').addEventListener('click', event => {
  if (event.target.matches('.edit')) {
    event.preventDefault()
    const noteIndex = event.target.parentElement.dataset.noteId

    print('edit ' + noteIndex)
    const listDiv = event.target.parentElement
    print(listDiv)
    const noteField = event.target.parentElement.querySelector('p')
    const editTextField = document.createElement('textarea')
    editTextField.textContent = noteField.textContent
    editTextField.classList.add('edit-text-field')
    noteField.parentNode.replaceChild(editTextField, noteField)
    addSubmitEditButton(listDiv)
    // SUBMIT EDIT
    q('#notes').addEventListener('click', event => {
      event.preventDefault()
      if (event.target.matches('.submit-edit')) {
        const newEditContent = editTextField.value
        noteField.textContent = newEditContent
        editTextField.parentNode.replaceChild(noteField, editTextField)
        replaceEditButton(listDiv)
        const editDateField = document.createElement('div')
        const createdDateField = listDiv.querySelector('.date')
        editDateField.classList.add('edited')
        editDateField.innerHTML = `<em>Edited on ${moment().format('ddd, MMM Do h:mm A')}</em>`
        createdDateField.appendChild(editDateField)
        return fetch((apiUrl + noteIndex),
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ note: newEditContent, done: false, edited: moment().format('ddd, MMM Do h:mm A') })
          })
          .then(response => response.json())
          .then(function (data) {
            print(data.edited)

            print(noteIndex)
          })
      }
    })
  }
})
