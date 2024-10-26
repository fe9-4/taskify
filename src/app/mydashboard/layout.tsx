const MyDashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-gray05 min-h-screen">
      {children}
    </div>
  );
}

export default MyDashboardLayout;