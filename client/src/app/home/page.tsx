import MainLayout from "@/components/mainLayout/MainLayout";


const Home = () => {
    return <h1 className="flex items-center justify-center h-screen text-4xl ">Welcome to DevMusic!</h1>;
  };
  
  // Wrap the page content with MainLayout
  const HomePage = () => {
    return (
      <MainLayout>
        <Home/>
      </MainLayout>
    );
  };

  export default HomePage;