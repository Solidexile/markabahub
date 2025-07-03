import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuthState } from "react-firebase-hooks/auth";
import { useAuth } from './AuthContext';
// Usage: const [user] = useAuthState(auth);

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      const newSocket = io(process.env.REACT_APP_API_URL, {
        withCredentials: true,
        auth: {
          token: localStorage.getItem('markabaHubToken')
        }
      });

      setSocket(newSocket);

      // Join user's room
      newSocket.emit('join', currentUser._id);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [currentUser]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};