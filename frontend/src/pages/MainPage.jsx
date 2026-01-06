import { Link } from 'react-router-dom';

const MainPage = () => {
  return (
    <div>
      <h1>Главная страница чата</h1>
      <p>Добро пожаловать в чат!</p>
      <p>
        Для отправки сообщений необходимо <Link to="/login">авторизоваться</Link>.
      </p>
    </div>
  );
};

export default MainPage;
