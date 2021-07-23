import React, { Component } from 'react';

class Footer extends Component {

    render() {
        const year = new Date().getFullYear()
        return (
            <footer className="footer-container">
                <span>LCLAA &copy; {year} -  All Rights Reserved </span>
            </footer>
        );
    }

}

export default Footer;
