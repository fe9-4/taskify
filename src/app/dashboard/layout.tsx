const DashboardLayout = ({ children}: { children: React.ReactNode }) => {
  return (
    <div className="mt-[60px] py-4 px-3 bg-gray05">
      {children}
    </div>
  );
}

export default DashboardLayout;