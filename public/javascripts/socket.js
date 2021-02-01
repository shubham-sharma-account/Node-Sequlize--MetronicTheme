$(document).ready(() => {
  const socket = io.connect('http://localhost:3000');
  let feedback = $('#feedback');
  let message = $('#message');
  let change_message = $('#change_message');

  change_message.click(() => {
    socket.emit('new_message', { message: message.val() })
  })

  socket.on('new_message', (data) => {
    //feedback.html('');
    feedback.append('<p>' + data.username + ':' + data.message + '</p>')
    message.val('')
  })
})