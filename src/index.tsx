import React from 'react'
import ReactDOM from 'react-dom'
import {Mainnet, DAppProvider} from '@usedapp/core'
import { App } from './App'

const config = {
    readOnlyChainId: Mainnet.chainId,
    readOnlyUrls: {
        [Mainnet.chainId]: 'https://rpc.ankr.com/eth',
    },
    multicallVersion: 2 as const,
}

ReactDOM.render(
  <React.StrictMode>
    <DAppProvider config={config}>
      <App />
    </DAppProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
