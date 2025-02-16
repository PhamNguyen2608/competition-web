import { FirebaseApp, initializeApp, getApp, getApps } from "firebase/app";
import { Auth, getAuth, browserLocalPersistence, setPersistence } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";
import { ENV } from "../../config/env.config";

export class FirebaseService {
  private static instance: FirebaseService;
  private readonly app: FirebaseApp;
  private readonly auth: Auth;
  private readonly firestore: Firestore;

  private constructor() {
    this.app = !getApps().length ? initializeApp(ENV.firebase) : getApp();
    this.auth = getAuth(this.app);
    setPersistence(this.auth, browserLocalPersistence).catch(console.error);
    this.firestore = getFirestore(this.app);
  }

  public static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }

  public getApp(): FirebaseApp {
    return this.app;
  }

  public getAuth(): Auth {
    return this.auth;
  }

  public getFirestore(): Firestore {
    return this.firestore;
  }
} 