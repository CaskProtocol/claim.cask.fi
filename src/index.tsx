import React from 'react'
import ReactDOM from 'react-dom'
import {Mainnet, DAppProvider} from '@usedapp/core'
import { App } from './App'

const config = {
    readOnlyChainId: Mainnet.chainId,
    readOnlyUrls: {
        [Mainnet.chainId]: 'https://eth-mainnet.alchemyapi.io/v2/E-awhigbRZSWhC2uDwouZkQPDStrBhR8',
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
