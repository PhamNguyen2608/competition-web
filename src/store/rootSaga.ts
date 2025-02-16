import { fork, all } from 'redux-saga/effects'
import { AllEffect, ForkEffect } from '@redux-saga/core/effects'
import { Saga } from '@redux-saga/types'
import authSaga from '../features/auth/authSaga'

// Modern type definition for root saga
type RootSagaType = Generator<AllEffect<ForkEffect<void>>, void, unknown>

function* watchErrors(saga: Saga) {
  while (true) {
    try {
      yield fork(saga)
      break
    } catch (error) {
      console.error('Saga error:', error)
      // Global error handling logic here
      // You can dispatch error actions or handle recovery
    }
  }
}

export default function* rootSaga(): RootSagaType {
  yield all([
    // Fork sagas with error boundary
    fork(watchErrors, authSaga),
    
    // Add new sagas here following the pattern:
    // fork(watchErrors, featureSaga),
  ])
}
