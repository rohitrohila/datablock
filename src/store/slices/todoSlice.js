import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  task:  {
    id: 0,
    task: "",
    isEditable: false,
    isCompleted: false,
  },
  allTask:[]
}

export const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    addTask: (state,action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      const taskObject = {
        id: state.allTask.length + 1,
        task: action.payload,
        isEditable: false,
        isCompleted: false,
      };
      state.task = taskObject;
    },
    addAllTask: (state,action) => {
      state.allTask.push(state.task)
    },

    deleteTask: (state, action) => {
      state.allTask.splice(action.payload,1)
    },

    doneTask: (state, action) => {
        console.log(action.payload)
        state.allTask[action.payload].isCompleted=true;
    },

    editTask: (state,action)=>{
      console.log(action.payload)
        state.allTask[action.payload.index].task=action.payload.task;
    }
  },
})

// Action creators are generated for each case reducer function
export const { addTask, addAllTask, deleteTask,doneTask,editTask } = todoSlice.actions

export default todoSlice.reducer