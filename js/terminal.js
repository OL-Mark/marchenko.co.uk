class Terminal {
  constructor() {
    this.content = document.getElementById('terminal-content');
    this.currentLine = null;
    this.commandHistory = [];
    this.historyIndex = -1;
    this.files = [
      'about-me.html',
      'README.txt'
    ];
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
    prompt.textContent = 'visitor:~$ ';

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
        output.innerHTML = this.files.map(file => `<div>${file}</div>`).join('');
        break;

      case 'cat about-me.html':
      case 'cat ./about-me.html':
        this.loadFileContent('about-me.html', output);
        break;

      case 'cat readme.txt':
      case 'cat ./readme.txt':
        this.loadFileContent('README.txt', output);
        break;

      case 'help':
        output.innerHTML = `
          <div>Available commands:</div>
          <div>  ls - List files</div>
          <div>  cat &lt;filename&gt; - Display file content</div>
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


  loadFileContent(filename, outputElement) {
    fetch(`files/${filename}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`File not found: ${filename}`);
        }
        return response.text();
      })
      .then(content => {
        if (filename.endsWith('.html')) {
          // Extract content from HTML file
          const parser = new DOMParser();
          const doc = parser.parseFromString(content, 'text/html');
          const aboutMeDiv = doc.querySelector('.about-me');
          if (aboutMeDiv) {
            outputElement.innerHTML = aboutMeDiv.outerHTML;
          } else {
            outputElement.innerHTML = `<div class="error">Could not parse HTML content</div>`;
          }
        } else {
          // Display text content as-is
          outputElement.innerHTML = `<pre>${content}</pre>`;
        }
        this.content.appendChild(outputElement);
        this.createNewLine();
      })
      .catch(error => {
        outputElement.className = 'error';
        outputElement.textContent = error.message;
        this.content.appendChild(outputElement);
        this.createNewLine();
      });
  }

  scrollToBottom() {
    this.content.scrollTop = this.content.scrollHeight;
  }
}

// Initialize terminal when page loads
document.addEventListener('DOMContentLoaded', () => {
  new Terminal();
});
