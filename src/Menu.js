const Menu = [
    {
        heading: 'Main Navigation',
        translate: 'sidebar.heading.HEADER'
    },
    {
        name: 'Dashboard',
        path: '/',
        icon : 'fas fa-user-tie'
    },
    {
        name: 'Speakers',
        path: '/speakers',
        icon : 'fas fa-chalkboard-teacher'
    },
    {
        name: 'Event Files',
        path: '/speakers',
        icon : 'fas fa-folder-open'
    },
    {
        name: 'Expositions',
        path: '/speakers',
        icon : 'fas fa-calendar-alt'
    },
    {
        name: 'Inscriptions',
        path: '/speakers',
        icon : 'fas fa-user-tie'
    },
    {
        name: 'Sponsors',
        path: '/speakers',
        icon : 'fas fa-building'
    },
    {
        name: 'Clients',
        path: '/speakers',
        icon : 'fas fa-user-friends'
    },
    {
        name: 'Notifications',
        path: '/speakers',
        icon : 'fas fa-comments'
    },
    {
        name: 'Administrator',
        path: '/speakers',
        icon : 'fas fa-user-shield'
    },
    {
        name: 'Menu',
        icon: 'icon-speedometer',
        translate: 'sidebar.nav.MENU',
        label: { value: 1, color: 'info' },
        submenu: [{
            name: 'Submenu',
            translate: 'sidebar.nav.SUBMENU',
            path: 'submenu'
        }]
    }
];

export default Menu;
