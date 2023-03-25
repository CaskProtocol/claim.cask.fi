import React from 'react'
import { Redirect, Route, Switch } from 'react-router'
import { BrowserRouter } from 'react-router-dom'
import { Page } from './components/base/base'
import { GlobalStyle } from './global/GlobalStyle'
import { Claim } from './pages/Claim'

export function App() {
  return (
    <Page>
      <GlobalStyle />
        <Claim/>
    </Page>
  )
}
