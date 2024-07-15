
// Import necessary functions from Redux Toolkit
import { createSlice } from "@reduxjs/toolkit";// Creating a slice for functionality is essential.

type Grid = {
    seed: number,
    gridSize: number,
    grid: number[][],

    placementSize: number,

    placementSelected: boolean,
    placementTopLeft: [number, number],

    showOverlay: boolean,
    overlayTopLeft: [number, number],
}

// Define the initial state for the slice
const initialState: Grid = {
    seed: 0,
    gridSize: 4,
    grid: [],
    placementSize: 1,
    placementSelected: false,
    showOverlay: false,

    placementTopLeft: [0,0],
    overlayTopLeft: [0,0],
}

function calculatePlacementTopLeft(gridSize: number, placementSize: number, x: number, y: number): [number, number] {
    return [Math.floor(x / gridSize) * placementSize, Math.floor(y / gridSize) * placementSize]
}

// Create a slice using the createSlice function
export const gridSlice = createSlice({
    name: 'grid', // Name of the slice
    initialState: initialState, // Initial state for the slice
    reducers: {
        hover: (state, action)=>{
            state.showOverlay=true
            state.overlayTopLeft=calculatePlacementTopLeft(state.gridSize, state.placementSize, action.payload.x, action.payload.y)
        },
        select: (state, action)=>{
            state.showOverlay=false
            state.placementTopLeft=calculatePlacementTopLeft(state.gridSize, state.placementSize, action.payload.x, action.payload.y)
            state.placementSelected=true
        },
        leave: (state)=>{
            state.showOverlay=false
        }
    }
})
