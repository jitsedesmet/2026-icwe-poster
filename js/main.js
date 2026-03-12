import '../css/style.scss'
import '@fortawesome/fontawesome-free/css/all.min.css';
import '@fortawesome/fontawesome-free/js/all.min.js';

let devicePixelRatio = window.devicePixelRatio || 1;
let zoomMode = false;

const updateScale = () => {
    const poster = document.getElementById('app');
    const body = document.body;

    const { innerWidth, innerHeight } = window;
    const { offsetWidth, offsetHeight } = poster;

    const fullScale = 1 / Math.max(offsetWidth / innerWidth, offsetHeight / innerHeight);

    body.style.setProperty('transform', `scale(${fullScale})`);
};

const updateScaleOnResize = () => {
    // Do not rescale if zoom level is changed (i.e., devicePixelRatio changes)
    if ((window.devicePixelRatio || 1) !== devicePixelRatio) {
        devicePixelRatio = window.devicePixelRatio || 1;
        switchToZoomMode();
        return;
    }
    updateScale();
}

const switchToZoomMode = () => {
    if (zoomMode) return;
    zoomMode = true;

    const html = document.documentElement;
    const body = document.body;
    const wrapper = document.getElementById('poster-wrapper');
    const poster = document.getElementById('app');

    if (!body || !wrapper) return;

    html.style.margin = '0';
    html.style.padding = '0';
    html.style.height = '100%';
    html.style.overflow = 'auto';

    body.style.position = 'unset';
    body.style.top = 'unset';
    body.style.left = 'unset';
    body.style.overflow = 'auto';
    body.style.margin = '0';
    body.style.width = 'unset';
    body.style.height = '100%';
    body.style.padding = '0';
    body.style.transform = 'unset';

    wrapper.style.width = '841px';
    wrapper.style.height = '1189px';
    wrapper.style.margin = 'auto';

    const { innerWidth, innerHeight } = window;
    const { offsetWidth, offsetHeight } = poster;
    const fullScale = 1 / Math.max(offsetWidth / innerWidth, offsetHeight / innerHeight);
    wrapper.style.transformOrigin = 'top center';
    wrapper.style.transform = `scale(${fullScale})`;
}

window.addEventListener('resize', updateScaleOnResize);
window.addEventListener('load', updateScale);
