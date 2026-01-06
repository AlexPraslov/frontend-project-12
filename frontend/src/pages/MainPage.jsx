import { useAuth } from '../contexts/AuthContext';

const MainPage = () => {
  const { logout } = useAuth();

  return (
    <div>
      <h1>Добро пожаловать в чат!</h1>
      <p>Вы успешно авторизованы.</p>
      <button onClick={logout}>Выйти</button>
      <p>Здесь скоро будет интерфейс чата...</p>
    </div>
  );
};

export default MainPage;
