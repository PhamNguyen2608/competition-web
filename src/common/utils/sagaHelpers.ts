// common/utils/sagaHelpers.ts
import { call, put } from 'redux-saga/effects'

type SuccessAction<T> = (payload: T) => { type: string; payload: T }
type FailureAction = (error: string) => { type: string; payload: string }

export function* createAsyncSaga<T, R>(
  action: { type: string; payload: T },
  successAction: SuccessAction<R>,
  failureAction: FailureAction,
  asyncFunction: (payload: T) => Promise<R>
): Generator<any, void, any> {
  try {
    const result: R = yield call(asyncFunction, action.payload)
    yield put(successAction(result))
  } catch (error) {
    yield put(failureAction(error instanceof Error ? error.message : 'Unknown error'))
  }
}