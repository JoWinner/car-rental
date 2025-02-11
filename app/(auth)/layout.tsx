
const AuthLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      
        <main className="py-6 lg:py-10 flex justify-center items-center">
          <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
    </div>
  );
}

export default AuthLayout;