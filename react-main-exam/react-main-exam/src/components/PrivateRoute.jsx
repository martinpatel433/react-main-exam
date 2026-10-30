export default function PrivateRoute({ user, fallback, children }) {
  return user ? children : fallback
}
