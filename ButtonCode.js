// Create button element
const button = document.createElement('button');
button.textContent = 'Submit File';
button.style.backgroundColor = 'green';
button.style.color = 'white';
button.style.padding = '5px';
button.style.border = 'none';
button.style.borderRadius = '5px';
button.style.margin = '5px';

// Create progress element
const progress = document.createElement('progress');
progress.style.width = '99%';
progress.style.height = '5px';
progress.style.backgroundColor = 'grey';

// Create progress bar inside progress element
const progressBar = document.createElement('div');
progressBar.style.width = '0%';
progressBar.style.height = '100%';
progressBar.style.backgroundColor = 'blue';

// Append progress bar to progress element
progress.appendChild(progressBar);

// Find target element to insert before
const targetElement = document.querySelector('.flex.flex-col.w-full.py-2.flex-grow.md\\:py-3.md\\:pl-4');

// Insert button and progress element before the target element
targetElement.parentNode.insertBefore(button, targetElement);
targetElement.parentNode.insertBefore(progress, targetElement);

// File submission functionality
button.addEventListener('click', async () => {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.txt, .js, .py, .html, .css, .json, .csv, .ts';

  fileInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    const fileName = file.name;

    const reader = new FileReader();
    reader.onload = async () => {
      const fileContent = reader.result;
      const chunkSize = 15000;
      const numChunks = Math.ceil(fileContent.length / chunkSize);

      for (let i = 0; i < numChunks; i++) {
        const start = i * chunkSize;
        const end = (i + 1) * chunkSize;
        const chunk = fileContent.slice(start, end);
        const part = i + 1;

        await submitConversation(chunk, part, fileName);

        progressBar.style.width = `${((i + 1) / numChunks) * 100}%`;
      }

      progressBar.style.backgroundColor = 'blue';
    };

    reader.readAsText(file);
  });

  fileInput.click();
});

// Function to submit conversation
async function submitConversation(text, part, filename) {
  const textarea = document.querySelector('textarea[tabindex="0"]');
  const enterKeyEvent = new KeyboardEvent('keydown', {
    bubbles: true,
    cancelable: true,
    keyCode: 13,
  });
  textarea.value = `Part ${part} of ${filename}:\n\n${text}`;
  textarea.dispatchEvent(enterKeyEvent);

  // Check if ChatGPT is ready
  let chatgptReady = false;
  while (!chatgptReady) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    chatgptReady = !document.querySelector('.text-2xl > span:not(.invisible)');
  }
}
