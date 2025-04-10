import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';



const synth = window.speechSynthesis;
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

function App() {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('chat-history');
    return saved ? JSON.parse(saved) : [{ text: 'Hi! Ask me anything.', sender: 'bot' }];
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('chat-history', JSON.stringify(messages));
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [messages]);

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
  };
  const handleBotResponse = async (userInput) => {
    setLoading(true);
    try {
      let botReply = "I'm not connected to AI, but I can pretend! 😄";
      const input = userInput.toLowerCase();
  
      if (input.includes("hello")) {
        botReply = "Hello there! How can I help you today?";
      } else if (input.includes("react")) {
        botReply = "React is a JavaScript library for building fast and interactive user interfaces.";
      } else if (input.includes("java")) {
        botReply = "Java is a high-level, class-based, object-oriented programming language that's designed to have as few implementation dependencies as possible.";
      } else if (input.includes("python")) {
        botReply = "Python is an interpreted, high-level programming language with dynamic semantics, great for automation, AI, and data science.";
      } else if (input.includes("javascript")) {
        botReply = "JavaScript is the language of the web! It's used to make websites interactive and dynamic.";
      } else if (input.includes("about")) {
        botReply = "I'm a friendly chatbot built using React! I can answer your questions and even open apps for you.";
      } else if (input.includes("open google")) {
        botReply = "OK sir, opening Google.";
        window.open("https://www.google.com", "_blank");
      } else if (input.includes("open youtube")) {
        botReply = "Opening YouTube for you!";
        window.open("https://www.youtube.com", "_blank");
      } else if (input.includes("open github")) {
        botReply = "Opening GitHub!";
        window.open("https://www.github.com", "_blank");
      } else if (input.includes("bye")) {
        botReply = "Goodbye! Have a great day!";
      }
  
      setTimeout(() => {
        setMessages(prev => [...prev, { text: botReply, sender: 'bot' }]);
        speak(botReply);
        setLoading(false);
      }, 800); // Simulated delay
    } catch (err) {
      setMessages(prev => [...prev, { text: "⚠️ Something went wrong!", sender: 'bot' }]);
      setLoading(false);
    }
  };
  
  const sendMessage = () => {
    if (!input.trim()) return;
    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    handleBotResponse(input);
    setInput('');
  };

  const startVoiceInput = () => {
    if (!recognition) return alert("Speech Recognition not supported in this browser.");
    recognition.start();
    recognition.onresult = (e) => {
      const speech = e.results[0][0].transcript;
      setInput(speech);
    };
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>🤖 React ChatBot</div>
      <div ref={chatRef} style={styles.chatBox}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              ...styles.message,
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              background: msg.sender === 'user' ? '#daf1ff' : '#f1f1f1'
            }}
          >
            <ReactMarkdown>{msg.text}</ReactMarkdown>
          </div>
        ))}
        {loading && (
          <div style={{ ...styles.message, fontStyle: 'italic', color: '#888' }}>Typing...</div>
        )}
      </div>
      <div style={styles.inputBox}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Type or speak..."
          style={styles.input}
        />
        <button onClick={startVoiceInput} style={styles.mic}>🎤</button>
        <button onClick={sendMessage} style={styles.button}>Send</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'Arial',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    padding: 20,
    background: '#f9f9f9'
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10
  },
  chatBox: {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    padding: 10,
    borderRadius: 10,
    background: '#fff',
    boxShadow: '0 0 10px rgba(0,0,0,0.05)'
  },
  message: {
    maxWidth: '75%',
    padding: 10,
    borderRadius: 10,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word'
  },
  inputBox: {
    display: 'flex',
    gap: 10,
    marginTop: 10
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    borderRadius: 5,
    border: '1px solid #ccc'
  },
  button: {
    padding: '10px 20px',
    fontSize: 16,
    borderRadius: 5,
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none'
  },
  mic: {
    padding: '10px 10px',
    fontSize: 18,
    borderRadius: 5,
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none'
  }
};

export default App;
