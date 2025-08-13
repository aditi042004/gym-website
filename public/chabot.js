// chatbot.js
// Ensure responsiveVoice.min.js is loaded in index.html before this script

let voiceEnabled = true; // Initial state for voice

function toggleVoice() {
  voiceEnabled = !voiceEnabled;
  console.log(`Voice replies ${voiceEnabled ? 'enabled' : 'disabled'}`);
  
  // Optional: Update button text/style based on state
  const voiceButton = document.querySelector('.chat-input button:last-child');
  if (voiceButton) {
      voiceButton.textContent = voiceEnabled ? '🔊 ON' : '🔊';
      // Assuming these CSS variables exist in styles.css for coloring the button
      voiceButton.style.backgroundColor = voiceEnabled ? 'var(--chat-hover)' : 'var(--chat-primary)'; 
  }

  if (typeof responsiveVoice !== 'undefined') {
      if (voiceEnabled) {
          responsiveVoice.speak("Voice output enabled.", 'UK English Male');
      } else {
          responsiveVoice.cancel(); // Stop any ongoing speech
      }
  }
}

// The goBack function is usually for separate chatbot pages; it's not directly
// used in a floating popup scenario within a single page. It is kept here
// for completeness based on your original file.
function goBack() {
  window.location.href = "index.html";
}

async function sendMessage() {
  const input = document.getElementById('userInput');
  const text = input.value.trim();
  if (!text) return; // Do not send empty messages

  const chatBody = document.getElementById('chatBody');

  // Display user's message immediately
  const userMsg = document.createElement('div');
  userMsg.className = 'chat-message user';
  userMsg.innerText = text;
  chatBody.appendChild(userMsg);
  input.value = ''; // Clear input field

  // Add a "Typing..." indicator for the bot
  const botMsg = document.createElement('div');
  botMsg.className = 'chat-message bot';
  botMsg.innerText = 'Typing...'; 
  chatBody.appendChild(botMsg);

  // Scroll to the bottom to show the latest message/indicator
  chatBody.scrollTop = chatBody.scrollHeight;

  try {
    // Prepare chat history for the API call (only sending the current user message for this turn)
    let chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: text }] });
    
    // Construct the payload for the Gemini API (as per previous instructions)
    const payload = { contents: chatHistory };
    
    // API Key will be automatically provided by the Canvas environment if left empty
    const apiKey = ""; 
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    // Make the API call to Gemini
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    const result = await response.json();

    // Remove the "Typing..." indicator
    chatBody.removeChild(botMsg);

    // Update the bot's message with the actual response or an error message
    const finalBotMsg = document.createElement('div');
    finalBotMsg.className = 'chat-message bot';

    if (result.candidates && result.candidates.length > 0 &&
        result.candidates[0].content && result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0) {
        const botResponseText = result.candidates[0].content.parts[0].text;
        finalBotMsg.innerText = botResponseText;
    } else {
        // Handle cases where the API response structure is unexpected or content is missing
        finalBotMsg.innerText = 'Sorry, I could not get a valid response from the AI. Please try again.';
        console.error('API response structure unexpected or empty:', result);
    }
    chatBody.appendChild(finalBotMsg);

    // Speak the bot's response if voice is enabled and ResponsiveVoice library is loaded
    if (voiceEnabled && typeof responsiveVoice !== 'undefined') {
      responsiveVoice.speak(finalBotMsg.innerText, 'UK English Male');
    }
  } catch (err) {
    // Handle network errors or other exceptions during the fetch call
    chatBody.removeChild(botMsg); // Remove typing indicator even on error
    const errorBotMsg = document.createElement('div');
    errorBotMsg.className = 'chat-message bot';
    errorBotMsg.innerText = 'An error occurred while connecting to the AI. Please check your network or try again later.';
    chatBody.appendChild(errorBotMsg);
    console.error('Fetch error during API call:', err);
  }

  // Ensure scroll to bottom after receiving and displaying bot's message
  chatBody.scrollTop = chatBody.scrollHeight;
}
