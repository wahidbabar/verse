import { auth } from "@/firebase/firebase.config";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
  UserCredential,
} from "firebase/auth";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  registerUser: (email: string, password: string) => Promise<UserCredential>;
  loginUser: (email: string, password: string) => Promise<UserCredential>;
  signInWithGoogle: () => Promise<UserCredential>;
  logout: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

interface UserData {
  email: string | null;
  username: string | null;
  photo: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const googleProvider = new GoogleAuthProvider();

// AuthProvider
export const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // register a user
  const registerUser = async (
    email: string,
    password: string
  ): Promise<UserCredential> => {
    return await createUserWithEmailAndPassword(auth, email, password);
  };

  // login the user
  const loginUser = async (
    email: string,
    password: string
  ): Promise<UserCredential> => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  // sign up with google
  const signInWithGoogle = async (): Promise<UserCredential> => {
    return await signInWithPopup(auth, googleProvider);
  };

  // logout the user
  const logout = async (): Promise<void> => {
    return await signOut(auth);
  };

  // manage user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);

      if (user) {
        const { email, displayName, photoURL } = user;
        const userData: UserData = {
          email,
          username: displayName,
          photo: photoURL,
        };
        // You can use userData here if needed
      }
    });

    return () => unsubscribe();
  }, []);

  const value: AuthContextType = {
    currentUser,
    loading,
    registerUser,
    loginUser,
    signInWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
