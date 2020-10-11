import React, { useEffect, useRef, useState } from 'react';
import './App.css';
// import './Upload.js';

// import firebase-skd 
import firebase from 'firebase/app';
// firestore for database
import 'firebase/firestore';
//auth for authntication
import 'firebase/auth';
// For analytics
import 'firebase/analytics';

// import hooks making it easier to work with fb and react
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

// to indentify our proj
firebase.initializeApp({
  apiKey: "AIzaSyA3wfpah2IMVs3rUpK0FRuoXqVk36wHcpI",
  authDomain: "superchat-841b2.firebaseapp.com",
  databaseURL: "https://superchat-841b2.firebaseio.com",
  projectId: "superchat-841b2",
  storageBucket: "superchat-841b2.appspot.com",
  messagingSenderId: "373535847344",
  appId: "1:373535847344:web:b5b0910261b3391cd61c75",
  measurementId: "G-RSSQSYT4D3"
})

// refernces
const auth = firebase.auth();
const firestore = firebase.firestore();


function App() {
  // Logged In => User ID, Email Address, ...; Logged Out => Null
  const [user] = useAuthState(auth); 

  return (
    <div className="App">
      <header>
        <h1>
          <span role="img" aria-label="react">⚛️</span>
          <span role="img" aria-label="fire">🔥</span>
          <span role="img" aria-label="speach">💬</span>
        </h1>
        <SignOut />
      </header>
      
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}


// SignIn Button
function SignIn() {
  // SignIn Authenticator
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  // Sign In Button
  return (
    <>
      <button 
        className="sign-in" 
        onClick={signInWithGoogle}>Sign in with Google
      </button>
      <p>Do not violate the community guidelines or you will be banned for life!</p>
    </>
  )
}


// Sign Out Button
function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}


// Chat Room
function ChatRoom() {
  const dummy = useRef();
  
  // refrence to users message
  const messagesRef = firestore.collection('messages');
  // query for the last 25 messages
  const query = messagesRef.orderBy('createdAt').limit(25);
  // array of last 25 chat messages in database
  const [messages] = useCollectionData(query, {idField: 'id'});
  // 
  const [formValue, setFormValue] = useState('');

  const sendMessage = async(e) => {
    e.preventDefault();
    const { uid, photoURL } = auth.currentUser;
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  useEffect(() => { dummy.current.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  return (
    <>

      <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
        <span ref={dummy}></span>
      </main>

      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Message" />
        <button type="submit" disabled={!formValue}>
          <span role="img" aria-label="fly">🕊️</span>
        </button>
      </form>

    </>
  )

}

// Chat Message
function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <div className={`message ${messageClass}`}>
      <img alt="user"
      scr={photoURL} 
      />
      <p>{text}</p>
    </div>
  )
}


export default App;
