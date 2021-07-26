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
        name: 'Events',
        icon : 'fas fa-calendar-alt',
        submenu: [
            {
                name: 'Events',
                path: '/events'
            },
            {
                name: 'Event files',
                path: '/event_files'
            },
        ]
    },
    {
        name: 'Expositions',
        path: '/expositions',
        icon : 'fas fa-chalkboard-teacher'
    },
    {
        name: 'Inscriptions',
        path: '/inscriptions',
        icon : 'fas fa-user-tie'
    },
    {
        name: 'Sponsors',
        path: '/sponsors',
        icon : 'fas fa-building'
    },
    {
        name: 'Clients',
        path: '/clients',
        icon : 'fas fa-user-friends'
    },
    {
        name: 'Notifications',
        path: '/notifications',
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
