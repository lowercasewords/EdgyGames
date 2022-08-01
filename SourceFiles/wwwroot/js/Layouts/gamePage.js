let mainEl = document.getElementById('main');
window.addEventListener('resize', (event) => {
    mainEl.style.height = mainEl.style.width;
});