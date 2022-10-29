let sidebarOpened = false;

toggleSidebar = function () {
    sidebarOpened = !sidebarOpened;

    const sidebar = document.getElementById('sidebar');
    const sidebarBtn = document.getElementById('sidebar-btn');
    const overlay = document.getElementById('overlay');

    if (!sidebarOpened) {
        sidebar.classList.add('navigation--closed');
        overlay.classList.add('overlay--closed');
        sidebarBtn.classList.remove('header__toggle--active');

    } else {
        sidebar.classList.remove('navigation--closed');
        overlay.classList.remove('overlay--closed');
        sidebarBtn.classList.add('header__toggle--active');
    }
};