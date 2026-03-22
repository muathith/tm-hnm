import { NextRequest, NextResponse } from "next/server";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBEMutxISSdHbL4OotcoKMh1Zv603jWzgw",
  authDomain: "mynewbb-73847.firebaseapp.com",
  projectId: "mynewbb-73847",
  storageBucket: "mynewbb-73847.firebasestorage.app",
  messagingSenderId: "1017329682260",
  appId: "1:1017329682260:web:7c8e6a9ece4e91399ceac1",
};

function getDb() {
  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  return getFirestore(app);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { visitorId, isOnline, lastActiveAt } = body;

    if (!visitorId || typeof visitorId !== "string") {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const db = getDb();
    const docRef = doc(db, "pays", visitorId);
    await setDoc(
      docRef,
      { isOnline: isOnline ?? false, lastActiveAt: lastActiveAt || new Date().toISOString() },
      { merge: true }
    );

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[Beacon] Error:", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
