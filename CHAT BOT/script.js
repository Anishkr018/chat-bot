const rules = [
      {
        pattern: /\bhtml\b/i,
        answer:
          "HTML gives a webpage its structure.\n\n" +
          "Use <h1> for headings, <p> for paragraphs, " +
          "and <button> for buttons.\n\n" +
          "Here, HTML creates the chat window and message box."
      },
      {
        pattern: /\bcss\b/i,
        answer:
          "CSS controls colours, fonts, spacing, layouts, " +
          "and animations.\n\n" +
          "Try changing --accent in style.css to personalize this chatbot!"
      },
      {
        pattern: /\b(javascript|js)\b/i,
        answer:
          "JavaScript makes a webpage interactive.\n\n" +
          "In Orbit, it reads your message, chooses a matching reply, " +
          "and adds message bubbles to the page."
      },
      {
        pattern: /\b(study|plan|learn)\b/i,
        answer:
          "Try a focused 60-minute session:\n\n" +
          "1. Learn one concept for 15 minutes.\n" +
          "2. Build a small example for 30 minutes.\n" +
          "3. Review and fix mistakes for 15 minutes.\n\n" +
          "Today’s challenge: add three new replies to this chatbot."
      },
      {
        pattern: /\b(motivate|motivation|stuck)\b/i,
        answer:
          "You don’t have to understand everything today.\n\n" +
          "Choose one small task, finish it, and build from there. " +
          "Even fixing one bug is progress. 🌱"
      },
      {
        pattern: /\b(joke|funny)\b/i,
        answer:
          "Why do programmers prefer dark mode?\n\n" +
          "Because light attracts bugs! 🐛"
      },
      {
        pattern: /\b(time|date)\b/i,
        answer: () =>
          "Your device’s current date and time:\n" +
          new Date().toLocaleString()
      },
      {
        pattern: /\b(your name|who are you)\b/i,
        answer:
          "I’m Orbit, a rule-based chatbot built with HTML, CSS, " +
          "and JavaScript. Ask me about coding, a study plan, or a joke!"
      },
      {
        pattern: /\bhow are you\b/i,
        answer: "Ready to chat! What are you learning today?"
      },
      {
        pattern: /\b(hi|hello|hey|hlo|namaste)\b/i,
        answer:
          "Hey! 👋 Nice to meet you.\n\n" +
          "We can talk about HTML, CSS, JavaScript, study plans, " +
          "or motivation. What would you like to explore?"
      },
      {
        pattern: /\b(thanks|thank you)\b/i,
        answer: "You’re welcome! Keep experimenting and building. ✨"
      },
      {
        pattern: /\b(bye|goodbye)\b/i,
        answer: "See you later! Good luck with your next project. 👋"
      }
    ];

    // =========================
    // SELECT HTML ELEMENTS
    // =========================
    const form = document.querySelector("#chat-form");
    const input = document.querySelector("#input");
    const sendButton = document.querySelector("#send");
    const messages = document.querySelector("#messages");
    const conversation = document.querySelector("#conversation");
    const welcome = document.querySelector("#welcome");
    const themeButton = document.querySelector("#theme");

    let busy = false;
    let replyTimer = null;

    // =========================
    // FIND A MATCHING REPLY
    // =========================
    function getReply(text) {
      const rule = rules.find(item => item.pattern.test(text));

      if (!rule) {
        return (
          "I don’t have a reply for that yet. I’m a rule-based demo.\n\n" +
          "Try asking about HTML, CSS, JavaScript, a study plan, or a joke."
        );
      }

      return typeof rule.answer === "function"
        ? rule.answer()
        : rule.answer;
    }

    function scrollToLatest() {
      conversation.scrollTop = conversation.scrollHeight;
    }

    // =========================
    // CREATE A MESSAGE BUBBLE
    // =========================
    function addMessage(text, sender) {
      const row = document.createElement("div");
      row.className = `message ${sender}`;

      if (sender === "bot") {
        const avatar = document.createElement("div");

        avatar.className = "avatar";
        avatar.textContent = "✳";
        avatar.setAttribute("aria-hidden", "true");

        row.appendChild(avatar);
      }

      const bubble = document.createElement("div");
      bubble.className = "bubble";

      const label = document.createElement("span");
      label.className = "label";
      label.textContent = sender === "bot" ? "Orbit" : "You";

      const content = document.createElement("span");

      // Display messages as text, not executable HTML.
      content.textContent = text;

      bubble.append(label, content);
      row.appendChild(bubble);
      messages.appendChild(row);

      scrollToLatest();
    }

    // =========================
    // SHOW TYPING ANIMATION
    // =========================
    function showTyping() {
      const row = document.createElement("div");

      row.className = "message";
      row.setAttribute("role", "status");
      row.setAttribute("aria-label", "Orbit is typing");

      const bubble = document.createElement("div");
      bubble.className = "bubble";

      const dots = document.createElement("div");
      dots.className = "dots";
      dots.setAttribute("aria-hidden", "true");

      for (let i = 0; i < 3; i++) {
        dots.appendChild(document.createElement("i"));
      }

      bubble.appendChild(dots);
      row.appendChild(bubble);
      messages.appendChild(row);

      scrollToLatest();

      return row;
    }

    function updateSendButton() {
      sendButton.disabled = busy || !input.value.trim();
    }

    // =========================
    // SEND MESSAGE AND REPLY
    // =========================
    function sendMessage(text) {
      const message = text.trim();

      if (!message || busy) {
        return;
      }

      busy = true;
      welcome.hidden = true;

      addMessage(message, "user");

      input.value = "";
      updateSendButton();

      const indicator = showTyping();

      replyTimer = setTimeout(() => {
        indicator.remove();

        addMessage(getReply(message), "bot");

        busy = false;
        replyTimer = null;

        updateSendButton();
      }, 850);
    }

    // Send button and Enter key.
    form.addEventListener("submit", event => {
      event.preventDefault();

      sendMessage(input.value);
      input.focus();
    });

    input.addEventListener("input", updateSendButton);

    // =========================
    // QUICK-REPLY BUTTONS
    // =========================
    document.querySelectorAll("[data-prompt]").forEach(button => {
      button.addEventListener("click", () => {
        sendMessage(button.dataset.prompt);
        input.focus();
      });
    });

    // =========================
    // DARK / LIGHT MODE
    // =========================
    themeButton.addEventListener("click", () => {
      const light = document.body.classList.toggle("light");

      themeButton.textContent = light ? "☾" : "☀";

      themeButton.setAttribute(
        "aria-label",
        light ? "Switch to dark mode" : "Switch to light mode"
      );
    });

    // =========================
    // START A NEW CHAT
    // =========================
    document.querySelector("#reset").addEventListener("click", () => {
      clearTimeout(replyTimer);

      replyTimer = null;
      busy = false;

      messages.replaceChildren();
      welcome.hidden = false;
      input.value = "";

      updateSendButton();

      conversation.scrollTop = 0;
      input.focus();
    });