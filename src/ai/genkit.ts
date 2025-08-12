import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {initializeApp} from 'firebase/app';

// This must be called before other Firebase services are used.
initializeApp({
  projectId: 'linksafe-dg5bq',
  appId: '1:793839426344:web:8f6f88b012a00b0af00e1d',
  storageBucket: 'linksafe-dg5bq.firebasestorage.app',
  apiKey: 'AIzaSyBzhvxseOkSsfSPNd19qyOxkma4Lk6hoG8',
  authDomain: 'linksafe-dg5bq.firebaseapp.com',
  measurementId: '',
  messagingSenderId: '793839426344',
});

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.0-flash',
});
