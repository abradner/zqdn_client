import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// import {configureStore} from '@reduxjs/toolkit'
// import gridsSlice from './features/GridGame.ts'

// const store = configureStore({
//     reducer: {
//         grids: gridsSlice.reducer,
//     },
// })


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
