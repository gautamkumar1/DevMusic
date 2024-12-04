import { useRouter } from 'next/navigation'
import { ReactNode, useEffect, FC } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

const PrivateRoute: FC<MainLayoutProps> = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token"); 
    if (!token) {
      router.push("/login"); 
    }
  }, [router]);

  return <>{children}</>; 
};

export default PrivateRoute;
