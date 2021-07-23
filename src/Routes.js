import React, { Suspense, lazy } from 'react';
import { withRouter, Switch, Route, Redirect } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

/* protectedroute component para rutas protegidas*/
import { ProtectedRoute } from './auth/protected.route';

/* loader component for Suspense*/
import PageLoader from './components/Common/PageLoader';

import Base from './components/Layout/Base';
import BasePage from './components/Layout/BasePage';
// import BaseHorizontal from './components/Layout/BaseHorizontal';

/* Used to render a lazy component with react-router */
const waitFor = Tag => props => <Tag {...props}/>;

const Home = lazy(() => import('./components/home/Home'));
const Speakers = lazy(() => import('./components/Speakers/Speakers'));
const RegisterSpeakers = lazy(() => import('./components/Speakers/RegisterSpeakers'));
const EditSpeakers = lazy(() => import('./components/Speakers/RegisterSpeakers'));
const SubMenu = lazy(() => import('./components/SubMenu/SubMenu'));
const Login = lazy(() => import('./pages/Login'));

//Lista de paginas que van fuera del layout wrapper
const listofPages = [
    '/login'
];

const Routes = ({ location }) => {
    const currentKey = location.pathname.split('/')[1] || '/';
    const timeout = { enter: 500, exit: 500 };

    // Animations supported
    //      'rag-fadeIn'
    //      'rag-fadeInRight'
    //      'rag-fadeInLeft'

    const animationName = 'rag-fadeIn'

    if(listofPages.indexOf(location.pathname) > -1) {
        return (
            // Page Layout component wrapper
            <BasePage>
                <TransitionGroup>
                    <CSSTransition  key={currentKey} timeout={timeout} classNames={animationName} exit={false}>
                        <div className="pages-container">
                            <Suspense fallback={<PageLoader/>}>
                                <Switch location={location}>
                                    <Route path="/login" component={waitFor(Login)} />
                                </Switch>
                            </Suspense>
                        </div>
                    </CSSTransition>
                </TransitionGroup>
            </BasePage>
        )
    }
    else {
        return (
            // Layout component wrapper
            // Use <BaseHorizontal> to change layout
            <Base>
              <TransitionGroup>
                <CSSTransition key={currentKey} timeout={timeout} classNames={animationName} exit={false}>
                    <div>
                        <Suspense fallback={<PageLoader/>}>
                            <Switch location={location}>
                                <ProtectedRoute exact path="/" component={waitFor(Home)}/>
                                <ProtectedRoute exact path="/speakers" component={waitFor(Speakers)}/>
                                <ProtectedRoute exact path="/speakers/new" component={waitFor(RegisterSpeakers)}/>
                                <ProtectedRoute exact path="/speakers/:id" component={waitFor(EditSpeakers)}/>
                                <ProtectedRoute path="/submenu" component={waitFor(SubMenu)}/>
                                <ProtectedRoute path="*" component={() => <Redirect to={{pathname: "/"}}/>} />
                            </Switch>
                        </Suspense>
                    </div>
                </CSSTransition>
              </TransitionGroup>
              <ToastContainer />
            </Base>
        )
    }
}

export default withRouter(Routes);
