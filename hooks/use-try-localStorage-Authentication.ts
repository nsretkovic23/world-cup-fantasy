import { useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/libs/interfaces/db-data-Interfaces";
import { UserContext, UserContextType } from "@/context/user-context";

const useTryLocalStorageAuthentication = (redirectToLogin:boolean): User | null => {
    const router = useRouter();
    const [userInfo, setUserInfo] = useState<User | null>(null);
    const [isAuthenticatedUser, setIsAuthenticatedUser] = useState<boolean>(false);
    const {user} = useContext(UserContext) as UserContextType;

    useEffect(() => {
        if (!user && typeof window !== "undefined") {
          const userInfoFromLocalStorage = localStorage.getItem("loggedInUser");
          if (userInfoFromLocalStorage) {
            setUserInfo(JSON.parse(userInfoFromLocalStorage) as User);
          } else {
            if(redirectToLogin)
              router.replace("/login");
          }
      }
    }, [router, redirectToLogin, user]);
  
    const fetchUser = useCallback(
      async (userInfo: User) => {
        const redirectToLoginPageAndDeleteLocalStorageData = () => {
          if(redirectToLogin) {
            router.replace("/login");
          }
          localStorage?.removeItem("loggedInUser");
        };

        
        try {
          console.log("Kolko puta se pozove FETCH")
          const response = await fetch(
              `http://localhost:3000/api/neo4j/users/auth/`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userInfo),
              });
          const data = await response.json();
          
          if (data.errorMessage) {
            console.error(data.errorMessage);
            redirectToLoginPageAndDeleteLocalStorageData();
          } else {
            return data as User;
          }

        } catch (error) {
            console.error(error);
            redirectToLoginPageAndDeleteLocalStorageData();
        }

      },
      [router, redirectToLogin]
    );
  
    useEffect(() => {
      if (!user && userInfo && !isAuthenticatedUser) {
        fetchUser(userInfo as User)
        .then(user => {
            if(user) {
                setUserInfo(user);
                setIsAuthenticatedUser(true);
            }
            else setUserInfo(null)
        })    
    } 
    }, [user,userInfo,isAuthenticatedUser,fetchUser]);
  
    return userInfo;
  };
  
  export default useTryLocalStorageAuthentication;