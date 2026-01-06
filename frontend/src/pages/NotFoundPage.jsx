import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div>
      <h1>404 - Страница не найдена</h1>
      <p>Извините, запрашиваемая страница не существует.</p>
      <p>
        <Link to="/">Вернуться на главную</Link>
      </p>
    </div>
  );
};

export default NotFoundPage;
