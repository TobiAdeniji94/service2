const ws = new WebSocket('ws://service2-virid.vercel.app/');

// Get HTML elements
const inputField = document.getElementById('inputField');
const submitBtn = document.getElementById('submitBtn');
const toggleErrorBtn = document.getElementById('toggleErrorBtn');

// Sends interaction event when the submit button is clicked
submitBtn.addEventListener('click', () => {
  const content = inputField.value;
  if (content) {
    const interactionEvent = {
      type: 'event.interaction',
      data: content,
    };
    ws.send(JSON.stringify(interactionEvent));
    inputField.value = ''; // Clear the input field after sending
  }
});

// Sends error event when the toggle error button is clicked
toggleErrorBtn.addEventListener('click', () => {
  const errorEvent = {
    type: 'event.error',
    data: Math.random().toString(36).substr(2, 9), // Generate a random string
  };
  ws.send(JSON.stringify(errorEvent));
});
