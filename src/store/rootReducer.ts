import { combineReducers } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import quizReducer from '../features/exam-question/quizSlice'

// Kết hợp tất cả các reducers thành root reducer
const rootReducer = combineReducers({
  auth: authReducer,
  quiz: quizReducer,
})

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer
