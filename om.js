function updateVideoId(card) {
    const anchor = card.querySelector('a');
    const videoUrl = new URL(anchor.href);
    const videoId = videoUrl.searchParams.get('v');
    card.setAttribute('data-video-id', videoId);
}

function setThumbnailImages() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        updateVideoId(card);
        const videoId = card.getAttribute('data-video-id');
        const img = card.querySelector('.card-img-top');
        img.src = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        fetchVideoTitle(card, videoId);
    });
}

function fetchVideoTitle(card, videoId) {
    fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`)
        .then(response => response.json())
        .then(data => {
            const title = card.querySelector('.card-title');
            title.innerText = data.title;
        })
        .catch(error => {
            console.error('Error fetching video title:', error);
        });
}

window.onload = setThumbnailImages;

const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'href') {
            const card = mutation.target.closest('.card');
            if (card) {
                updateVideoId(card);
                const videoId = card.getAttribute('data-video-id');
                const img = card.querySelector('.card-img-top');
                img.src = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
                fetchVideoTitle(card, videoId);
            }
        }
    });
});

document.querySelectorAll('.card a').forEach(anchor => {
    observer.observe(anchor, { attributes: true });
});