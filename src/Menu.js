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
        path: '/expositions',
        icon : 'fas fa-calendar-alt'
    },
    {
        name: 'Inscriptions',
        path: '/speakers',
        icon : 'fas fa-user-tie'
    },
    {
        name: 'Sponsors',
        path: '/sponsors',
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
        icon : 'fas fa-user-shield',
        submenu: [{
            name: 'Administrator users',
            path: '/administrators'
        }]
    }
];

export default Menu;
