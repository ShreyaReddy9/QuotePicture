document.querySelectorAll('.card').forEach(card => {
  attachFlipListeners(card);
});

function saveMemory(event, button) {
  event.stopPropagation();

  const cardBack = button.parentElement;
  const memoryInput = cardBack.querySelector('.memory-input');
  const memoryQuote = cardBack.querySelector('.memory-quote');

  const newMemory = memoryInput.value.trim();
  if (newMemory !== "") {
    const card = cardBack.parentElement.parentElement;
    const cardId = card.getAttribute('data-id');

    localStorage.setItem(cardId, newMemory);
    memoryQuote.innerText = newMemory;
    memoryInput.style.display = "none";
    button.style.display = "none";
  }
}

function enableEdit(quoteElement) {
  const cardBack = quoteElement.parentElement;
  const memoryInput = cardBack.querySelector('.memory-input');
  const saveButton = cardBack.querySelector('button');

  memoryInput.style.display = "block";
  saveButton.style.display = "inline-block";
  memoryInput.value = quoteElement.innerText;
  quoteElement.innerText = "";
}

function addNewCard() {
  const fileInput = document.getElementById('imageUpload');
  const memoryText = document.getElementById('memoryText').value.trim();

  if (!fileInput.files[0]) {
    alert("Please select an image.");
    return;
  }

  const formData = new FormData();
  formData.append('image', fileInput.files[0]);
  formData.append('memory', memoryText);

  fetch('http://localhost:5000/upload', {
    method: 'POST',
    body: formData,
  })
  .then(res => res.json())
  .then(data => {
    const newId = `memory${Date.now()}`;
    const gallery = document.querySelector('.gallery');
    const newCard = document.createElement('div');
    newCard.className = "card";
    newCard.setAttribute('data-id', newId);

    newCard.innerHTML = `
      <div class="card-inner">
        <div class="card-front">
          <img src="${data.imageUrl}" alt="User Uploaded Memory">
        </div>
        <div class="card-back">
          <h3>Memory Date: ${new Date().toLocaleDateString()}</h3>
          <p class="memory-quote" onclick="enableEdit(this)">${data.memory}</p>
          <input type="text" placeholder="Type your memory..." class="memory-input" style="display: none;">
          <button onclick="saveMemory(event, this)" style="display: none;">Save</button>
        </div>
      </div>
    `;

    gallery.appendChild(newCard);
    attachFlipListeners(newCard); // ✅ NEW: Attach flipping behavior to new card
  });
}

function attachFlipListeners(card) {
  const cardInner = card.querySelector('.card-inner');

  card.addEventListener('click', () => {
    if (!cardInner.classList.contains('flipped')) {
      cardInner.classList.add('flipped');

      const cardId = card.getAttribute('data-id');
      const storedMemory = localStorage.getItem(cardId);

      if (storedMemory) {
        const memoryQuote = card.querySelector('.memory-quote');
        const memoryInput = card.querySelector('.memory-input');
        const saveButton = card.querySelector('button');

        memoryQuote.innerText = storedMemory;
        memoryInput.style.display = "none";
        saveButton.style.display = "none";
      }
    }
  });

  card.addEventListener('dblclick', () => {
    if (cardInner.classList.contains('flipped')) {
      cardInner.classList.remove('flipped');
    }
  });
}

window.addEventListener('DOMContentLoaded', () => {
  fetch('http://localhost:5000/images')
    .then(res => res.json())
    .then(images => {
      const gallery = document.querySelector('.gallery');

      images.forEach((img, index) => {
        const newCard = document.createElement('div');
        newCard.className = "card";
        newCard.setAttribute('data-id', `memory_preloaded_${index}`);

        newCard.innerHTML = `
          <div class="card-inner">
            <div class="card-front">
              <img src="${img.imageUrl}" alt="Uploaded Memory">
            </div>
            <div class="card-back">
              <h3>Memory Date: ${new Date().toLocaleDateString()}</h3>
              <p class="memory-quote" onclick="enableEdit(this)">${img.memory}</p>
              <input type="text" placeholder="Type your memory..." class="memory-input" style="display: none;">
              <button onclick="saveMemory(event, this)" style="display: none;">Save</button>
            </div>
          </div>
        `;

        gallery.appendChild(newCard);
        attachFlipListeners(newCard);
      });
    });
});
