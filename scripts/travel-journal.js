document.addEventListener('DOMContentLoaded', function() {
    const links = Array.from(document.querySelectorAll('.journal-photo-link'));
    const dialog = document.querySelector('.journal-lightbox');
    if (!dialog || typeof dialog.showModal !== 'function') return;

    const image = dialog.querySelector('.journal-lightbox-image');
    const caption = dialog.querySelector('#lightbox-caption');
    const count = dialog.querySelector('[data-count]');
    let selected = 0;
    let trigger;

    function showPhoto(index) {
        selected = (index + links.length) % links.length;
        const photo = links[selected].querySelector('img');
        image.src = links[selected].href;
        image.alt = photo.alt;
        caption.textContent = photo.alt;
        count.textContent = `${selected + 1} / ${links.length}`;
    }

    links.forEach(function(link, index) {
        link.addEventListener('click', function(event) {
            if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            trigger = link;
            showPhoto(index);
            dialog.showModal();
            document.body.classList.add('journal-viewing');
        });
    });

    dialog.querySelector('[data-close]').addEventListener('click', function() { dialog.close(); });
    dialog.querySelector('[data-previous]').addEventListener('click', function() { showPhoto(selected - 1); });
    dialog.querySelector('[data-next]').addEventListener('click', function() { showPhoto(selected + 1); });
    dialog.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault();
            showPhoto(selected + (event.key === 'ArrowRight' ? 1 : -1));
        }
    });
    dialog.addEventListener('close', function() {
        document.body.classList.remove('journal-viewing');
        image.removeAttribute('src');
        if (trigger) trigger.focus({ preventScroll: true });
    });
});
