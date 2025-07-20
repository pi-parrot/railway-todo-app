import React from 'react'
import { useSelector } from 'react-redux'
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'
import { Sidebar } from '~/components/Sidebar'
import Home from '~/pages/index.page'
import NotFound from '~/pages/404'
import SignIn from '~/pages/signin/index.page'
import SignUp from '~/pages/signup/index.page'
import ListIndex from '~/pages/lists/[listId]/index.page'

export const Router = () => {
  const auth = useSelector((state) => state.auth.token !== null)

  console.log(
    'Router rendered, auth:',
    auth,
    'current path:',
    window.location.pathname
  )

  return (
    <BrowserRouter>
      <div className="app_layout">
        <Sidebar />
        <div className="main_content">
          <Switch>
            <Route exact path="/signin">
              <SignIn />
            </Route>
            <Route exact path="/signup">
              <SignUp />
            </Route>
            {auth ? (
              <>
                <Route exact path="/">
                  <Home />
                </Route>
                <Route exact path="/lists/:listId">
                  <ListIndex />
                </Route>
              </>
            ) : (
              <>
                <Route exact path="/">
                  <Redirect to="/signin" />
                </Route>
              </>
            )}
            <Route path="*">
              <NotFound />
            </Route>
          </Switch>
        </div>
      </div>
    </BrowserRouter>
  )
}
