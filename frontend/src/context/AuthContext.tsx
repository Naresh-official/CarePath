import {
	createContext,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from "react";
import axios from "axios";

export interface AuthUser {
	id: string;
	name: string;
	email: string;
	role?: string;
}

interface AuthContextType {
	user: AuthUser | null;
	loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const [user, setUser] = useState<AuthUser | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		(async () => {
			try {
				const { data } = await axios.get(
					`${import.meta.env.VITE_BACKEND_URL}/auth/me`,
					{
						withCredentials: true,
					}
				);

				setUser(data.data);
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
			} catch (err: unknown) {
				setUser(null);
			}
			setLoading(false);
		})();
	}, []);

	return (
		<AuthContext.Provider value={{ user, loading }}>
			{children}
		</AuthContext.Provider>
	);
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
