import { call, put, take, takeLatest, fork, cancelled } from 'redux-saga/effects';
import { eventChannel, EventChannel } from 'redux-saga';
import { auth } from '../../config/firebase.config';
import { onAuthStateChanged, User } from 'firebase/auth';
import AuthService from '../../services/authService';
import { setUser, setLoading, setError, initAuth } from './authSlice';
import type { AppUser } from '../../types/auth';
import { createAsyncSaga } from 'common/utils/sagaHelpers';

type AuthChannelPayload = {
  user?: User | null;
  error?: Error;
};

function createAuthChannel(): EventChannel<AuthChannelPayload> {
  return eventChannel<AuthChannelPayload>(emitter => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => emitter({ user }),
      (error) => emitter({ error })
    );
    return unsubscribe;
  });
}

// Định nghĩa các action creators
const handleAuthSuccess = (user: AppUser) => ({ type: 'auth/setUser', payload: user });
const handleAuthFailure = (error: string) => ({ type: 'auth/setError', payload: error });

// Hàm xử lý async logic
const handleAuth = async (user: User): Promise<AppUser> => {
  const token = await user.getIdToken();
  localStorage.setItem('auth_token', token);
  return AuthService.firebaseUserToUser(user);
};

function* handleAuthStateChange(): Generator<any, void, any> {
  const channel: EventChannel<AuthChannelPayload> = yield call(createAuthChannel);

  try {
    while (true) {
      const payload: AuthChannelPayload = yield take(channel);
      
      if (payload.error) {
        yield put(setError(payload.error.message));
        continue;
      }

      if (payload.user) {
        yield* createAsyncSaga(
          { type: 'auth/handleAuth', payload: payload.user },
          handleAuthSuccess,
          handleAuthFailure,
          handleAuth
        );
      } else {
        localStorage.removeItem('auth_token');
        yield put(setUser(null));
      }
    }
  } finally {
    if (yield cancelled()) {
      channel.close();
    }
  }
}

function* initializeAuth() {
  try {
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        const token: string = yield call([currentUser, currentUser.getIdToken], true);
        localStorage.setItem('auth_token', token);
        const appUser: AppUser = yield call(
          [AuthService, AuthService.firebaseUserToUser], 
          currentUser
        );
        yield put(setUser(appUser));
      } catch (error) {
        console.error('Token refresh error:', error);
        localStorage.removeItem('auth_token');
        yield put(setUser(null));
      }
    }
    yield fork(handleAuthStateChange);
  } catch (error) {
    yield put(setError(error instanceof Error ? error.message : 'Unknown error'));
  } finally {
    yield put(setLoading(false));
  }
}

export default function* authSaga() {
  yield takeLatest(initAuth.type, initializeAuth);
} 