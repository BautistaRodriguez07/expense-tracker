export const Protected = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn } = useAuth();
  if (!isSignedIn) {
    return <div>You are not logged in</div>;
  }
  return <>{children}</>;
};
