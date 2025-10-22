class Terminal {
  constructor() {
    this.content = document.getElementById('terminal-content');
    this.currentLine = null;
    this.commandHistory = [];
    this.historyIndex = -1;
    this.init();
  }

  init() {
    this.createNewLine();
    this.focus();

    // Add event listeners
    document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    document.addEventListener('click', () => this.focus());
  }

  createNewLine() {
    const line = document.createElement('div');
    line.className = 'terminal-line';

    const prompt = document.createElement('span');
    prompt.className = 'prompt';
    prompt.textContent = '/home/visitor:~$ ';

    const input = document.createElement('input');
    input.className = 'command-input';
    input.type = 'text';
    input.autocomplete = 'off';
    input.spellcheck = false;

    line.appendChild(prompt);
    line.appendChild(input);

    this.content.appendChild(line);
    this.currentLine = line;
    input.focus();

    // Auto-scroll to bottom
    this.scrollToBottom();
  }

  handleKeyDown(e) {
    const input = this.currentLine.querySelector('.command-input');

    if (e.key === 'Enter') {
      e.preventDefault();
      this.executeCommand(input.value.trim());
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.navigateHistory(-1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.navigateHistory(1);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      this.handleTabCompletion(input.value);
    }
  }

  executeCommand(command) {
    if (!command) {
      this.createNewLine();
      return;
    }

    // Add command to history
    this.commandHistory.push(command);
    this.historyIndex = this.commandHistory.length;

    // Hide input, show command
    const input = this.currentLine.querySelector('.command-input');
    input.style.display = 'none';

    const commandSpan = document.createElement('span');
    commandSpan.textContent = command;
    this.currentLine.appendChild(commandSpan);

    // Process command
    this.processCommand(command);
  }

  processCommand(command) {
    const output = document.createElement('div');
    output.className = 'output';

    switch (command.toLowerCase()) {
      case 'ls':
        output.innerHTML = `
          <div>about-me.txt</div>
        `;
        break;

      case 'cat about-me':
      case 'cat about-me.txt':
      case 'cat ./about-me.txt':
        output.innerHTML = `
          <div class="about-me">
            <h2>Oleksandr Marchenko</h2>
            <p>Software Developer</p>
            <p>I'm open to new job opportunities within UK and the rest of Europe.</p>
            <p>Feel free to contact me on these services:</p>
            <ul>
              <li>LinkedIn: <a href="https://www.linkedin.com/in/alrmarchenko/" target="_blank">@alrmarchenko</a></li>
              <li>Facebook: <a href="https://www.facebook.com/olek.marchenko" target="_blank">@olek.marchenko</a></li>
            </ul>
          </div>
        `;
        break;

      case 'help':
        output.innerHTML = `
          <div>Available commands:</div>
          <div>  ls - List files</div>
          <div>  cat about-me.txt - Display about-me content</div>
          <div>  help - Show this help message</div>
          <div>  clear - Clear terminal</div>
        `;
        break;

      case 'clear':
        this.content.innerHTML = '';
        this.createNewLine();
        return;

      default:
        output.className = 'error';
        output.textContent = `Command not found: ${command}. Type 'help' for available commands.`;
    }

    this.content.appendChild(output);
    this.createNewLine();
  }

  navigateHistory(direction) {
    if (this.commandHistory.length === 0) return;

    this.historyIndex += direction;

    if (this.historyIndex < 0) {
      this.historyIndex = 0;
    } else if (this.historyIndex >= this.commandHistory.length) {
      this.historyIndex = this.commandHistory.length;
    }

    const input = this.currentLine.querySelector('.command-input');
    if (this.historyIndex === this.commandHistory.length) {
      input.value = '';
    } else {
      input.value = this.commandHistory[this.historyIndex];
    }
  }

  handleTabCompletion(input) {
    const inputValue = input.value.toLowerCase();
    if (inputValue === '' || inputValue === 'cat ') {
      input.value = 'cat about-me';
    }
  }

  focus() {
    const input = this.currentLine?.querySelector('.command-input');
    if (input) {
      input.focus();
    }
  }


  scrollToBottom() {
    this.content.scrollTop = this.content.scrollHeight;
  }
}

// Initialize terminal when page loads
document.addEventListener('DOMContentLoaded', () => {
  new Terminal();
});
