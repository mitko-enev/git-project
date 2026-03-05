// Клас Song - аналог на Java класа
class Song {
    constructor(name, artist, genre, format, rating, hasVideo) {
        this.name = name;
        this.artist = artist;
        this.genre = genre;
        this.format = format;
        this.rating = rating;
        this.hasVideo = hasVideo;
    }

    // Връща HTML представяне на песента
    toHTML() {
        const stars = '★'.repeat(this.rating) + '☆'.repeat(10 - this.rating);
        const ratingClass = this.rating <= 3 ? 'low' : (this.rating <= 7 ? 'medium' : 'high');
        
        return `
            <div class="song-item">
                <div class="song-title">🎵 ${this.name}</div>
                <div class="song-details">
                    <span>👤 ${this.artist}</span>
                    <span>🎸 ${this.genre}</span>
                    <span>💿 ${this.format}</span>
                    <span class="rating-stars" title="Оценка: ${this.rating}/10">${stars}</span>
                    <span class="badge ${ratingClass}">${this.rating}/10</span>
                    ${this.hasVideo ? '<span class="badge video-badge">🎥 Видео</span>' : ''}
                </div>
            </div>
        `;
    }

    // Връща текстово описание за запис във файл
    toString() {
        return `🎵 ${this.name} | Изпълнител: ${this.artist} | ${this.genre} | ${this.format} | Оценка: ${this.rating}${this.hasVideo ? ' | Видео: да' : ''}\n`;
    }
}

// Масив за съхранение на песните
let songs = [];

// Елементи от DOM
const songNameInput = document.getElementById('songName');
const artistInput = document.getElementById('artist');
const genreSelect = document.getElementById('genre');
const ratingSlider = document.getElementById('rating');
const ratingDisplay = document.getElementById('ratingDisplay');
const hasVideoCheck = document.getElementById('hasVideo');
const formatRadios = document.getElementsByName('format');
const playlistDiv = document.getElementById('playlist');
const progressBar = document.getElementById('progressBar');
const songCountSpan = document.getElementById('songCount');
const addBtn = document.getElementById('addBtn');
const saveBtn = document.getElementById('saveBtn');
const sortBtn = document.getElementById('sortBtn');
const songForm = document.getElementById('songForm');

// Актуализиране на display стойността на оценката
ratingSlider.addEventListener('input', function() {
    const value = this.value;
    ratingDisplay.textContent = `Оценка: ${value}`;
    
    // Промяна на цвета според стойността
    ratingDisplay.classList.remove('low', 'medium', 'high');
    if (value <= 3) {
        ratingDisplay.classList.add('low');
    } else if (value <= 7) {
        ratingDisplay.classList.add('medium');
    } else {
        ratingDisplay.classList.add('high');
    }
});

// Вземане на избрания формат от радио бутоните
function getSelectedFormat() {
    for (let radio of formatRadios) {
        if (radio.checked) return radio.value;
    }
    return 'Single'; // по подразбиране
}

// Актуализиране на прогресс бара и брояча
function updateProgress() {
    const count = songs.length;
    const percentage = Math.min(count * 10, 100); // Максимум 100% при 10 песни
    progressBar.style.width = percentage + '%';
    progressBar.textContent = count + (count === 1 ? ' песен' : ' песни');
    songCountSpan.textContent = count + (count === 1 ? ' песен' : ' песни');
}

// Показване на всички песни в плейлиста
function displayPlaylist() {
    if (songs.length === 0) {
        playlistDiv.innerHTML = '<div style="text-align: center; padding: 30px; color: #999;">🎵 Все още няма добавени песни</div>';
        return;
    }
    
    playlistDiv.innerHTML = songs.map(song => song.toHTML()).join('');
}

// Добавяне на нова песен
function addSong(event) {
    if (event) event.preventDefault();
    
    const name = songNameInput.value.trim();
    const artist = artistInput.value.trim();

    // Валидация
    if (!name) {
        alert('Моля, въведете име на песен!');
        songNameInput.focus();
        return;
    }

    if (!artist) {
        alert('Моля, въведете изпълнител!');
        artistInput.focus();
        return;
    }

    // Създаване на нова песен
    const song = new Song(
        name,
        artist,
        genreSelect.value,
        getSelectedFormat(),
        parseInt(ratingSlider.value),
        hasVideoCheck.checked
    );

    // Добавяне към списъка
    songs.push(song);
    
    // Актуализиране на интерфейса
    displayPlaylist();
    updateProgress();

    // Анимация при добавяне
    const newSongElement = playlistDiv.lastElementChild;
    if (newSongElement) {
        newSongElement.style.animation = 'fadeIn 0.5s ease-out';
    }

    // Нулиране на формата
    songNameInput.value = '';
    artistInput.value = '';
    ratingSlider.value = 5;
    ratingDisplay.textContent = 'Оценка: 5';
    ratingDisplay.className = 'rating-value';
    hasVideoCheck.checked = false;
    document.querySelector('input[value="Single"]').checked = true;
    
    // Фокус върху полето за име
    songNameInput.focus();

    // Показване на съобщение
    showNotification(`✅ Песента "${name}" е добавена успешно!`);
}

// Показване на временно известие
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Запазване на плейлиста във файл
function savePlaylist() {
    if (songs.length === 0) {
        alert('Няма песни за запазване!');
        return;
    }

    try {
        // Създаване на текстово съдържание
        let content = '🎵 МОЯТ ПЛЕЙЛИСТ 🎵\n';
        content += '='.repeat(50) + '\n';
        content += `Създаден на: ${new Date().toLocaleString('bg-BG')}\n`;
        content += `Брой песни: ${songs.length}\n`;
        content += '='.repeat(50) + '\n\n';
        
        songs.forEach((song, index) => {
            content += `${index + 1}. ${song.toString()}`;
        });

        // Създаване и сваляне на файл
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `playlist_${new Date().toISOString().slice(0,10)}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        showNotification('✅ Плейлистът е запазен успешно!');
    } catch (error) {
        alert('Грешка при запис: ' + error.message);
    }
}

// Сортиране на песните по оценка (от най-висока към най-ниска)
function sortSongs() {
    if (songs.length === 0) {
        alert('Няма добавени песни за сортиране.');
        return;
    }

    songs.sort((a, b) => b.rating - a.rating);
    displayPlaylist();
    showNotification('📊 Песните са сортирани по оценка!');
}

// Добавяне на слушатели за събития
songForm.addEventListener('submit', addSong);
addBtn.addEventListener('click', addSong);
saveBtn.addEventListener('click', savePlaylist);
sortBtn.addEventListener('click', sortSongs);

// Добавяне на клавишни комбинации
document.addEventListener('keydown', function(e) {
    // Ctrl+Enter за добавяне
    if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        addSong();
    }
    // Ctrl+S за запазване
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        savePlaylist();
    }
});

// Инициализация
updateProgress();
displayPlaylist();

console.log('🎵 Музикалното приложение е готово за работа!');