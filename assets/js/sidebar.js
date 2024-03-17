let menuOpened = false;

toggleMenu = function () {
    menuOpened = !menuOpened;

    //const sidebar = document.getElementById('sidebar');
    const menu = document.getElementById('menu');
    const menuBtn = document.getElementById('menu-btn');
    const overlay = document.getElementById('overlay');

    if (!menuOpened) {
        //sidebar.classList.add('navigation--closed');
        menu.classList.add('menu--closed');
        overlay.classList.add('overlay--closed');
        menuBtn.classList.remove('burger--active');

    } else {
        //sidebar.classList.remove('navigation--closed');
        menu.classList.remove('menu--closed');
        overlay.classList.remove('overlay--closed');
        menuBtn.classList.add('burger--active');
    }
};