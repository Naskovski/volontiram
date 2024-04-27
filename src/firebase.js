import { initializeApp } from "firebase/app";
import {
    GoogleAuthProvider,
    getAuth,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    onAuthStateChanged,
    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider
} from "firebase/auth";
import {
    getFirestore,
    query,
    getDocs,
    collection,
    where,
    doc, setDoc
} from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import showOverlay from "./functions/showOverlay";
import { getStorage, ref } from "firebase/storage";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID
};



export default firebaseConfig;

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

const user = auth.currentUser;
let userDocRef = doc(db, 'userData', 'Friday');

const storage = getStorage(app);
const storageRef = ref(storage);

onAuthStateChanged(auth, (user) => {
    if (user) {
        userDocRef = doc(db, 'userData', user.uid);
        //console.log('current user:', user.uid);
    } else {

    }
});

const signInWithGoogle = async () => {
    try {
        const res = await signInWithPopup(auth, googleProvider);
        const user = res.user;
        const q = query(collection(db, "userData"), where("uid", "==", user.uid));
        const docs = await getDocs(q);
        if (docs.docs.length === 0) {
            const newUserDocRef = doc(db, 'userData', user.uid);
            await setDoc(newUserDocRef, {
                uid: user.uid,
                name: user.displayName,
                email: user.email,
            });
        }
        if (docs.docs.length === 0) {
            const newPublicUserDocRef = doc(db, 'publicUserData', user.uid);
            await setDoc(newPublicUserDocRef, {
                uid: user.uid,
                name: user.displayName,
            });
        }
        userDocRef = doc(db, 'userData', user.uid);
    } catch (err) {
        console.error(err);
    }
};

const logInWithEmailAndPassword = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            userDocRef = doc(db, 'userData', userCredential.user.uid);
        })
        .catch((err) => {
            console.error(err);
            alert(err.message);
        });
};

const changeUserPassword = async (oldPassword, newPassword1, newPassword2) => {
    try {
        if(newPassword1!==newPassword2){
            throw new Error("Passwords don't match!")
        }

        const user = auth.currentUser;
        const credential = EmailAuthProvider.credential(
            auth.currentUser.email,
            oldPassword
        )
        await reauthenticateWithCredential(
            user,
            credential
        )

        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword1).then(() => {
            alert('Password successfully changed!')
            showOverlay('ChangePassword', 'hide')
        });

    } catch (err) {
        console.error(err);
        alert(err.message);
    }
};

const registerWithEmailAndPassword = async (name, email, password1, password2) => {
    try {
        if(password1 !== password2) {
            alert("Passwords don't match. Please try again!");
            console.log("Passwords don't match");
            return ;
        }
        const res = await createUserWithEmailAndPassword(auth, email, password1);
        const user = res.user;
        const newUserDocRef = doc(db, 'userData', user.uid);
        await setDoc(newUserDocRef, {
            uid: user.uid,
            name: name,
            email: email,
        });
        userDocRef = doc(db, 'userData', user.uid);
        const newPublicUserDocRef = doc(db, 'publicUserData', user.uid);
        await setDoc(newPublicUserDocRef, {
            uid: user.uid,
            name: name,
        });


    } catch (err) {
        console.error(err);
        if(err.message!=="Cannot read properties of null (reading 'uid')"){
            alert(err.message);
        }
    }
};

const sendPasswordReset = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email);
        alert("Password reset link sent!");
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
};

export {
    app,
    auth,
    db,
    signInWithGoogle,
    logInWithEmailAndPassword,
    registerWithEmailAndPassword,
    sendPasswordReset,
    changeUserPassword,
    userDocRef,
    storage,
    storageRef
};
const analytics = getAnalytics(app);

