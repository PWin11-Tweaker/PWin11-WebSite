// Функция для извлечения изображений и текста из HTML
function processReleaseBody(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    let images = '';
    const imgElements = div.getElementsByTagName('img');
    for (let img of imgElements) {
        if (img.src && img.src.trim() !== '') {
            images += `<img src="${img.src}" alt="${img.alt || 'Release image'}" class="w-full h-auto mb-2 rounded-lg">`;
        }
    }
    // Проверка на Markdown-изображения (например, ![alt](url))
    const markdownMatch = html.match(/!\[.*?\]\((.*?)\)/);
    if (markdownMatch && markdownMatch[1]) {
        images += `<img src="${markdownMatch[1]}" alt="Release image" class="w-full h-auto mb-2 rounded-lg">`;
    }
    const text = div.textContent || div.innerText || '';
    return { images, text: text.substring(0, 80) + '...' };
}

// Функция для загрузки релизов с GitHub
async function fetchReleases() {
    try {
        const response = await fetch('https://api.github.com/repos/PWin11-Tweaker/PWin11-Tweaker/releases');
        const releases = await response.json();
        const releasesContainer = document.getElementById('releases');

        releases.slice(0, 6).forEach(release => {
            const releaseCard = document.createElement('div');
            releaseCard.className = 'release-card p-6 rounded-lg';
            const { images, text } = processReleaseBody(release.body);
            const downloadUrl = release.assets && release.assets[0] && release.assets[0].browser_download_url ? release.assets[0].browser_download_url : '#';
            releaseCard.innerHTML = `
                <div class="content-container">
                    <h3 class="text-xl font-semibold mb-2">${release.name}</h3>
                    <div class="image-container">${images}</div>
                    <p class="text-gray-300 mb-4">${text}</p>
                </div>
                <div class="button-container flex justify-between items-center">
                    <a href="${downloadUrl}" class="download-btn ${release.prerelease ? 'download-btn-prerelease' : 'download-btn-release'}">Скачать</a>
                    <a href="${release.html_url}" class="github-btn ${release.prerelease ? 'github-btn-prerelease' : 'github-btn-release'}">Перейти на GitHub</a>
                </div>
            `;
            releasesContainer.appendChild(releaseCard);
        });
    } catch (error) {
        console.error('Ошибка загрузки релизов:', error);
    }
}

// Вызов функции только на странице pwin11tweaker_download.html
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('pwin11tweaker_download.html')) {
        fetchReleases();
    }
});